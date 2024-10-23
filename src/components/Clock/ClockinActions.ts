"use server"

import { auth } from "@/auth"
import { baseUrl } from "@/utils/constants"
import axios from "axios"


export const clockin = async()=>{
    try{
        const session = await auth()

        if(!session){
            return "session is required"
        }

        const res= await axios.post(baseUrl + "clockin", {
            date:new Date().toLocaleTimeString()
        },{
            headers:{
                Authorization: "Bearer " + session?.user?.access_token
            }
        })


        console.log(res, "res")

        if(res.status === 201){
            return [res.data, 201]
        }

        return ["Failed to retrieve data", 400]

    }catch(e:any){

        return e.message

    }
}


export const clockout = async(id:string)=>{
    try{
        const session = await auth()

        if(!session){
            return "session is required"
        }

        const res= await axios.post(baseUrl + "clockout", {
            id:id,
            clockout:new Date().toLocaleTimeString()
        },{
            headers:{
                Authorization: "Bearer " + session?.user?.access_token
            }
        })



        if(res.status === 201){
            return [res.data, 201]
        }

        return ["Failed to retrieve data", 400]

    }catch(e:any){

        return e.message

    }
}
export const lunchstart = async(id:string)=>{
    try{
        const session = await auth()

        if(!session){
            return "session is required"
        }

        const res= await axios.post(baseUrl + "lunchStart", {
            id:id,
            lunchStart:new Date().toLocaleTimeString()
        },{
            headers:{
                Authorization: "Bearer " + session?.user?.access_token
            }
        })



        if(res.status === 200){
            return [res.data, 200]
        }

        return ["Failed to retrieve data", 400]

    }catch(e:any){

        return e.message

    }
}
export const lunchend = async(id:string)=>{
    try{
        const session = await auth()

        if(!session){
            return "session is required"
        }

        const res= await axios.post(baseUrl + "lunchbreak", {
            id:id,
            lunchBreak:new Date().toLocaleTimeString()
        },{
            headers:{
                Authorization: "Bearer " + session?.user?.access_token
            }
        })



        if(res.status === 200){
            return [res.data, 200]
        }

        return ["Failed to retrieve data", 400]

    }catch(e:any){

        return e.message

    }
}