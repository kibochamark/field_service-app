import { getCustomers, getCustomersInfo } from '@/components/Customer/CustomerActions'
import DemoPage from '@/components/Customer/page'
import React from 'react'

export default async function page() {
  const customers = await getCustomers() ?? []
  console.log(customers, "kastomaa")

  const customersinfo = await getCustomersInfo() ?? []
  console.log(customersinfo, "info")

  return (
    <div className='w-full min-h-screen'> 
      {/* Pass customersinfo as props to DemoPage */}
      <DemoPage customersinfo={customersinfo} />
    </div>
  )
}
