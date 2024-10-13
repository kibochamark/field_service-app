"use client";
import { useEffect, useState, useMemo } from "react";
import {
  CheckCircle2,
  Send,
  FileText,
  CreditCard,
  Check,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { baseUrl } from "@/utils/constants";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Status =
  | "Assigned"
  | "Accepted"
  | "ongoing"
  | "Completed";

interface Location {
  city: string;
  zip: string;
  state: string;
  otherinfo?: string | null;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Technician {
  id: string;
  firstName: string;
  lastName: string;
}

interface Job {
  id: string;
  name: string;
  description: string;
  location: Location;
  status: Status;
  startTime: string;
  endTime: string;
  client: Client;
  technicians: Technician[];
  jobType: string;
}

const getIcon = (status: Status) => {
  switch (status) {
    case "Assigned":
      return FileText;
    case "Accepted":
      return Send;
    case "ongoing":
      return CheckCircle2;
    case "Completed":
      return CreditCard;
    default:
      return null; // Added a default case for safety
  }
};

const JobComponent = ({ job }: { job: Job }) => {
  const steps = [
    { status: "Assigned", color: "bg-yellow-500", description: "Job has been assigned." },
    { status: "Accepted", color: "bg-blue-500", description: "Job has been accepted by the technician." },
    { status: "ongoing", color: "bg-green-500", description: "Job is currently in progress." },
    { status: "Completed", color: "bg-purple-500", description: "Job has been completed." },
  ];

  const currentStepIndex = steps.findIndex(
    (step) => step.status.toLowerCase() === job.status.toLowerCase()
  );
  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-4 w-full">
      <h2 className="text-xl font-bold mb-2">{job.name}</h2>
      <div className="text-gray-500 mb-8 grid grid-cols-2 ">
        <p>
          Client: {job.client.firstName} {job.client.lastName}
        </p>
        <p>Email: {job.client.email}</p>
        <p>
          Location: {job.location.city}, {job.location.state} - {job.location.zip}
        </p>
        <p>Start Time: {new Date(job.startTime).toLocaleString()}</p>
        <p>End Time: {new Date(job.endTime).toLocaleString()}</p>
        <p>Job Type: {job.jobType}</p>
        <p>Description: {job.description}</p>
        {/* <p>
          Technicians:{" "}
          {job.technicians
            .map((tech) => `${tech.firstName} ${tech.lastName}`)
            .join(", ")}
        </p> */}
      </div>
      <div className="flex border-1 border-gray-400 shadow-md my-4"></div>
      <div className="flex items-center justify-between relative mb-8 px-4 md:px-8 lg:px-16">
      {steps.map((step, index) => {
          const Icon = getIcon(step.status as Status);
          const isPast = currentStepIndex >= index;
          const isCompleted = currentStepIndex > index;

          return (
            <div key={step.status} className="flex flex-col items-center relative">
              <p className="text-sm text-gray-600 mb-1">{step.description}</p>
              
              <div className="relative flex items-center">
                <div
                  className={`w-8 h-8 rounded-full ${isPast ? step.color : "bg-gray-200"} flex items-center justify-center z-10`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <div
                      className={`w-2 h-2 rounded-full ${isPast ? "bg-white" : "bg-gray-400"}`}
                    />
                  )}
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-64 ${isCompleted ? "bg-green-500" : "bg-gray-200"} absolute top-1/2 left-full transform -translate-y-1/2`}
                  />
                )}
              </div>

              <div className="mt-2 text-center ">
                <div className={`inline-flex rounded-full p-2 ${step.color}`}>
                  {Icon && <Icon className="w-5 h-5 text-white" />}
                </div>
                <h3 className={`text-lg font-bold ${isPast ? "text-gray-900" : "text-gray-500"}`}>
                  {step.status}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conditionally render Generate Invoice Button for Completed status */}
      {job.status.toLowerCase() === "completed" && (
        <div className="w-full justify-end flex">
          <Link href={`/callpro/createinvoice`}>
            <Button className="mt-2 bg-primary800">
              Generate Invoice
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};




export default function WorkFlow({ jobId }: { jobId: string }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<Status | "ALL">("ALL");
  const { data: session } = useSession(); // Use session for client-side auth
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getJobs = async () => {
      if (!session?.user?.access_token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}${jobId}/retrievejob`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + session.user.access_token,
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching jobs: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Response Data:", data); // Log the raw response data

        if (data && data.data) {
          const jobData: Job = {
            id: data.data.id,
            name: data.data.name,
            description: data.data.description,
            client: {
              id: data.data.clients.id, // Ensure the client id is included
              firstName: data.data.clients.firstName,
              lastName: data.data.clients.lastName,
              email: data.data.clients.email,
            },
            location: {
              city: data.data.location.city,
              zip: data.data.location.zip,
              state: data.data.location.state,
            },
            status: data.data.status,
            startTime: data.data.jobschedule.startDate,
            endTime: data.data.jobschedule.endDate,
            jobType: data.data.jobType.name,
            technicians: data.data.technicians?.map((technician: any) => ({
              firstName: technician?.firstName, // Use optional chaining
              lastName: technician?.lastName,     // Use optional chaining
              id: technician?.id,                  // Use optional chaining if needed
            })) || [], // Fallback to an empty array if technicians is undefined
          };

          console.log("Job Data:", jobData); // Log the processed job data
          setJobs([jobData]);
        } else {
          console.error("No job data found in response");
        }
      } catch (error: any) {
        console.error(`Error fetching jobs: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, [jobId, session]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesStatus =
        filterStatus === "ALL" || job.status === filterStatus;
      const matchesSearchTerm =
        job.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearchTerm;
    });
  }, [jobs, filterStatus, searchTerm]);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Technician Workflow</h1>
      {/* <Input
        type="text"
        placeholder="Search jobs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Select
        onValueChange={(value: string) => setFilterStatus(value as Status | "ALL")}
        defaultValue="ALL"
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All</SelectItem>
          <SelectItem value="Assigned">Assigned</SelectItem>
          <SelectItem value="Accepted">Accepted</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="SCHEDULED">Scheduled</SelectItem>
        </SelectContent>
      </Select> */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobComponent key={job.id} job={job} />
            ))
          ) : (
            <p>No jobs found.</p>
          )}
        </div>
      )}
    </div>
  );
}
