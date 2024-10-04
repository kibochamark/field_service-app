import { getCustomers } from "@/components/Customer/CustomerActions";
import {
  getJobsByCompanyId,
  getJobTypes,
  getTechnicians,
} from "@/components/Jobs/jobactions";
import JobManagementSystem from "@/components/Jobs/JobViewpage";
import React from "react";

const page = async () => {
  let customers = [],
    technician = [],
    jobTypes = [],
    allJobs = [];

  try {
    const customersRaw = (await getCustomers()) ?? [];
    const technicianRaw = (await getTechnicians()) ?? [];
    const jobTypesRaw = (await getJobTypes()) ?? [];
    const allJobsRaw = (await getJobsByCompanyId()) ?? [];

    // Ensure that the fetched data are arrays before mapping
    customers = Array.isArray(customersRaw) ? customersRaw : [];
    technician = Array.isArray(technicianRaw) ? technicianRaw : [];
    jobTypes = Array.isArray(jobTypesRaw) ? jobTypesRaw : [];
    allJobs = Array.isArray(allJobsRaw) ? allJobsRaw : [];
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // Map customer and technician data with fallback for missing names
  const customerData = customers.map((customer: any) => ({
    id: customer.id,
    name: `${customer?.firstName || ""} ${customer?.lastName || ""}`,
  }));

  const techData = technician.map((tech: any) => ({
    id: tech.id,
    name: `${tech?.firstName || ""} ${tech?.lastName || ""}`,
  }));

  return (
    <div>
      <JobManagementSystem
        customers={customerData}
        employee={techData}
        jobtype={jobTypes}
        alljobs={allJobs}
      />
    </div>
  );
};

export default page;
