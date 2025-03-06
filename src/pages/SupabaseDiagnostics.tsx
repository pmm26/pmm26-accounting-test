import { useState } from "react";
import { supabase, debugSupabaseSession } from "@/lib/supabase";
import { useAuth, useUser } from "@clerk/clerk-react";
import { JWT_TEMPLATE_NAME, generateUUIDFromString } from "@/lib/clerk";

const SupabaseDiagnostics = () => {
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingUUID, setIsSettingUUID] = useState(false);
  const { getToken, userId } = useAuth();
  const { user } = useUser();

  // Function to generate and set a UUID for the current user
  const setUserUUID = async () => {
    if (!user) {
      setError("You must be signed in to set a UUID");
      return;
    }
    
    setIsSettingUUID(true);
    
    try {
      // Generate a UUID from the user ID
      const uuid = generateUUIDFromString(userId || "");
      
      // Set the UUID in the user's public metadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          supabase_uuid: uuid
        }
      });
      
      // Run diagnostics again to show the updated status
      await runDiagnostics();
      
      // Show success message
      setError(`Successfully set UUID: ${uuid}`);
    } catch (e) {
      setError(`Error setting UUID: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsSettingUUID(false);
    }
  };

  const runDiagnostics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Test 1: Check environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const results: any = {
        environmentVariables: {
          supabaseUrl: supabaseUrl ? "✅ Set" : "❌ Not set",
          supabaseAnonKey: supabaseAnonKey ? "✅ Set" : "❌ Not set",
          supabaseUrlValue: supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : "Not set",
        },
        tests: []
      };
      
      // Test 2: Validate URL format
      try {
        if (supabaseUrl) {
          new URL(supabaseUrl);
          results.tests.push({
            name: "URL Format Validation",
            status: "✅ Success",
            message: "Supabase URL is properly formatted"
          });
        } else {
          results.tests.push({
            name: "URL Format Validation",
            status: "❌ Failed",
            message: "Supabase URL is not set"
          });
        }
      } catch (e) {
        results.tests.push({
          name: "URL Format Validation",
          status: "❌ Failed",
          message: `Invalid URL format: ${e instanceof Error ? e.message : String(e)}`
        });
      }
      
      // Test 3: Basic fetch test to the Supabase URL
      try {
        if (supabaseUrl) {
          const response = await fetch(`${supabaseUrl}/auth/v1/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseAnonKey || '',
            },
          });
          
          results.tests.push({
            name: "Basic Fetch Test",
            status: response.ok ? "✅ Success" : "❌ Failed",
            message: `Status: ${response.status} ${response.statusText}`,
            details: response.ok ? "Successfully connected to Supabase API" : "Failed to connect to Supabase API"
          });
        } else {
          results.tests.push({
            name: "Basic Fetch Test",
            status: "⚠️ Skipped",
            message: "Supabase URL is not set"
          });
        }
      } catch (e) {
        results.tests.push({
          name: "Basic Fetch Test",
          status: "❌ Failed",
          message: `Fetch error: ${e instanceof Error ? e.message : String(e)}`,
          details: "This could indicate network issues, CORS problems, or an invalid URL"
        });
      }
      
      // Test 4: Check Supabase client session
      try {
        const sessionDebug = await debugSupabaseSession();
        results.sessionDebug = sessionDebug;
        
        results.tests.push({
          name: "Supabase Client Session",
          status: sessionDebug.error ? "❌ Failed" : (sessionDebug.session ? "✅ Success" : "⚠️ No Session"),
          message: sessionDebug.error 
            ? `Error: ${sessionDebug.error}` 
            : (sessionDebug.session ? "Active session found" : "No active session"),
        });
      } catch (e) {
        results.tests.push({
          name: "Supabase Client Session",
          status: "❌ Failed",
          message: `Error: ${e instanceof Error ? e.message : String(e)}`
        });
      }
      
      // Test 5: Simple query test
      try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        
        results.tests.push({
          name: "Simple Query Test",
          status: error ? "❌ Failed" : "✅ Success",
          message: error 
            ? `Query error: ${error.message}` 
            : "Successfully queried the database",
          details: error?.details || (data ? `Received data: ${JSON.stringify(data)}` : "No data returned")
        });
      } catch (e) {
        results.tests.push({
          name: "Simple Query Test",
          status: "❌ Failed",
          message: `Error: ${e instanceof Error ? e.message : String(e)}`
        });
      }
      
      // Test 6: Check JWT token format
      if (userId) {
        try {
          const token = await getToken({ template: JWT_TEMPLATE_NAME });
          
          if (token) {
            // Try to decode the token
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              
              // Check if sub claim exists and is a UUID
              const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
              const hasSubClaim = !!payload.sub;
              const isUUID = hasSubClaim && uuidRegex.test(payload.sub);
              
              // Generate a UUID from the user ID for comparison
              const generatedUUID = userId ? generateUUIDFromString(userId) : null;
              
              results.tests.push({
                name: "JWT Token Format",
                status: isUUID ? "✅ Success" : "❌ Failed",
                message: isUUID 
                  ? "The 'sub' claim is a valid UUID format" 
                  : (hasSubClaim 
                    ? `The 'sub' claim is not a valid UUID: ${payload.sub}` 
                    : "The 'sub' claim is missing in the JWT token"),
                details: hasSubClaim 
                  ? `Current sub value: ${payload.sub}${!isUUID ? `\nA valid UUID would look like: ${generatedUUID}` : ""}` 
                  : "The JWT token must include a 'sub' claim in UUID format for Supabase"
              });
              
              // Add JWT payload for debugging
              results.jwtPayload = {
                sub: payload.sub || "Missing",
                role: payload.role || "Missing",
                exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : "Missing",
                iat: payload.iat ? new Date(payload.iat * 1000).toISOString() : "Missing",
                aud: payload.aud || "Missing"
              };
            } else {
              results.tests.push({
                name: "JWT Token Format",
                status: "❌ Failed",
                message: "Invalid JWT token format",
                details: "The token doesn't have the expected JWT format (header.payload.signature)"
              });
            }
          } else {
            results.tests.push({
              name: "JWT Token Format",
              status: "❌ Failed",
              message: `No JWT token returned from Clerk for template: ${JWT_TEMPLATE_NAME}`,
              details: `Make sure you have configured the JWT template named "${JWT_TEMPLATE_NAME}" in the Clerk dashboard`
            });
          }
        } catch (e) {
          results.tests.push({
            name: "JWT Token Format",
            status: "❌ Failed",
            message: `Error checking JWT token: ${e instanceof Error ? e.message : String(e)}`,
            details: "There was an error retrieving or parsing the JWT token"
          });
        }
      } else {
        results.tests.push({
          name: "JWT Token Format",
          status: "⚠️ Skipped",
          message: "User is not signed in",
          details: "Sign in to check the JWT token format"
        });
      }
      
      setDiagnosticResults(results);
    } catch (e) {
      setError(`Error running diagnostics: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Diagnostics</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p className="mb-4">
          This tool will help diagnose issues with your Supabase connection. It will run several tests to identify potential problems.
        </p>
        
        <div className="flex space-x-4">
          <button
            onClick={runDiagnostics}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading ? "Running Diagnostics..." : "Run Diagnostics"}
          </button>
          
          {userId && (
            <button
              onClick={setUserUUID}
              disabled={isSettingUUID}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isSettingUUID ? "Setting UUID..." : "Set UUID for Current User"}
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className={`border px-4 py-3 rounded mb-6 ${error.includes("Successfully") ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"}`}>
          <p className="font-bold">{error.includes("Successfully") ? "Success" : "Error"}</p>
          <p>{error}</p>
        </div>
      )}
      
      {diagnosticResults && (
        <>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-3 rounded">
                <p className="font-medium">VITE_SUPABASE_URL</p>
                <p className={diagnosticResults.environmentVariables.supabaseUrl.includes("✅") ? "text-green-600" : "text-red-600"}>
                  {diagnosticResults.environmentVariables.supabaseUrl}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {diagnosticResults.environmentVariables.supabaseUrlValue}
                </p>
              </div>
              <div className="border p-3 rounded">
                <p className="font-medium">VITE_SUPABASE_ANON_KEY</p>
                <p className={diagnosticResults.environmentVariables.supabaseAnonKey.includes("✅") ? "text-green-600" : "text-red-600"}>
                  {diagnosticResults.environmentVariables.supabaseAnonKey}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Diagnostic Tests</h2>
            
            {diagnosticResults.tests.map((test: any, index: number) => (
              <div key={index} className="border-b last:border-b-0 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{test.name}</h3>
                  <span className={
                    test.status.includes("✅") ? "text-green-600" : 
                    test.status.includes("❌") ? "text-red-600" : 
                    "text-yellow-600"
                  }>
                    {test.status}
                  </span>
                </div>
                <p className="mt-1">{test.message}</p>
                {test.details && (
                  <p className="mt-1 text-sm text-gray-600">{test.details}</p>
                )}
              </div>
            ))}
          </div>
          
          {diagnosticResults.sessionDebug && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Session Debug</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(diagnosticResults.sessionDebug, null, 2)}
              </pre>
            </div>
          )}
          
          {diagnosticResults.jwtPayload && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">JWT Token Claims</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(diagnosticResults.jwtPayload).map(([key, value]) => (
                  <div key={key} className="border p-3 rounded">
                    <p className="font-medium">{key}</p>
                    <p className={typeof value === 'string' && value.includes("Missing") ? "text-red-600" : "text-green-600"}>
                      {value as string}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded">
                <h3 className="font-semibold text-blue-800 mb-2">How to fix UUID format issues:</h3>
                <p className="mb-2">Update your Clerk JWT template with the following claims:</p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
{`{
  "sub": "{{#if user.public_metadata.supabase_uuid}}{{user.public_metadata.supabase_uuid}}{{else}}00000000-0000-0000-0000-000000000000{{/if}}",
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
                <p className="mt-2 text-sm">
                  Note: You'll need to set a valid UUID in the user's public_metadata.supabase_uuid field.
                  You can generate a UUID for each user using the Clerk webhook or Admin API.
                </p>
              </div>
            </div>
          )}
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Troubleshooting Tips</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Make sure your Supabase URL is correctly formatted and includes the protocol (https://)</li>
              <li>Verify that your Supabase anon key is valid</li>
              <li>Check for any network issues or CORS restrictions</li>
              <li><strong>Ensure your JWT template has the 'sub' claim in UUID format</strong></li>
              <li>Try clearing your browser's local storage and cache</li>
              <li>Check the browser console for additional error details</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SupabaseDiagnostics; 