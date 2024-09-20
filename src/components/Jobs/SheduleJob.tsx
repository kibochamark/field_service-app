"use client";
import { useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Calendar } from "@/shadcn/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface Job {
  id: string;
  customer: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
  scheduleJob: string;
  when: string;
}

interface ScheduleJobProps {
  jobs: Job[];
}

const ScheduleJob: React.FC<ScheduleJobProps> = ({ jobs }) => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobs.length > 0 ? jobs[0].id : null);

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const selectedJob = jobs.find((job) => job.id === selectedJobId);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Schedule Jobs</CardTitle>
        <CardDescription>Enter the details to schedule a new job.</CardDescription>
      </CardHeader>

      {/* List of job badges */}
      <CardContent className="space-x-2 mb-4">
        {jobs.map((job) => (
          <Button
            key={job.id}
            variant={job.id === selectedJobId ? "default" : "outline"}
            onClick={() => handleJobSelect(job.id)}
          >
            {job.customer}
          </Button>
        ))}
      </CardContent>

      {/* Form for the selected job */}
      {selectedJob ? (
        <CardContent className="space-y-4">
          {/* <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={selectedJob.customer} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input id="type" value={selectedJob.type} readOnly />
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue={selectedJob.status}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(new Date(selectedJob.startDate), "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={new Date(selectedJob.startDate)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(new Date(selectedJob.endDate), "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={new Date(selectedJob.endDate)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="text" defaultValue={`$${selectedJob.amount.toFixed(2)}`} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule Job</Label>
            <Select defaultValue={selectedJob.scheduleJob}>
              <SelectTrigger>
                <SelectValue placeholder="Select schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="when">When</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(selectedJob.when), "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={new Date(selectedJob.when)} initialFocus />
              </PopoverContent>
            </Popover>
          </div> */}
        </CardContent>
      ) : (
        <CardContent>
          <p>No job selected.</p>
        </CardContent>
      )}

      <CardFooter>
        <Button className="w-full">Submit</Button>
      </CardFooter>
    </Card>
  );
};

export default ScheduleJob;
