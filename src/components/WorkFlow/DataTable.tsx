"use client"; // Ensure this line is present for client-side rendering

import * as React from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Input } from "@/shadcn/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import { DataTablePagination } from "../GlobalComponents/Pagination";
import { DataTableViewOptions } from "../GlobalComponents/ColumnToggle";

interface WorkflowStep {
  stepName: string;
  status: "pending" | "completed" | "failed";
  assignedTo: string;
  completedAt?: string;
  notes: string;
}

interface Job {
  id: string;
  title: string;
  steps: WorkflowStep[];
}

interface DataTableProps {
  columns: ColumnDef<WorkflowStep>[]; // Change Job to WorkflowStep
  data: WorkflowStep[]; // Now it expects WorkflowStep[] data
}

export function DataTable({ columns, data }: DataTableProps) {
  const router = useRouter(); // Initialize useRouter here
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
  });

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter jobs..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <DataTableViewOptions table={table} />
      </div>

      <div className="rounded-md border-1 border-primary200">
        <Table>
          <TableHeader className="bg-primary800 hover:bg-primary900 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-bold text-black">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
