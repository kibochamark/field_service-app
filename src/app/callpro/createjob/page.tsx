import { getCustomers } from '@/components/Customer/CustomerActions';
import { getEmployees } from '@/components/Employee/EmployeeActions';
import JobManagement from '@/components/Jobs/CreateJob1';
import { getJobTypes, getTechnicians } from '@/components/Jobs/jobactions';
import React from 'react';

export const dynamic = "force-dynamic"

async function page() {
  const customers = await getCustomers() ?? [];
  const technician = await getTechnicians() ?? [];
  const jobTypes = await getJobTypes() ?? [];
  console.log(jobTypes, "jobs")
  console.log(technician, "tech")
  console.log(customers, "cus")

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