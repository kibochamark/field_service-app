"use client";
import { format } from "date-fns";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Progress } from "@/shadcn/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import {
  CalendarCheck,
  CalendarCheck2,
  CalendarDays,
  CheckCircle,
  Clock,
  Clock1,
  Clock10,
  MapPin,
  Phone,
  Star,
  Truck,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
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
}

interface DataResponse {
  data: Job[];
}

interface WeeklyJobData {
  day: string;
  jobs: number;
}

export function TechnicianDashboard({
  technicianData,
}: {
  technicianData: DataResponse;
}) {


  const { data: session } = useSession();
  const technicianId = session?.user?.userId; // Get the current technician's ID

  // Filter jobs by technician's ID
  const technicianJobs = technicianData.data.filter((job) =>
    job.technicians.some((tech) => tech.technician.id === technicianId)
  );
  const [selectedJob, setSelectedJob] = useState(
    technicianJobs.length > 0 ? technicianJobs[0].id : ""
  );
  const [jobStatus, setJobStatus] = useState("");



  const completedJobs = technicianJobs.filter(
    (job: Job) => job.status === "COMPLETED"
  ).length;
  const totalJobs = technicianJobs.length;

  const ongoing = technicianJobs.filter(
    (job: Job) => job.status === "ONGOING"
  ).length;
  const accepted = technicianJobs.filter(
    (job: Job) => job.status === "SCHEDULED"
  ).length;
  // const assigned = technicianData.data.filter((job:Job) => job.status === "ACCEPTED").length;
  //calculating the pancentages of the job status
  const JobPercentages = () => {
    // Calculate total jobs
    const total = accepted + ongoing + completedJobs;

    // Guard against division by zero if no jobs
    if (total === 0)
      return {
        acceptedPercentage: 0,
        ongoingPercentage: 0,
        completedPercentage: 0,
      };

    // Calculate percentages
    const acceptedPercentage = (accepted / total) * 100;
    const ongoingPercentage = (ongoing / total) * 100;
    const completedPercentage = (completedJobs / total) * 100;

    // Return the calculated percentages
    return {
      acceptedPercentage: acceptedPercentage.toFixed(2), // limiting to 2 decimal points
      ongoingPercentage: ongoingPercentage.toFixed(2),
      completedPercentage: completedPercentage.toFixed(2),
    };
  };
  const { acceptedPercentage, ongoingPercentage, completedPercentage } =
    JobPercentages();

  const jobStatusData = [
    {
      status: "Accepted",
      count: accepted,
      percentage: acceptedPercentage,
      color: "bg-blue-500",
    },
    {
      status: "Ongoing",
      count: ongoing,
      percentage: ongoingPercentage,
      color: "bg-yellow-500",
    },
    {
      status: "Completed",
      count: completedJobs,
      percentage: completedPercentage,
      color: "bg-green-500",
    },
  ];

  // Calculate weekly job counts
  // Calculate weekly job counts
  const calculateWeeklyJobs = (): WeeklyJobData[] => {
    const weeklyData: { [key: string]: number } = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

    technicianJobs.forEach((job: Job) => {
      const startDate = new Date(job.jobschedule.startDate);
      const day = format(startDate, "EEE"); // Get the abbreviated day of the week
      if (weeklyData[day] !== undefined) {
        weeklyData[day]++;
      }
    });

    return Object.keys(weeklyData).map((day) => ({
      day,
      jobs: weeklyData[day],
    }));
  };

  const weeklyJobsData: WeeklyJobData[] = calculateWeeklyJobs();

  // Calculate Total Jobs This Week, Busiest Day, and Average Jobs Per Day
  const totalJobsThisWeek: number = weeklyJobsData.reduce(
    (sum, day) => sum + day.jobs,
    0
  );
  const busiestDayData: WeeklyJobData = weeklyJobsData.reduce(
    (busiest, current) => (current.jobs > busiest.jobs ? current : busiest)
  );
  const averageJobsPerDay: string = (totalJobsThisWeek / 7).toFixed(1);

  // Dynamic color intensity for heatmap based on job count
  const getHeatmapColor = (jobs: number) => {
    if (jobs >= 5) {
      return "bg-red-500"; // Busy day (high number of jobs)
    } else if (jobs >= 3) {
      return "bg-yellow-400"; // Medium number of jobs
    } else if (jobs >= 1) {
      return "bg-gray-300";
    } else {
      return "bg-green-300"; // Fewer jobs
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src="/placeholder.svg?height=64&width=64"
                alt="Technician"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {session?.user?.name}
              </h1>
              <p className="text-gray-600">{session?.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Date</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            {/* <Button variant="outline" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Support</span>
            </Button> */}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalJobs}</div>
              {/* <p className="text-blue-100">This week</p> */}
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Completed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{completedJobs}</div>
              <p className="text-green-100">This week</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Ongoing Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{ongoing}</div>
              <p className="text-yellow-100">Currently</p>
            </CardContent>
          </Card>
          {/* <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Efficiency Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">95%</div>
              <p className="text-purple-100">This month</p>
            </CardContent>
          </Card> */}
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Assigned Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{accepted}</div>
              <p className="text-indigo-100">Total assigned</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-white shadow-lg rounded-lg">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Job Details Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Job Selection */}
                <div className="flex items-center space-x-4">
                  <Select value={selectedJob} onValueChange={setSelectedJob}>
                    <SelectTrigger className="w-[180px] border-gray-300">
                      <SelectValue placeholder="Select Job" />
                    </SelectTrigger>
                    
                    <SelectContent>
                      {technicianJobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.name} 
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Status Selection */}
                  {/* <Select value={jobStatus} onValueChange={setJobStatus}>
                    <SelectTrigger className="w-[180px] border-gray-300">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select> */}
                  <Link href="/callpro/technician">
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      Update Status
                    </Button>
                  </Link>
                </div>

                {/* Job Details Section */}
                {selectedJob && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    {/* <h3 className="font-semibold text-gray-800 mb-2">
                      Job Details: {selectedJob}
                    </h3> */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Fetch job details dynamically from techdata */}
                      {technicianJobs
                        .filter((job) => job.id === selectedJob)
                        .map((job) => (
                          <>
                            <div className="flex items-center space-x-2">
                              <User className="h-5 w-5 text-blue-500" />
                              <span>Client: {job.clients.firstName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-5 w-5 text-red-500" />
                              <span>Location: {job.location.city}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-5 w-5 text-yellow-500" />
                              <span>
                                Scheduled:{" "}
                                {new Intl.DateTimeFormat("en-GB").format(
                                  new Date(job.jobschedule.startDate)
                                )}
                              </span>{" "}
                            </div>
                            {/* <div className="flex items-center space-x-2">
                              <Truck className="h-5 w-5 text-green-500" />
                              <span>Equipment: {job.location.state}</span>
                            </div> */}
                            <div className="flex items-center space-x-2">
                              <CalendarCheck2 className="h-5 w-5 text-green-500" />
                              <span>
                                Job Status: {job.status.toLowerCase()}
                              </span>
                            </div>
                          </>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Job Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobStatusData.map((status) => (
                  <div key={status.status} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {status.status}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {status.count} ({status.percentage}%)
                      </span>
                    </div>
                    <Progress
                      value={Number(status.percentage)}
                      className={status.color}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <Card className="lg:col-span-2 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Upcoming Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* <TableHead>Job ID</TableHead> */}
                    <TableHead>Client</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                {""}
                <TableBody>
                  {technicianJobs
                    .filter(
                      (job) =>
                        job.status === "ONGOING" ||
                        job.status === "SCHEDULED" ||
                        job.status === "ACCEPTED"
                    )
                    .map((job) => (
                      <TableRow key={job.id}>
                        {/* <TableCell>{job.id}</TableCell> */}
                        <TableCell>{job.clients.firstName}</TableCell>
                        <TableCell>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <MapPin
                              style={{ marginRight: "8px" }}
                              className="h-5 w-5 text-red-500"
                            />
                            {job.location.city}{" "}
                            {job.location.otherinfo
                              ? job.location.otherinfo + ", "
                              : ""}
                            {job.location.state}, {job.location.zip}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {job.status === "ONGOING" && (
                              <Clock1
                                className="animate-spin h-5 w-5 text-yellow-500"
                                style={{ marginRight: "8px" }}
                              />
                            )}
                            {job.status === "SCHEDULED" && (
                              <CalendarCheck
                                className="animate-pulse h-5 w-5 text-blue-500"
                                style={{ marginRight: "8px" }}
                              />
                            )}
                            <Badge
                              variant={
                                job.status === "ACCEPTED"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {job.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link href={"/callpro/technician"}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}

                  {/* Check if there are no upcoming jobs */}
                  {technicianJobs.filter(
                    (job) =>
                      job.status === "ONGOING" ||
                      job.status === "SCHEDULED" ||
                      job.status === "ACCEPTED"
                  ).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} style={{ textAlign: "center" }}>
                        No upcoming jobs
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Weekly Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weeklyJobsData.map((day) => (
                  <div key={day.day} className="text-center">
                    <div
                      className={`w-full aspect-square rounded-md ${getHeatmapColor(
                        day.jobs
                      )}`}
                    ></div>
                    <p className="text-xs font-medium mt-1">{day.day}</p>
                    <p className="text-sm font-bold">{day.jobs}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  Total Jobs This Week: {totalJobsThisWeek}
                </p>
                <p className="text-sm text-gray-600">
                  Busiest Day: {busiestDayData.day} ({busiestDayData.jobs} jobs)
                </p>
                <p className="text-sm text-gray-600">
                  Average Jobs Per Day: {averageJobsPerDay}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
