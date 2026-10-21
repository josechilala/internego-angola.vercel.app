import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Project, ProjectPhoto } from "@/data/projects";
import { hasSupabaseConfig, supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";
import { getProjectAdminContext } from "@/lib/supabase/admin";

const publicSupabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    })
  : null;

type ProjectPhotoRow = {
  id: string;
  storage_path: string;
  alt: string;
  caption: string | null;
  sort_order: number;
};

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: Project["category"];
  location: string | null;
  project_date: string | null;
  status: Project["status"];
  project_photos: ProjectPhotoRow[] | null;
};

const projectSelection = `
  id, slug, title, description, category, location, project_date, status,
  project_photos ( id, storage_path, alt, caption, sort_order )
`;

function mapProject(row: ProjectRow): Project {
  const photos: ProjectPhoto[] = (row.project_photos ?? [])
    .sort((first, second) => first.sort_order - second.sort_order)
    .map((photo) => ({
      id: photo.id,
      src: `/api/projects/images/${photo.id}`,
      alt: photo.alt,
      caption: photo.caption ?? undefined,
      sortOrder: photo.sort_order,
    }));

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    status: row.status,
    location: row.location ?? undefined,
    date: row.project_date ?? undefined,
    photos,
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  if (!publicSupabase) return [];

  const { data, error } = await publicSupabase
    .from("projects")
    .select(projectSelection)
    .eq("status", "published")
    .order("project_date", { ascending: false, nullsFirst: false });

  if (error || !data) return [];
  return (data as unknown as ProjectRow[]).map(mapProject).filter((project) => project.photos.length > 0);
}

export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  if (!publicSupabase) return null;

  const { data, error } = await publicSupabase
    .from("projects")
    .select(projectSelection)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  const project = mapProject(data as unknown as ProjectRow);
  return project.photos.length > 0 ? project : null;
}

export async function getAdminProjects(): Promise<Project[]> {
  const { supabase, isAdmin } = await getProjectAdminContext();
  if (!supabase || !isAdmin) return [];

  const { data, error } = await supabase
    .from("projects")
    .select(projectSelection)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as ProjectRow[]).map(mapProject);
}