"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Calendar } from "@/shadcn/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/shadcn/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { Badge } from "@/shadcn/ui/badge";
import { toast } from "@/shadcn/ui/use-toast";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Calendar as CalendarIcon,
  ArrowLeft,
  ArrowRight,
  Save,
  Edit,
  X,
  Check,
  PlusCircle,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shadcn/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import React from "react";
import { cn } from "@/lib/utils";
import { baseUrl } from "@/utils/constants";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Separator } from "@radix-ui/react-dropdown-menu";
import AnimatedStepProgression from "./Progressbar";
import { FileText, Users, Star } from 'lucide-react'
import { string } from "yup";


type JobStatus =
  | "Draft"
  | "Not Assigned"
  | "Assigned"
  | "In Progress"
  | "Completed";

interface Job {
  id: string;
  name: string;
  description: string;
  type: string;
  clientId: string[];
  technicianId: string[];
  jobSchedule: {
    startDate: Date | null;
    endDate: Date | null;
    recurrence: string;
  };
  location: {
    city: string;
    state: string;
    zip: string;
  
  };
}

interface Client {
  id: string;
  name: string;
}

interface Step {
  id: number
  title: string
  icon: React.ReactNode
}


const steps: Step[] = [
  { id: 1, title: "Create", icon: <FileText className="w-6 h-6" /> },
  { id: 2, title: "Assign", icon: <Users className="w-6 h-6" /> },
  { id: 3, title: "Schedule", icon: <Calendar className="w-6 h-6" /> },
  { id: 4, title: "Review", icon: <Star className="w-6 h-6" /> },
]

const recurrenceOptions = ["DAILY", "WEEKLY", "MONTHLY"];

export default function JobManagement({
  customers,
  employee,
  jobtype,
  alljobs,
}: {
  customers: any;
  employee: any;
  jobtype: any;
  alljobs: any;
}) {
  const [step, setStep] = useState<number>(1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentJob, setCurrentJob] = useState<Job>({
    id: "",
    name: "",
    description: "",
    type: "",
    clientId: [],
    technicianId: [],
    location: {
      city: "",
      state: "",
      zip: ""      
    },
    jobSchedule: {
      startDate: new Date(),
      endDate: new Date(),
      recurrence: "None",
    },
  });

  

  const router=useRouter()

  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const [openClientSearch, setOpenClientSearch] = React.useState(false);
  const [clientSearch, setClientSearch] = React.useState("");
  // const [selectedClients, setSelectedClients] = React.useState<Client[]>([]);

  // const handleSelectClient = (client: { id: string; name: string }) => {
  //   setSelectedClients((prev) => {
  //     const isSelected = prev.some((c) => c.id === client.id);
  //     if (isSelected) {
  //       return prev.filter((c) => c.id !== client.id);
  //     } else {
  //       return [...prev, client];
  //     }
  //   });
  // };

  const [selectedClient, setSelectedClient] = React.useState<string>("");

// Handle selecting a single client
const handleSelectClient = (client: { id: string; name: string }) => {
  setSelectedClient(client.id); // Store the selected client's name
};

  const { data: session } = useSession();

 

  // const removeClient = (clientId: string) => {
  //   setSelectedClients((prev) => prev.filter((c) => c.id !== clientId));
  // };
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);
  const [openTechnicianSearch, setOpenTechnicianSearch] = React.useState(false);
  const [technicianSearch, setTechnicianSearch] = React.useState("");
  const [selectedTechnicians, setSelectedTechnicians] = React.useState<
    { id: string; name: string }[]
  >([]);

  const handleSelectTechnician = (technician: { id: string; name: string }) => {
    setSelectedTechnicians((prev) => {
      const isSelected = prev.some((t) => t.id === technician.id);
      if (isSelected) {
        return prev.filter((t) => t.id !== technician.id);
      } else {
        return [...prev, technician];
      }
    });
  };

//   const assignJob = async () => {
//   const { city, zip, state } = currentJob.location; // Extract location fields
//   const technicianIds = selectedTechnicians.map((tech) => tech.id); // Extract technician IDs

//   // Prepare the data to be sent in the request body
//   const jobData = {
//     location: {
//       city,
//       zip,
//       state,
//       otherinfo: currentJob.location.otherInfo || "", // Optional field
//     },
//     technicianIds, // Array of technician IDs
//     jobSchedule: currentJob.jobSchedule, // Dates and recurrence
//   };

