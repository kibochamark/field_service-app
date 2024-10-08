"use server"

import { auth } from "@/auth"
import { baseUrl } from "@/utils/constants"




export async function getPlans(){
    try{
        
        const session = await auth()

        if(session){
            const res = await fetch(baseUrl + "plans", {
                method:"GET",
                headers:{
                    "Authorization" : "Bearer " + session?.user.access_token
                },
                next:{tags:["getplans"]}
            })

            const data= await res.json()
            if(res.status == 200){

                return data?.data
            }

        }
        return []

    }catch(e:any){
        return e.message
    }
}