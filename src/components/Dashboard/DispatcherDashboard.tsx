'use client'

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Select } from "@/shadcn/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { PieChart, Pie, Cell } from 'recharts'
import { LineChart, Line } from 'recharts'
import { Activity, Users, Clock, TrendingUp } from "lucide-react"
import { useSession } from "next-auth/react"


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


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function DispatcherDashboard({technicianData}:{technicianData:DataResponse}) {
  const { data: session } = useSession();
  const dispatcherId = session?.user.userId;

  // Filter jobs by dispatcher
  const jobsForDispatcher = useMemo(() => {
    return technicianData.data.filter((job) => job.dispatcherId === dispatcherId);
  }, [technicianData, dispatcherId]);

  // Total jobs count
  const totalJobs = jobsForDispatcher.length;

  // Group jobs by status
  const jobStatusOverview = useMemo(() => {
    const jobStatuses = jobsForDispatcher.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { month: 'Jan', completed: jobStatuses['COMPLETED'] || 0, pending: jobStatuses['SCHEDULED'] || 0, inProgress: jobStatuses['ONGOING'] || 0 },
      { month: 'Feb', completed: jobStatuses['COMPLETED'] || 0, pending: jobStatuses['SCHEDULED'] || 0, inProgress: jobStatuses['ONGOING'] || 0 },
      // Add similar structure for other months or dynamically generate based on job data
    ];
  }, [jobsForDispatcher]);

  // Calculate technician performance based on jobs completed
  const technicianPerformance = useMemo(() => {
    const technicianStats = jobsForDispatcher.reduce((acc, job) => {
      job.technicians.forEach(({ technician }) => {
        const techName = `${technician.firstName} ${technician.lastName}`;
        acc[techName] = (acc[techName] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(technicianStats).map((techName) => ({
      name: techName,
      efficiency: technicianStats[techName],
    }));
  }, [jobsForDispatcher]);

  // Group jobs by job type
  const jobTypeDistribution = useMemo(() => {
    const jobTypeStats = jobsForDispatcher.reduce((acc, job) => {
      const jobTypeName = job.jobType.name;
      acc[jobTypeName] = (acc[jobTypeName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(jobTypeStats).map((jobTypeName) => ({
      name: jobTypeName,
      value: jobTypeStats[jobTypeName],
    }));
  }, [jobsForDispatcher]);


  //Calculate average completion time (only for completed jobs)
  const avgCompletionTime = useMemo(() => {
    const completedJobs = jobsForDispatcher.filter((job) => job.status === 'COMPLETED');
    
    if (completedJobs.length === 0) return 0; // If no jobs are completed, return 0
    
    const totalCompletionTime = completedJobs.reduce((acc, job) => {
      const startDate = new Date(job.jobschedule.startDate);
      const completionDate = new Date(job.jobschedule.endDate);
      const timeDiff = completionDate.getTime() - startDate.getTime(); // Difference in milliseconds
      const daysDiff = timeDiff / (1000 * 3600 * 24); // Convert to days
      return acc + daysDiff;
    }, 0);

    return (totalCompletionTime / completedJobs.length).toFixed(2); // Return average in days
  }, [jobsForDispatcher]);

  const techsCount = jobsForDispatcher.reduce((acc, job) => acc + job.technicians.length, 0);



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Dispatcher Analysis Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Activity className="w-4 h-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            {/* <p className="text-xs text-blue-100">+20.1% from last month</p> */}
          </CardContent>
        </Card>
        <Card className="bg-green-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
            <Users className="w-4 h-4 text-green-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{techsCount}</div>
            {/* <p className="text-xs text-green-100">+2 from last month</p> */}
          </CardContent>
        </Card>
        <Card className="bg-yellow-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
            <Clock className="w-4 h-4 text-yellow-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletionTime}</div>
            {/* <p className="text-xs text-yellow-100">-0.5 days from last month</p> */}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700">Job Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jobStatusOverview}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="COMPLETED" fill="#4CAF50" />
                <Bar dataKey="SCHEDULED" fill="#FFC107" />
                <Bar dataKey="ONGOING" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700">Technician Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={technicianPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="efficiency" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700">Job Types Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={jobTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {jobTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700">Time Period</CardTitle>
          </CardHeader>
          <CardContent>
            <Select>
              <option value="last7days">Last 7 Days</option>
              <option value="lastMonth">Last Month</option>
              <option value="last3Months">Last 3 Months</option>
              <option value="lastYear">Last Year</option>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}