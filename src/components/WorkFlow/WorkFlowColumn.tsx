"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash, Edit } from "lucide-react";
import { Button } from "@/shadcn/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import React from "react";
import { DataTableColumnHeader } from "../GlobalComponents/ColumnHeader";
import StatusBadge from "./StatusBadge";

// Job type definition
// export type Job = {
//   id: string;
//   customer: string;
//   type: string;
//   status: string;
//   startDate: string;
//   endDate: string;
//   amount: number;
//   scheduleJob: string;
//   when: string;
// };
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
// Define columns for the job schedule table

export const WorkFlowColumn: ColumnDef<Job>[] = [
  {
    accessorKey: "stepName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Step Name"} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Status"} />;
    },
    cell: ({ cell }) => {
      const status = cell.getValue<string>() as 'pending' | 'completed' | 'failed'; // Type assertion
      return <StatusBadge status={status} />;
    },
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Assigned To"} />;
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Start Date"} />;
    },
    cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
  },
  {
    accessorKey: "completedAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"End Date"} />;
    },
    cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
  },
  {
    accessorKey: "notes",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Notes"} />;
    },
  },
  // Add additional columns as needed
];

// Export the WorkFlowColumn
export default WorkFlowColumn;
