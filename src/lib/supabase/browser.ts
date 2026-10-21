"use client";

import { createBrowserClient } from "@supabase/ssr";
import { hasSupabaseConfig, supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getBrowserSupabaseClient() {
  if (!hasSupabaseConfig) return null;
  browserClient ??= createBrowserClient(supabaseUrl, supabasePublishableKey);
  return browserClient;
}