import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/shadcn/ui/toggle-group";
import { LockIcon, PenIcon, ShieldIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { handleAdd } from '../../../store/EmployeeSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

interface AddEmployeeProps {
    roles: any[];
}

interface FormDataState {
    firstname: string;
    lastname: string;
    phonenumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    roleId: string;
    companyId: string;
    permissions: string[];
}

const AddEmployee: React.FC<AddEmployeeProps> = ({ roles }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState<FormDataState>({
        firstname: '',
        lastname: '',
        phonenumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        roleId: '',
        companyId: session?.user?.companyId as string || '',
        permissions: []
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionsChange = (values: string[]) => {
        setFormData(prev => ({ ...prev, permissions: values }));
    };

    const validateForm = () => {
        const { firstname, lastname, phonenumber, email, password, confirmPassword, roleId } = formData;

        if (!firstname || !lastname || !phonenumber || !email || !password || !confirmPassword || !roleId) {
            toast.error('All fields are required');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        // Password length validation
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return false;
        }

        // Confirm password validation
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await fetch('http://localhost:8000/api/v1/employee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user.access_token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to add employee');
            }

            await response.json();

            toast.success("Employee Added");

            setFormData({
                firstname: '',
                lastname: '',
                phonenumber: '',
                email: '',
                password: '',
                confirmPassword: '',
                roleId: '',
                companyId: session?.user?.companyId as string || '',
                permissions: [],
            });

            handleCancel();

        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleCancel = () => {
        dispatch(handleAdd({ isadd: false }));
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Add New Employee</CardTitle>
                <CardDescription>Enter the details of the new employee to add them to your company.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstname">First Name</Label>
                        <Input
                            id="firstname"
                            name="firstname"
                            placeholder="John"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastname">Last Name</Label>
                        <Input
                            id="lastname"
                            name="lastname"
                            placeholder="Doe"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phonenumber">Phone Number</Label>
                        <Input
                            id="phonenumber"
                            name="phonenumber"
                            placeholder="123-456-7890"
                            value={formData.phonenumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            onValueChange={value => handleSelectChange('roleId', value)}
                            value={formData.roleId}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role: any) => (
                                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Permissions</Label>
                        <ToggleGroup
                            type="multiple"
                            value={formData.permissions}
                            onValueChange={handlePermissionsChange}
                            className="justify-start"
                        >
                            <ToggleGroupItem value="read" aria-label="Toggle read permission">
                                <LockIcon className="h-4 w-4 mr-2" />
                                Read
                            </ToggleGroupItem>
                            <ToggleGroupItem value="write" aria-label="Toggle write permission">
                                <PenIcon className="h-4 w-4 mr-2" />
                                Write
                            </ToggleGroupItem>
                            <ToggleGroupItem value="admin" aria-label="Toggle admin permission">
                                <ShieldIcon className="h-4 w-4 mr-2" />
                                Admin
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button type="submit">Add Employee</Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default AddEmployee;
