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
      
      <NavbarComponent />

      <div className="flex flex-1">
       =
        <SidebarMenu />

       
        <div className="flex-1 p-4">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default Page;
