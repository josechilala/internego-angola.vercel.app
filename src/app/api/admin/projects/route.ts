import { projectInputSchema } from "@/lib/projects/validation";
import { requireProjectAdmin } from "@/lib/supabase/require-admin";

export async function POST(request: Request) {
  const { context, response } = await requireProjectAdmin();
  if (response || !context) return response;

  const input = projectInputSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return Response.json({ error: "Verifique os campos do projeto." }, { status: 400 });

  const { data: project, error } = await context.supabase
    .from("projects")
    .insert({
      title: input.data.title,
      slug: input.data.slug,
      description: input.data.description,
      category: input.data.category,
      location: input.data.location || null,
      project_date: input.data.date || null,
      created_by: context.user.id,
      status: "draft",
    })
    .select("id, slug, title, description, category, location, project_date, status")
    .single();

  if (error || !project) {
    const message = error?.code === "23505" ? "Este slug já está a ser utilizado." : "Não foi possível criar o projeto.";
    return Response.json({ error: message }, { status: error?.code === "23505" ? 409 : 500 });
  }

  return Response.json({
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description,
    category: project.category,
    status: project.status,
    location: project.location ?? undefined,
    date: project.project_date ?? undefined,
    photos: [],
  }, { status: 201 });
}