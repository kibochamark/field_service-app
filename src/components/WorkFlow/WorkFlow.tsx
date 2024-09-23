"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Badge } from "@/shadcn/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Progress } from "@/shadcn/ui/progress"
import { CheckCircle2, Clock, AlertCircle, User, Briefcase } from "lucide-react"

interface WorkflowStep {
  stepName: string
  status: "pending" | "completed" | "failed"
  assignedTo: string
  completedAt?: string
  notes: string
}

interface Job {
  id: string
  title: string
  steps: WorkflowStep[]
}

const jobs: Job[] = [
  {
    id: "job1",
    title: "Project Alpha",
    steps: [
      {
        stepName: "Initial Review",
        status: "completed",
        assignedTo: "John Doe",
        completedAt: "2023-09-15T10:30:00Z",
        notes: "All documents have been reviewed and approved."
      },
      {
        stepName: "Data Validation",
        status: "pending",
        assignedTo: "Jane Smith",
        notes: "Waiting for additional data from the client."
      },
      {
        stepName: "Final Approval",
        status: "failed",
        assignedTo: "Mike Johnson",
        notes: "Approval denied due to incomplete information."
      }
    ]
  },
  {
    id: "job2",
    title: "Project Beta",
    steps: [
      {
        stepName: "Requirements Gathering",
        status: "completed",
        assignedTo: "Emily Brown",
        completedAt: "2023-09-14T14:45:00Z",
        notes: "All requirements have been collected and documented."
      },
      {
        stepName: "Design Phase",
        status: "pending",
        assignedTo: "David Wilson",
        notes: "Working on the initial design concepts."
      }
    ]
  },
  {
    id: "job3",
    title: "Project Gamma",
    steps: [
      {
        stepName: "Code Review",
        status: "completed",
        assignedTo: "Sarah Lee",
        completedAt: "2023-09-13T11:20:00Z",
        notes: "Code has been reviewed and approved."
      },
      {
        stepName: "Testing",
        status: "pending",
        assignedTo: "Tom Harris",
        notes: "Conducting unit and integration tests."
      },
      {
        stepName: "Deployment",
        status: "pending",
        assignedTo: "Lisa Chen",
        notes: "Preparing for deployment to staging environment."
      }
    ]
  }
]

export default function WorkFlow() {
  const [activeTab, setActiveTab] = useState(jobs[0].id)

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
    }
  }

  const getJobProgress = (steps: WorkflowStep[]) => {
    const completed = steps.filter(step => step.status === 'completed').length
    return (completed / steps.length) * 100
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Multi-Job Workflow Progress</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {jobs.map(job => (
          <Card key={job.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={getJobProgress(job.steps)} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {job.steps.filter(step => step.status === 'completed').length} of {job.steps.length} steps completed
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          {jobs.map(job => (
            <TabsTrigger key={job.id} value={job.id} className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2" />
              {job.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {jobs.map(job => (
          <TabsContent key={job.id} value={job.id}>
            <div className="space-y-4">
              {job.steps.map((step, index) => (
                <Card key={index}>
                  <CardHeader className="bg-muted">
                    <CardTitle className="flex items-center justify-between">
                      <span>{step.stepName}</span>
                      <Badge className={getStatusColor(step.status)}>
                        {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${step.assignedTo}`} />
                          <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{step.assignedTo}</p>
                          <p className="text-sm text-muted-foreground">Assigned To</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(step.status)}
                        <div>
                          <p className="font-semibold">
                            {step.completedAt
                              ? new Date(step.completedAt).toLocaleString()
                              : 'Not completed'}
                          </p>
                          <p className="text-sm text-muted-foreground">Completed At</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">{step.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}