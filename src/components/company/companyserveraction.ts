"use server"

import { auth } from "@/auth";
import { baseUrl } from "@/utils/constants";
import axios from "axios";

export const company = async (values: any) => {
    const session = await auth()
    try {
        const result = await axios.post(process.env.BASEURL! + "company", {
            ...values,
        }, {
            headers: {
                Authorization: "Bearer " + session?.user?.access_token
            }
        });
        if(result.status === 201){
            return result.data
        }
        return result.data;
    } catch (error:any) {

        console.error("Error creating company account", error);
        return JSON.stringify(error)
    }
};


export async function getCompanySize(){
    try{
        const session = await auth()
        const res= await fetch(baseUrl + `companysize`, {
            method:"GET",
            headers:{
                Authorization:"Bearer " + session?.user?.access_token
            },
            next:{tags:["getcompanysize"]}
        })

        const data= await res.json()

    


        return data

    }catch(e:any){
        return e?.message
    }
}
