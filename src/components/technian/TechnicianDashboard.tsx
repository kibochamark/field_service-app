"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Progress } from "@/shadcn/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { CalendarDays, CheckCircle, Clock, MapPin, Phone, Star, Truck, User } from "lucide-react"
import { useSession } from "next-auth/react"

export function TechnicianDashboard() {
  const [selectedJob, setSelectedJob] = useState("JOB001")
  const [jobStatus, setJobStatus] = useState("accepted")

  const {data: session} = useSession()


  const jobStatusData = [
    { status: "Accepted", count: 4, percentage: 26.7, color: "bg-blue-500" },
    { status: "Ongoing", count: 3, percentage: 20, color: "bg-yellow-500" },
    { status: "Completed", count: 8, percentage: 53.3, color: "bg-green-500" },
  ]

  const weeklyJobsData = [
    { day: "Mon", jobs: 3 },
    { day: "Tue", jobs: 5 },
    { day: "Wed", jobs: 4 },
    { day: "Thu", jobs: 2 },
    { day: "Fri", jobs: 6 },
    { day: "Sat", jobs: 3 },
    { day: "Sun", jobs: 1 },
  ]

  const getHeatmapColor = (jobs: number) => {
    const maxJobs = Math.max(...weeklyJobsData.map(d => d.jobs))
    const intensity = (jobs / maxJobs) * 100
    return `bg-purple-${Math.round(intensity / 10) * 100}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Technician" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome, {session?.user?.name}</h1>
              <p className="text-gray-600">{session?.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Date</p>
              <p className="text-lg font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
            </div>
            {/* <Button variant="outline" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Support</span>
            </Button> */}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">24</div>
              <p className="text-blue-100">This week</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Completed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">18</div>
              <p className="text-green-100">This week</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Ongoing Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">3</div>
              <p className="text-yellow-100">Currently</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Efficiency Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">95%</div>
              <p className="text-purple-100">This month</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Assigned Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">27</div>
              <p className="text-indigo-100">Total assigned</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Update Job Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Select value={selectedJob} onValueChange={setSelectedJob}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Job" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JOB001">JOB001</SelectItem>
                      <SelectItem value="JOB002">JOB002</SelectItem>
                      <SelectItem value="JOB003">JOB003</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={jobStatus} onValueChange={setJobStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">Update Status</Button>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Job Details: {selectedJob}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-blue-500" />
                      <span>Client: ABC Company</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-red-500" />
                      <span>Location: 123 Main St</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <span>ETA: 2 hours</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Truck className="h-5 w-5 text-green-500" />
                      <span>Equipment: HVAC System</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Job Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobStatusData.map((status) => (
                  <div key={status.status} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">{status.status}</span>
                      <span className="text-sm font-medium text-gray-900">{status.count} ({status.percentage}%)</span>
                    </div>
                    <Progress value={status.percentage} className={status.color} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <Card className="lg:col-span-2 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Upcoming Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: "JOB004", client: "XYZ Corp", location: "456 Elm St", status: "Accepted" },
                    { id: "JOB005", client: "123 Industries", location: "789 Oak Rd", status: "Pending" },
                    { id: "JOB006", client: "Tech Solutions", location: "101 Pine Ave", status: "Accepted" },
                  ].map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{job.id}</TableCell>
                      <TableCell>{job.client}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>
                        <Badge variant={job.status === "Accepted" ? "default" : "secondary"}>{job.status}</Badge>
                      </TableCell>
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

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Weekly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weeklyJobsData.map((day) => (
                  <div key={day.day} className="text-center">
                    <div className={`w-full aspect-square rounded-md ${getHeatmapColor(day.jobs)}`}></div>
                    <p className="text-xs font-medium mt-1">{day.day}</p>
                    <p className="text-sm font-bold">{day.jobs}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">Total Jobs This Week: 24</p>
                <p className="text-sm text-gray-600">Busiest Day: Friday (6 jobs)</p>
                <p className="text-sm text-gray-600">Average Jobs Per Day: 3.4</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}