import { projectImageBucket } from "@/lib/supabase/env";
import { requireProjectAdmin } from "@/lib/supabase/require-admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { context, response } = await requireProjectAdmin();
  if (response || !context) return response;

  const { id } = await params;
  const { data: photo, error: lookupError } = await context.supabase
    .from("project_photos")
    .select("id, storage_path, project_id, projects(status)")
    .eq("id", id)
    .maybeSingle();

  if (lookupError || !photo) return Response.json({ error: "Fotografia não encontrada." }, { status: 404 });

  const { count, error: countError } = await context.supabase
    .from("project_photos")
    .select("id", { count: "exact", head: true })
    .eq("project_id", photo.project_id);

  const relatedProject = Array.isArray(photo.projects) ? photo.projects[0] : photo.projects;
  if (countError) return Response.json({ error: "Não foi possível verificar as fotografias do projeto." }, { status: 500 });
  if (relatedProject?.status === "published" && count === 1) {
    return Response.json({ error: "Despublique o projeto antes de remover a última fotografia." }, { status: 409 });
  }

  const { error: storageError } = await context.supabase.storage
    .from(projectImageBucket)
    .remove([photo.storage_path]);
  if (storageError) return Response.json({ error: "Não foi possível remover o ficheiro." }, { status: 500 });

  const { error } = await context.supabase.from("project_photos").delete().eq("id", id);
  if (error) return Response.json({ error: "Não foi possível remover a fotografia do projeto." }, { status: 500 });

  return new Response(null, { status: 204 });
}