"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Trash, Edit } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { useRouter } from "next/navigation";
interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
interface allInvoices {
  _id: string;
  jobId: string;
  clientId: string;
  technicianId?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  paymentStatus: string;
  dueDate: string;
  issueDate: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const InvoiceColumns: ColumnDef<allInvoices>[] = [
  {
    accessorKey: "clientId",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Client Id"} />
    },
  },
  {
    accessorKey: "subtotal",

    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Sub Total"} />
    },
  },
  {
    accessorKey: "tax",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Tax"} />
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Total Amount"} />
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Contact"} />
    },
  },
 
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Due Date"} />
    },
  },
  {
    accessorKey: "issueDate",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Issue Date"} />
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Status"} />
    },
    cell: ({ cell }) => {
      const status = cell.getValue<string>() as 'pending' | 'completed' | 'failed'; // Type assertion
      return <StatusBadge status={status} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"CreatedAt"} />
    },
    cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"UpdatedAt"} />
    },
    cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <Action row={row} />;
    },
  },
];

import React from "react";
import { DataTableColumnHeader } from "../GlobalComponents/ColumnHeader";
import StatusBadge from "./StatusBadge";
import { useSession } from "next-auth/react";

const Action = ({ row }: { row: any }) => {
  const router = useRouter();

  function handleDelete(id: any): void {
    throw new Error("Function not implemented.");
  }
  const { data: session } = useSession();


  return (
    <div>
      {session?.user.role === "business owner" ||  session?.user.role === "business admin" ? (

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`/callpro/editcustomer/${row.original.id}`)}><Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(row.id)}> <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      ): null }
    </div>
  );
};

export default InvoiceColumns;
