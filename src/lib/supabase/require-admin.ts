import { getProjectAdminContext } from "@/lib/supabase/admin";

export async function requireProjectAdmin() {
  const context = await getProjectAdminContext();

  if (!context.supabase) {
    return { context: null, response: Response.json({ error: "Supabase não está configurado." }, { status: 503 }) };
  }

  if (!context.user) {
    return { context: null, response: Response.json({ error: "Sessão expirada. Inicie sessão novamente." }, { status: 401 }) };
  }

  if (!context.isAdmin) {
    return { context: null, response: Response.json({ error: "Acesso não autorizado." }, { status: 403 }) };
  }

  return { context, response: null };
}