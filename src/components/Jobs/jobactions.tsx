"use server"

import { auth } from "@/auth"
import { baseUrl } from "@/utils/constants"

export async function getTechnicians() {
  try {
    const session = await auth();
    
    const res = await fetch(baseUrl + `/${session?.user?.companyId}/technician`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + session?.user?.access_token
      },
      next: { tags: ["gettechnicians"] }
    });

    const data = await res.json();

    if(res.status == 200){
      return data
    }
    
    return [];

  } catch (e: any) {
    return e?.message;
  }
}

export async function getJobTypes() {
  try {
    const session = await auth(); 
    
    const response = await fetch(baseUrl + "jobtype", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${session?.user?.access_token}` 
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      return data?.data; 
    }

    return []; 

  } catch (error: any) {
    console.error("Failed to fetch job types:", error);
    return error?.message; 
  }
}

export async function getJobsByCompanyId() {
  try {
    const session = await auth();

    const res = await fetch(`${baseUrl}${session?.user?.companyId}/retrievejobs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`
      },
      next: { tags: ["getjobs"] }
    });

    const data = await res.json(); 
      return data?.data

  } catch (e: any) {
    console.error("Failed to fetch jobs:", e.message);
    return [];
  }
}

 