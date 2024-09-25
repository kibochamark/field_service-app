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

    if(res.status == 200){
      return data?.data
    }
    
    return [];

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