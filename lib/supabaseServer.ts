import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  // We intentionally don't throw here so the dev server can still run; requests will fail with a clear message.
  console.warn("Supabase server client not configured. Set SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL.");
}

export const supabaseAdmin = createClient(supabaseUrl || "", supabaseServiceKey || "", {
  auth: { persistSession: false },
  global: { headers: { "x-upstash-cache-control": "no-cache" } } as any,
});

export default supabaseAdmin;
