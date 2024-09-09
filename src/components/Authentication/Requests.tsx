"use server";

import { baseUrl } from "@/utils/constants";
import axios from "axios";
import { signIn } from "next-auth/react";

export const roles = async () => {
  try {
    const role = await axios.get(baseUrl + "roles");
    return role.data;
  } catch (error) {
    console.error("Error fetching roles", error);
  }
};

export const googlsingUp = async (role: string) => {
  try {
    const res = await axios.get("https://field-service-management.vercel.app/auth/google", {
      params: { role: role },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching google", error);
  }
};


export const signup = async (values: any) => {
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