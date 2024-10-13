import { auth } from "@/auth";
import { baseUrl } from "@/utils/constants";

export async function getJobWorkflow() {
    try {
      const session = await auth();
      const res = await fetch(`${baseUrl}${session?.user?.companyId}/workflow`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
        next: { tags: ["getworkflow"] },
      });
  
      const data = await res.json();
      console.log(data, "data"); // This should log the response from the API
  
      if (res.status === 200) {
        return data?.data; // Return the array of job workflow data
      }
  
      return []; // Return an empty array if the response status is not 200
    } catch (e: any) {
      console.error("Failed to fetch job workflow:", e.message);
      return []; // Return an empty array if there's an error
    }
  }
  