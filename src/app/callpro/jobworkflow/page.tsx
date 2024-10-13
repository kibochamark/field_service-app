import { getJobWorkflow } from "@/components/JobWorkflow/JobWorkActions";
import JobWorkflow from "@/components/JobWorkflow/JobWorkflow";
import React from "react";

const JobWorkflowPage = async () => {
  const jobWorkflowData = await getJobWorkflow(); 
  console.log(jobWorkflowData, "jobWorkflowData"); // Log the data received

  return (
    <div>      
      <JobWorkflow jobWorkflowData={jobWorkflowData} />
    </div>
  );
};

export default JobWorkflowPage;
