"use server"

import { auth } from "@/auth"
import { baseUrl } from "@/utils/constants"

export async function getCustomers() {
  try {
    const session = await auth();
    const res = await fetch(baseUrl + `/customers/${session?.user?.companyId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + session?.user?.access_token
      },
      next: { tags: ["getcustomers"] }
    });

    const data = await res.json();
    console.log(data, "CDATA")
    return data;

  } catch (e: any) {
    return e?.message;
  }
}
 
export async function getCustomersInfo() {
  try {
    const session = await auth();
    const res = await fetch(baseUrl + `/customerinfo/${session?.user?.companyId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + session?.user?.access_token
      },
      next: { tags: ["getcustomersinfo"] }
    });

    const data = await res.json();
    return data;

  } catch (e: any) {
    return e?.message;
  }
}