import { Dashboard } from "@/components/Dashboard/dashboard";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

const page = () => {
  const handleLogout = async () => {
    signOut({
      callbackUrl: "/login",
    });
  };
  return (
    <div>
      <Dashboard/>
    </div>
  );
};

export default page;
