import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/shadcn/ui/toggle-group"
import { toast } from "@/shadcn/ui/use-toast"
import { LockIcon, PenIcon, ShieldIcon } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { handleAdd } from '../../../store/EmployeeSlice'

export default function AddEmployee({ roles }: { roles: any }) {
    const router = useRouter()
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        permissions: []
    })

    const handleInputChange = (e:any) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (value:any) => {
        setFormData(prev => ({ ...prev, role: value }))
    }

    const handlePermissionsChange = (values:any) => {
        setFormData(prev => ({ ...prev, permissions: values }))
    }

    const handleSubmit = (e:any) => {
        e.preventDefault()
        if (formData.permissions.length === 0) {
            toast({
                title: "Error",
                description: "Please select at least one permission",
                variant: "destructive",
            })
            return
        }
        // Here you would typically send the data to your backend
        console.log('Submitted data:', formData)
        toast({
            title: "Employee Added",
            description: `${formData.name} has been added as a ${formData.role} with ${formData.permissions.join(', ')} permissions`,
        })
        // Reset form after submission
        setFormData({
            name: '',
            email: '',
            password: '',
            role: '',
            permissions: []
        })
    }

    const handleCancel = () => {
        // Go back to the previous page
        dispatch(handleAdd({
            isadd: false
        }))
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Add New Employee</CardTitle>
                <CardDescription>Enter the details of the new employee to add them to your company.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
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
                        <Select onValueChange={handleSelectChange} value={formData.role} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles?.map((role:any) => {
                                    return (
                                        <SelectItem value="employee">{role.name}</SelectItem>

                                    )
                                })}
                                
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
    )
}
