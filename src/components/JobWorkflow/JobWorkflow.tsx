"use client"
import { useState } from "react"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shadcn/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { CheckCircle2, Circle, Clock, FileCheck, FileClock, FileEdit, XCircle, ChevronLeft, ChevronRight, User, Calendar, MessageSquare } from "lucide-react"

type JobStatus = "CREATED" | "ASSIGNED" | "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELED"

interface TimelineItem {
  status: JobStatus
  timestamp: string
  description: string
  assignee?: string
  notes?: string[]
}

const jobTimeline: TimelineItem[] = [
  { 
    status: "CREATED", 
    timestamp: "2023-05-01 09:00", 
    description: "Job request submitted",
    notes: ["Client requested urgent service", "Initial budget approved"]
  },
  { 
    status: "ASSIGNED", 
    timestamp: "2023-05-01 10:30", 
    description: "Assigned to John Doe",
    assignee: "John Doe",
    notes: ["John Doe accepted the assignment", "Preliminary materials sent to John"]
  },
  { 
    status: "SCHEDULED", 
    timestamp: "2023-05-02 14:00", 
    description: "Scheduled for May 5th",
    notes: ["Client confirmed availability", "Resources allocated for the job"]
  },
  { 
    status: "ONGOING", 
    timestamp: "2023-05-05 09:00", 
    description: "Work in progress",
    notes: ["Phase 1 completed", "Encountered minor setback, resolved within an hour"]
  },
  { 
    status: "COMPLETED", 
    timestamp: "2023-05-05 17:00", 
    description: "All tasks finished",
    notes: ["Final inspection passed", "Client signed off on deliverables"]
  },
]

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

export default function JobWorkflow() {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(3) // Assuming "ONGOING" is the current status

  const handlePrevStatus = () => {
    setCurrentStatusIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNextStatus = () => {
    setCurrentStatusIndex((prev) => Math.min(jobTimeline.length - 1, prev + 1))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Job Workflow Dashboard</h1>
        
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
                  style={{ width: `${((currentStatusIndex + 1) / jobTimeline.length) * 100}%` }}
                />
                <div className="relative flex justify-between">
                  {jobTimeline.map((item, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex flex-col items-center ${
                              index <= currentStatusIndex ? "opacity-100" : "opacity-50"
                            }`}
                          >
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                statusColors[item.status]
                              } ${index <= currentStatusIndex ? "ring-4 ring-offset-2 ring-blue-300" : ""}`}
                            >
                              {statusIcons[item.status]}
                            </div>
                            <div className="mt-2 text-sm font-medium">{item.status}</div>
                            {index === currentStatusIndex && (
                              <Badge variant="outline" className="mt-1">
                                Current
                              </Badge>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.description}</p>
                          <p className="text-xs text-gray-500">{item.timestamp}</p>
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
                <Button variant="outline" onClick={handleNextStatus} disabled={currentStatusIndex === jobTimeline.length - 1}>
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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusColors[jobTimeline[currentStatusIndex].status]}`}>
                    {statusIcons[jobTimeline[currentStatusIndex].status]}
                  </div>
                  <div>
                    <h3 className="font-semibold">{jobTimeline[currentStatusIndex].status}</h3>
                    <p className="text-sm text-gray-500">{jobTimeline[currentStatusIndex].timestamp}</p>
                  </div>
                </div>
                <p>{jobTimeline[currentStatusIndex].description}</p>
                {jobTimeline[currentStatusIndex].assignee && (
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span>{jobTimeline[currentStatusIndex].assignee}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span>Due: May 10, 2023</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="notes">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="communication">Communication</TabsTrigger>
                </TabsList>
                <TabsContent value="notes">
                  <div className="space-y-4">
                    {jobTimeline[currentStatusIndex].notes?.map((note, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <MessageSquare className="h-5 w-5 text-gray-500 mt-1" />
                        <p>{note}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="documents">
                  <p>Relevant documents will be displayed here.</p>
                </TabsContent>
                <TabsContent value="communication">
                  <p>Communication history will be shown here.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}