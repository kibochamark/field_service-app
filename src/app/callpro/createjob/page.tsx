import { getCustomers } from '@/components/Customer/CustomerActions';
import { getTechnicians, getJobTypes, getJobsByCompanyId } from '@/components/Jobs/jobactions';
import JobManagement from '@/components/Jobs/CreateJob1';
import React from 'react';

export const dynamic = "force-dynamic";

const page = async () => {
  // Fetch data from APIs
  const customers = await getCustomers() ?? [];
  const technician = await getTechnicians() ?? [];
  const jobTypes = await getJobTypes() ?? [];
  const allJobs = await getJobsByCompanyId() ?? [];

  // Detailed logging to debug issues
  console.log({ customers }, "customers data (should be an array)");
  console.log({ technician }, "technician data (should be an array)");
  console.log({ jobTypes }, "jobTypes data (should be an array)");

  // Check if customers is an array before calling map
  const customerData = Array.isArray(customers)
    ? customers.map((customer: any) => ({
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`,
      }))
    : [];

  const techdata = Array.isArray(technician)
    ? technician.map((technician: any) => ({
        id: technician.id,
        name: `${technician.firstName} ${technician.lastName}`,
      }))
    : [];

  const jobTypeData = Array.isArray(jobTypes)
    ? jobTypes.map((jobType: any) => ({
        id: jobType.id,
        name: jobType.name,
      }))
    : [];

  return (
    <div>
      <JobManagement
        customers={customerData}
        employee={techdata}
        jobtype={jobTypeData}   // Ensure jobTypeData is used
        alljobs={allJobs}
      />
    </div>
  );
};

export default page;
