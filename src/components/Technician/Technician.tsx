"use client"
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Textarea } from "@/shadcn/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { MapPinIcon, ClockIcon, CheckCircleIcon, CircleIcon, XCircleIcon } from 'lucide-react'

export default function Technician() {
  const [activeTab, setActiveTab] = useState("assigned")
  const [jobs, setJobs] = useState([
    { id: 1, name: "Repair AC", client: "John Doe", location: "123 Main St", mapLink: "https://maps.google.com", startTime: "2023-09-26T10:00", endTime: "2023-09-26T12:00", status: "Assigned" },
    { id: 2, name: "Install Heater", client: "Jane Smith", location: "456 Elm St", mapLink: "https://maps.google.com", startTime: "2023-09-26T14:00", endTime: "2023-09-26T16:00", status: "Assigned" },
    { id: 3, name: "Maintenance", client: "Bob Johnson", location: "789 Oak St", mapLink: "https://maps.google.com", startTime: "2023-09-27T09:00", endTime: "2023-09-27T11:00", status: "Accepted" },
  ])

  const acceptJob = (jobId) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: "Accepted" } : job
    ))
  }

  const updateJobStatus = (jobId, newStatus) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ))
  }

  const assignedJobs = jobs.filter(job => job.status === "Assigned")
  const acceptedJobs = jobs.filter(job => job.status !== "Assigned")

  const totalAssigned = assignedJobs.length
  const inProgress = jobs.filter(job => job.status === "In Progress").length
  const completed = jobs.filter(job => job.status === "Completed").length

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Technician Dashboard</h1>
      
      {/* Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="assigned">Assigned Jobs</TabsTrigger>
          <TabsTrigger value="accepted">Accepted Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="assigned">
          <div className="space-y-4">
            {assignedJobs.map(job => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle>{job.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Client:</strong> {job.client}</p>
                  <p>
                    <strong>Location:</strong> {job.location}
                    <a href={job.mapLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500">
                      <MapPinIcon className="inline-block w-4 h-4" />
                    </a>
                  </p>
                  <p><strong>Scheduled Time:</strong> {new Date(job.startTime).toLocaleString()} - {new Date(job.endTime).toLocaleString()}</p>
                  <Button onClick={() => acceptJob(job.id)} className="mt-2">Accept Job</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="accepted">
          <Table className='bg-white'>
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
              {acceptedJobs.map(job => (
                <TableRow key={job.id}>
                  <TableCell>{job.name}</TableCell>
                  <TableCell>{job.client}</TableCell>
                  <TableCell>
                    {job.location}
                    <a href={job.mapLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500">
                      <MapPinIcon className="inline-block w-4 h-4" />
                    </a>
                  </TableCell>
                  <TableCell>{new Date(job.startTime).toLocaleString()} - {new Date(job.endTime).toLocaleString()}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell>
                    {job.status === "Accepted" && (
                      <Button onClick={() => updateJobStatus(job.id, "In Progress")}>Start Job</Button>
                    )}
                    {job.status === "In Progress" && (
                      <>
                        <Button onClick={() => updateJobStatus(job.id, "Completed")} className="mr-2">Complete Job</Button>
                        <Button variant="outline" onClick={() => {
                          // Open a modal or form for adding notes, photos, etc.
                          alert("Open form for adding notes, photos, etc.")
                        }}>Add Notes/Photos</Button>
                      </>
                    )}
                    {job.status === "Completed" && (
                      <Button variant="outline" onClick={() => {
                        // Open a modal or form for generating invoice
                        alert("Generate Invoice")
                      }}>Generate Invoice</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}