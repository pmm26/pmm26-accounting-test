import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// Get Supabase URL and ensure it's properly formatted
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
// Ensure the URL has a protocol (https://)
if (supabaseUrl) {
  // Remove any leading/trailing whitespace
  supabaseUrl = supabaseUrl.trim();
  
  // Ensure the URL has a protocol (https://)
  if (!supabaseUrl.startsWith('http')) {
    supabaseUrl = `https://${supabaseUrl}`;
  }
  
  // Validate URL format
  try {
    new URL(supabaseUrl); // This will throw if the URL is invalid
    console.log(`Initializing Supabase client with URL: ${supabaseUrl}`);
  } catch (e) {
    console.error(`Invalid Supabase URL format: ${supabaseUrl}`, e);
    supabaseUrl = ""; // Reset to empty to trigger the error below
  }
} else {
  console.error("Supabase URL is missing");
}

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Validate URL before creating client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase URL or anon key. Please check your environment variables.");
}

// Create the Supabase client with proper error handling
let supabase;
try {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      flowType: "pkce",
      detectSessionInUrl: false, // Disable automatic URL detection to prevent conflicts with Clerk
      storageKey: "supabase-auth-token", // Explicit storage key to avoid conflicts
      storage: {
        getItem: (key) => {
          try {
            const storedSession = localStorage.getItem(key);
            console.log(`Getting Supabase session from storage: ${key}`, storedSession ? "Found" : "Not found");
            return storedSession;
          } catch (e) {
            console.error(`Error getting item from storage: ${key}`, e);
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            console.log(`Setting Supabase session in storage: ${key}`);
            localStorage.setItem(key, value);
          } catch (e) {
            console.error(`Error setting item in storage: ${key}`, e);
          }
        },
        removeItem: (key) => {
          try {
            console.log(`Removing Supabase session from storage: ${key}`);
            localStorage.removeItem(key);
          } catch (e) {
            console.error(`Error removing item from storage: ${key}`, e);
          }
        },
      },
    },
    global: {
      headers: {
        // Use a static headers object instead of a function that could cause circular references
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    },
  });
  console.log("Supabase client created successfully");
} catch (error) {
  console.error("Error creating Supabase client:", error);
  // Create a fallback client that logs errors
  supabase = createClient<Database>("https://placeholder.supabase.co", "placeholder", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
}

export { supabase };

// Helper function to debug Supabase session
export const debugSupabaseSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting Supabase session:", error);
      return { error };
    }
    
    if (!data.session) {
      console.log("No active Supabase session");
      return { session: null };
    }
    
    // Return a sanitized version of the session for debugging
    return {
      session: {
        access_token: data.session.access_token ? `${data.session.access_token.substring(0, 10)}...` : null,
        refresh_token: data.session.refresh_token ? "Present" : "Missing",
        expires_at: data.session.expires_at,
        user: data.session.user ? {
          id: data.session.user.id,
          email: data.session.user.email,
        } : null,
      }
    };
  } catch (error) {
    console.error("Error in debugSupabaseSession:", error);
    return { error: String(error) };
  }
};
