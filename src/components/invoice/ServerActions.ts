"use server"

import { auth } from "@/auth";
import { baseUrl } from "@/utils/constants";
export async function getClints() {
    try {
        const session = await auth();

        const res = await fetch(baseUrl + `/66c5b18bf6e875a068ac3db8/retrievejobs/`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + session?.user?.access_token
            },
            next: { tags: ["getclients"] }
        });
        

        const data = await res.json();
        console.log(data, "datafor invoice");
        

        if (res.status == 200) {
            return data?.data;
        }

        return [];

    } catch (e: any) {
        return e?.message;
    }
}
