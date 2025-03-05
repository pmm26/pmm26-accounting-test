import { UserButton as ClerkUserButton } from "@clerk/clerk-react";

const UserButton = () => {
  return <ClerkUserButton afterSignOutUrl="/sign-in" />;
};

export default UserButton;
