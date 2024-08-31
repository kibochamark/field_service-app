"use server"
import { revalidateTag } from 'next/cache'
import React from 'react'


export async function Revalidate(name:string) {
  return revalidateTag(
    name
  )
}


