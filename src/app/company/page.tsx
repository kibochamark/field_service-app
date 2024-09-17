import { getCompanySize } from '@/components/company/companyserveraction'
import CompanySetup from '@/components/company/companySetup'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import React, { Suspense } from 'react'

const page = async () => {
    const companySize = await getCompanySize() ?? {}

    return (
        <div className='md:h-screen w-full mx-auto'>
            <Suspense fallback={<Loader className="animate animate-spin text-primary600" />}>
                <CompanySetup  size={companySize} />
            </Suspense>
        </div>
    )
}

export default page
