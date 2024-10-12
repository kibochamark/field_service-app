"use client"
import { useState } from "react"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shadcn/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { CheckCircle2, Circle, Clock, FileCheck, FileClock, FileEdit, XCircle, ChevronLeft, ChevronRight, User, Calendar, MessageSquare } from "lucide-react"

type JobStatus = "CREATED" | "ASSIGNED" | "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELED"

interface Step {
  id: string
  workflowId: string
  status: JobStatus
  createdAt: string
  updatedAt: string
}

interface Technician {
  id: string
  firstName: string
  lastName: string
}

interface Job {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  technicians: { technician: Technician }[]
}

interface JobWorkflowData {
  id: string
  type: string
  jobId: string
  subscriptionId: string | null
  createdAt: string
  updatedAt: string
  Steps: Step[]
  job: Job
}

const statusIcons: Record<JobStatus, React.ReactNode> = {
  CREATED: <FileEdit className="h-6 w-6" />,
  ASSIGNED: <FileClock className="h-6 w-6" />,
  SCHEDULED: <Clock className="h-6 w-6" />,
  ONGOING: <Circle className="h-6 w-6" />,
  COMPLETED: <CheckCircle2 className="h-6 w-6" />,
  CANCELED: <XCircle className="h-6 w-6" />,
}

const statusColors: Record<JobStatus, string> = {
  CREATED: "bg-blue-500",
  ASSIGNED: "bg-yellow-500",
  SCHEDULED: "bg-purple-500",
  ONGOING: "bg-orange-500",
  COMPLETED: "bg-green-500",
  CANCELED: "bg-red-500",
}

export default function JobWorkflow({ jobWorkflowData }: { jobWorkflowData: JobWorkflowData[] }) {
  const [selectedWorkflowIndex, setSelectedWorkflowIndex] = useState(0)
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0)

  const selectedWorkflow = jobWorkflowData[selectedWorkflowIndex]
  const currentStep = selectedWorkflow.Steps[currentStatusIndex]

  const handlePrevStatus = () => {
    setCurrentStatusIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNextStatus = () => {
    setCurrentStatusIndex((prev) => Math.min(selectedWorkflow.Steps.length - 1, prev + 1))
  }

  const handleWorkflowChange = (index: number) => {
    setSelectedWorkflowIndex(index)
    setCurrentStatusIndex(0)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Job Workflow Dashboard</h1>
        
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Select Job Workflow</h2>
          <div className="flex flex-wrap gap-4">
            {jobWorkflowData.map((workflow, index) => (
              <Button
                key={workflow.id}
                variant={selectedWorkflowIndex === index ? "default" : "outline"}
                onClick={() => handleWorkflowChange(index)}
              >
                {workflow.job.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-8">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
                <div
                  className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 transition-all duration-500 ease-in-out"
                  style={{ width: `${((currentStatusIndex + 1) / selectedWorkflow.Steps.length) * 100}%` }}
                />
                <div className="relative flex justify-between">
                  {selectedWorkflow.Steps.map((step, index) => (
                    <TooltipProvider key={step.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex flex-col items-center ${
                              index <= currentStatusIndex ? "opacity-100" : "opacity-50"
                            }`}
                          >
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                statusColors[step.status]
                              } ${index <= currentStatusIndex ? "ring-4 ring-offset-2 ring-blue-300" : ""}`}
                            >
                              {statusIcons[step.status]}
                            </div>
                            <div className="mt-2 text-sm font-medium">{step.status}</div>
                            {index === currentStatusIndex && (
                              <Badge variant="outline" className="mt-1">
                                Current
                              </Badge>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{step.status}</p>
                          <p className="text-xs text-gray-500">{new Date(step.createdAt).toLocaleString()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={handlePrevStatus} disabled={currentStatusIndex === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button variant="outline" onClick={handleNextStatus} disabled={currentStatusIndex === selectedWorkflow.Steps.length - 1}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Status Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusColors[currentStep.status]}`}>
                    {statusIcons[currentStep.status]}
                  </div>
                  <div>
                    <h3 className="font-semibold">{currentStep.status}</h3>
                    <p className="text-sm text-gray-500">{new Date(currentStep.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <p>{selectedWorkflow.job.description}</p>
                {selectedWorkflow.job.technicians.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span>
                      {selectedWorkflow.job.technicians.map(({ technician }) => 
                        `${technician.firstName} ${technician.lastName}`
                      ).join(", ")}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span>Created: {new Date(selectedWorkflow.job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="timeline">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="technicians">Technicians</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="timeline">
                  <div className="space-y-4">
                    {selectedWorkflow.Steps.map((step, index) => (
                      <div key={step.id} className="flex items-start space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${statusColors[step.status]}`}>
                          {statusIcons[step.status]}
                        </div>
                        <div>
                          <p className="font-semibold">{step.status}</p>
                          <p className="text-sm text-gray-500">{new Date(step.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="technicians">
                  <div className="space-y-4">
                    {selectedWorkflow.job.technicians.map(({ technician }) => (
                      <div key={technician.id} className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-gray-500" />
                        <span>{technician.firstName} {technician.lastName}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="details">
                  <div className="space-y-2">
                    <p><strong>Job Name:</strong> {selectedWorkflow.job.name}</p>
                    <p><strong>Description:</strong> {selectedWorkflow.job.description}</p>
                    <p><strong>Created:</strong> {new Date(selectedWorkflow.job.createdAt).toLocaleString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(selectedWorkflow.job.updatedAt).toLocaleString()}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}