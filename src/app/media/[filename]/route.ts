import { readFile } from "node:fs/promises";
import path from "node:path";

const permittedFiles = new Set(["1.jpeg", "2.jpeg", "3.jpeg", "7.jpeg", "8.jpeg", "9.jpeg"]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  if (!permittedFiles.has(filename)) {
    return new Response(null, { status: 404 });
  }

  try {
    const image = await readFile(path.join(process.cwd(), filename));

    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}