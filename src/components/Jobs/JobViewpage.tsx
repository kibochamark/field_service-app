"use client"
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar"
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Search, Filter, MoreVertical, Plus, MapPin, PenIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { useSession } from 'next-auth/react'

export default function JobManagementSystem({
  customers,
  employee,
  jobtype,
  alljobs,
}: {
  customers: any;
  employee: any;
  jobtype: any;
  alljobs: any;
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const { data: session } = useSession();

  // Filter jobs based on search term and status
  const filteredJobs = alljobs.filter((job:any) => 
    job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customers.find((client: any) => client.id === job.clientId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.find((emp: any) => emp.id === job.technicianId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === "All" || job.status === filterStatus)
  )

  console.log(filteredJobs, "jobs")
 

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SCHEDULED": return <Calendar className="h-4 w-4 text-blue-500" />
      case "ONGOING": return <Clock className="h-4 w-4 text-yellow-500" />
      case "COMPLETED": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "CANCELLED": return <XCircle className="h-4 w-4 text-red-500" />
      case "CREATED": return <PenIcon className="h-4 w-4 text-green-500" />
      default: return null
    }
  }

  const canCreateJob = session?.user.role === "business owner" || 
                       session?.user.role === "business admin" || 
                       session?.user.role === "dispatcher"

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Job Management</h1>
        {canCreateJob && (
          <Link href="/callpro/createjob">
            <Button variant="outline" className="bg-blue-600 text-white">
              Create Job
            </Button>
          </Link>
        )}
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6">
        {["All", "SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED", "CREATED"].map((status) => (
          <Card key={status} className={`${filterStatus === status ? 'bg-blue-100 border-blue-300' : 'bg-white'}`}>
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                <span>{status}</span>
                {getStatusIcon(status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {status === "All" 
                  ? alljobs.length 
                  : alljobs.filter((job:any) => job.status === status).length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Job List</CardTitle>
          <CardDescription>Manage and track all jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex flex-1 max-w-sm space-x-2">
              <Input 
                placeholder="Search jobs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline"><Search className="h-4 w-4 mr-2" />Search</Button>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {["All", "ASSIGNED", "ONGOING", "COMPLETED", "CANCELLED", "CREATED"].map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Job Type</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job: any) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                    {job?.clients?.firstName}, {job?.clients?.lastName}
                    </TableCell>
                    <TableCell>{job.name}</TableCell>
                    <TableCell>{job.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center w-fit">
                        {getStatusIcon(job.status)}
                        <span className="ml-1">{job.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{job?.jobType?.name || 'Unknown'}</TableCell>
                    <TableCell>{job?.technicians.map((tech: any) => `${tech?.technician?.firstName} ${tech?.technician?.lastName}`).join(', ') || 'No technicians'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={job?.location?.address || 'N/A'}>
  <span className="flex items-center">
    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
    {job?.location?.state || 'N/A'}
  </span>
  <p className="text-sm">
    {job?.location?.city ? `${job?.location.city}, ${job?.location.state}` : 'Location not specified'}
    {job?.location?.zip ? ` - ${job?.location.zip}` : ''}
    {job?.location?.otherinfo ? ` (${job?.location.otherinfo})` : ''}
  </p>
</TableCell>
                    <TableCell>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
