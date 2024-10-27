import InvoiceManager from '@/components/invoice/InvoiceManager'
import { getInvoiceDashboardData, getInvoiceDetails } from '@/components/invoice/ServerActions';
import { Loader } from 'lucide-react';
import React, { Suspense } from 'react'

export const dynamic = "force-dynamic"

const page = async() => {

  const getInvoice = await getInvoiceDetails();

  const dashboarddata = await getInvoiceDashboardData() ?? {}
  
  // console.log(getInvoice, "----------------getInvoice server page-----------------------");
  
  return (
    <div>
      <Suspense fallback={<div className='flex items-center justify-center my-2'>
        <Loader className='text-primary700 animate animate-spin'/>
      </div>}>
        <InvoiceManager getInvoice={getInvoice} dashboarddata={dashboarddata}/>
        </Suspense>
    </div>
  )
}

export default page