//   // Make the PUT request to update the job
//   try {
//     const response = await fetch(`/assign/${jobId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${session?.user.access_token}`, 
//       },
//       body: JSON.stringify(jobData), 
//     });

//     if (!response.ok) {
//       throw new Error("Failed to update job.");
//     }

//     const result = await response.json();
//     console.log("Job updated successfully:", result);
//     setStep(3);
//   } catch (error) {
//     console.error("Error updating job:", error);
//   }
// };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCurrentJob({ ...currentJob, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentJob({
      ...currentJob,
      location: { ...currentJob.location, [e.target.name]: e.target.value },
    });
  };

  const handleSelectChange = (value: string, field: keyof Job) => {
    setCurrentJob({ ...currentJob, [field]: value });
  };
  const handleCreateNewClient = () => {
    router.push('/callpro/createcustomer') 
  }

  const handleDateChange = (date: any, field: "startDate" | "endDate") => {
    // Validate that end date is not earlier than start date
    if (field === "startDate" && currentJob.jobSchedule.endDate && date > currentJob.jobSchedule.endDate) {
      // If the new startDate is later than the current endDate, set both dates to the new startDate
      setCurrentJob({
        ...currentJob,
        jobSchedule: {
          ...currentJob.jobSchedule,
          startDate: date,
          endDate: date, // Adjust endDate to match startDate
        },
      });
    } else if (field === "endDate" && currentJob.jobSchedule.startDate && date < currentJob.jobSchedule.startDate) {
      // If the new endDate is earlier than the startDate, do not allow it
      alert("End date cannot be earlier than the start date.");
    } else {
      // Otherwise, just set the selected date
      setCurrentJob({
        ...currentJob,
        jobSchedule: {
          ...currentJob.jobSchedule,
          [field]: date,
        },
      });
    }
  
    // Optional: Hide the calendar after selecting a date
    if (field === "startDate") setShowStartCalendar(false);
    else setShowEndCalendar(false);
  };
  
  

  const validateStep = () => {
    switch (step) {
      case 1:
        return (
          currentJob.name &&
          currentJob.description &&
          currentJob.type &&
          currentJob.clientId
        );
     
      case 2:
        return currentJob.technicianId;
      default:
        return true;

     case 3:
          return (
            currentJob.jobSchedule.startDate &&
            currentJob.jobSchedule.endDate &&
            currentJob.jobSchedule.recurrence
          );
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }

    switch (step) {
      case 1:
        setStep(2);
        break;
      
      case 2:
        setStep(3);
        break;

      case 3:
          setStep(4);
          break;
    }
  };

  const handleBack = () => {
    switch (step) {
      
      case 2:
        setStep(1);
        break;
      case 3:
          setStep(2);
          break;
      case 4:
        setStep(3);
        break;
    }
  };



const createJob = async () => {
  if (!validateStep()) return; // Validate the step before proceeding

  // Update the job data to only use one client ID
  let updatedJob = {
    ...currentJob,
    clientId: selectedClient, // Directly use selectedClient (string), not an array
    jobTypeId: currentJob.type,
    companyId: session?.user.companyId,
  };

  // Create the data to send with the single client ID
  let dataToSend = {
    name: updatedJob.name,
    description: updatedJob.description,
    jobTypeId: updatedJob.jobTypeId,
    clientId: updatedJob.clientId, // Single clientId
    companyId: updatedJob.companyId,
    
  };

  try {
    const method = editingJobId ? "PUT" : "POST";
    const endpoint = baseUrl + "job";

    const response = await fetch(endpoint, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.access_token}`,
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error("Failed to submit job data");
    }

    const result = await response.json();

    // Log the full response for debugging
    console.log("API response:", result);

    // Ensure that result.data.id exists and is a string
    if (result.data && result.data.id && typeof result.data.id === 'string') {
      setCreatedJobId(result.data.id); // Set the job ID in state
      setStep(2); // Move to the next step after creating the job
      return result.data.id; // Return the created job ID
    } else {
      throw new Error("Job ID not returned from create job API");
    }
  } catch (error) {
    console.error("Error submitting job:", error);
    toast({
      title: "Submission Error",
      variant: "destructive",
    });
    return null; // Return null if there's an error
  }
};
  

const assignJob = async (jobId: string) => {
  if (!validateStep()) return; // Validate the data if necessary

  // Prepare the updated job data based on your current job state
  const updatedJobData = {
        
    technicianIds: selectedTechnicians.map(technician => technician.id), 
    location: currentJob.location || {},
  };

  console.log(updatedJobData, "check")

  console.log("Updated Job Data:", updatedJobData);

  try {
    const endpoint = `${baseUrl}assign/${jobId}`; // Create the URL for the PUT request
    console.log(`Sending PUT request to ${endpoint}`);

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.access_token}`,
      },
      body: JSON.stringify(updatedJobData), // Send the updated job data
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorResponse = await response.json();
      console.log("Error response:", errorResponse);
      throw new Error("Failed to update job data");
    }   

    const result = await response.json();
    console.log("Job updated successfully:", result);
    

    toast({
      title: "Job Updated",
      description: "The job has been successfully updated.",
    });

    // Update the jobs state with the updated job
    setJobs(jobs.map((job) => (job.id === jobId ? result : job)));

    // Reset the form or state as necessary
    setCurrentJob({
      id: "",
      name: "",
      description: "",
      type: "",
      clientId: [],
      jobSchedule: {
        startDate: new Date(),
        endDate: new Date(),
        recurrence: "None",
      },
      technicianId: [],
      location: { city: "", zip: "", state: ""},
    });
    setStep(3); // Move to the next step or as needed
  } catch (error) {
    console.error("Error updating job:", error);
    toast({
      title: "Update Error",
      variant: "destructive",
    });
  }
};

