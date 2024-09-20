import { getCustomers } from '@/components/Customer/CustomerActions';
import { getEmployees } from '@/components/Employee/EmployeeActions';
import JobManagement from '@/components/Jobs/CreateJob1';
import { getJobTypes, getTechnicians } from '@/components/Jobs/jobactions';
import React from 'react';

async function page() {
  const customers = await getCustomers() ?? [];
  const technician = await getTechnicians() ?? [];
  const jobTypes = await getJobTypes() ?? [];
  

  // Extracting names and ids from customers
  const customerData = customers.map((customer: any) => ({
    id: customer.id,
    name: `${customer.firstName} ${customer.lastName}`,
  }));

  const techdata = technician.map((technician: any) => ({
    id: technician.id,
    name: `${technician.firstName} ${technician.lastName}`,
  }));

   

  return (
    <div>
      <JobManagement customers={customerData} employee={techdata} jobtype={jobTypes} />
    </div>
  );
}

export default page;
