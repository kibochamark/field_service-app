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

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  notes: string;
  profile: {
    phone: string;
    address: {
      city: string;
      state: string;
      zip: string;
    };
  };
  createdAt: string;
};

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"First Name"} />;
    },
  },
  {
    accessorKey: "lastName",

    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Last Name"} />;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Email"} />;
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Notes"} />;
    },
  },
  {
    accessorKey: "profile.phone",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Contact"} />;
    },
  },

  {
    accessorKey: "profile.address.city",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"City"} />;
    },
  },
  {
    accessorKey: "profile.address.state",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Country"} />;
    },
  },
  {
    accessorKey: "profile.address.zip",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Zip Code"} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={"Creation date"} />;
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
import { useSession } from "next-auth/react";


const Action = ({ row }: { row: any }) => {
  const router = useRouter();
  
  function handleDelete(id: any): void {
    throw new Error("Function not implemented.");
  }
  const { data: session } = useSession();

  return (
    <div>
      {session?.user.role === "business owner" ||
      session?.user.role === "business admin" ? (
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
              onClick={() =>
                router.push(`/callpro/editcustomer/${row.original.id}`)
              }
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.id)}>
              {" "}
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
};

export default columns;
