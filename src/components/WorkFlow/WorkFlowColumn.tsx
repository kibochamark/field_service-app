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
  // {
  //   accessorKey: "jobTitle",
  //   header: ({ column }) => {
  //     return <DataTableColumnHeader column={column} title={"jobTitle"} />;
  //   },
  // },
  {
    accessorKey: "stepName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"stepName"} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Type"} />;
    },
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Status"} />;
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
  // {
  //   accessorKey: "amount",
  //   header: ({ column }) => {
  //     return <DataTableColumnHeader column={column} title={"Amount"} />;
  //   },
  //   cell: ({ cell }) => $${cell.getValue<number>().toFixed(2)},
  // },
  // {
  //   accessorKey: "scheduleJob",
  //   header: ({ column }) => {
  //     return <DataTableColumnHeader column={column} title={"Schedule Job"} />;
  //   },
  // },
  // {
  //   accessorKey: "when",
  //   header: ({ column }) => {
  //     return <DataTableColumnHeader column={column} title={"When"} />;
  //   },
  // },
  // {
  //   id: "select", // Set an id for the column
  //   header: ({ table }) => (
  //     <input
  //       type="checkbox"
  //       onChange={(e) => {
  //         const checked = e.target.checked;
  //         table.getRowModel().rows.forEach((row) => {
  //           row.getToggleSelectedHandler()(checked);
  //         });
  //       }}
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <input
  //       type="checkbox"
  //       checked={row.getIsSelected()}
  //       onChange={row.getToggleSelectedHandler()}
  //     />
  //   ),
  // },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     return <Action row={row} />;
  //   },
  // },
];

// Action menu for the rows


export default WorkFlowColumn;