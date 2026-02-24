import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase client (for SSR in server components and API routes)
let _serverClient: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient {
  if (!_serverClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    _serverClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _serverClient;
}

// Lazy proxy for server-side usage (API routes, server components)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getServerSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Client-side Supabase client (for use in "use client" components)
let _browserClient: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient {
  if (!_browserClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    _browserClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _browserClient;
}

export const supabaseBrowser = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getBrowserSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
