'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Textarea } from "@/shadcn/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Calendar } from "@/shadcn/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Badge } from "@/shadcn/ui/badge"
import { toast } from "@/shadcn/ui/use-toast"
import { format } from 'date-fns'
import { AlertCircle, CheckCircle2, Clock, MapPin, User, Calendar as CalendarIcon, ArrowLeft, ArrowRight, Save, Edit, X, Check } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shadcn/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import React from 'react'
import { cn } from '@/lib/utils'
import { baseUrl } from '@/utils/constants'
import { useSession } from 'next-auth/react'

type Step = 'create' | 'schedule' | 'assign' | 'review'
type JobStatus = 'Draft' | 'Not Assigned' | 'Assigned' | 'In Progress' | 'Completed'


interface Job {
  id: string
  name: string
  description: string
  type: string
  client: string[] 
  startDate: Date | null
  endDate: Date | null
  recurrence: string
  technician: string[] 
  status: JobStatus
}

interface Client {
  id: string
  name: string
}

const recurrenceOptions = ['None', 'Daily', 'Weekly', 'Monthly']



export default function JobManagement({ customers, employee, jobtype }: { customers: any; employee: any; jobtype: any }) {
  const [step, setStep] = useState<Step>('create')
  const [jobs, setJobs] = useState<Job[]>([])
  const [currentJob, setCurrentJob] = useState<Job>({
    id: '',
    name: '',
    description: '',    
    type: '',
    client: [],
    startDate: new Date(),  
    endDate: new Date(),
    recurrence: 'None',
    technician: [],
    status: 'Draft'
  })



  const [editingJobId, setEditingJobId] = useState<string | null>(null)

  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);


  const [openClientSearch, setOpenClientSearch] = React.useState(false)
  const [clientSearch, setClientSearch] = React.useState("")
  const [selectedClients, setSelectedClients] = React.useState<Client[]>([])

  const handleSelectClient = (client: { id: string; name: string }) => {
    setSelectedClients((prev) => {
      const isSelected = prev.some((c) => c.id === client.id)
      if (isSelected) {
        return prev.filter((c) => c.id !== client.id)
      } else {
        return [...prev, client]
      }
    })
  }
  const { data: session } = useSession();
  const removeClient = (clientId: string) => {
    setSelectedClients((prev) => prev.filter((c) => c.id !== clientId))
  }

  const [openTechnicianSearch, setOpenTechnicianSearch] = React.useState(false)
  const [technicianSearch, setTechnicianSearch] = React.useState("")
  const [selectedTechnicians, setSelectedTechnicians] = React.useState<{id: string, name: string}[]>([])

