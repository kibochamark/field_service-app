"use client"; 
import ScheduleJob from "@/components/Jobs/SheduleJob";
import { useSearchParams } from "next/navigation"; 
import React, { Suspense } from "react";

const JobLoader = () => {
  const searchParams = useSearchParams(); 
  const jobs = searchParams.get("jobs"); 

  // Ensure jobs is a string before parsing
  const parsedJobs = typeof jobs === "string" ? JSON.parse(jobs) : [];

  return <ScheduleJob jobs={parsedJobs} />;
};

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <JobLoader />
      </Suspense>
    </div>
  );
};

export default Page;
