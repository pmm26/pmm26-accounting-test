import { UserButton as ClerkUserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const UserButton = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate("/logout");
  };

  return (
    <div onClick={handleSignOut}>
      <ClerkUserButton 
        userProfileMode="navigation" 
        userProfileUrl="/profile" 
        signInUrl="/sign-in"
        afterSignOutUrl="/sign-in" 
      />
    </div>
  );
};

export default UserButton;
