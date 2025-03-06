import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { checkClerkJwtTemplate, JWT_TEMPLATE_NAME } from "@/lib/clerk";
import { supabase, debugSupabaseSession } from "@/lib/supabase";
import { verifySupabaseConnection } from "@/lib/auth";

const AuthDiagnostics = () => {
  const { getToken, userId, isLoaded } = useAuth();
  const [jwtStatus, setJwtStatus] = useState<any>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [sessionDebug, setSessionDebug] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    // Collect environment variables (only the names, not values for security)
    const relevantEnvVars = [
      "VITE_CLERK_PUBLISHABLE_KEY",
      "VITE_SUPABASE_URL",
      "VITE_SUPABASE_ANON_KEY",
      "VITE_TEMPO",
      "VITE_BASE_PATH",
      "VITE_CLERK_JWT_TEMPLATE",
    ];

    const vars: Record<string, string> = {};
    relevantEnvVars.forEach(varName => {
      vars[varName] = import.meta.env[varName] ? "✅ Set" : "❌ Not set";
    });
    
    setEnvVars(vars);
  }, []);

  const runDiagnostics = async () => {
    if (!isLoaded || !userId) {
      alert("You need to be signed in to run diagnostics");
      return;
    }

    setIsChecking(true);
    
    try {
      console.log(`Using JWT template: ${JWT_TEMPLATE_NAME}`);
      
      // Check JWT template
      const jwtCheck = await checkClerkJwtTemplate(() => 
        getToken({ template: JWT_TEMPLATE_NAME })
      );
      setJwtStatus(jwtCheck);
      
      // Debug current Supabase session
      const currentSession = await debugSupabaseSession();
      setSessionDebug(currentSession);
      
      // If JWT check passed, verify Supabase connection
      if (jwtCheck.success) {
        const token = await getToken({ template: JWT_TEMPLATE_NAME });
        
        if (token) {
          // Try to decode the token to check its structure
          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              console.log("JWT payload for diagnostics:", payload);
              
              // Check for critical claims
              const missingClaims = [];
              if (!payload.sub) missingClaims.push("sub");
              if (!payload.exp) missingClaims.push("exp");
              if (!payload.aud) missingClaims.push("aud");
              
              if (missingClaims.length > 0) {
                console.warn(`Missing critical claims in JWT: ${missingClaims.join(", ")}`);
              }
            }
          } catch (e) {
            console.error("Error decoding JWT:", e);
          }
          
          // Try to set the session
          console.log("Setting Supabase session with JWT token");
          const sessionResult = await supabase.auth.setSession({
            access_token: token,
            refresh_token: token, // Use the same token as refresh token to avoid null issues
          });
          
          // Check if we can make a query
          const connectionStatus = await verifySupabaseConnection();
          
          // Get updated session after setting it
          const updatedSession = await debugSupabaseSession();
          setSessionDebug(updatedSession);
          
          setSupabaseStatus({
            sessionError: sessionResult.error,
            connectionStatus,
            message: connectionStatus 
              ? "Successfully connected to Supabase" 
              : "Failed to connect to Supabase"
          });
        }
      }
    } catch (error) {
      console.error("Diagnostics error:", error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Authentication Diagnostics</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="border p-3 rounded">
              <p className="font-medium">{key}</p>
              <p className={value.includes("✅") ? "text-green-600" : "text-red-600"}>{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="font-medium">Using JWT Template: <span className="text-blue-700">{JWT_TEMPLATE_NAME}</span></p>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">JWT Template Setup Guide</h2>
        <div className="prose">
          <p>To set up the JWT template in Clerk for Supabase integration:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Log in to your <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Clerk Dashboard</a></li>
            <li>Select your application</li>
            <li>In the left sidebar, find and click on "JWT Templates"</li>
            <li>Click the "New template" button</li>
            <li>Name the template exactly <code className="bg-gray-100 px-1 py-0.5 rounded">{JWT_TEMPLATE_NAME}</code> (case-sensitive)</li>
            <li>Add the following claims to your template:
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto mt-2">
{`{
  "sub": "{{user.id}}",
  "aud": "authenticated",
  "role": "authenticated",
  "exp": "{{current_timestamp + 3600}}",
  "iat": "{{current_timestamp}}",
  "email": "{{user.primary_email_address}}",
  "app_metadata": {
    "provider": "clerk"
  },
  "user_metadata": {
    "first_name": "{{user.first_name}}",
    "last_name": "{{user.last_name}}"
  }
}`}
              </pre>
            </li>
            <li>Make sure to include the <code className="bg-gray-100 px-1 py-0.5 rounded">exp</code> (expiration) and <code className="bg-gray-100 px-1 py-0.5 rounded">iat</code> (issued at) claims as shown above</li>
            <li>Set the signing algorithm to "HS256"</li>
            <li>For the signing key, use your Supabase project's JWT Secret:
              <ul className="list-disc pl-5 mt-2">
                <li>Go to your Supabase dashboard</li>
                <li>Navigate to Project Settings → API</li>
                <li>Find the "JWT Settings" section</li>
                <li>Copy the "JWT Secret" value</li>
                <li>Paste this value as the signing key in Clerk</li>
              </ul>
            </li>
            <li>Click "Save" or "Create Template"</li>
            <li>After creating the template, restart your application or refresh the page</li>
          </ol>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        <p className="mb-2">
          <span className="font-medium">User ID:</span> {userId || "Not signed in"}
        </p>
        <p className="mb-4">
          <span className="font-medium">Auth Loaded:</span> {isLoaded ? "✅ Yes" : "❌ No"}
        </p>
        
        <button
          onClick={runDiagnostics}
          disabled={isChecking || !isLoaded || !userId}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isChecking ? "Running Diagnostics..." : "Run Diagnostics"}
        </button>
      </div>
      
      {jwtStatus && (
        <div className={`bg-white shadow-md rounded-lg p-6 mb-6 ${jwtStatus.success ? "border-green-500 border-2" : "border-red-500 border-2"}`}>
          <h2 className="text-xl font-semibold mb-4">JWT Template Status</h2>
          <p className="mb-2">
            <span className="font-medium">Status:</span>{" "}
            <span className={jwtStatus.success ? "text-green-600" : "text-red-600"}>
              {jwtStatus.success ? "✅ Success" : "❌ Failed"}
            </span>
          </p>
          
          {jwtStatus.success ? (
            <p className="mb-2">
              <span className="font-medium">Token:</span> {jwtStatus.token}
            </p>
          ) : (
            <>
              <p className="mb-2">
                <span className="font-medium">Error:</span> {jwtStatus.error}
              </p>
              <p className="mb-2">
                <span className="font-medium">Details:</span> {jwtStatus.details}
              </p>
              <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                <h3 className="font-semibold text-yellow-800">How to fix:</h3>
                <ol className="list-decimal ml-5 text-yellow-800">
                  <li>Go to the Clerk Dashboard</li>
                  <li>Navigate to JWT Templates</li>
                  <li>Create a template named "supabase"</li>
                  <li>Add the necessary claims for Supabase (sub, role, etc.)</li>
                  <li>Save the template and try again</li>
                </ol>
              </div>
            </>
          )}
        </div>
      )}
      
      {sessionDebug && (
        <div className={`bg-white shadow-md rounded-lg p-6 mb-6 ${sessionDebug.session ? "border-green-500 border-2" : "border-yellow-500 border-2"}`}>
          <h2 className="text-xl font-semibold mb-4">Supabase Session Debug</h2>
          
          {sessionDebug.error ? (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-red-800 font-medium">Error getting session:</p>
              <p className="text-red-700">{sessionDebug.error}</p>
            </div>
          ) : sessionDebug.session ? (
            <div>
              <p className="mb-2">
                <span className="font-medium">Status:</span>{" "}
                <span className="text-green-600">✅ Session Active</span>
              </p>
              <p className="mb-2">
                <span className="font-medium">Access Token:</span>{" "}
                {sessionDebug.session.access_token}
              </p>
              <p className="mb-2">
                <span className="font-medium">Refresh Token:</span>{" "}
                {sessionDebug.session.refresh_token}
              </p>
              <p className="mb-2">
                <span className="font-medium">Expires At:</span>{" "}
                {sessionDebug.session.expires_at ? new Date(sessionDebug.session.expires_at * 1000).toLocaleString() : "Unknown"}
              </p>
              {sessionDebug.session.user && (
                <div className="mt-2">
                  <p className="font-medium">User:</p>
                  <ul className="pl-5 list-disc">
                    <li>ID: {sessionDebug.session.user.id}</li>
                    <li>Email: {sessionDebug.session.user.email}</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-800 font-medium">No active Supabase session found</p>
              <p className="text-yellow-700 mt-2">
                This means that either no session has been set, or the session has expired or is invalid.
                Run the diagnostics to attempt setting a new session.
              </p>
            </div>
          )}
        </div>
      )}
      
      {supabaseStatus && (
        <div className={`bg-white shadow-md rounded-lg p-6 mb-6 ${supabaseStatus.connectionStatus ? "border-green-500 border-2" : "border-red-500 border-2"}`}>
          <h2 className="text-xl font-semibold mb-4">Supabase Connection Status</h2>
          <p className="mb-2">
            <span className="font-medium">Status:</span>{" "}
            <span className={supabaseStatus.connectionStatus ? "text-green-600" : "text-red-600"}>
              {supabaseStatus.connectionStatus ? "✅ Connected" : "❌ Failed"}
            </span>
          </p>
          <p className="mb-2">
            <span className="font-medium">Message:</span> {supabaseStatus.message}
          </p>
          
          {supabaseStatus.sessionError && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <h3 className="font-semibold text-red-800">Session Error:</h3>
              <p className="text-red-800">{supabaseStatus.sessionError.message}</p>
            </div>
          )}
          
          {!supabaseStatus.connectionStatus && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-md">
              <h3 className="font-semibold text-yellow-800">How to fix:</h3>
              <ol className="list-decimal ml-5 text-yellow-800">
                <li>Verify your Supabase URL and anon key are correct</li>
                <li>Check that your JWT template has the correct claims for Supabase</li>
                <li>Ensure your Supabase project is configured to accept JWTs from Clerk</li>
                <li>Check the browser console for more detailed error messages</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthDiagnostics; 