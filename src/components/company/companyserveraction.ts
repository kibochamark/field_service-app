"use server"

import { auth } from "@/auth";
import axios from "axios";

export const company = async (values: any) => {
    const session = await auth()
    console.log(session, "dserver")
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