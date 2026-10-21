import { projectImageBucket } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!uuidPattern.test(id)) return new Response(null, { status: 404 });

  const supabase = await createServerSupabaseClient();
  if (!supabase) return new Response(null, { status: 404 });

  const { data: photo, error: photoError } = await supabase
    .from("project_photos")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (photoError || !photo) return new Response(null, { status: 404 });

  const { data, error } = await supabase.storage
    .from(projectImageBucket)
    .createSignedUrl(photo.storage_path, 120);

  if (error || !data?.signedUrl) return new Response(null, { status: 404 });

  return new Response(null, {
    status: 302,
    headers: {
      Location: data.signedUrl,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}