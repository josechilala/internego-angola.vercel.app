import { projectPhotoInputSchema } from "@/lib/projects/validation";
import { projectImageBucket } from "@/lib/supabase/env";
import { requireProjectAdmin } from "@/lib/supabase/require-admin";

const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const maxFileSize = 10 * 1024 * 1024;

async function hasValidImageSignature(file: File) {
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  if (file.type === "image/jpeg") return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  if (file.type === "image/png") return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => header[index] === byte);
  if (file.type === "image/webp") {
    return String.fromCharCode(...header.slice(0, 4)) === "RIFF" && String.fromCharCode(...header.slice(8, 12)) === "WEBP";
  }
  return false;
}

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  const { context, response } = await requireProjectAdmin();
  if (response || !context) return response;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  const photoInput = projectPhotoInputSchema.safeParse({
    alt: formData?.get("alt"),
    caption: formData?.get("caption") ?? "",
  });

  if (!(file instanceof File) || !photoInput.success) {
    return Response.json({ error: "Selecione uma fotografia e preencha o texto alternativo." }, { status: 400 });
  }

  const extension = allowedImageTypes.get(file.type);
  if (!extension || file.size <= 0 || file.size > maxFileSize || !(await hasValidImageSignature(file))) {
    return Response.json({ error: "Use JPEG, PNG ou WebP até 10 MB." }, { status: 400 });
  }

  const { id } = await params;
  const { data: project, error: projectError } = await context.supabase
    .from("projects")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (projectError || !project) return Response.json({ error: "Projeto não encontrado." }, { status: 404 });

  const { count } = await context.supabase
    .from("project_photos")
    .select("id", { count: "exact", head: true })
    .eq("project_id", id);

  const storagePath = `${id}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await context.supabase.storage
    .from(projectImageBucket)
    .upload(storagePath, file, { contentType: file.type, cacheControl: "31536000", upsert: false });

  if (uploadError) return Response.json({ error: "Não foi possível guardar a fotografia." }, { status: 500 });

  const { data: photo, error: insertError } = await context.supabase
    .from("project_photos")
    .insert({
      project_id: id,
      storage_path: storagePath,
      alt: photoInput.data.alt,
      caption: photoInput.data.caption || null,
      sort_order: count ?? 0,
    })
    .select("id, storage_path, alt, caption, sort_order")
    .single();

  if (insertError || !photo) {
    await context.supabase.storage.from(projectImageBucket).remove([storagePath]);
    return Response.json({ error: "A fotografia não pôde ser associada ao projeto." }, { status: 500 });
  }

  return Response.json({
    id: photo.id,
    src: `/api/projects/images/${photo.id}`,
    alt: photo.alt,
    caption: photo.caption ?? undefined,
    sortOrder: photo.sort_order,
  }, { status: 201 });
}