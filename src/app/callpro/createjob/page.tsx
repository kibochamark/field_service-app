import { auth } from '@/auth';
import { getCustomers } from '@/components/Customer/CustomerActions';
import { getEmployees } from '@/components/Employee/EmployeeActions';
import JobManagement from '@/components/Jobs/CreateJob1';
import { getJobsByCompanyId, getJobTypes, getTechnicians } from '@/components/Jobs/jobactions';
import React from 'react';

export const dynamic = "force-dynamic"





const page = async() =>{
  const customers = await getCustomers() ?? [];
  const technician = await getTechnicians() ?? [];
  const jobTypes = await getJobTypes() ?? [];
  const allJobs = await getJobsByCompanyId() ?? [];

  // Extracting names and ids from customers
  const customerData = customers.map((customer: any) => ({
    id: customer.id,
    name: `${customer.firstName} ${customer.lastName}`,
  }));

  const techdata = technician.map((technician: any) => ({
    id: technician.id,
    name: `${technician.firstName} ${technician.lastName}`,
  }));
  
  console.log(technician, "techs")
   

  return (
    <div>
      <JobManagement customers={customerData} employee={techdata} jobtype={jobTypes} alljobs={allJobs}/>
    </div>
  );
}

export default page;
