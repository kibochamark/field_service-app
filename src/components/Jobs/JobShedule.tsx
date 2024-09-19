"use client"
import { useState } from 'react'
// import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
// import { Label } from "@/components/ui/label"
import { PlusIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'
import { Button } from '@/shadcn/ui/button'
import { Input } from '@/shadcn/ui/input'
import { Label } from '@/shadcn/ui/label'

interface Schedule {
  scheduleId: number
  jobId: string
  startDate: string
  endDate: string
  recurrence: string
  status: 'Active' | 'Inactive' | 'Completed'
}

const initialSchedules: Schedule[] = [
  { scheduleId: 1, jobId: "JOB-001", startDate: "2023-06-01T09:00", endDate: "2023-06-01T10:00", recurrence: "Daily", status: "Active" },
  { scheduleId: 2, jobId: "JOB-002", startDate: "2023-06-04T14:00", endDate: "2023-06-04T15:00", recurrence: "Weekly", status: "Active" },
  { scheduleId: 3, jobId: "JOB-003", startDate: "2023-07-01T03:00", endDate: "2023-07-01T04:00", recurrence: "Monthly", status: "Inactive" },
]

export default function JobSchedule() {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [newSchedule, setNewSchedule] = useState<Omit<Schedule, 'scheduleId'>>({
    jobId: '',
    startDate: '',
    endDate: '',
    recurrence: 'Once',
    status: 'Active'
  })

  const handleAddSchedule = () => {
    setSchedules([...schedules, { scheduleId: schedules.length + 1, ...newSchedule }])
    setNewSchedule({ jobId: '', startDate: '', endDate: '', recurrence: 'Once', status: 'Active' })
    setIsAddModalOpen(false)
  }

  const handleEditSchedule = () => {
    if (editingSchedule) {
      setSchedules(schedules.map(schedule => 
        schedule.scheduleId === editingSchedule.scheduleId ? editingSchedule : schedule
      ))
      setEditingSchedule(null)
    }
  }

  const handleDeleteSchedule = (scheduleId: number) => {
    setSchedules(schedules.filter(schedule => schedule.scheduleId !== scheduleId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const ScheduleForm = ({ schedule, setSchedule, onSubmit, submitText }: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jobId">Job ID</Label>
          <Input
            id="jobId"
            value={schedule.jobId}
            onChange={(e) => setSchedule({ ...schedule, jobId: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recurrence">Recurrence</Label>
          <Select
            value={schedule.recurrence}
            onValueChange={(value:any) => setSchedule({ ...schedule, recurrence: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select recurrence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Once">Once</SelectItem>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={schedule.startDate}
            onChange={(e) => setSchedule({ ...schedule, startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={schedule.endDate}
            onChange={(e) => setSchedule({ ...schedule, endDate: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={schedule.status}
          onValueChange={(value: 'Active' | 'Inactive' | 'Completed') => setSchedule({ ...schedule, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onSubmit} className="w-full">{submitText}</Button>
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Schedules</h1>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Schedule</DialogTitle>
            </DialogHeader>
            <ScheduleForm
              schedule={newSchedule}
              setSchedule={setNewSchedule}
              onSubmit={handleAddSchedule}
              submitText="Add Schedule"
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table className='bg-white rounded-md'>
        <TableHeader>
          <TableRow>
            <TableHead>Schedule ID</TableHead>
            <TableHead>Job ID</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Recurrence</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.scheduleId}>
              <TableCell>{schedule.scheduleId}</TableCell>
              <TableCell>{schedule.jobId}</TableCell>
              <TableCell>{formatDate(schedule.startDate)}</TableCell>
              <TableCell>{formatDate(schedule.endDate)}</TableCell>
              <TableCell>{schedule.recurrence}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  schedule.status === 'Active' ? 'bg-green-200 text-green-800' :
                  schedule.status === 'Inactive' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {schedule.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setEditingSchedule(schedule)}>
                        <Pencil2Icon className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Schedule</DialogTitle>
                      </DialogHeader>
                      {editingSchedule && (
                        <ScheduleForm
                          schedule={editingSchedule}
                          setSchedule={setEditingSchedule}
                          onSubmit={handleEditSchedule}
                          submitText="Update Schedule"
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon" onClick={() => handleDeleteSchedule(schedule.scheduleId)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}