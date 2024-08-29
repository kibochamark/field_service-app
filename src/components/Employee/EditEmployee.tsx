"use client";
import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { clearEdit } from '../../../store/EmployeeSlice';

interface EditEmployeeProps {
    roles: any[];
    employee: any;
}

const EditEmployee: React.FC<EditEmployeeProps> = ({ roles, employee }) => {
    const [formData, setFormData] = useState(employee);
    const dispatch = useDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const selectedRole = roles.find(role => role.name === value);
        setFormData({ ...formData, role: selectedRole });
    };

    const handleSubmit = () => {
        
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Employee</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input name="firstName" value={formData.firstName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input name="lastName" value={formData.lastName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input name="email" value={formData.email} onChange={handleInputChange} />
                                </div>
                <div className="space-y-2">
                    <Label>Role</Label>
                    <select
                        name="role"
                        value={formData.role?.name || ""}
                        onChange={handleRoleChange}
                        className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                        <option value="">Select a role</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Permissions</Label>
                    <Input
                        name="permissions"
                        value={formData.permissions?.join(", ") || ""}
                        onChange={handleInputChange}
                        placeholder="Enter permissions separated by commas"
                    />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => dispatch(clearEdit())}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit}>
                    Save Changes
                </Button>
            </CardFooter>
        </Card>
    );
};

export default EditEmployee;

               
