import { roles } from "@/components/Authentication/Requests";
import Signup from "@/components/Authentication/Signup";
import axios from "axios";
import React from "react";

export const signup = async (values: {}) => {
  try {
    const result = await axios.post(
      "http://localhost:8000/api/v1/auth/signup",
      { ...values }
    );
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.error("Error creating user account", error);
  }
};

export const company = async (values: {}) => {
  try {
    const result = await axios.post("http://localhost:8000/api/v1/company", {
      ...values,
    });
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.error("Error creating company account", error);
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
