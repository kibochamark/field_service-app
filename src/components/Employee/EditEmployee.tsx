"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { clearEdit } from '../../../store/EmployeeSlice';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { baseUrl } from '@/utils/constants';

interface Role {
    id: string;
    name: string;
    permissions: { value: string }[];
}

interface EditEmployeeProps {
    roles: Role[];
    employee: any;
}

const EditEmployee: React.FC<EditEmployeeProps> = ({ roles, employee }) => {
    const [formData, setFormData] = useState(employee);
    const [rolePermissions, setRolePermissions] = useState<string[]>([]);
    const dispatch = useDispatch();
    const { data: session } = useSession();

    useEffect(() => {
        if (formData.role) {
            const selectedRole = roles.find(role => role.name === formData.role.name);
            if (selectedRole) {
                setRolePermissions(selectedRole.permissions.map(permission => permission.value));
            }
        }
    }, [formData.role, roles]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const selectedRole = roles.find(role => role.name === value);
        if (selectedRole) {
            setFormData((prev: any) => ({ ...prev, role: selectedRole, permissions: selectedRole.permissions.map(permission => permission.value) }));
            setRolePermissions(selectedRole.permissions.map(permission => permission.value));
        }
    };

    const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            permissions: checked
                ? [...prev.permissions, value]
                : prev.permissions.filter((permission: string) => permission !== value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Prepare the data to match the expected schema
        const updatedEmployeeData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            profile: {
                phone: formData.phone, // Add any additional profile fields here
            },
            roleId: formData.role?.id, // Send the roleId instead of the entire role object
            permissions: formData.permissions, // This is already in the correct format
        };
    
        
    
        try {
            const response = await fetch(baseUrl + `${formData.id}/employee/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user.access_token}`,
                },
                body: JSON.stringify(updatedEmployeeData),
            });
    
            
    
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Error Response:", errorResponse);
                throw new Error(errorResponse.message || 'Failed to update employee');
            }
    
            const result = await response.json();
            toast.success("Employee updated successfully");
    
           
    
            setFormData(result);
            dispatch(clearEdit());
    
        } catch (error: any) {
            console.error("Catch Error:", error);
            toast.error(error.message);
        }
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
                    <div className="grid grid-cols-2 gap-2">
                        {rolePermissions.map((permission) => (
                            <div key={permission} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="permissions"
                                    value={permission}
                                    checked={formData.permissions?.includes(permission)}
                                    onChange={handlePermissionChange}
                                    className="form-checkbox"
                                />
                                <Label>{permission}</Label>
                            </div>
                        ))}
                    </div>
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
