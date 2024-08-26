// pages/add-employee.tsx (or the appropriate path for your page)
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/shadcn/ui/toggle-group";
import { toast } from "@/shadcn/ui/use-toast";
import { LockIcon, PenIcon, ShieldIcon } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { baseUrl } from '@/utils/constants';

interface AddEmployeeProps {
    roles: any[];
    companies: any[]; 
}

interface FormDataState {
    firstname: string;
    lastname: string;
    phonenumber: string;
    email: string;
    password: string;
    roleId: string;
    companyId: string;
    permissions: string[];
}

const AddEmployee: React.FC<AddEmployeeProps> = ({ roles, companies }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormDataState>({
        firstname: '',
        lastname: '',
        phonenumber: '',
        email: '',
        password: '',
        roleId: '',
        companyId: '',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.permissions.length === 0) {
            toast({
                title: "Error",
                description: "Please select at least one permission",
                variant: "destructive",
            });
            return;
        }

        try {
            const response = await fetch('/api/v1/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to add employee');
            }

            const data = await response.json();

            toast({
                title: "Employee Added",
                description: `${data.newuser.firstName} ${data.newuser.lastName} has been added as a ${data.newuser.role.name} to ${data.newuser.company.name} with selected permissions`,
            });

            setFormData({
                firstname: '',
                lastname: '',
                phonenumber: '',
                email: '',
                password: '',
                roleId: '',
                companyId: '',
                permissions: []
            });

            router.push('/v1/employees');
        } catch (error) {
            toast({
                title: "Error",
                description: (error as Error).message,
                variant: "destructive",
            });
        }
    };

    const handleCancel = () => {
        router.push('/v1/employees'); 
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
                        <Label htmlFor="role">Role</Label>
                        <Select onValueChange={value => handleSelectChange('roleId', value)} value={formData.roleId} required>
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
                        <Label htmlFor="company">Company</Label>
                        <Select onValueChange={value => handleSelectChange('companyId', value)} value={formData.companyId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a company" />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map((company: any) => (
                                    <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
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
