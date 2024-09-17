'use client'

import { useState } from 'react'
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Textarea } from "@/shadcn/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Label } from "@/shadcn/ui/label"
import { CardFooter } from "@/shadcn/ui/card"

// Mock data for dropdowns
const clients = [
  { id: '1', name: 'Client A' },
  { id: '2', name: 'Client B' },
  { id: '3', name: 'Client C' },
]

const dispatchers = [
  { id: '1', name: 'Dispatcher X' },
  { id: '2', name: 'Dispatcher Y' },
  { id: '3', name: 'Dispatcher Z' },
]

const technicians = [
  { id: '1', name: 'Technician 1' },
  { id: '2', name: 'Technician 2' },
  { id: '3', name: 'Technician 3' },
]

export default function Component() {
  const [open, setOpen] = useState(false)
  const [jobData, setJobData] = useState({
    name: '',
    description: '',
    jobType: '',
    location: {
      city: '',
      state: '',
      zip: '',
      otherinfo: ''
    },
    client: '',
    dispatcher: '',
    technician: '',
    jobSchedule: {
      startDate: '',
      endDate: '',
      recurrence: 'DAILY'
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setJobData(prev => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setJobData(prev => ({
      ...prev,
      location: { ...prev.location, [name]: value }
    }))
  }

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setJobData(prev => ({
      ...prev,
      jobSchedule: { ...prev.jobSchedule, [name]: value }
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setJobData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Job Data:', jobData)
    // Here you would typically send the data to your backend
    setOpen(false)
  }

  return (
    <CardFooter>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create New Job</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Job</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={jobData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={jobData.description} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select onValueChange={(value: string) => handleSelectChange('jobType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="City" name="city" value={jobData.location.city} onChange={handleLocationChange} required />
                <Input placeholder="State" name="state" value={jobData.location.state} onChange={handleLocationChange} required />
                <Input placeholder="Zip" name="zip" value={jobData.location.zip} onChange={handleLocationChange} required />
                <Input placeholder="Other Info" name="otherinfo" value={jobData.location.otherinfo} onChange={handleLocationChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select onValueChange={(value: string) => handleSelectChange('client', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dispatcher">Dispatcher</Label>
                <Select onValueChange={(value: string) => handleSelectChange('dispatcher', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dispatcher" />
                  </SelectTrigger>
                  <SelectContent>
                    {dispatchers.map((dispatcher) => (
                      <SelectItem key={dispatcher.id} value={dispatcher.id}>{dispatcher.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="technician">Technician</Label>
                <Select onValueChange={(value: string) => handleSelectChange('technician', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map((technician) => (
                      <SelectItem key={technician.id} value={technician.id}>{technician.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                
                <Label>Start Date</Label>
                <Input type="date" name="startDate" value={jobData.jobSchedule.startDate} onChange={handleScheduleChange} required />
                <Label>End Date</Label>
                <Input type="date" name="endDate" value={jobData.jobSchedule.endDate} onChange={handleScheduleChange} required />
                <Label>Job Schedule</Label>
                <Select 
                  onValueChange={(value: any) => setJobData(prev => ({ ...prev, jobSchedule: { ...prev.jobSchedule, recurrence: value } }))}
                  defaultValue={jobData.jobSchedule.recurrence}
                >
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
              <Button type="submit" className="w-full">Create Job</Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </CardFooter>
  )
}