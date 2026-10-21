import "server-only";
import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getProjectAdminContext() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { supabase: null, user: null, isAdmin: false };

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { supabase, user: null, isAdmin: false };

  const { data: isAdmin, error: roleError } = await supabase.rpc("is_project_admin");
  return { supabase, user: user as User, isAdmin: !roleError && isAdmin === true };
}