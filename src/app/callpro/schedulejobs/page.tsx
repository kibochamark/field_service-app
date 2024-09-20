// app/callpro/schedulejobs/page.tsx
"use client"; // Ensure this line is present for client-side rendering
import ScheduleJob from "@/components/Jobs/SheduleJob";
import { useSearchParams } from "next/navigation"; // Use useSearchParams instead of useRouter
import React from "react";


const Page = () => {
  const searchParams = useSearchParams(); // Get search parameters
  const jobs = searchParams.get("jobs"); // Get the jobs parameter from search params

  // Ensure jobs is a string before parsing
  const parsedJobs = typeof jobs === "string" ? JSON.parse(jobs) : []; 

  return (
    <div>
      <ScheduleJob jobs={parsedJobs} /> {/* Pass the parsed jobs to ScheduleJob */}
    </div>
  );
};

export default Page;
