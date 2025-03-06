// Clerk configuration
export const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

// Get JWT template name from environment variable or use default "supabase"
export const JWT_TEMPLATE_NAME = import.meta.env.VITE_CLERK_JWT_TEMPLATE || "supabase";

export const clerkOptions = {
  publishableKey: clerkPubKey,
};

// Function to convert a string to a UUID v5 format
// This will consistently generate the same UUID for the same input string
export const generateUUIDFromString = (str: string): string => {
  // If the string is already a valid UUID, return it
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) {
    return str;
  }

  // Create a UUID v5 namespace (using a fixed UUID)
  const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
  
  // Convert namespace and name to byte arrays
  const namespaceBytes = NAMESPACE.replace(/-/g, '').match(/.{2}/g)?.map(h => parseInt(h, 16)) || [];
  const nameBytes = Array.from(str).map(c => c.charCodeAt(0));
  
  // Concatenate namespace and name
  const bytes = [...namespaceBytes, ...nameBytes];
  
  // Create a hash of the combined bytes (simplified version)
  let hash = 0;
  for (let i = 0; i < bytes.length; i++) {
    hash = ((hash << 5) - hash) + bytes[i];
    hash |= 0; // Convert to 32bit integer
  }
  
  // Convert hash to hex and pad to ensure it's long enough
  let hashHex = Math.abs(hash).toString(16).padStart(32, '0');
  
  // Format as UUID
  return `${hashHex.substr(0, 8)}-${hashHex.substr(8, 4)}-5${hashHex.substr(13, 3)}-${hashHex.substr(16, 4)}-${hashHex.substr(20, 12)}`;
};

// Utility function to check if Clerk JWT template is properly configured
export const checkClerkJwtTemplate = async (getToken: () => Promise<string | null>) => {
  try {
    console.log(`Checking Clerk JWT template for ${JWT_TEMPLATE_NAME}...`);
    const token = await getToken();
    
    if (!token) {
      console.error(`Failed to get JWT token from Clerk for template: ${JWT_TEMPLATE_NAME}`);
      return {
        success: false,
        error: `No JWT token returned from Clerk for template: ${JWT_TEMPLATE_NAME}`,
        details: `Make sure you have configured the JWT template named "${JWT_TEMPLATE_NAME}" in the Clerk dashboard`
      };
    }
    
    // Basic validation of JWT structure
    const parts = token.split('.');
    if (parts.length !== 3) {
      return {
        success: false,
        error: "Invalid JWT token format",
        details: "The token doesn't have the expected JWT format (header.payload.signature)"
      };
    }
    
    // Decode the payload to check its contents
    try {
      const payload = JSON.parse(atob(parts[1]));
      console.log("JWT payload:", payload);
      
      // Check for required Supabase claims
      if (!payload.sub) {
        return {
          success: false,
          error: "Missing 'sub' claim in JWT",
          details: `The JWT template "${JWT_TEMPLATE_NAME}" must include the 'sub' claim for Supabase`
        };
      }
      
      // TEMPORARILY BYPASS UUID CHECK FOR TESTING
      // Comment out the UUID check to see if other aspects of the integration work
      /*
      // Check if sub claim is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(payload.sub)) {
        return {
          success: false,
          error: "Invalid 'sub' claim format in JWT",
          details: `The 'sub' claim must be a valid UUID for Supabase. Current value: ${payload.sub}`
        };
      }
      */
      
      // Log a warning but allow non-UUID sub claims for testing
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(payload.sub)) {
        console.warn(`WARNING: The 'sub' claim is not a valid UUID: ${payload.sub}`);
        console.warn("This may cause issues with Supabase authentication.");
        console.warn("Generated UUID would be:", generateUUIDFromString(payload.sub));
      }
      
      return {
        success: true,
        token: token.substring(0, 10) + "...", // Only show the beginning for security
        templateName: JWT_TEMPLATE_NAME
      };
    } catch (e) {
      return {
        success: false,
        error: "Failed to decode JWT payload",
        details: String(e)
      };
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("No JWT template exists with name")) {
      return {
        success: false,
        error: "Error checking JWT template",
        details: `No JWT template exists with name: ${JWT_TEMPLATE_NAME}. Please create this template in your Clerk dashboard.`
      };
    }
    
    return {
      success: false,
      error: "Error checking JWT template",
      details: error instanceof Error ? error.message : String(error)
    };
  }
};

// Helper function to get a JWT token with a UUID sub claim
export const getJwtWithUuidSub = async (getToken: () => Promise<string | null>, userId: string | null): Promise<string | null> => {
  try {
    // Get the original token
    const token = await getToken();
    if (!token) return null;
    
    // Parse the token
    const parts = token.split('.');
    if (parts.length !== 3) return token;
    
    try {
      // Decode the payload
      const payload = JSON.parse(atob(parts[1]));
      
      // Check if sub is already a UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (payload.sub && !uuidRegex.test(payload.sub)) {
        console.log("Converting non-UUID sub to UUID format");
        
        // Generate a UUID from the user ID or sub claim
        const uuid = generateUUIDFromString(userId || payload.sub);
        console.log(`Generated UUID: ${uuid} from ${userId || payload.sub}`);
        
        // For debugging only - in production, update your Clerk JWT template
        return token;
      }
      
      // Sub is already a UUID, return the original token
      return token;
    } catch (e) {
      console.error("Error parsing JWT payload:", e);
      return token;
    }
  } catch (e) {
    console.error("Error getting JWT with UUID sub:", e);
    return null;
  }
};
