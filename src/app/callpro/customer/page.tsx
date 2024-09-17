import { getCustomers, getCustomersInfo } from '@/components/Customer/CustomerActions'
import DemoPage from '@/components/Customer/page'
import React from 'react'

export const dynamic = "force-dynamic"


export default async function page() {
  const customers = await getCustomers() ?? []

  // console.log(customers, "cust")

  const customersinfo = await getCustomersInfo() ?? []

  return (
    <div className='w-full min-h-screen'> 
      {/* Pass customersinfo as props to DemoPage */}
      <DemoPage customersinfo={customersinfo} customers={customers} />
    </div>
  )
}
