"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  Send,
  FileText,
  CreditCard,
  Check,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";

type Status = "DRAFT" | "SENT" | "APPROVED" | "PAID";

interface WorkflowStep {
  status: Status;
  description: string;
  date: string;
  color: string;
}

interface Workflow {
  id: string;
  name: string;
  currentStatus: Status;
  steps: WorkflowStep[];
}

const getIcon = (status: Status) => {
  switch (status) {
    case "DRAFT":
      return FileText;
    case "SENT":
      return Send;
    case "APPROVED":
      return CheckCircle2;
    case "PAID":
      return CreditCard;
  }
};

const WorkflowComponent = ({ workflow }: { workflow: Workflow }) => {
  const currentStepIndex = workflow.steps.findIndex(
    (step) => step.status === workflow.currentStatus
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-4 w-full">
      <h2 className="text-xl font-bold mb-2">{workflow.name}</h2>
      <div className="flex flex-wrap items-center justify-between relative">
        {workflow.steps.map((step, index) => {
          const Icon = getIcon(step.status);
          const isActive = workflow.currentStatus === step.status;
          const isPast = currentStepIndex >= index;
          const isCompleted = currentStepIndex > index;

          return (
            <div
              key={step.status}
              className="flex flex-col items-center flex-1 relative mb-4"
            >
              <div className="relative flex items-center">
                <div
                  className={`w-8 h-8 rounded-full ${
                    isPast ? step.color : "bg-gray-200"
                  } flex items-center justify-center z-10`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isPast ? "bg-white " : "bg-gray-400"
                      }`}
                    />
                  )}
                </div>

                {index < workflow.steps.length - 1 && (
                  <div
                    className={`h-1 w-full sm:w-64 ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    } absolute top-1/2 left-full transform -translate-y-1/2`}
                  />
                )}
              </div>

              <div className="mt-2 text-center">
                <div className={`inline-flex rounded-full p-2 ${step.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3
                  className={`text-lg font-bold ${
                    isPast ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.status}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    isPast ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {step.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">{step.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function WorkflowPage() {
  const [workflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "Job Application",
      currentStatus: "PAID",
      steps: [
        {
          status: "DRAFT",
          description: "Application created",
          date: "2023-05-01",
          color: "bg-yellow-500",
        },
        {
          status: "SENT",
          description: "Application sent to employer",
          date: "2023-05-03",
          color: "bg-blue-500",
        },
        {
          status: "APPROVED",
          description: "Application approved",
          date: "2023-05-07",
          color: "bg-green-500",
        },
        {
          status: "PAID",
          description: "First paycheck received",
          date: "2023-05-15",
          color: "bg-purple-500",
        },
      ],
    },
    {
      id: "2",
      name: "Project Completion",
      currentStatus: "APPROVED",
      steps: [
        {
          status: "DRAFT",
          description: "Project outline drafted",
          date: "2023-05-01",
          color: "bg-yellow-500",
        },
        {
          status: "SENT",
          description: "Project proposal sent",
          date: "2023-05-03",
          color: "bg-blue-500",
        },
        {
          status: "APPROVED",
          description: "Project approved",
          date: "2023-05-07",
          color: "bg-green-500",
        },
        {
          status: "PAID",
          description: "Final payment received",
          date: "2023-05-15",
          color: "bg-purple-500",
        },
      ],
    },
    {
      id: "1",
      name: "Job ",
      currentStatus: "PAID",
      steps: [
        {
          status: "DRAFT",
          description: "Application created",
          date: "2023-05-01",
          color: "bg-yellow-500",
        },
        {
          status: "SENT",
          description: "Application sent to employer",
          date: "2023-05-03",
          color: "bg-blue-500",
        },
        {
          status: "APPROVED",
          description: "Application approved",
          date: "2023-05-07",
          color: "bg-green-500",
        },
        {
          status: "PAID",
          description: "First paycheck received",
          date: "2023-05-15",
          color: "bg-purple-500",
        },
      ],
    },
    {
      id: "2",
      name: "Project ",
      currentStatus: "APPROVED",
      steps: [
        {
          status: "DRAFT",
          description: "Project outline drafted",
          date: "2023-05-01",
          color: "bg-yellow-500",
        },
        {
          status: "SENT",
          description: "Project proposal sent",
          date: "2023-05-03",
          color: "bg-blue-500",
        },
        {
          status: "APPROVED",
          description: "Project approved",
          date: "2023-05-07",
          color: "bg-green-500",
        },
        {
          status: "PAID",
          description: "Final payment received",
          date: "2023-05-15",
          color: "bg-purple-500",
        },
      ],
    },
    {
      id: "1",
      name: "Job Appli",
      currentStatus: "SENT",
      steps: [
        {
          status: "DRAFT",
          description: "Application created",
          date: "2023-05-01",
          color: "bg-yellow-500",
        },
        {
          status: "SENT",
          description: "Application sent to employer",
          date: "2023-05-03",
          color: "bg-blue-500",
        },
        {
          status: "APPROVED",
          description: "Application approved",
          date: "2023-05-07",
          color: "bg-green-500",
        },
        {
          status: "PAID",
          description: "First paycheck received",
          date: "2023-05-15",
          color: "bg-purple-500",
        },
      ],
    },
    {
      id: "2",
      name: "Project Completion",
      currentStatus: "DRAFT",
      steps: [
        {
          status: "DRAFT",
          description: "Project outline drafted",
          date: "2023-05-01",
          color: "bg-yellow-500",
        },
        {
          status: "SENT",
          description: "Project proposal sent",
          date: "2023-05-03",
          color: "bg-blue-500",
        },
        {
          status: "APPROVED",
          description: "Project approved",
          date: "2023-05-07",
          color: "bg-green-500",
        },
        {
          status: "PAID",
          description: "Final payment received",
          date: "2023-05-15",
          color: "bg-purple-500",
        },
      ],
    },
    // Additional workflows can be added here...
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<Status | "ALL">("ALL");
  
  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedWorkflows = useMemo(() => {
    return workflows
      .filter(
        (workflow) =>
          workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (filterStatus === "ALL" || workflow.currentStatus === filterStatus)
      )
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
  }, [workflows, searchTerm, sortOrder, filterStatus]);

  // Paginated workflows
  const indexOfLastWorkflow = currentPage * itemsPerPage;
  const indexOfFirstWorkflow = indexOfLastWorkflow - itemsPerPage;
  const currentWorkflows = filteredAndSortedWorkflows.slice(
    indexOfFirstWorkflow,
    indexOfLastWorkflow
  );

  // Total number of pages
  const totalPages = Math.ceil(filteredAndSortedWorkflows.length / itemsPerPage);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Job Tracking</h1>
      <div className="mb-4 flex flex-wrap space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a job..."
            className="pl-10 w-full sm:w-72"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={(value) => setFilterStatus(value as Status | "ALL")}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SENT">Sent</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="flex items-center space-x-2"
        >
          {sortOrder === "asc" ? <SortAsc /> : <SortDesc />}
          <span>Sort</span>
        </Button>
      </div>
      
      {/* Render current workflows */}
      {currentWorkflows.map((workflow) => (
        <WorkflowComponent key={workflow.id} workflow={workflow} />
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6 bg-white p-3">
        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage" className="text-sm">
            Items per page:
          </label>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