const handleSelectTechnician = (technician: { id: string; name: string }) => {
  setSelectedTechnicians((prev) => {
    const isSelected = prev.some((t) => t.id === technician.id)
    if (isSelected) {
      return prev.filter((t) => t.id !== technician.id)
    } else {
      return [...prev, technician]
    }
  })
}


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentJob({ ...currentJob, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string, field: keyof Job) => {
    setCurrentJob({ ...currentJob, [field]: value })
  }

  const handleDateChange = (date: any, field: 'startDate' | 'endDate') => {
    setCurrentJob({ ...currentJob, [field]: date });
    if (field === 'startDate') setShowStartCalendar(false);
    else setShowEndCalendar(false);
  };
  const validateStep = () => {
    switch (step) {
      case 'create':
        return currentJob.name && currentJob.description && currentJob.type && currentJob.client      
      case 'schedule':
        return currentJob.startDate && currentJob.endDate && currentJob.recurrence
      case 'assign':
        return currentJob.technician
      default:
        return true
    }
  }

  

  const handleNext = () => {
    if (!validateStep()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      })
      return
    }

    switch (step) {
      case 'create':
        setStep('schedule')
        break
      case 'schedule':
        setStep('assign')
        break
      case 'assign':
        setStep('review')
        break
    }
  }

  const handleBack = () => {
    switch (step) {
      case 'schedule':
        setStep('create')
        break
      case 'assign':
        setStep('schedule')
        break
      case 'review':
        setStep('assign')
        break
    }
  }

 const handleSubmit = async () => {
  if (!validateStep()) return;

  const updatedJob = {
    ...currentJob,
    client: selectedClients.map((client) => client.id), // Extract client IDs
    technician: selectedTechnicians.map((tech) => tech.id), // Extract technician IDs
    jobTypeId: currentJob.type, 
  };

  console.log(updatedJob, "updated job");

  try {
    const method = editingJobId ? 'PUT' : 'POST'; // Change method based on if editing
    const endpoint = baseUrl + 'job'; // Base URL for job API

    // Log before making the request
    console.log("Sending request to:", endpoint);
    
    const response = await fetch(endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.user.access_token}`, // Use the access token
      },
      body: JSON.stringify(updatedJob),
    });

    // Log the response status and headers
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    
    // Check if response is OK
    if (!response.ok) {
      const errorResponse = await response.json();
      console.log("Error response body:", errorResponse);
      throw new Error('Failed to submit job data');
    }

    const result = await response.json();
    console.log("Response body:", result);

    toast({
      title: editingJobId ? "Job Updated" : "Job Created",
      description: editingJobId ? "The job has been successfully updated." : "The new job has been successfully created and assigned.",
    });

    // Update state based on whether it's an edit or a new job
    setJobs(editingJobId ? jobs.map(job => job.id === editingJobId ? result : job) : [...jobs, result]);
    setEditingJobId(null);
    setCurrentJob({
      id: '',
      name: '',
      description: '',
      type: '', // Reset job type after submission
      client: [], // Clear client selections
      startDate: new Date(),
      endDate: new Date(),
      recurrence: 'None',
      technician: [], // Clear technician selections
      status: 'Draft'
    });
    setStep('create');
  } catch (error) {
    console.error("Error submitting job:", error);
    toast({
      title: "Submission Error",
      variant: "destructive"
    });
  }
};

  
  

  const handleSaveDraft = () => {
    localStorage.setItem('jobDraft', JSON.stringify(currentJob))
    toast({
      title: "Draft Saved",
      description: "Your job draft has been saved. You can continue editing later.",
    })
  }

  const handleEditJob = (job: Job) => {
    setCurrentJob(job)
    setEditingJobId(job.id)
    setStep('create')
  }

  const filteredClients = customers.filter((client: { id: string; name: string }) =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase())
  )

  const renderStep = () => {
    switch (step) {
      case 'create':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Job Name</Label>
              <Input id="name" name="name" value={currentJob.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={currentJob.description} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="type">Job Type</Label>
              <Select value={currentJob.type} onValueChange={(value) => handleSelectChange(value, 'type')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobtype.map((type:any) => (
                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
<div>
      <Label htmlFor="clients">Clients</Label>
      <Popover open={openClientSearch} onOpenChange={setOpenClientSearch}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openClientSearch}
            className="w-full justify-between"
          >
            {selectedClients.length > 0 ? `${selectedClients.length} selected` : "Select clients..."}
            <User className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search clients..." onValueChange={setClientSearch} />
            <CommandList>
              <CommandEmpty>No client found.</CommandEmpty>
              <CommandGroup>
                {filteredClients.map((client: { id: string; name: string }) => (
                  <CommandItem
                    key={client.id}
                    onSelect={() => handleSelectClient(client)}
                    className="flex items-center justify-between"
                  >
                    <span>{client.name}</span>
                    {selectedClients.some((c) => c.id === client.id) && <Check className="h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedClients.map((client) => (
          <Badge key={client.id} variant="secondary" className="flex items-center gap-1">
            {client.name}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={() => removeClient(client.id)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {client.name}</span>
            </Button>
          </Badge>
        ))}
      </div>
    </div>
          </div>
        )
      case 'schedule':
        return (
         
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
    {/* Start Date */}
    <div>
      <Label>Start Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !currentJob.startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {currentJob.startDate ? format(currentJob.startDate, "PPP") : <span>Pick a start date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={currentJob.startDate as Date}
            onSelect={(date) => handleDateChange(date, 'startDate')}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>

    {/* End Date */}
    <div>
      <Label>End Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !currentJob.endDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {currentJob.endDate ? format(currentJob.endDate, "PPP") : <span>Pick an end date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={currentJob.endDate as Date}
            onSelect={(date) => handleDateChange(date, 'endDate')}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  </div>
            <div>
              <Label htmlFor="recurrence">Recurrence</Label>
              <Select value={currentJob.recurrence} onValueChange={(value) => handleSelectChange(value, 'recurrence')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recurrence" />
                </SelectTrigger>
                <SelectContent>
                  {recurrenceOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      case 'assign':
        return (
          <div className="space-y-4">
    <div>
      <Label htmlFor="technicians">Assign Technician</Label>
      <Popover open={openTechnicianSearch} onOpenChange={setOpenTechnicianSearch}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openTechnicianSearch}
            className="w-full justify-between"
          >
            {selectedTechnicians.length > 0 ? `${selectedTechnicians.length} selected` : "Select technicians..."}
            <User className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search technicians..." onValueChange={setTechnicianSearch} />
            <CommandList>
              <CommandEmpty>No technician found.</CommandEmpty>
              <CommandGroup>
                {employee
                  .filter((tech:{id: string; name: string}) =>
                    tech.name.toLowerCase().includes(technicianSearch.toLowerCase())
                  )
                  .map((tech: { id: string; name: string }) => (
                    <CommandItem
                      key={tech.id}
                      onSelect={() => handleSelectTechnician(tech)}
                      className="flex items-center justify-between"
                    >
                      <span>{tech.name}</span>
                      {selectedTechnicians.some((t) => t.id === tech.id) && <Check className="h-4 w-4" />}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedTechnicians.map((tech) => (
          <Badge key={tech.id} variant="secondary" className="flex items-center gap-1">
            {tech.name}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={() => handleSelectTechnician(tech)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tech.name}</span>
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  </div>
        )
      case 'review':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Job Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Job Name</p>
                  <p>{currentJob.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Job Type</p>
                  <p>{currentJob.type}</p>
                </div>
                <div>
                  <p className="font-semibold">Client</p>
                  <p>{currentJob.client}</p>
                </div>
                <div>
                  <p className="font-semibold">Technician</p>
                  <p>{currentJob.technician}</p>
                </div>
                <div>
                  <p className="font-semibold">Start Date</p>
                  <p>{currentJob.startDate ? format(currentJob.startDate, 'PPP') : 'Not set'}</p>
                </div>
                <div>
                  <p className="font-semibold">End Date</p>
                  <p>{currentJob.endDate ? format(currentJob.endDate, 'PPP') : 'Not set'}</p>
                </div>
                <div>
                  <p className="font-semibold">Recurrence</p>
                  <p>{currentJob.recurrence}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-semibold">Description</p>
                <p>{currentJob.description}</p>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  const renderProgressTracker = () => {
    const steps: Step[] = ['create', 'schedule', 'assign', 'review']
    return (
      <div className="flex justify-between mb-8">
        {steps.map((s, index) => (
          <div key={s} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${steps.indexOf(step) >= index ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
            >
              {index + 1}
            </div>
            <span className="text-sm mt-1 capitalize">{s}</span>
          </div>
        ))}
      </div>
    )
  }

  const renderJobList = () => (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{job.name}</span>
              <Badge variant={job.status === 'Completed' ? 'default' : 'secondary'}>{job.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-semibold">Client</p>
                <p>{job.client}</p>
              </div>
              <div>
                <p className="font-semibold">Technician</p>
                <p>{job.technician}</p>
              </div>
              <div>
                <p className="font-semibold">Start Date</p>
                <p>{job.startDate ? format(job.startDate, 'PPP') : 'Not set'}</p>
              </div>
              <div>
                <p className="font-semibold">Job Type</p>
                <p>{job.type}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View Details</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{job.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Client</Label>
                    <span className="col-span-3">{job.client}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Type</Label>
                    <span className="col-span-3">{job.type}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Technician</Label>
                    <span className="col-span-3">{job.technician}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Start Date</Label>
                    <span className="col-span-3">{job.startDate ? format(job.startDate, 'PPP') : 'Not set'}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">End Date</Label>
                    <span className="col-span-3">{job.endDate ? format(job.endDate, 'PPP') : 'Not set'}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Recurrence</Label>
                    <span className="col-span-3">{job.recurrence}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Description</Label>
                    <span className="col-span-3">{job.description}</span>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={() => handleEditJob(job)}>Edit</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Job</TabsTrigger>
          <TabsTrigger value="track">Track Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <h1 className="text-2xl font-bold mb-4">{editingJobId ? 'Edit Job' : 'Create New Job'}</h1>
          {renderProgressTracker()}
          {renderStep()}
          <div className="flex justify-between mt-6">
            {step !== 'create' && (
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            {!editingJobId && (
              <Button onClick={handleSaveDraft} variant="outline">
                <Save className="mr-2 h-4 w-4" /> Save Draft
              </Button>
            )}
            {step !== 'review' ? (
              <Button onClick={handleNext} className="ml-auto">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="ml-auto">
                {editingJobId ? 'Update Job' : 'Create Job'} <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </TabsContent>
        <TabsContent value="track">
          <h1 className="text-2xl font-bold mb-4">Job Tracking</h1>
          {renderJobList()}
        </TabsContent>
      </Tabs>
    </div>
  )
}