import InvoiceManager from '@/components/invoice/InvoiceManager'
import { getInvoiceDetails } from '@/components/invoice/ServerActions';
import React from 'react'

const page = async() => {

  const getInvoice = await getInvoiceDetails();
  
  console.log(getInvoice, "----------------getInvoice server page-----------------------");
  
  return (
    <div>
        <InvoiceManager getInvoice={getInvoice}/>
    </div>
  )
}

export default page