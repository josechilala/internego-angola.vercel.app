import { projectInputSchema, projectStatusSchema } from "@/lib/projects/validation";
import { requireProjectAdmin } from "@/lib/supabase/require-admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const { context, response } = await requireProjectAdmin();
  if (response || !context) return response;

  const body = await request.json().catch(() => null);
  const { id } = await params;
  const statusUpdate = projectStatusSchema.safeParse(body);

  if (statusUpdate.success) {
    if (statusUpdate.data.status === "published") {
      const { count, error: photoError } = await context.supabase
        .from("project_photos")
        .select("id", { count: "exact", head: true })
        .eq("project_id", id);

      if (photoError || !count) {
        return Response.json({ error: "Carregue pelo menos uma fotografia antes de publicar." }, { status: 400 });
      }
    }

    const { data, error } = await context.supabase
      .from("projects")
      .update({ status: statusUpdate.data.status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, status")
      .maybeSingle();

    if (error || !data) return Response.json({ error: "Não foi possível atualizar o estado do projeto." }, { status: 404 });
    return Response.json(data);
  }

  const input = projectInputSchema.safeParse(body);
  if (!input.success) return Response.json({ error: "Verifique os campos do projeto." }, { status: 400 });

  const { data, error } = await context.supabase
    .from("projects")
    .update({
      title: input.data.title,
      slug: input.data.slug,
      description: input.data.description,
      category: input.data.category,
      location: input.data.location || null,
      project_date: input.data.date || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, slug, title, description, category, location, project_date, status")
    .maybeSingle();

  if (error || !data) {
    const message = error?.code === "23505" ? "Este slug já está a ser utilizado." : "Não foi possível atualizar o projeto.";
    return Response.json({ error: message }, { status: error?.code === "23505" ? 409 : 404 });
  }

  return Response.json(data);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { context, response } = await requireProjectAdmin();
  if (response || !context) return response;

  const { id } = await params;
  const { data: photos } = await context.supabase
    .from("project_photos")
    .select("storage_path")
    .eq("project_id", id);

  if (photos?.length) {
    const { error: storageError } = await context.supabase.storage
      .from("project-images")
      .remove(photos.map((photo) => photo.storage_path));
    if (storageError) return Response.json({ error: "Não foi possível remover as fotografias." }, { status: 500 });
  }

  const { error, count } = await context.supabase
    .from("projects")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error || count === 0) return Response.json({ error: "Não foi possível remover o projeto." }, { status: 404 });
  return new Response(null, { status: 204 });
}