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
} from "lucide-react";
import { getTechicianJob } from "./ServerAction";
import { useSession } from "next-auth/react";
import { baseUrl } from "@/utils/constants";
import { toast } from "react-toastify";

interface Job {
  id: string;
  mapLink: string;
  name: string;
  client: {
    firstName: string;
    lastName: string;
    email: string;
  };
  location: {
    city: string;
    zip: string;
    state: string;
  };
  scheduled: {
    startDate: string;
    endDate: string;
  };
  status: string;
}

export default function Technician() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("assigned");
  const [jobs, setJobs] = useState<Job[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const technicianJobs = async () => {
      try {
        const response = await getTechicianJob();
        // console.log(response, "the data");

        if (Array.isArray(response.data)) {
          const formattedJobs = response.data.map((job: any) => ({
            id: job.id,
            name: job.name,
            client: {
              firstName: job.clients.firstName || "Unknown First Name", // fallback to 'Unknown First Name' if firstName is undefined or null
              lastName: job.clients.lastName || "Unknown Last Name", // fallback to 'Unknown Last Name' if lastName is undefined or null
              email: job.clients.email || "Unknown Email", // fallback to 'Unknown Email' if email is undefined or null
            },
            location: {
              city: job.location?.city || "Unknown City", // fallback to 'Unknown City' if city is undefined or null
              zip: job.location?.zip || "Unknown Zip", // fallback to 'Unknown Zip' if zip is undefined or null
              state: job.location?.state || "Unknown State", // fallback to 'Unknown State' if state is undefined or null
            },
            scheduled: {
              startDate: job.jobschedule.startDate || "Unknown Start Date", // fallback to 'Unknown Start Date' if startDate is undefined or null
              endDate: job.jobschedule.endDate || "Unknown End Date", // fallback to 'Unknown End Date' if endDate is undefined or null
            },
            status: job.status || "Unknown Status", // fallback to 'Unknown Status' if status is undefined or null
          }));
          setJobs(formattedJobs);
        } else {
          console.log("Response is not an array");
        }
      } catch (error) {
        console.error("Error in technicianJobs:", error);
      }
    };
    technicianJobs();
  }, []);

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
    const hasAcceptedOrOngoingJob = jobs.some(
      (job) => job.status === "ACCEPTED" || job.status === "ONGOING"
    );
  
    if (hasAcceptedOrOngoingJob) {
      // Prevent accepting a new job if there's already an accepted or ongoing job
      toast.error("You cannot accept a new job while you have an ongoing or accepted job.");
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
  
      if (response.ok) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, status: "ACCEPTED" } : job
          )
        );
  
        // Redirect to the accepted jobs tab
        setActiveTab("accepted");
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

      if (response.ok) {
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
          router.push(`/callpro/technician/technicianworkflow/${jobId}`);
        }
      } else {
        console.error("Failed to update job status:", await response.json());
      }
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const assignedJobs = jobs.filter((job) => job.status === "SCHEDULED");
  const acceptedJobs = jobs.filter(
    (job) =>
      job.status === "ACCEPTED" ||
      job.status === "ONGOING" ||
      job.status === "COMPLETED"
  );

  const totalAssigned = assignedJobs.length;
  const inProgress = jobs.filter((job) => job.status === "ONGOING").length;
  const completed = jobs.filter((job) => job.status === "COMPLETED").length;

  return (
    <div className="container mx-auto p-4">
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
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
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
                      <strong>Client:</strong> {job.client.firstName}{" "}
                      {job.client.lastName}
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
                      {new Date(job.scheduled.startDate).toLocaleString()} -{" "}
                      {new Date(job.scheduled.endDate).toLocaleString()}
                    </p>
                    <Button onClick={() => acceptJob(job.id)} className="mt-2">
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
                      {job.client.firstName} {job.client.lastName}
                    </TableCell>
                    <TableCell>
                      {job.location.city}, {job.location.state}{" "}
                      {job.location.zip}
                    </TableCell>
                    <TableCell>
                      {new Date(job.scheduled.startDate).toLocaleString()} -{" "}
                      {new Date(job.scheduled.endDate).toLocaleString()}
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
                          onClick={() => updateJobStatus(job.id, "COMPLETED")}
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
    </div>
  );
}
