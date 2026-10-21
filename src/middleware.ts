import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseConfig, supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin/");

  if ((!isAdminPage && !isAdminApi) || !hasSupabaseConfig) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    if (isAdminApi) return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
    if (pathname === "/admin/login") return response;
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/admin/login") return response;

  const { data: isAdmin } = await supabase.rpc("is_project_admin");
  if (!isAdmin) {
    if (isAdminApi) return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
    return NextResponse.redirect(new URL("/admin/login?error=acesso", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};