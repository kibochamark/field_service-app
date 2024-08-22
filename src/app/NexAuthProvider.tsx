"use client"
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

const NextAuthProvider = ({children, session}:{children:ReactNode; session?:any}) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}

export default NextAuthProvider
