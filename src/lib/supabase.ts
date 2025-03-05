import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    flowType: "pkce",
    detectSessionInUrl: false, // Disable automatic URL detection to prevent conflicts with Clerk
  },
  global: {
    headers: {
      // This function runs on every request
      async headers() {
        try {
          // Get the current session
          const { data } = await supabase.auth.getSession();
          // If there's an active session, include the Authorization header
          if (data?.session) {
            return {
              Authorization: `Bearer ${data.session.access_token}`,
            };
          }
        } catch (error) {
          console.error("Error getting Supabase session:", error);
        }
        return {};
      },
    },
  },
});
