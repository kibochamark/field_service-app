"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import AddEmployee from "./AddEmployee";
import EditEmployee from "./EditEmployee";
import { Button } from "@/shadcn/ui/button";
import { Badge } from "@/shadcn/ui/badge";
import { Edit, File, ListFilter, MoreHorizontal, PlusCircle, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shadcn/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { handleAdd, handleEdit, clearEdit } from "../../../store/EmployeeSlice";

interface HandleAddEditProps {
  roles: any[];
  employees: any[];
}

const HandleAddEdit: React.FC<HandleAddEditProps> = ({ roles, employees }) => {
  const { isAdd, isEdit, currentEmployee } = useSelector(
    (state: RootState) => state.employee
  );
  const dispatch = useDispatch();

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  const filteredEmployees = employees
    ? employees.filter((employee: any) => {
        const searchValue = globalFilter.toLowerCase();
        const matchesGlobalFilter =
          employee.firstName.toLowerCase().includes(searchValue) ||
          employee.lastName.toLowerCase().includes(searchValue) ||
          employee.email.toLowerCase().includes(searchValue) ||
          employee.role?.name.toLowerCase().includes(searchValue);

        const matchesRoleFilter =
          !selectedRole || employee.role?.name === selectedRole;

        return matchesGlobalFilter && matchesRoleFilter;
      })
    : [];

  const fieldsToDisplay = [
    "firstName",
    "lastName",
    "email",
    "role",
    "createdAt",
    "updatedAt",
    "permissions",
  ];

  const getPermissionsForRole = (roleName: string) => {
    const role = roles.find((r) => r.name === roleName);
    return role && role.permissions
      ? role.permissions.map((permission: { value: any }) => permission.value)
      : [];
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full">
      {isAdd ? (
        <AddEmployee roles={roles} />
      ) : isEdit ? (
        <EditEmployee roles={roles} employee={currentEmployee} />
      ) : (
        <Tabs defaultValue="all">
          <div className="flex items-center mb-4 gap-2">
            <input
              type="text"
              placeholder="Search employees..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="px-4 py-2 border rounded-md w-full"
            />
            <div className="flex items-center gap-2">
              <ListFilter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border rounded-md"
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role.name} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              size="sm"
              className="h-8 gap-1"
              onClick={() => {
                dispatch(
                  handleAdd({
                    isAdd: true,
                  })
                );
              }}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Employee
              </span>
            </Button>
          </div>
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Employees</CardTitle>
                <CardDescription>
                  Manage your Employees and view their performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredEmployees.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {fieldsToDisplay.map((field) => (
                          <TableHead key={field} className="font-bold">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </TableHead>
                        ))}
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee: any) => (
                        <TableRow key={employee.id}>
                          {fieldsToDisplay.map((field) => (
                            <TableCell key={field}>
                              {field === "permissions" ? (
                                <Badge variant="outline">
                                  {getPermissionsForRole(employee.role?.name).join(
                                    ", "
                                  ) || "No Permissions"}
                                </Badge>
                              ) : field === "role" ? (
                                <Badge variant="outline">
                                  {employee[field]?.name || "No Role"}
                                </Badge>
                              ) : field === "createdAt" ||
                                field === "updatedAt" ? (
                                formatDate(employee[field])
                              ) : (
                                employee[field]
                              )}
                            </TableCell>
                          ))}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
  onClick={() =>
    dispatch(
      handleEdit({
        isEdit: true,
        employee,
      })
    )
  }
  className="text-blue-600"
>
  <Edit className="mr-2 h-4 w-4" />
  Edit
</DropdownMenuItem>
                                <DropdownMenuItem
  onClick={() => {
    /* Handle Delete Logic Here */
  }}
  className="text-red-600"
>
  <Trash className="mr-2 h-4 w-4" />
  Delete
</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center text-muted-foreground">
                    No employees found. Please adjust your filters or add new
                    employees.
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>1-{filteredEmployees.length}</strong> of{" "}
                  <strong>{filteredEmployees.length}</strong> Employees
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default HandleAddEdit;
