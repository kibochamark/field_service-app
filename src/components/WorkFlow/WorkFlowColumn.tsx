import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../GlobalComponents/ColumnHeader";
import StatusBadge from "./StatusBadge";

// WorkflowStep type definition
interface WorkflowStep {
  stepName: string;
  status: "pending" | "completed" | "failed";
  assignedTo: string;
  completedAt?: string;
  notes: string;
}

// Define columns for the workflow steps table
export const WorkFlowColumn: ColumnDef<WorkflowStep>[] = [
  {
    accessorKey: "stepName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Step Name" />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ cell }) => {
      const status = cell.getValue<string>() as "pending" | "completed" | "failed"; // Type assertion
      return <StatusBadge status={status} />;
    },
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Assigned To" />;
    },
  },
  {
    accessorKey: "completedAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Completed At" />;
    },
    cell: ({ cell }) => {
      const completedAt = cell.getValue<string>();
      return completedAt ? new Date(completedAt).toLocaleDateString() : "N/A";
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Notes" />;
    },
  },
];

// Export the WorkFlowColumn
export default WorkFlowColumn;
