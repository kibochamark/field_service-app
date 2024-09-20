// src/components/Jobs/ScheduleJob.tsx
"use client"; // Ensure this line is present for client-side rendering
import React from "react";

interface Job {
  id: string;
  customer: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
  scheduleJob: string;
  when: string;
}

interface ScheduleJobProps {
  jobs: Job[]; // Define the props structure
}

const ScheduleJob: React.FC<ScheduleJobProps> = ({ jobs }) => {
  return (
    <div>
      <h1>Schedule Jobs</h1>
      {jobs.length > 0 ? (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <h2>{job.customer}</h2>
              <p>Type: {job.type}</p>
              <p>Status: {job.status}</p>
              <p>Start Date: {new Date(job.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(job.endDate).toLocaleDateString()}</p>
              <p>Amount: ${job.amount.toFixed(2)}</p>
              <p>Schedule Job: {job.scheduleJob}</p>
              <p>When: {job.when}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs selected.</p>
      )}
    </div>
  );
};

export default ScheduleJob;
