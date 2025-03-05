import { SignIn as ClerkSignIn } from "@clerk/clerk-react";

const SignIn = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Invoice App</h1>
          <p className="mt-2 text-gray-600">Sign in to access your invoices</p>
        </div>
        <ClerkSignIn signUpUrl="/sign-up" />
      </div>
    </div>
  );
};

export default SignIn;
