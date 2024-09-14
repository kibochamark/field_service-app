import { auth } from "@/auth";
import { roles } from "@/components/Authentication/Requests";
import Signup from "@/components/Authentication/Signup";
import { baseUrl } from "@/utils/constants";
import axios from "axios";
import { getSession } from "next-auth/react";
import React from "react";




const page = async () => {
  const role = await roles();
  return (
    <div className="min-w-full">
      <Signup role={role} />
    </div>
  );
};

export default page;
