"use server"
import { auth } from "@/auth";
import { baseUrl } from "@/utils/constants";

export async function getJobWorkflowData() {
  try {
    const session = await auth();

    const res = await fetch(`${baseUrl}${session?.user?.companyId}/retrievejobs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      next: { tags: ["getjobs"] },
    });

    const data = await res.json();
    return data?.data; // Return the data array from the API response
  } catch (e: any) {
    console.error("Failed to fetch job workflow data:", e.message);
    return []; // Return an empty array on error
  }
}
