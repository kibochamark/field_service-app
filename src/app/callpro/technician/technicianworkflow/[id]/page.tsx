import WorkFlow from "@/components/technian/WorkFlow";
import React from "react";
interface PageProps {
  params: { id: string };
}

const Page = ({ params }: PageProps) => {
  const { id } = params;

  if (!id) {
    return <div>Loading...</div>; // or handle error, show message
  }

  return (
    <div>
      <WorkFlow jobId={id} />
    </div>
  );
};

export default Page;
