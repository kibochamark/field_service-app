'use client'

import { CheckCircle2, Send, FileText, CreditCard, Check } from "lucide-react"

type Status = "DRAFT" | "SENT" | "APPROVED" | "PAID"

interface WorkflowStep {
  status: Status
  description: string
  date: string
  color: string
}

interface JobWorkflowProps {
  currentStatus: Status
}

const workflowSteps: WorkflowStep[] = [
  { status: "DRAFT", description: "Job created and ready for review", date: "2023-05-01", color: "bg-yellow-500" },
  { status: "SENT", description: "Proposal sent to client for approval", date: "2023-05-03", color: "bg-blue-500" },
  { status: "APPROVED", description: "Client has approved the proposal", date: "2023-05-07", color: "bg-green-500" },
  { status: "PAID", description: "Payment received, job completed", date: "2023-05-15", color: "bg-purple-500" },
]

export function JobWorkflow({ currentStatus }: JobWorkflowProps) {
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

  const currentStepIndex = workflowSteps.findIndex(step => step.status === currentStatus)

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-0.5 bg-gray-200" aria-hidden="true" />
        {/* Colored portion of the line based on current status */}
        <div 
          className={`absolute left-4 sm:left-5 top-0 w-0.5 bg-gradient-to-b ${workflowSteps[currentStepIndex].color}`} 
          style={{height: `calc(${(currentStepIndex + 1) * 25}% - 2rem)`}}
          aria-hidden="true"
        />

        <div className="space-y-12 sm:space-y-16 relative">
          {workflowSteps.map((step, index) => {
            const Icon = getIcon(step.status)
            const isActive = currentStatus === step.status
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
                    } inline-flex rounded-full p-3 sm:p-4 ${
                      isActive ? 'ring-4 ring-opacity-50' : ''
                    } ${isPast ? 'opacity-100' : 'opacity-40'}`}
                  >
                    <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${isPast ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="mt-3">
                    <h3
                      className={`text-xl sm:text-2xl font-bold ${
                        isPast ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.status}
                    </h3>
                    <p
                      className={`text-base sm:text-lg mt-1 ${
                        isPast ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      {step.description}
                    </p>
                    <p className="text-sm sm:text-base text-gray-400 mt-1">{step.date}</p>
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