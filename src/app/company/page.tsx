import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div>

            set up company
            <Link href={"/api/auth/signout"}>logout</Link>

        </div>
    )
}

export default page
