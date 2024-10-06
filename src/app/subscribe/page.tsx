


import React, { Suspense } from 'react'

import { Loader } from 'lucide-react'
import { getPlans } from './actions'
import Subscribe from '@/components/subscription/PageView'

export const dynamic = "force-dynamic"


const page = async () => {
  const plans = await getPlans() || []
 
  return (
    <div>
      <Suspense fallback={<Loader className='text-primary600 flex items-center justify-center animate animate-spin' />}>
        <Subscribe plans={plans} />
      </Suspense>
    </div>
  )
}

export default page
