"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import {
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  CircleIcon,
  TriangleAlert,
} from "lucide-react";
import { getTechicianJob } from "./ServerAction";
import { useSession } from "next-auth/react";
import { baseUrl } from "@/utils/constants";
import { toast } from "react-toastify";
import { Revalidate } from "@/utils/Revalidate";
import Link from "next/link";

interface Location {
  city: string;
  zip: string;
  state: string;
  otherinfo: string | null;
}

interface JobSchedule {
  startDate: string;
  endDate: string;
  recurrence: string;
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

interface TechnicianWrapper {
  technician: Technician;
}

interface JobType {
  id: string;
  name: string;
}

interface Job {
  location: Location;
  jobschedule: JobSchedule;
  id: string;
  name: string;
  description: string;
  jobTypeId: string;
  status: string;
  dispatcherId: string;
  clientId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  clients: Client;
  technicians: TechnicianWrapper[];
  jobType: JobType;
  mapLink: string;
}

interface DataResponse {
  data: Job[];
}

export default function Technician({
  technicianData,
}: {
  technicianData: DataResponse;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("assigned");
  const [jobs, setJobs] = useState<Job[]>([]);
  const { data: session } = useSession();

  const technicianId = session?.user?.userId; // Get the current technician's ID

  // Filter jobs by technician's ID
  const technicianJobs = technicianData.data.filter((job) =>
    job.technicians.some((tech) => tech.technician.id === technicianId)
  );
  // const acceptJob = async (jobId: string) => {
  //   try {
  //     const response = await fetch(baseUrl + `${jobId}/updatejobstatus`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${session?.user.access_token}`,
  //       },
  //       body: JSON.stringify({ status: "ACCEPTED" }),
  //     });

  //     if (response.ok) {
  //       setJobs((prevJobs) =>
  //         prevJobs.map((job) =>
  //           job.id === jobId ? { ...job, status: "ACCEPTED" } : job
  //         )
  //       );

  //       // Redirect to the accepted jobs tab
  //       setActiveTab("accepted");
  //     } else {
  //       console.error("Failed to accept job:", await response.json());
  //     }
  //   } catch (error) {
  //     console.error("Error accepting job:", error);
  //   }
  // };
  const acceptJob = async (jobId: string) => {
    // Check if there is any job with status ACCEPTED or ONGOING
    const hasAcceptedOrOngoingJob = technicianJobs.some(
      (job) => job.status === "ACCEPTED" || job.status === "ONGOING"
    );

    if (hasAcceptedOrOngoingJob) {
      // Prevent accepting a new job if there's already an accepted or ongoing job

      toast.error(
        "You cannot accept a new job while you have an ongoing or accepted job."
      );
      return;
    }

    try {
      const response = await fetch(baseUrl + `${jobId}/updatejobstatus`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.access_token}`,
        },
        body: JSON.stringify({ status: "ACCEPTED" }),
      });

      if (response.status === 200) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, status: "ACCEPTED" } : job
          )
        );

        // Redirect to the accepted jobs tab
        toast.success("job has been accepted");
        setActiveTab("accepted");
        Revalidate("getupdates");
      } else {
        console.error("Failed to accept job:", await response.json());
      }
    } catch (error) {
      console.error("Error accepting job:", error);
    }
  };

  const updateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      const response = await fetch(baseUrl + `${jobId}/updatejobstatus`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.access_token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.status === 200) {
        // Update the job status in the state
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, status: newStatus } : job
          )
        );

        // Redirect to the technician workflow page
        if (
          newStatus === "COMPLETED" ||
          newStatus === "ONGOING" ||
          newStatus === "ACCEPTED"
        ) {
          Revalidate("getupdates");
          toast.success(`status updated to ${newStatus}`);
          router.push(`/callpro/technician/technicianworkflow/${jobId}`);
          toast.success(`status updated to---22 ${newStatus}`);
        }
      } else {
        console.error("Failed to update job status:", await response.json());
      }
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const assignedJobs = technicianJobs.filter(
    (job) => job.status === "SCHEDULED"
  );
  const acceptedJobs = technicianJobs.filter(
    (job) =>
      job.status === "ACCEPTED" ||
      job.status === "ONGOING" ||
      job.status === "COMPLETED"
  );

  const totalAssigned = assignedJobs.length;
  const inProgress = technicianJobs.filter(
    (job) => job.status === "ONGOING"
  ).length;
  const completed = technicianJobs.filter(
    (job) => job.status === "COMPLETED"
  ).length;

  return (
    <div className="container mx-auto p-4">
      {session?.user.role === "technician" ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Technician Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Assigned
                </CardTitle>
                <CircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAssigned}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgress}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completed}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="assigned">Assigned Jobs</TabsTrigger>
              <TabsTrigger value="accepted">Accepted Jobs</TabsTrigger>
            </TabsList>
            <TabsContent value="assigned">
              {assignedJobs.length > 0 ? (
                <div className="space-y-4">
                  {assignedJobs.map((job) => (
                    <Card key={job.id}>
                      <CardHeader>
                        <CardTitle>{job.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          <strong>Client:</strong> {job.clients.firstName}{" "}
                          {job.clients.lastName}
                        </p>
                        <p>
                          <strong>Location:</strong> {job.location.city},{" "}
                          {job.location.state} {job.location.zip}
                          <a
                            href={job.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-500"
                          >
                            <MapPinIcon className="inline-block w-4 h-4" />
                          </a>
                        </p>
                        <p>
                          <strong>Scheduled Time:</strong>{" "}
                          {new Date(job.jobschedule.startDate).toLocaleString()}{" "}
                          - {new Date(job.jobschedule.endDate).toLocaleString()}
                        </p>
                        <Button
                          onClick={() => acceptJob(job.id)}
                          className="mt-2"
                        >
                          Accept Job
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex w-full">
                  <p className="flex w-full text-center mt-24 justify-center text-gray-800 text-muted-foreground">
                    You Have no Job Assigned
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="accepted">
              {acceptedJobs.length > 0 ? (
                <Table className="bg-white">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Name</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Scheduled Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {acceptedJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>{job.name}</TableCell>
                        <TableCell>
                          {job.clients.firstName} {job.clients.lastName}
                        </TableCell>
                        <TableCell>
                          {job.location.city}, {job.location.state}{" "}
                          {job.location.zip}
                        </TableCell>
                        <TableCell>
                          {new Date(job.jobschedule.startDate).toLocaleString()}{" "}
                          - {new Date(job.jobschedule.endDate).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {job.status === "ACCEPTED" && (
                            <div className="flex items-center text-blue-500">
                              <CheckCircleIcon className="w-4 h-4 mr-2 text-blue-500" />
                              <span>Accepted</span>
                            </div>
                          )}
                          {job.status === "ONGOING" && (
                            <div className="flex items-center text-yellow-500">
                              <ClockIcon className="w-4 h-4 mr-2 text-yellow-500" />
                              <span>Ongoing</span>
                            </div>
                          )}
                          {job.status === "COMPLETED" && (
                            <div className="flex items-center text-green-500">
                              <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                              <span>Completed</span>
                            </div>
                          )}
                        </TableCell>

                        <TableCell>
                          {job.status === "ACCEPTED" && (
                            <Button
                              onClick={() => updateJobStatus(job.id, "ONGOING")}
                              className="mt-2 bg-primary700"
                            >
                              Start Job
                            </Button>
                          )}
                          {job.status === "ONGOING" && (
                            <Button
                              onClick={() =>
                                updateJobStatus(job.id, "COMPLETED")
                              }
                              className="mt-2 bg-primary700"
                            >
                              Complete Job
                            </Button>
                          )}
                          {job.status === "COMPLETED" && (
                            <Button
                              onClick={() =>
                                router.push(
                                  `/callpro/technician/technicianworkflow/${job.id}`
                                )
                              }
                              className="mt-2 bg-primary700"
                            >
                              View History
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex w-full">
                  <p className="flex w-full text-center mt-24 justify-center text-gray-800 text-muted-foreground">
                    You Have no Accepted Job
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <TriangleAlert className="text-red-600 mr-2" />
            <h2 className="text-xl font-bold text-red-600">Unauthorized</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Only technician allowed. Please go back to the homepage or contact support if you think this is an error.
          </p>
          <Link
            href={"/callpro/dashboard"}
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            Go back home
          </Link>
          <div className="bg-red-100 text-red-700 p-4 rounded">
            <p>
              Oops! Something went wrong. We apologize for the inconvenience. if
              you think its an error notify the system admin of the issue.
            </p>
            <p>
              Refresh and Try again. If the problem persists, please contact our support team.
            </p>
          </div>
        </div>
      </div>
      
      )}
    </div>
  );
}
