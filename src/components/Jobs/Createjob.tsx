'use client'

import { useState } from 'react'
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Textarea } from "@/shadcn/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Label } from "@/shadcn/ui/label"
import { Calendar } from "@/shadcn/ui/calendar"
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover'

export default function Createjob() {
  const [open, setOpen] = useState(false)
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
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
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
                  <SelectItem value="client1">Client 1</SelectItem>
                  <SelectItem value="client2">Client 2</SelectItem>
                  <SelectItem value="client3">Client 3</SelectItem>
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
                  <SelectItem value="dispatcher1">Dispatcher 1</SelectItem>
                  <SelectItem value="dispatcher2">Dispatcher 2</SelectItem>
                  <SelectItem value="dispatcher3">Dispatcher 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="technician">Technician</Label>
              <Select name="technician" onValueChange={(value) => setFormData(prev => ({ ...prev, technician: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech1">Technician 1</SelectItem>
                  <SelectItem value="tech2">Technician 2</SelectItem>
                  <SelectItem value="tech3">Technician 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                    {formData.jobSchedule.startDate ? format(formData.jobSchedule.startDate, 'PP') : 'Pick a start date'}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <Calendar
                    mode="single"
                    selected={formData.jobSchedule.startDate || undefined} // Ensure type compatibility
                    onSelect={(date) => handleScheduleChange('startDate', date)}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                    {formData.jobSchedule.endDate ? format(formData.jobSchedule.endDate, 'PP') : 'Pick an end date'}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <Calendar
                    mode="single"
                    selected={formData.jobSchedule.endDate || undefined} // Ensure type compatibility
                    onSelect={(date) => handleScheduleChange('endDate', date)}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="recurrence">Recurrence</Label>
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
    }
  }

  const handleSubmit = () => {
    console.log('Form submitted:', formData)
    setOpen(false)
    setStep(1)
    // Typically, you'd send the data to your backend here.
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Job</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Job - Step {step} of 4</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {renderStep()}
        </div>
        <div className="flex justify-between">
          {step > 1 && <Button onClick={prevStep}>Previous</Button>}
          {step < 4 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
