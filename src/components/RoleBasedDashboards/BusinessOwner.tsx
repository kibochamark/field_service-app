"use client";

import React from "react";
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
  activeClientsCount: number;
  pendingInvoicesCount: number;
  ongoingJobsCount: number;
  averageJobDuration: string;
  recentJobs: Array<{
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${sampleData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleData.activeClientsCount}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleData.pendingInvoicesCount}</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleData.ongoingJobsCount}</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
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
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.recentJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.name}</TableCell>
                  <TableCell>{job.client}</TableCell>
                  <TableCell>
  <Badge
    variant={
      job.status === "Completed"
        ? "default"  // Replace with existing variant or create custom styles
        : job.status === "In Progress"
        ? "secondary"
        : "outline"
    }
  >
    {job.status}
  </Badge>
</TableCell>

                  <TableCell>{job.date}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleData.subscriptionStatus}</div>
            <p className="text-xs text-muted-foreground">Next renewal in 14 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Average Job Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleData.averageJobDuration}</div>
            <p className="text-xs text-muted-foreground">Across completed jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleData.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">+100 new hires this year</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
