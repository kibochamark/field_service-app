"use server";

import axios from "axios";
import { signIn } from "next-auth/react";

export const roles = async () => {
  try {
    const role = await axios.get("http://localhost:8000/api/v1/roles");
    return role.data;
  } catch (error) {
    console.error("Error fetching roles", error);
  }
};

export const googlsingUp = async (role: string) => {
  try {
    const res = await axios.get("http://localhost:8000/auth/google", {
      params: { role: role },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching google", error);
  }
};
