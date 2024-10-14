"use server";

import { auth } from "@/auth";
import { baseUrl } from "@/utils/constants";

// Function to fetch technician jobs
export async function getTechicianJob() {
  const session = await auth();

  const response = await fetch(
    baseUrl + `/${session?.user?.companyId}/retrievejobs/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.access_token}`,
      },
    }
  );
  
  console.log(
    response,
    "-----------------------------------tech-------------------------------------------"
  );

  if (response.ok) {
    const data = await response.json();
    console.log(data, "data1111");
    return data; // Return the data here
  } else {
    const data = await response.json();
    console.log(data, "dataa2222");
    alert(`Error: ${data.message}`);
    return null; // Return null or handle error as needed
  }
}
