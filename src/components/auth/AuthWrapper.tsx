import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";
import { syncUserWithSupabase } from "@/lib/auth";
import { checkClerkJwtTemplate, JWT_TEMPLATE_NAME, generateUUIDFromString, getJwtWithUuidSub } from "@/lib/clerk";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isLoaded, userId, getToken } = useAuth();
  const { user } = useUser();
  const [isSupabaseAuthenticated, setIsSupabaseAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [jwtDiagnostics, setJwtDiagnostics] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if Supabase URL and anon key are configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  useEffect(() => {
    // Validate Supabase configuration
    if (!supabaseUrl || !supabaseAnonKey) {
      setAuthError("Supabase configuration is missing. Please check your environment variables.");
      setIsAuthenticating(false);
      return;
    }
    
    if (!isLoaded) return;

    // If user is not signed in, show the component anyway but with an error message
    // This prevents the infinite redirect loop
    if (!userId) {
      setIsAuthenticating(false);
      setAuthError("You need to be signed in to access this page");
      console.log("User not signed in, but not redirecting to prevent loop");
      return;
    }

    const setupSupabaseAuth = async () => {
      try {
        setIsAuthenticating(true);
        setAuthError(null);
        
        console.log(`Using JWT template: ${JWT_TEMPLATE_NAME}`);
        
        // Check if Clerk JWT template is properly configured
        const jwtCheck = await checkClerkJwtTemplate(() => 
          getToken({ template: JWT_TEMPLATE_NAME })
        );
        
        setJwtDiagnostics(jwtCheck);
        
        if (!jwtCheck.success) {
          console.error("JWT template check failed:", jwtCheck);
          setAuthError(`JWT template issue: ${jwtCheck.error}. ${jwtCheck.details}`);
          setIsAuthenticating(false);
          return;
        }
        
        console.log("JWT template check passed:", jwtCheck);
        
        // Get JWT token from Clerk with the configured template and ensure it has a UUID sub claim
        console.log(`Requesting JWT token from Clerk with ${JWT_TEMPLATE_NAME} template`);
        const token = await getJwtWithUuidSub(
          () => getToken({ template: JWT_TEMPLATE_NAME }),
          userId
        );

        if (!token) {
          console.error("Failed to get token from Clerk");
          setAuthError(`Failed to get authentication token. Please check if JWT template "${JWT_TEMPLATE_NAME}" is properly configured in Clerk dashboard.`);
          setIsAuthenticating(false);
          return;
        }

        console.log("Successfully obtained JWT token from Clerk");
        
        // Set the auth token in Supabase
        console.log("Setting Supabase session with the JWT token");
        
        try {
          // Create a more complete session object
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: token, // Use the same token as refresh token to avoid null issues
          });

          if (sessionError) {
            console.error("Supabase auth error:", sessionError);
            
            // Try to decode the token to see if there are any issues
            try {
              const parts = token.split('.');
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                console.log("JWT payload for debugging:", payload);
                
                // Check for critical claims
                const missingClaims = [];
                if (!payload.sub) missingClaims.push("sub");
                if (!payload.exp) missingClaims.push("exp");
                if (!payload.aud) missingClaims.push("aud");
                
                if (missingClaims.length > 0) {
                  setAuthError(`Supabase authentication error: ${sessionError.message}. Missing claims in JWT: ${missingClaims.join(", ")}`);
                } else if (sessionError.message.includes("fetch")) {
                  setAuthError(`Supabase API connection error: ${sessionError.message}. Please check your Supabase URL configuration.`);
                } else {
                  setAuthError(`Supabase authentication error: ${sessionError.message}. Check browser console for details.`);
                }
              } else {
                setAuthError(`Supabase authentication error: ${sessionError.message}. Invalid JWT format.`);
              }
            } catch (e) {
              setAuthError(`Supabase authentication error: ${sessionError.message}`);
            }
            
            setIsAuthenticating(false);
            return;
          }

          console.log("Successfully set Supabase session:", sessionData);

          // Verify the session was set correctly
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            console.error("Session was not set correctly");
            setAuthError("Failed to establish Supabase session. The session is missing after setting it.");
            setIsAuthenticating(false);
            return;
          }
          
          console.log("Verified Supabase session is active");

          // Sync user data with Supabase
          if (user) {
            const primaryEmail = user.primaryEmailAddress?.emailAddress;
            await syncUserWithSupabase(userId, primaryEmail);
          }

          setIsSupabaseAuthenticated(true);
          setIsAuthenticating(false);
        } catch (error) {
          console.error("Error setting Supabase session:", error);
          
          if (error instanceof Error && error.message.includes("fetch")) {
            setAuthError(`Supabase API connection error: ${error.message}. Please check your Supabase URL configuration.`);
          } else {
            setAuthError(`Error setting Supabase session: ${error instanceof Error ? error.message : String(error)}`);
          }
          
          setIsAuthenticating(false);
          return;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Auth setup error:", error);
        setAuthError(`Authentication setup error: ${errorMessage}`);
        setIsAuthenticating(false);
      }
    };

    setupSupabaseAuth();
  }, [isLoaded, userId, getToken, user, supabaseUrl, supabaseAnonKey]);

  if (!isLoaded || isAuthenticating) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // Show error message if there's an auth error
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mb-4">
          <p className="font-bold">Authentication Error</p>
          <p>{authError}</p>
          
          {jwtDiagnostics && !jwtDiagnostics.success && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
              <p className="font-semibold">JWT Diagnostics:</p>
              <p>Error: {jwtDiagnostics.error}</p>
              <p>Details: {jwtDiagnostics.details}</p>
              <p className="mt-2">
                Please make sure you have configured the JWT template in the Clerk dashboard.
                The template should be named "supabase" and include the necessary claims for Supabase.
              </p>
            </div>
          )}
          
          {authError.includes("Supabase URL") && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
              <p className="font-semibold">Supabase URL Configuration:</p>
              <p>Current URL: {supabaseUrl || "Not set"}</p>
              <p className="mt-2">
                Make sure your Supabase URL is correctly formatted and includes the protocol (https://).
                Example: https://your-project-id.supabase.co
              </p>
            </div>
          )}
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => navigate('/sign-in')} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Sign In
          </button>
          <button 
            onClick={() => navigate('/auth-diagnostics')} 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Diagnostics
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If user is signed in but not authenticated with Supabase, show loading
  if (userId && !isSupabaseAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
        <p className="ml-2">Setting up authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;

