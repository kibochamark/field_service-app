"use server"

import { auth } from "@/auth"
import { baseUrl } from "@/utils/constants"
import axios from "axios"
import { headers } from "next/headers"

export async function getEmployees(){
    try{
        const session = await auth()
        const res= await fetch(baseUrl + `${session?.user?.companyId}/employees`, {
            method:"GET",
            headers:{
                Authorization:"Bearer " + session?.user?.access_token
            },
            next:{tags:["getemployees"]}
        })

        const data= await res.json()

    


        return data

    }catch(e:any){
        return e?.message
    }
}



export async function getRoles(token:string){
    try{
        const res= await fetch(baseUrl + "roles", {
            method:"GET",
            headers:{
                Authorization:"Bearer " + token
            },
            next:{tags:["getroles"]}
        })

        const data= await res.json()

        return data?.data ?? []

    }catch(e:any){
        return e?.message
    }
}



// handle bulk upload for employees
export async function BulkEmployeeCreation(employeedata:FormData){
    console.log(employeedata)
    try{
        // retrieve user session
        const session = await auth();
        if(session){

            const res= await fetch("http://localhost:8000/api/v1/employee/bulk", {
                method:"POST",
                headers:{
                    Authorization: "Bearer " + session?.user?.access_token,
                },
                body:employeedata
            })
            if(res.status !== 200){
                throw new Error("Failed to create employees , something went wrong")
            }
    
    
            return await res.json()
    
        }

    }catch(e:any){
        return e?.message
    }
}

