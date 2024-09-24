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
export type Job = {
  id: string;
  customer: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
  scheduleJob: string;
  when: string;
};

// Define columns for the job schedule table
export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "customer",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Customer"} />;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Type"} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Status"} />;
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Start Date"} />;
    },
    cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"End Date"} />;
    },
    cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Amount"} />;
    },
    cell: ({ cell }) => `$${cell.getValue<number>().toFixed(2)}`,
  },
  {
    accessorKey: "scheduleJob",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Schedule Job"} />;
    },
  },
  {
    accessorKey: "when",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"When"} />;
    },
  },
  {
    id: "select", // Set an id for the column
    header: ({ table }) => (
      <input
        type="checkbox"
        onChange={(e) => {
          const checked = e.target.checked;
          table.getRowModel().rows.forEach((row) => {
            row.getToggleSelectedHandler()(checked);
          });
        }}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <Action row={row} />;
    },
  },
];

// Action menu for the rows
const Action = ({ row }: { row: any }) => {
  const router = useRouter();

  function handleDelete(id: any): void {
    // Implement the delete logic here
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/callpro/editcustomer/${row.original.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(row.id)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default columns;
