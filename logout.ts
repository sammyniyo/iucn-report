import { signOut } from "next-auth/react";

const handleLogout = () => {
  signOut({ callbackUrl: "/" }); // Redirects to home after logout
};
