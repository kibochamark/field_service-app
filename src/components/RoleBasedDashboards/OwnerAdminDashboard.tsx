"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shadcn/ui/card"
import { Badge } from "@/shadcn/ui/badge"
import {
  DollarSign,
  Users,
  CalendarCheck,
  Package2,
  Briefcase,
  UserCheck,
  FileText,
  Clock,
} from "lucide-react"

interface AdminDashboardData {
  totalRevenue: number
  totalEmployees: number
  subscriptionStatus: string
  scheduledJobsCount: number
  completedJobsCount: number
  totalClients: number
  pendingInvoicesCount: number
  ongoingJobsCount: number
  averageJobDuration: string	
	

}

interface OwnerAdminDashboardProps {
  adminData: AdminDashboardData
}

export default function OwnerAdminDashboard({ adminData }: OwnerAdminDashboardProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6">
      {/* Total Employees */}
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

      {/* Subscription Status */}
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

      {/* Scheduled Jobs */}
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

      {/* Completed Jobs */}
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

      {/* Total Revenue */}
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

      {/* Active Clients */}
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

      {/* Pending Invoices */}
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

      {/* Ongoing Jobs */}
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

      {/* Average Job Duration */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Avg. Job Duration</CardTitle>
          <CardDescription>Average time to complete a job</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Clock className="text-primary w-8 h-8" />
          <span className="text-2xl font-semibold">{adminData.averageJobDuration}</span>
        </CardContent>
      </Card> */}
    </div>
  )
}