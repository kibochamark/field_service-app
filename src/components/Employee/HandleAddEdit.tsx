"use client";
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../../store/Store';
import AddEmployee from './AddEmployee';
import { Button } from "@/shadcn/ui/button";
import { Badge } from "@/shadcn/ui/badge";
import {
    File,
    ListFilter,
    MoreHorizontal,
    PlusCircle,
} from "lucide-react";
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
import { handleAdd } from '../../../store/EmployeeSlice';

interface HandleAddEditProps {
    roles: any[];
    employees: any[];
}

const HandleAddEdit: React.FC<HandleAddEditProps> = ({ roles, employees }) => {
    const isadd = useSelector((state: RootState) => state.employee.isadd);
    const dispatch = useDispatch();

    const [selectedFirstName, setSelectedFirstName] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');

    // Extract unique first names and roles with safety checks
    const uniqueFirstNames: string[] = employees && employees.length > 0
        ? Array.from(new Set(employees.map((employee: any) => employee.firstName)))
        : [];
    const uniqueRoles: string[] = employees && employees.length > 0
        ? Array.from(new Set(employees.map((employee: any) => employee.role?.name)))
        : [];

    // Filter employees based on selected first name and role
    const filteredEmployees = employees && employees.length > 0
        ? employees.filter((employee: any) => {
            return (
                (selectedFirstName ? employee.firstName === selectedFirstName : true) &&
                (selectedRole ? employee.role?.name === selectedRole : true)
            );
        })
        : [];

    const fieldsToDisplay = [
        "firstName", "lastName", "email", "role", "createdAt", "updatedAt", "permissions"
    ];

    const handleFilterChange = (filterType: string, value: string) => {
        if (filterType === 'firstName') {
            setSelectedFirstName(value);
        } else if (filterType === 'role') {
            setSelectedRole(value);
        }
    };

    return (
        <div className='w-full'>
            {isadd ? (
                <AddEmployee roles={roles} />
            ) : (
                <Tabs defaultValue="all">
                    <div className="flex items-center">
                        {/* <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="draft">Draft</TabsTrigger>
                            <TabsTrigger value="archived" className="hidden sm:flex">
                                Archived
                            </TabsTrigger>
                        </TabsList> */}
                        <div className="ml-auto flex items-center gap-2">
                            {/* <DropdownMenu> */}
                                {/* <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 gap-1">
                                        <ListFilter className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            Filter by First Name
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Filter by First Name</DropdownMenuLabel>
                                    {uniqueFirstNames.length > 0 ? (
                                        uniqueFirstNames.map((firstName) => (
                                            <DropdownMenuItem
                                                key={firstName}
                                                onClick={() => handleFilterChange('firstName', firstName)}
                                            >
                                                {firstName}
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <DropdownMenuItem disabled>No first names available</DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu> */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 gap-1">
                                        <ListFilter className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            Filter by Role
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                                    {uniqueRoles.length > 0 ? (
                                        uniqueRoles.map((role) => (
                                            <DropdownMenuItem
                                                key={role}
                                                onClick={() => handleFilterChange('role', role)}
                                            >
                                                {role}
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <DropdownMenuItem disabled>No roles available</DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {/* <Button size="sm" variant="outline" className="h-8 gap-1">
                                <File className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Export
                                </span>
                            </Button> */}
                            <Button size="sm" className="h-8 gap-1" onClick={() => {
                                dispatch(handleAdd({
                                    isadd: true
                                }));
                            }}>
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Add Employee
                                </span>
                            </Button>
                        </div>
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
                                                    <TableHead key={field}>
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
                                                                <Badge variant="outline">{employee[field].join(", ")}</Badge>
                                                            ) : field === "role" ? (
                                                                <Badge variant="outline">{employee[field]?.name}</Badge>
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
                                                                <DropdownMenuItem onClick={() => {/* Handle Edit Logic Here */}}>Edit</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => {/* Handle Delete Logic Here */}}>Delete</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        No employees found. Please adjust your filters or add new employees.
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <div className="text-xs text-muted-foreground">
                                    Showing <strong>1-{filteredEmployees.length}</strong> of <strong>{filteredEmployees.length}</strong> Employees
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
