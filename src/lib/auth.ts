import { supabase } from "./supabase";

// Function to create or update a user in the Supabase users table
export const syncUserWithSupabase = async (
  clerkUserId: string,
  email?: string,
) => {
  try {
    console.log("Syncing user with Supabase:", { clerkUserId, email });

    // First check if the user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", clerkUserId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is the error code for no rows returned
      console.error("Error fetching user:", fetchError);
      return null;
    }

    if (existingUser) {
      console.log("User exists in Supabase, updating if needed");
      // User exists, update if needed
      if (email && existingUser.email !== email) {
        const { data, error } = await supabase
          .from("users")
          .update({ email, updated_at: new Date().toISOString() })
          .eq("clerk_id", clerkUserId)
          .select()
          .single();

        if (error) {
          console.error("Error updating user:", error);
          return null;
        }

        console.log("User updated in Supabase");
        return data;
      }
      return existingUser;
    } else {
      console.log("User doesn't exist in Supabase, creating new user");
      // User doesn't exist, create new user
      const { data, error } = await supabase
        .from("users")
        .insert({
          clerk_id: clerkUserId,
          email,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating user:", error);
        return null;
      }

      console.log("User created in Supabase");
      return data;
    }
  } catch (error) {
    console.error("Error in syncUserWithSupabase:", error);
    return null;
  }
};

// Function to verify Supabase connection and token
export const verifySupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Supabase session error:", error);
      return false;
    }

    if (!data.session) {
      console.log("No active Supabase session");
      return false;
    }

    // Test a simple query to verify the token works
    const { error: queryError } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (queryError) {
      console.error("Supabase query error:", queryError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verifying Supabase connection:", error);
    return false;
  }
};
