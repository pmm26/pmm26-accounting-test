import { SignUp as ClerkSignUp } from "@clerk/clerk-react";

const SignUp = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Invoice App</h1>
          <p className="mt-2 text-gray-600">Create an account to get started</p>
        </div>
        <ClerkSignUp signInUrl="/sign-in" />
      </div>
    </div>
  );
};

export default SignUp;
