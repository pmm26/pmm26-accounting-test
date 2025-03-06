import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { supabase } from "@/lib/supabase";

const Logout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // First, sign out from Supabase
        await supabase.auth.signOut();
        
        // Then, sign out from Clerk
        await signOut();
        
        // Redirect to sign-in page
        navigate("/sign-in");
      } catch (error) {
        console.error("Error during logout:", error);
        // Still redirect to sign-in page even if there's an error
        navigate("/sign-in");
      }
    };

    performLogout();
  }, [signOut, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Logging out...</h1>
          <p className="mt-2 text-gray-600">Please wait while we sign you out.</p>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout; 