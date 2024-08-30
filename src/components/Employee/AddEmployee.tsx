import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/shadcn/ui/toggle-group";
import { LockIcon, PenIcon, ShieldIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { handleAdd } from '../../../store/EmployeeSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';

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

const getPermissionsForRole = (roleName: string, roles: any[]) => {
    const role = roles.find(r => r.name === roleName);
    return role ? role.permissions.map((permission: { value: any; }) => permission.value) : [];
};

const SignupSchema = Yup.object().shape({
    firstname: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    lastname: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    phonenumber: Yup.string().matches(/^\d+$/, 'Phone number must be digits only').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Required'),
    roleId: Yup.string().required('Required'),
});

const AddEmployee: React.FC<AddEmployeeProps> = ({ roles }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [rolePermissions, setRolePermissions] = useState<string[]>([]);

    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleSelectChange = (name: string, value: string, setFieldValue: any) => {
        setFieldValue(name, value);
        const selectedRole = roles.find(role => role.id === value);
        if (selectedRole) {
            setRolePermissions(selectedRole.permissions.map((permission: { value: any; }) => permission.value));
        }
    };

    const handleSubmit = async (values: FormDataState) => {
        
        const { confirmPassword, ...dataToSend } = values;
    
        try {
            const response = await fetch('http://localhost:8000/api/v1/employee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user.access_token}`,
                },
                body: JSON.stringify(dataToSend),
            });
    
            if (!response.ok) {
                throw new Error('Failed to add employee');
            }
    
            await response.json();
    
            toast.success("Employee Added");
    
            dispatch(handleAdd({ isAdd: false }));
            router.push('/employees');
    
        } catch (error: any) {
            toast.error(error.message);
        }
    };
    
    
    const handleCancel = () => {
        dispatch(handleAdd({ isAdd: false }));
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Add New Employee</CardTitle>
                <CardDescription>Enter the details of the new employee to add them to your company.</CardDescription>
            </CardHeader>
            <Formik
                initialValues={{
                    firstname: '',
                    lastname: '',
                    phonenumber: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    roleId: '',
                    companyId: session?.user?.companyId as string || '',
                    permissions: [],
                }}
                validationSchema={SignupSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, setFieldValue, values }) => (
                    <Form>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstname">First Name</Label>
                                <Field name="firstname" as={Input} placeholder="John" />
                                <ErrorMessage name="firstname" component="div" className="text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastname">Last Name</Label>
                                <Field name="lastname" as={Input} placeholder="Doe" />
                                <ErrorMessage name="lastname" component="div" className="text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phonenumber">Phone Number</Label>
                                <Field name="phonenumber" as={Input} placeholder="1234567890" />
                                <ErrorMessage name="phonenumber" component="div" className="text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Field name="email" as={Input} type="email" placeholder="john@example.com" />
                                <ErrorMessage name="email" component="div" className="text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Field
                                        name="password"
                                        as={Input}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={handleTogglePassword} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                        {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                                <ErrorMessage name="password" component="div" className="text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Field
                                        name="confirmPassword"
                                        as={Input}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={handleTogglePassword} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                        {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                                <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="roleId">Role</Label>
                                <Select
                                    onValueChange={value => handleSelectChange('roleId', value, setFieldValue)}
                                    value={values.roleId}
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
                                <ErrorMessage name="roleId" component="div" className="text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <Label>Permissions</Label>
                                <ToggleGroup
                                    type="multiple"
                                    value={values.permissions}
                                    onValueChange={values => setFieldValue('permissions', values)}
                                    className="justify-start"
                                >
                                    {rolePermissions.map(permission => (
                                        <ToggleGroupItem
                                            key={permission}
                                            value={permission}
                                            aria-label={`Toggle ${permission} permission`}
                                        >
                                            {permission === 'All permissions' ? (
                                                <ShieldIcon className="h-4 w-4 mr-2" />
                                            ) : permission === 'Read' ? (
                                                <LockIcon className="h-4 w-4 mr-2" />
                                            ) : (
                                                <PenIcon className="h-4 w-4 mr-2" />
                                            )}
                                            {permission}
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button type="submit">Add Employee</Button>
                </CardFooter>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default AddEmployee;
