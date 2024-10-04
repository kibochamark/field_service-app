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

export interface getInvoice {
  client: {
    email: string; // Client email
    firstName: string; // Client first name
    lastName: string; // Client last name
  };
  subtotal: number; // Subtotal amount
  tax: number; // Tax amount
  totalAmount: number; // Total amount after tax
  paymentStatus: string; // Status of payment (e.g., "paid", "pending", "failed")
  dueDate: string; // Due date of the invoice in ISO string format
  issueDate: string; // Issue date of the invoice in ISO string format
  status: 'draft' | 'pending' | 'completed'; // Status of the invoice
  createdAt: string; // Creation date in ISO string format
  updatedAt: string; // Last updated date in ISO string format
}


export const InvoiceColumns: ColumnDef<getInvoice>[] = [
  {
    accessorKey: "client.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Client Email"} />
    ),
    cell: ({ row }) => {
      return row.original.client.email; // Display client email
    },
  },
  {
    accessorKey: "client.firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Client Email"} />
    ),
    cell: ({ row }) => {
      return row.original.client.firstName; // Display client email
    },
  },
  // {
  //   accessorKey: "subtotal",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title={"Sub Total"} />
  //   ),
  // },
  // {
  //   accessorKey: "tax",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title={"Tax"} />
  //   ),
  // },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Total Amount"} />
    ),
  },
  // {
  //   accessorKey: "paymentStatus",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title={"Payment Status"} />
  //   ),
  // },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Due Date"} />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.dueDate);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "issueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Issue Date"} />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.issueDate);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Status"} />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<'completed' | 'pending' | 'failed'>() ;
      return <StatusBadge status={status} />;
    },
  },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title={"Created At"} />
  //   ),
  //   cell: ({ row }) => {
  //     const date = new Date(row.original.createdAt);
  //     return date.toLocaleDateString();
  //   },
  // },
  // {
  //   accessorKey: "updatedAt",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title={"Updated At"} />
  //   ),
  //   cell: ({ row }) => {
  //     const date = new Date(row.original.updatedAt);
  //     return date.toLocaleDateString();
  //   },
  // },
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
import { useState } from "react";
import axios from "axios";
import ConfirmationModal from "./ConfirmationModal";
import { baseUrl } from "@/utils/constants";

const Action = ({ row }: { row: any }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { data: session } = useSession();

  const handleDelete = async (id: any) => {
    setDeleting(true);
    try {
      // Perform the delete request to the API
      await axios.delete(baseUrl + `/invoice/${id}`);
      // You can add a notification or UI update here, like refetching data
      console.log("Invoice deleted successfully.");
      setShowModal(false);
      router.refresh(); // Refresh the page or re-fetch the data
    } catch (error) {
      console.error("Error deleting invoice:", error);
    } finally {
      setDeleting(false);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div>
      {session?.user.role === "business owner" || session?.user.role === "business admin" ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => 
                router.push(`/callpro/invoice/editpage/${row.original.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openModal}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Confirmation Modal */}
          <ConfirmationModal
            show={showModal}
            onClose={closeModal}
            onConfirm={() => handleDelete(row.original.id)}
            title="Delete Invoice"
            message="Are you sure you want to delete this invoice? This action cannot be undone."
          />
        </>
      ) : null}
    </div>
  );
};

export default InvoiceColumns;
