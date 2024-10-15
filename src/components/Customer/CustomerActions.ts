"use server"

import { auth } from "@/auth"
import { baseUrl } from "@/utils/constants"

export async function getCustomers() {
  try {
    const session = await auth();

    // Ensure the session and access token are available
    if (!session || !session.user?.access_token) {
      throw new Error("Unauthorized: No access token available.");
    }

    const res = await fetch(`${baseUrl}/customers/${session.user.companyId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
      next: { tags: ["getcustomers"] }
    });

    const data = await res.json();
    console.log(data, "Customers data"); // Debugging the response

    // If response is successful, return the data
    if (res.ok) {
      return data?.data || []; // Return the data or an empty array if no data is found
    } else {
      console.error(`Error fetching customers: ${res.status} - ${res.statusText}`);
      return [];
    }
  } catch (e: any) {
    console.error("Failed to fetch customers:", e);
    return []; // Return an empty array in case of error
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



// handle bulk upload for employees
export async function BulkCustomerCreation(customerData:FormData){
  try{
      // retrieve user session
      const session = await auth();
      if(session){

          const res= await fetch( baseUrl + "customers/bulk", {
              method:"POST",
              headers:{
                  Authorization: "Bearer " + session?.user?.access_token,
              },
              body:customerData
          })

        

          if(res.status !== 200){
              return [res.status, "Failed to create customers , something went wrong"]
          }

          const data= await res.json()

  
  
          return [200, data]
  
      }

  }catch(e:any){
      return [500, e?.message]
  }
}