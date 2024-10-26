"use client"
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shadcn/ui/card";
import { DollarSign, Users, CalendarCheck, Package2 } from "lucide-react";
import { Badge } from "@/shadcn/ui/badge";

interface AdminDashboardData {
  totalRevenue: number;
  totalEmployees: number;
  subscriptionStatus: string;   
  scheduledJobsCount: number;
  completedJobsCount: number;
 
}

interface OwnerAdminDashboardProps {
  adminData: AdminDashboardData;
}

const OwnerAdminDashboard: React.FC<OwnerAdminDashboardProps> = ({ adminData }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 p-6">
      {/* Total Employees */}
      <Card>
        <CardHeader>
          <CardTitle>Total Employees</CardTitle>
          <CardDescription>Number of active employees</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Users className="text-primary w-8 h-8" />
          <span className="text-xl font-semibold">{adminData.totalEmployees}</span>
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
          <span className="text-xl font-semibold">{adminData.scheduledJobsCount}</span>
        </CardContent>
      </Card>

      {/* Completed Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Jobs</CardTitle>
          <CardDescription>Jobs completed to date</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <CalendarCheck className="text-primary w-8 h-8" />
          <span className="text-xl font-semibold">{adminData.completedJobsCount}</span>
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
          <span className="text-xl font-semibold">${adminData.totalRevenue}</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerAdminDashboard;
