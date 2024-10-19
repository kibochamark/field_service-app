import { getInvoiceDetails } from '@/components/invoice/ServerActions';
import MultipleWorkFlow from '@/components/WorkFlow/MultipleWorkFlow';
import React from 'react';

const page = async () => {
  // Ensure getInvoiceDetails returns an array or default to an empty array
  const getInvoice = await getInvoiceDetails() || []; 

  return (
    <div>
      <MultipleWorkFlow getInvoice={getInvoice} />
    </div>
  );
};

export default page;
