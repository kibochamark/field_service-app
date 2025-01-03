"use server"

import { auth } from "@/auth";
import { baseUrl } from "@/utils/constants";

//getting clients with invoice details
export async function getClints() {
    try {
        const session = await auth();

        const res = await fetch(baseUrl + `/${session?.user?.companyId}/retrievejobs/`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + session?.user?.access_token
            },
            next: { tags: ["getclients"] }
        });
        

        const data = await res.json();
        console.log(data, "------11111111111111-------------------------data for clients-------------------------------------");


        if (res.status == 200) {
            console.log(data, "-------------------------------data for clients-------------------------------------");
            return data?.data;
            
            // return data;
        }

        return [];

    } catch (e: any) {
        return e?.message;
    }
}




//getting invoice details
export async function getInvoiceDetails() {
    try {
        const session = await auth();  // Ensure user is authenticated

        // Perform the API request
        const res = await fetch(baseUrl + `/${session?.user?.companyId}/invoices/`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + session?.user?.access_token // Pass token for auth
            },
            next: { tags: ["getclient"] }  // Invalidate and refresh caching if needed (Next.js)
        });

        // Check if the response is OK (status code 200-299)
        if (!res.ok) {
            console.error(`Failed to fetch invoices. Status: ${res.status}`);
            return [];  // Return an empty array on error
        }

        const data = await res.json();  // Parse the response as JSON
        console.log(data, "-------------------------------data for invoice-------------------");
        
        return data;

    } catch (e: any) {
        // console.error('Error fetching invoice details:', e);
        return [];  // Return an empty array on failure
    }
}



export async function getInvoiceDashboardData() {

    const session= await auth()
    try{

        if(session){
            const res= await fetch(baseUrl + `${session.user.companyId}/invoicedata`, {
                method:"GET",
                headers:{
                    Authorization:"Bearer " + session.user.access_token
                },
                next:{tags:["getinvoicedashboarddata"]}
            })

            if(res.status !== 200){
                return new Error("Failed to fetch")
            }

            const data= await res.json()

            return data

        }else{
            return "Unauthorized"
        }

    }catch(e:any){
        return e?.message
    }
    
}