const scheduleJob = async (jobId: string) => {
  if (!validateStep()) return; // Validate the data if necessary

  // Prepare the updated job data based on your current job state
  const updatedJobData = {
        
 
  
  jobSchedule:currentJob.jobSchedule
  };

  console.log(updatedJobData, "check")

  console.log("Updated Job Data:", updatedJobData);

  try {
    const endpoint = `${baseUrl}${jobId}/schedulejob`; // Create the URL for the PUT request
    console.log(`Sending PUT request to ${endpoint}`);

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.access_token}`,
      },
      body: JSON.stringify(updatedJobData), // Send the updated job data
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorResponse = await response.json();
      console.log("Error response:", errorResponse);
      throw new Error("Failed to update job data");
    }   

    const result = await response.json();
    console.log("Job updated successfully:", result);
    

    toast({
      title: "Job Updated",
      description: "The job has been successfully updated.",
    });

    // Update the jobs state with the updated job
    setJobs(jobs.map((job) => (job.id === jobId ? result : job)));

    // Reset the form or state as necessary
    setCurrentJob({
      id: "",
      name: "",
      description: "",
      type: "",
      clientId: [],
      jobSchedule: {
        startDate: new Date(),
        endDate: new Date(),
        recurrence: "None",
      },
      technicianId: [],
      location: { city: "", zip: "", state: ""},
    });
    setStep(4); // Move to the next step or as needed
  } catch (error) {
    console.error("Error updating job:", error);
    toast({
      title: "Update Error",
      variant: "destructive",
    });
  }
};

  const handleSubmit = async () => {   
    if (step === 1) {
      const jobId = await createJob(); // Ensure that createJob returns the created job ID
      setCreatedJobId(jobId); // Store the job ID in state
    } else if (step === 2) {
      if (createdJobId) {
        await assignJob(createdJobId); 
     }   
 } else if (step === 3) {
        if (createdJobId) {
    await scheduleJob(createdJobId);
        }
  };
}
  




  const handleEditJob = (job: string) => {
    
    
    router.push("/callpro/jobs/" + job + "/edit")
  };

  const filteredClients = customers.filter(
    (client: { id: string; name: string }) =>
      client.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Job Name</Label>
              <Input
                id="name"
                name="name"
                value={currentJob.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={currentJob.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Job Type</Label>
              <Select
                value={currentJob.type}
                onValueChange={(value) => handleSelectChange(value, "type")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobtype.map((type: any) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
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
        {selectedClient ? customers.find((client: { id: string; name: string }) =>
      client.id === selectedClient)?.name
   : "Select client..."} 
        <User className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[300px] p-0">
      <Command>
        <CommandInput
          placeholder="Search clients..."
          onValueChange={setClientSearch}
        />
        <CommandList>
          <CommandEmpty>No client found.</CommandEmpty>
          <CommandGroup>
            {filteredClients.map((client: Client) => (
              <CommandItem
                key={client.id}
                onSelect={() => handleSelectClient(client)}
                className="flex items-center justify-between"
              >
                <span>{client.name}</span>
                {selectedClient === client.name && <Check className="h-4 w-4" />}
              </CommandItem>
            ))}
          </CommandGroup>
          <Separator className="my-2" />
          <CommandItem
            onSelect={handleCreateNewClient}
            className="justify-center text-primary"
          >
            <PlusCircle className="mr-2 h-4 w-4 mb-2" />
            Create new client
          </CommandItem>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
  <div className="mt-2">
    {selectedClient ? customers.find((client: { id: string; name: string }) =>
      client.id === selectedClient)?.name : "No client selected."}
  </div>
</div>


          </div>
        );
     
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="technicians">Assign Technician</Label>
              <Popover
                open={openTechnicianSearch}
                onOpenChange={setOpenTechnicianSearch}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openTechnicianSearch}
                    className="w-full justify-between"
                  >
                    {selectedTechnicians.length > 0
                      ? `${selectedTechnicians.length} selected`
                      : "Select technicians..."}
                    <User className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search technicians..."
                      onValueChange={setTechnicianSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No technician found.</CommandEmpty>
                      <CommandGroup>
                        {employee
                          .filter((tech: { id: string; name: string }) =>
                            tech.name
                              .toLowerCase()
                              .includes(technicianSearch.toLowerCase())
                          )
                          .map((tech: { id: string; name: string }) => (
                            <CommandItem
                              key={tech.id}
                              onSelect={() => handleSelectTechnician(tech)}
                              className="flex items-center justify-between"
                            >
                              <span>{tech.name}</span>
                              {selectedTechnicians.some(
                                (t) => t.id === tech.id
                              ) && <Check className="h-4 w-4" />}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedTechnicians.map((tech) => (
                  <Badge
                    key={tech.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
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
                        <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={currentJob.location.city}
                onChange={handleLocationChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="zip">Zip Code</Label>
              <Input
                id="zip"
                name="zip"
                value={currentJob.location.zip}
                onChange={handleLocationChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={currentJob.location.state}
                onChange={handleLocationChange}
                required
              />
            </div>
            {/* <div>
              <Label htmlFor="otherinfo">Other Info (optional)</Label>
              <Input id="otherinfo" name="otherinfo" value={currentJob.location.otherInfo} onChange={handleLocationChange} />
            </div> */}
          </div>
        );
        case 3:
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
                          !currentJob.jobSchedule.startDate &&
                            "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentJob.jobSchedule.startDate ? (
                          format(currentJob.jobSchedule.startDate, "PPP")
                        ) : (
                          <span>Pick a start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={currentJob.jobSchedule.startDate as Date}
                        onSelect={(date) => handleDateChange(date, "startDate")}
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
                          !currentJob.jobSchedule.endDate &&
                            "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentJob.jobSchedule.endDate ? (
                          format(currentJob.jobSchedule.endDate, "PPP")
                        ) : (
                          <span>Pick an end date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={currentJob.jobSchedule.endDate as Date}
                        onSelect={(date) => handleDateChange(date, "endDate")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label htmlFor="recurrence">Recurrence</Label>
                <Select
                  value={currentJob.jobSchedule?.recurrence}
                  onValueChange={(value) =>
                    setCurrentJob({
                      ...currentJob,
                      jobSchedule: {
                        ...currentJob.jobSchedule,
                        recurrence: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    {recurrenceOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
      case 4:
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
  <p>
    {jobtype.find((type: any) => type.id === currentJob.type)?.name || 'No job type selected'}
  </p>
</div>
<div>
  <p className="font-semibold">Client</p>
  {selectedClient ? (  // Check if a client is selected
    <p>{customers.find((client: { id: string; name: string }) =>client.id == selectedClient)?.name}</p>  // Render the selected client's name
  ) : (
    <p>No client assigned</p>  // If no client is selected
  )}
</div>



<div>
  <p className="font-semibold">Technician</p>
  {selectedTechnicians.length > 0 ? (
    <ul>
      {selectedTechnicians.map((technician, index) => (
        <li key={index}>{technician.name}</li>
      ))}
    </ul>
  ) : (
    <p>No technicians assigned</p>
  )}
</div>


                <div>
                  <p className="font-semibold">Start Date</p>
                  <p>
                    {currentJob.jobSchedule.startDate
                      ? format(currentJob.jobSchedule.startDate, "PPP")
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">End Date</p>
                  <p>
                    {currentJob.jobSchedule.endDate
                      ? format(currentJob.jobSchedule.endDate, "PPP")
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Recurrence</p>
                  <p>{currentJob.jobSchedule.recurrence}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-semibold">Description</p>
                <p>{currentJob.description}</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  }; 
  <AnimatedStepProgression next={handleNext} back={handleBack} step={step} setstep={setStep}/>

  

  const renderJobList = () => (
    <div className="space-y-4">
      {alljobs?.map((job: any) => (
        <Card key={job.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{job.name}</span>
              <Badge variant={job.status === 'Completed' ? 'default' : 'secondary'}>
                {job.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-semibold">Description</p>
                <p>{job?.description || 'No description provided'}</p>
              </div>
              <div>
                <p className="font-semibold">Job Type</p>
                <p>{job?.jobType?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="font-semibold">Location</p>
                {/* Display detailed location info */}
                <p>
                  {job?.location?.city ? `${job?.location.city}, ${job?.location.state}` : 'Location not specified'}
                  {job?.location?.zip ? ` - ${job?.location.zip}` : ''}
                  {job?.location?.otherinfo ? ` (${job?.location.otherinfo})` : ''}
                </p>
              </div>
              <div>
                <p className="font-semibold">Start Date</p>
                <p>{job?.jobSchedule?.startDate ? format(new Date(job?.jobSchedule.startDate), 'PPP') : 'Not set'}</p>
              </div>
              <div>
                <p className="font-semibold">End Date</p>
                <p>{job?.jobSchedule?.endDate ? format(new Date(job?.jobSchedule.endDate), 'PPP') : 'Not set'}</p>
              </div>
              <div>
                <p className="font-semibold">Clients</p>
                {/* Display client names */}
                <p>{job?.clients?.firstName}, {job?.clients?.lastName}</p>
              </div>
              <div>
                <p className="font-semibold">Technicians</p>
                {/* Display technician names */}
                <p>{job?.technicians.map((tech: any) => `${tech?.technician?.firstName} ${tech?.technician?.lastName}`).join(', ') || 'No technicians'}</p>
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
                  <DialogTitle>{job?.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Client</Label>
                    <span className="col-span-3">{job?.clients?.firstName}, {job?.clients?.lastName}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Technician</Label>
                    <span className="col-span-3">{job.technicians.map((tech: any) => `${tech?.technician?.firstName} ${tech?.technician?.lastName}`).join(', ') || 'No technicians'}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Location</Label>
                    <span className="col-span-3">
                      {job.location?.city ? `${job.location.city}, ${job.location.state}` : 'Location not specified'}
                      {job.location?.zip ? ` - ${job.location.zip}` : ''}
                      {job.location?.otherinfo ? ` (${job.location.otherinfo})` : ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Start Date</Label>
                    <span className="col-span-3">{job.jobSchedule?.startDate ? format(new Date(job.jobSchedule.startDate), 'PPP') : 'Not set'}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">End Date</Label>
                    <span className="col-span-3">{job.jobSchedule?.endDate ? format(new Date(job.jobSchedule.endDate), 'PPP') : 'Not set'}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Recurrence</Label>
                    <span className="col-span-3">{job.jobSchedule?.recurrence || 'None'}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Description</Label>
                    <span className="col-span-3">{job.description}</span>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
             <Button onClick={() => handleEditJob(job.id)}>Edit Job</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
    

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Job</TabsTrigger>
          <TabsTrigger value="track">Track Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <h1 className="text-2xl font-bold mb-4">
            {editingJobId ? "Edit Job" : "Create New Job"}
          </h1>
          <AnimatedStepProgression next={handleNext} back={handleBack} step={step} setstep={setStep}/>
          {renderStep()}
          <div className="flex justify-between items-center mt-4">
        <Button
          onClick={handleBack}
          disabled={step === 1}
          variant="outline"
        >
          Previous
        </Button>
        <span className="text-lg font-semibold">
          Step {step} of {steps.length}
        </span>
        <Button
  onClick={handleSubmit}
  type={"submit"}
>
  {step === steps.length ? "Complete" : "Next"}
</Button>
      </div>
        </TabsContent>
        <TabsContent value="track">
          <h1 className="text-2xl font-bold mb-4">Job Tracking</h1>
          {renderJobList()}
        </TabsContent>
      </Tabs>
    </div>
  );
}


