"use client"
import { CheckCircle2, Send, FileText, CreditCard, Check } from "lucide-react"
import { useState } from "react"

type Status = "DRAFT" | "SENT" | "APPROVED" | "PAID"

interface WorkflowStep {
  status: Status
  description: string
  date: string
  color: string
}

interface Workflow {
  id: string
  name: string
  currentStatus: Status
  steps: WorkflowStep[]
}

const getIcon = (status: Status) => {
  switch (status) {
    case "DRAFT":
      return FileText
    case "SENT":
      return Send
    case "APPROVED":
      return CheckCircle2
    case "PAID":
      return CreditCard
  }
}

const WorkflowComponent = ({ workflow }: { workflow: Workflow }) => {
  const currentStepIndex = workflow.steps.findIndex(step => step.status === workflow.currentStatus)

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">{workflow.name}</h2>
      <div className="relative">
        <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-0.5 bg-gray-200" aria-hidden="true" />
        <div 
          className={`absolute left-4 sm:left-5 top-0 w-0.5 bg-gradient-to-b ${workflow.steps[currentStepIndex].color}`} 
          style={{height: `calc(${(currentStepIndex + 1) * 25}% - 2rem)`}}
          aria-hidden="true"
        />
        <div className="space-y-8 sm:space-y-12 relative">
          {workflow.steps.map((step, index) => {
            const Icon = getIcon(step.status)
            const isActive = workflow.currentStatus === step.status
            const isPast = currentStepIndex >= index
            const isCompleted = currentStepIndex > index

            return (
              <div key={step.status} className="relative flex items-start">
                <div className="flex items-center absolute left-0 mt-1.5">
                  <div className={`w-9 h-9 rounded-full ${isPast ? step.color : 'bg-gray-200'} flex items-center justify-center`}>
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <div className={`w-3 h-3 rounded-full ${isPast ? 'bg-white' : 'bg-gray-400'}`} />
                    )}
                  </div>
                </div>
                <div className="ml-14 sm:ml-16">
                  <div
                    className={`${
                      step.color
                    } inline-flex rounded-full p-2 sm:p-3 ${isActive ? 'ring-4 ring-opacity-50' : ''} ${isPast ? 'opacity-100' : 'opacity-40'}`}
                  >
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${isPast ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="mt-3">
                    <h3
                      className={`text-lg sm:text-xl font-bold ${isPast ? 'text-gray-900' : 'text-gray-500'}`}
                    >
                      {step.status}
                    </h3>
                    <p className={`text-sm sm:text-base mt-1 ${isPast ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step.description}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">{step.date}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function MultipleWorkFlow() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "Job Application",
      currentStatus: "SENT",
      steps: [
        { status: "DRAFT", description: "Application created", date: "2023-05-01", color: "bg-yellow-500" },
        { status: "SENT", description: "Application sent to employer", date: "2023-05-03", color: "bg-blue-500" },
        { status: "APPROVED", description: "Application approved", date: "2023-05-07", color: "bg-green-500" },
        { status: "PAID", description: "First paycheck received", date: "2023-05-15", color: "bg-purple-500" },
      ]
    },
    {
      id: "2",
      name: "Product Order",
      currentStatus: "APPROVED",
      steps: [
        { status: "DRAFT", description: "Order created", date: "2023-05-10", color: "bg-yellow-500" },
        { status: "SENT", description: "Order placed", date: "2023-05-11", color: "bg-blue-500" },
        { status: "APPROVED", description: "Order approved", date: "2023-05-12", color: "bg-green-500" },
        { status: "PAID", description: "Payment processed", date: "2023-05-13", color: "bg-purple-500" },
      ]
    }
  ])

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null)

  const handleWorkflowClick = (workflowId: string) => {
    setSelectedWorkflowId(prevId => (prevId === workflowId ? null : workflowId))
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Multiple Workflows</h1>
      {workflows.map(workflow => (
        <div key={workflow.id}>
          <button
            onClick={() => handleWorkflowClick(workflow.id)}
            className="w-full text-left p-4 bg-gray-100 rounded-lg mb-4 hover:bg-gray-200"
          >
            <h2 className="text-xl font-bold">{workflow.name}</h2>
            <p className="text-gray-500">Current Status: {workflow.currentStatus}</p>
          </button>
          {selectedWorkflowId === workflow.id && <WorkflowComponent workflow={workflow} />}
        </div>
      ))}
    </div>
  )
}
