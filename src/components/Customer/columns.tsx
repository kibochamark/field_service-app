"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  notes: string;  
  createdAt: string;
};

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        First Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  }, 
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => {

      return (
        <Action row={row}/>
      );
    },
  },
];


import React from 'react'
import { useDispatch } from "react-redux";
import { handleEdit } from "../../../store/CustomerSlice";

const Action = ({row}:{row:any}) => {
  const dispatch = useDispatch()
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
              onClick={() =>{
dispatch(handleEdit({
  edit:true,data:row.original
}))
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}

export default columns
