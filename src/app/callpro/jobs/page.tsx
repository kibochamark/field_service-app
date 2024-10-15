import { getCustomers } from '@/components/Customer/CustomerActions';
import { getJobsByCompanyId, getJobTypes, getTechnicians } from '@/components/Jobs/jobactions';
import JobManagementSystem from '@/components/Jobs/JobViewpage';
import React from 'react';

export const dynamic = "force-dynamic";

const page = async () => {
  // Fetch data from APIs
  const customers = (await getCustomers()) ?? [];
  const technician = (await getTechnicians()) ?? [];
  const jobTypes = (await getJobTypes()) ?? [];
  const allJobs = (await getJobsByCompanyId()) ?? [];

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

  return (
    <div>
      <JobManagementSystem
        customers={customerData}
        employee={techdata}
        jobtype={jobTypes}
        alljobs={allJobs}
      />
    </div>
  );
};

export default page;
