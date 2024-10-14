import { getJobWorkflow } from "@/components/JobWorkflow/JobWorkActions";
import JobWorkflow from "@/components/JobWorkflow/JobWorkflow";
import React, { useEffect, useState } from "react";

const JobWorkflowPage = async () => {
  const jobWorkflowData = await getJobWorkflow();
  console.log(jobWorkflowData, "jobWorkflowData");

  return (
    <div>
      <JobWorkflow jobWorkflowData={jobWorkflowData} />
    </div>
  );
};

export default JobWorkflowPage;
