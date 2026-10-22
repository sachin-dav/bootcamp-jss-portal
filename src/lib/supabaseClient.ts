import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  console.error(
    "[supabase] VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY are missing. " +
      "Paste them into .env (see .env.example) and restart `npm run dev`.",
  );
}

// Read-only, public client: no auth session is persisted or used.
// Placeholders keep the app rendering (with error states) instead of crashing when .env is empty.
export const supabase = createClient(url || "http://localhost:54321", anonKey || "missing-anon-key", {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
