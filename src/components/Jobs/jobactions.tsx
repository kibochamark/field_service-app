"use server"

import { auth } from "@/auth"
import { baseUrl } from "@/utils/constants"
export async function getTechnicians() {
  try {
    const session = await auth();
    
    // Ensure session and token exist before making the API call
    if (!session || !session.user?.access_token) {
      throw new Error("Unauthorized: No access token available.");
    }

    const res = await fetch(`${baseUrl}/${session.user.companyId}/technician`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + session.user.access_token
      },
      next: { tags: ["gettechnicians"] }
    });

    const data = await res.json();
    console.log(data, "Technicians API response"); // Debug API response

    // Check for a successful response
    if (res.ok) {
      return data || []; // Return the data or an empty array if no data is found
    } else {
      console.error(`Error fetching technicians: ${res.status} - ${res.statusText}`);
      return [];
    }
  } catch (e: any) {
    console.error("Failed to fetch technicians:", e);
    return []; // Return an empty array in case of error
  }
}





export async function getJobTypes() {
  try {
    const session = await auth();

    // Ensure session and token are valid before making the API call
    if (!session || !session.user?.access_token) {
      throw new Error("Unauthorized: No access token available.");
    }

    const response = await fetch(baseUrl + "jobtype", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${session.user.access_token}` 
      },
    });

    const data = await response.json();
    console.log(data, "the API response for job types");

    if (response.ok) {
      return data?.data || []; // Return the job types or an empty array if no data field is found
    } else {
      console.error(`Error fetching job types------------------: ${response.status} - ${response.statusText}`);
      return [];
    }
  } catch (error: any) {
    console.error("Failed to fetch job types:", error);
    return []; // Return an empty array in case of failure
  }
}

export async function getJobsByCompanyId() {
  try {
    const session = await auth();

    // Ensure session and access token are available
    if (!session || !session.user?.access_token) {
      throw new Error("Unauthorized: No access token available.");
    }

    const res = await fetch(`${baseUrl}${session.user.companyId}/retrievejobs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`
      },
      next: { tags: ["getjobs"] }
    });

    const data = await res.json();
    console.log(data, "Jobs data"); // Debugging log to inspect the fetched jobs

    // If the response is successful and contains data
    if (res.ok) {
      return data?.data || []; // Return jobs data or an empty array if no data is found
    } else {
      console.error(`Error fetching jobs: ${res.status} - ${res.statusText}`);
      return [];
    }
  } catch (e: any) {
    console.error("Failed to fetch jobs:", e.message);
    return [];
  }
}


 