import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Single lazy-initialized Supabase client shared by server and browser.
// Using anon key only (no service role), so one instance is safe.
let _client: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase environment variables");
  _client = createClient(url, key);
  return _client;
}

// Lazy proxy — defers createClient until first property access
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
