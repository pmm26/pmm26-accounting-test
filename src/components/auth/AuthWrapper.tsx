import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";
import { syncUserWithSupabase } from "@/lib/auth";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isLoaded, userId, getToken } = useAuth();
  const { user } = useUser();
  const [isSupabaseAuthenticated, setIsSupabaseAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      navigate("/sign-in");
      return;
    }

    const setupSupabaseAuth = async () => {
      try {
        setIsAuthenticating(true);
        // Get JWT token from Clerk
        const token = await getToken({ template: "supabase" });

        if (!token) {
          console.error("Failed to get token from Clerk");
          navigate("/sign-in");
          return;
        }

        // Set the auth token in Supabase
        const { error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: "",
        });

        if (error) {
          console.error("Supabase auth error:", error);
          navigate("/sign-in");
          return;
        }

        // Sync user data with Supabase
        if (user) {
          const primaryEmail = user.primaryEmailAddress?.emailAddress;
          await syncUserWithSupabase(userId, primaryEmail);
        }

        setIsSupabaseAuthenticated(true);
        setIsAuthenticating(false);
      } catch (error) {
        console.error("Auth setup error:", error);
        setIsAuthenticating(false);
        navigate("/sign-in");
      }
    };

    setupSupabaseAuth();
  }, [isLoaded, userId, getToken, navigate, user]);

  // Prevent infinite redirects by checking if we're already on the sign-in page
  useEffect(() => {
    if (!isLoaded) return;

    if (
      !userId &&
      location.pathname !== "/sign-in" &&
      location.pathname !== "/sign-up"
    ) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate, location.pathname]);

  if (!isLoaded || isAuthenticating) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (
    !userId &&
    location.pathname !== "/sign-in" &&
    location.pathname !== "/sign-up"
  ) {
    return null; // Don't render anything while redirecting to sign-in
  }

  if (
    userId &&
    !isSupabaseAuthenticated &&
    location.pathname !== "/sign-in" &&
    location.pathname !== "/sign-up"
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
