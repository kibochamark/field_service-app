"use server"

import { auth } from "@/auth"
import { baseUrl } from "@/utils/constants"
import axios from "axios";

export type Sub = {
    values: {
        planId: String;
        companyId: String;
        startDate: Date;
        endDate: Date;
    }

}


export async function CreateSubscribe(data: Sub) {
    console.log(data)
    try {
        let sub
        const session = await auth()

        if (session) {
            const res = await axios.post(baseUrl + "subscription", { ...data?.values }, {

                headers: {
                    "Authorization": "Bearer " + session?.user.access_token
                },

            })

            if (res.status == 201) {
                sub = res?.data
            }


        }
        return sub

    } catch (e: any) {
        return e.message
    }
}