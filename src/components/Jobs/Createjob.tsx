'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Textarea } from "@/shadcn/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Label } from "@/shadcn/ui/label"
import { Calendar } from "@/shadcn/ui/calendar"
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover'
import { baseUrl } from '@/utils/constants'
import { useSession } from 'next-auth/react'

interface JobType{
  id:string;
  name:string;
}
export default function CreateJob() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    jobType: '',
    location: {
      city: '',
      state: '',
      zip: '',
      otherInfo: ''
    },
    client: '',
    dispatcher: '',
    technician: '',
    jobSchedule: {
      startDate: null as Date | null,
      endDate: null as Date | null,
      recurrence: 'DAILY'
    }
  })

  const [jobTypes, setJobTypes] = useState<string[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])

  const { data: session } = useSession();

  const fetchJobTypes = async () => {
    try {
      const response = await fetch(baseUrl + "jobtype", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${session?.user?.access_token}`
        },
      })
      const data = await response.json()
      setJobTypes(data.data)

      console.log(data, "jobtype")
    } catch (error) {
      console.error("Failed to fetch job types:", error)
    }
  };
 

  // Fetch Customers on Component Load
  const fetchCustomers = async () => {
    try {
      const response = await fetch(baseUrl + `customers/${session?.user?.companyId}`, {
        headers: {
          'Authorization': `Bearer ${session?.user?.access_token}`
        },
      })
      const data = await response.json()
      setCustomers(data)
      console.log(data, "customer")
    } catch (error) {
      console.error("Failed to fetch customers:", error)
    }
  };

  // Fetch Employees on Component Load
  const fetchEmployees = async () => {
    try {
      const response = await fetch(baseUrl + `${session?.user?.companyId}/employees`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${session?.user?.access_token}`
        },
      })
      const data = await response.json()
      setEmployees(data)
      console.log(data, "employees")
    } catch (error) {
      console.error("Failed to fetch employees:", error)
    }
  };

  // Call fetch functions on component mount
  useEffect(() => {
    if (session?.user) {
      fetchJobTypes();
      fetchCustomers();
      fetchEmployees();
    }
    
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [name]: value }
    }))
  }

  const handleScheduleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      jobSchedule: { ...prev.jobSchedule, [field]: value }
    }))
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        name: formData.name,
        description: formData.description,
        jobType: formData.jobType,
        location: {
          city: formData.location.city,
          state: formData.location.state,
          zip: formData.location.zip,
          otherInfo: formData.location.otherInfo,
        },
        client: formData.client,
        dispatcher: formData.dispatcher,
        technician: formData.technician,
        // jobSchedule: {
        //   startDate: formData.jobSchedule.startDate,
        //   endDate: formData.jobSchedule.endDate,
        //   recurrence: formData.jobSchedule.recurrence,
        // },
      };

      const response = await fetch(baseUrl + "job", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.access_token}`
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to create job");
      }

      const result = await response.json();
      console.log("Job created:", result);
    } catch (error) {
      console.error(error);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">Job Title</Label>
              <Input id="firstName" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="jobType">Job Type</Label>
              <Select name="jobType" onValueChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type: any) => (
                    <SelectItem key={type.id} value={type.id as string}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" value={formData.location.city} onChange={handleLocationChange} />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" value={formData.location.state} onChange={handleLocationChange} />
            </div>
            <div>
              <Label htmlFor="zip">ZIP Code</Label>
              <Input id="zip" name="zip" value={formData.location.zip} onChange={handleLocationChange} />
            </div>
            <div>
              <Label htmlFor="otherInfo">Other Location Info</Label>
              <Textarea id="otherInfo" name="otherInfo" value={formData.location.otherInfo} onChange={handleLocationChange} />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="client">Client</Label>
              <Select name="client" onValueChange={(value) => setFormData(prev => ({ ...prev, client: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dispatcher">Dispatcher</Label>
              <Select name="dispatcher" onValueChange={(value) => setFormData(prev => ({ ...prev, dispatcher: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dispatcher" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>{employee.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select name="dispatcher" onValueChange={(value) => setFormData(prev => ({ ...prev, dispatcher: value }))}>
  <SelectTrigger>
    <SelectValue placeholder="Select dispatcher" />
  </SelectTrigger>
  <SelectContent>
    {employees.map((employee) => (
      <SelectItem key={employee.id} value={employee.id}>
        {employee.firstName} {employee.lastName}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

          </div>)
                case 4:
                  return (
                    <div className="space-y-4">
                      <div>
                        <Label>Job Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.jobSchedule.startDate ? format(formData.jobSchedule.startDate, 'PPP') : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            {/* <Calendar
                              mode="single"
                              selected={formData.jobSchedule.startDate}
                              onSelect={(date) => handleScheduleChange('startDate', date)}
                              initialFocus
                            /> */}
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label>Job End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.jobSchedule.endDate ? format(formData.jobSchedule.endDate, 'PPP') : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            {/* <Calendar
                              mode="single"
                              selected={formData.jobSchedule.endDate}
                              onSelect={(date) => handleScheduleChange('endDate', date)}
                              initialFocus
                            /> */}
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label>Recurrence</Label>
                        <Select name="recurrence" onValueChange={(value) => handleScheduleChange('recurrence', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select recurrence" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )
                default:
                  return null
              }
            }
          
            return (
              <div className="p-4 space-y-4">
                <h1 className="text-xl font-semibold">Create Job</h1>
                {renderStep()}
                <div className="space-x-2">
                  {step > 1 && <Button variant="outline" onClick={prevStep}>Previous</Button>}
                  {step < 4 && <Button onClick={nextStep}>Next</Button>}
                  {step === 4 && <Button onClick={handleSubmit}>Submit</Button>}
                </div>
              </div>
            )
          }
          
