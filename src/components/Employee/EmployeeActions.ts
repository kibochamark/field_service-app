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