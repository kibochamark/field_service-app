'use client'

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Select } from "@/shadcn/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { PieChart, Pie, Cell } from 'recharts'
import { LineChart, Line } from 'recharts'
import { Activity, Users, Clock, TrendingUp } from "lucide-react"

const jobData = [  
  { month: 'Jan', completed: 65, pending: 40, inProgress: 24 },
  { month: 'Feb', completed: 59, pending: 30, inProgress: 28 },
  { month: 'Mar', completed: 80, pending: 51, inProgress: 40 },
  { month: 'Apr', completed: 81, pending: 42, inProgress: 33 },
  { month: 'May', completed: 56, pending: 38, inProgress: 45 },
  { month: 'Jun', completed: 55, pending: 20, inProgress: 38 },
]

const technicianPerformance = [
  { name: 'John Doe', efficiency: 85 },
  { name: 'Jane Smith', efficiency: 78 },
  { name: 'Bob Johnson', efficiency: 92 },
  { name: 'Alice Brown', efficiency: 88 },
]

const jobTypeData = [
  { name: 'Plumbing', value: 400 },
  { name: 'Electrical', value: 300 },
  { name: 'HVAC', value: 200 },
  { name: 'Carpentry', value: 100 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function DispatcherDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Dispatcher Analysis Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Activity className="w-4 h-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-blue-100">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
            <Users className="w-4 h-4 text-green-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-green-100">+2 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
            <Clock className="w-4 h-4 text-yellow-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.5 days</div>
            <p className="text-xs text-yellow-100">-0.5 days from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <TrendingUp className="w-4 h-4 text-red-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-red-100">+0.3 from last month</p>
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
              <BarChart data={jobData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#4CAF50" />
                <Bar dataKey="pending" fill="#FFC107" />
                <Bar dataKey="inProgress" fill="#2196F3" />
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
                  data={jobTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {jobTypeData.map((entry, index) => (
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