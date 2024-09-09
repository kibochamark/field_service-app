import { auth } from "@/auth";
import { roles } from "@/components/Authentication/Requests";
import Signup from "@/components/Authentication/Signup";
import { baseUrl } from "@/utils/constants";
import axios from "axios";
import { getSession } from "next-auth/react";
import React from "react";

const signup = async (values: any) => {
  try {
    const result = await axios.post(
      baseUrl + "auth/signup",
      { 
        firstname:values.firstname,
        lastname:values.lastname,
        email:values.email,
        password:values.password,
        phonenumber:values.phonenumber
      }
    );
    return result.data;
  } catch (error:any) {
    console.error("Error creating user account", error);
    return error.message
  }
};



const page = async () => {
  const role = await roles();
  return (
    <div className="min-w-full">
      <Signup role={role} />
    </div>
  );
};

export default page;
