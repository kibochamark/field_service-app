"use server"

import { auth } from "@/auth"
import { baseUrl } from "@/utils/constants"

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

