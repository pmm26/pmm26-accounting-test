import { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { generateUUIDFromString } from "@/lib/clerk";

const ClerkJwtHelper = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const [uuid, setUuid] = useState<string | null>(null);
  const [isSettingUuid, setIsSettingUuid] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const generateAndSetUuid = async () => {
    if (!userId || !user) {
      setMessage("You must be signed in to generate a UUID");
      return;
    }

    setIsSettingUuid(true);
    setMessage(null);

    try {
      // Generate UUID from user ID
      const generatedUuid = generateUUIDFromString(userId);
      setUuid(generatedUuid);

      // Store UUID in user metadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          supabase_uuid: generatedUuid
        }
      });

      setMessage(`Successfully generated and stored UUID: ${generatedUuid}`);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSettingUuid(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Clerk JWT Template Helper</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Fix the "sub claim must be a UUID" Error</h2>
        <p className="mb-4">
          This tool will help you fix the "invalid claim: sub claim must be a UUID" error by generating a UUID for your Clerk user and providing instructions to update your JWT template.
        </p>

        <div className="mb-6">
          <button
            onClick={generateAndSetUuid}
            disabled={isSettingUuid || !userId}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isSettingUuid ? "Generating UUID..." : "Generate and Store UUID"}
          </button>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded ${message.includes("Successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        {uuid && (
          <div className="bg-gray-100 p-4 rounded mb-6">
            <p className="font-semibold">Your UUID:</p>
            <p className="font-mono bg-white p-2 rounded border mt-1">{uuid}</p>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">How to update your Clerk JWT template:</h3>
          <ol className="list-decimal pl-5 space-y-2 text-blue-800">
            <li>Go to the <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Clerk Dashboard</a></li>
            <li>Navigate to JWT Templates</li>
            <li>Edit your "supabase" template (or create it if it doesn't exist)</li>
            <li>Use the following template:</li>
          </ol>

          <pre className="bg-white p-3 rounded text-sm overflow-auto mt-4 border">
{`{
  "sub": "{{#if user.unsafe_metadata.supabase_uuid}}{{user.unsafe_metadata.supabase_uuid}}{{else}}${uuid || '00000000-0000-0000-0000-000000000000'}{{/if}}",
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

          <p className="mt-4 text-blue-800">
            Make sure to set the signing algorithm to "HS256" and use your Supabase project's JWT Secret as the signing key.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
        <p className="mb-2">
          The error "invalid claim: sub claim must be a UUID" occurs because Supabase expects the "sub" claim in the JWT token to be a valid UUID format, but Clerk uses its own user ID format.
        </p>
        <p className="mb-2">
          By generating a UUID and storing it in your user's metadata, you can use that UUID in your JWT template instead of Clerk's default user ID.
        </p>
        <p>
          This approach ensures that the same UUID is consistently used for each user, which is important for database permissions and row-level security in Supabase.
        </p>
      </div>
    </div>
  );
};

export default ClerkJwtHelper; 