import { Dashboard } from "@/components/Dashboard/dashboard";
import { signOut } from "next-auth/react";
import React from "react";
import { SidebarMenu } from "../sidebar";
import NavbarComponent from "../navbar";

const Page = () => {
  const handleLogout = async () => {
    signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar at the top */}
      <NavbarComponent />

      <div className="flex flex-1">
        {/* Sidebar on the left */}
        <SidebarMenu />

        {/* Main content (Dashboard) on the right/center */}
        <div className="flex-1 p-4">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default Page;
