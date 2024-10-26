"use client";

import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shadcn/ui/card";
import { Badge } from "@/shadcn/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Button } from "@/shadcn/ui/button";
import {
  DollarSign,
  Users,
  CalendarCheck,
  Package2,
  Briefcase,
  UserCheck,
  FileText,
  Clock, 
} from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface AdminDashboardData {
  totalRevenue: number;
  totalEmployees: number;
  subscriptionStatus: string;
  scheduledJobsCount: number;
  completedJobsCount: number;
  totalClients: number;
  pendingInvoicesCount: number;
  ongoingJobsCount: number;
  averageJobDuration: string;
  jobName: string;
  client: string;
  status: string;
  date: string;
  technician:[]
  recentJobs: Array<{
    jobName: string;
    technician: ReactNode;
    id: string;
    name: string;
    client: string;
    status: string;
    date: string;
  
  }>;
  jobTypeDistribution: Array<{
    type: string;
    count: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
}

interface OwnerAdminDashboardProps {
  adminData: AdminDashboardData;
}

export default function OwnerAdminDashboard({ adminData }: OwnerAdminDashboardProps) {
  // Merge `adminData` with `sampleData`, using `sampleData` only when `adminData` is missing a property.
  const sampleData = {
    totalRevenue: 50000,
    totalEmployees: 50,
    subscriptionStatus: "Active",
    scheduledJobsCount: 15,
    completedJobsCount: 30,
    activeClientsCount: 20,
    pendingInvoicesCount: 5,
    ongoingJobsCount: 8,
    averageJobDuration: "4 hours",
    recentJobs: [
      { id: "1", name: "Job A", client: "Client X", status: "Completed", date: "2024-01-10" },
      { id: "2", name: "Job B", client: "Client Y", status: "In Progress", date: "2024-02-14" },
      { id: "3", name: "Job C", client: "Client Z", status: "Scheduled", date: "2024-03-20" },
    ],
    jobTypeDistribution: [
      { type: "Installation", count: 10 },
      { type: "Maintenance", count: 5 },
      { type: "Repair", count: 3 },
    ],
    monthlyRevenue: [
      { month: "January", revenue: 1000 },
      { month: "February", revenue: 1500 },
      { month: "March", revenue: 1200 },
    ],
  };

  const dashboardData = { ...sampleData, ...adminData };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Select defaultValue="thisMonth">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="lastMonth">Last Month</SelectItem>
            <SelectItem value="thisYear">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
          <CardDescription>Total earnings from invoices</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <DollarSign className="text-primary w-8 h-8" />
          <span className="text-2xl font-semibold">${adminData.totalRevenue.toLocaleString()}</span>
        </CardContent>
      </Card>
        
        <Card>
        <CardHeader>
          <CardTitle>Active Clients</CardTitle>
          <CardDescription>Number of current active clients</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <UserCheck className="text-primary w-8 h-8" />
          <span className="text-2xl font-semibold">{adminData.totalClients}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pending Invoices</CardTitle>
          <CardDescription>Number of unpaid invoices</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <FileText className="text-primary w-8 h-8" />
          <span className="text-2xl font-semibold">{adminData.pendingInvoicesCount}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ongoing Jobs</CardTitle>
          <CardDescription>Number of jobs in progress</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Clock className="text-primary w-8 h-8" />
          <span className="text-2xl font-semibold">{adminData.ongoingJobsCount}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Completed Jobs</CardTitle>
          <CardDescription>Jobs completed to date</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Briefcase className="text-primary w-8 h-8" />
          <span className="text-2xl font-semibold">{adminData.completedJobsCount}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Jobs</CardTitle>
          <CardDescription>Jobs planned for future dates</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <CalendarCheck className="text-primary w-8 h-8" />
          <span className="text-2xl font-semibold">{adminData.scheduledJobsCount}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>Current subscription level</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Package2 className="text-primary w-8 h-8" />
          <Badge
            className={`${
              adminData.subscriptionStatus.toLowerCase() === "active"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {adminData.subscriptionStatus}
          </Badge>
        </CardContent>
      </Card>
        
        <Card>
        <CardHeader>
          <CardTitle>Total Employees</CardTitle>
          <CardDescription>Number of active employees</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Users className="text-primary w-8 h-8" />
          <span className="text-2xl font-semibold">{adminData.totalEmployees}</span>
        </CardContent>
      </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
  <ResponsiveContainer width="100%" height={350}>
    <BarChart data={dashboardData.monthlyRevenue}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="revenue" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
</CardContent>

        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Job Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie data={dashboardData.jobTypeDistribution} dataKey="count" nameKey="type" outerRadius={80} fill="#82ca9d">
        {dashboardData.jobTypeDistribution.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d", "#ffc658"][index % 3]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</CardContent>

        </Card>
      </div>

      <Card>
  <CardHeader>
    <CardTitle>Recent Jobs</CardTitle>
    <CardDescription>Overview of the latest job activities</CardDescription>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job Name</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Technician</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {adminData.recentJobs && adminData.recentJobs.length > 0 ? (
          adminData.recentJobs.map((job) => (
            <TableRow key={job.jobName}>
              <TableCell className="font-medium">{job.jobName}</TableCell>
              <TableCell>{job.client}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    job.status === "Completed"
                      ? "default"
                      : job.status === "In Progress"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {job.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(job.date).toLocaleDateString()}</TableCell>
              <TableCell>{job.technician}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No recent jobs found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </CardContent>
</Card>


      
    </div>
  );
}
