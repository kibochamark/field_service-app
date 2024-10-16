// "use client"
// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
// import { Badge } from "@/shadcn/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
// import { Progress } from "@/shadcn/ui/progress";
// import { CheckCircle2, Clock, AlertCircle, Briefcase } from "lucide-react";
// import { DataTable } from "./DataTable";
// import WorkFlowColumn from "./WorkFlowColumn";

// interface WorkflowStep {
//   stepName: string;
//   status: "pending" | "completed" | "failed";
//   assignedTo: string;
//   completedAt?: string;
//   notes: string;
// }

// interface Job {
//   id: string;
//   title: string;
//   steps: WorkflowStep[];
// }

// const jobs: Job[] = [
//   {
//     id: "job1",
//     title: "Created Jobs",
//     steps: [
//       {
//         stepName: "Initial Review",
//         status: "completed",
//         assignedTo: "John Doe",
//         completedAt: "2023-09-15T10:30:00Z",
//         notes: "All documents have been reviewed and approved.",
//       },
//       {
//         stepName: "Data Validation",
//         status: "pending",
//         assignedTo: "Jane Smith",
//         notes: "Waiting for additional data from the client.",
//       },
//       {
//         stepName: "Final Approval",
//         status: "failed",
//         assignedTo: "Mike Johnson",
//         notes: "Approval denied due to incomplete information.",
//       },
//     ],
//   },
//   {
//     id: "job2",
//     title: "Assigned Jobs",
//     steps: [
//       {
//         stepName: "Requirements Gathering",
//         status: "completed",
//         assignedTo: "Emily Brown",
//         completedAt: "2023-09-14T14:45:00Z",
//         notes: "All requirements have been collected and documented.",
//       },
//       {
//         stepName: "Design Phase",
//         status: "pending",
//         assignedTo: "David Wilson",
//         notes: "Working on the initial design concepts.",
//       },
//     ],
//   },
//   {
//     id: "job3",
//     title: "Scheduled Jobs",
//     steps: [
//       {
//         stepName: "Code Review",
//         status: "completed",
//         assignedTo: "Sarah Lee",
//         completedAt: "2023-09-13T11:20:00Z",
//         notes: "Code has been reviewed and approved.",
//       },
//       {
//         stepName: "Testing",
//         status: "pending",
//         assignedTo: "Tom Harris",
//         notes: "Conducting unit and integration tests.",
//       },
//       {
//         stepName: "Deployment",
//         status: "pending",
//         assignedTo: "Lisa Chen",
//         notes: "Preparing for deployment to staging environment.",
//       },
//     ],
//   },
//   {
//     id: "job4",
//     title: "Review Jobs",
//     steps: [
//       {
//         stepName: "Code Review",
//         status: "completed",
//         assignedTo: "Sarah Lee",
//         completedAt: "2023-09-13T11:20:00Z",
//         notes: "Code has been reviewed and approved.",
//       },
//       {
//         stepName: "Testing",
//         status: "pending",
//         assignedTo: "Tom Harris",
//         notes: "Conducting unit and integration tests.",
//       },
//       {
//         stepName: "Deployment",
//         status: "pending",
//         assignedTo: "Lisa Chen",
//         notes: "Preparing for deployment to staging environment.",
//       },
//     ],
//   },
// ];

// export default function WorkFlow() {
//   const [activeTab, setActiveTab] = useState(jobs[0].id);


//   const getJobProgress = (steps: WorkflowStep[]) => {
//     const completed = steps.filter((step) => step.status === "completed").length;
//     return (completed / steps.length) * 100;
//   };

//   return (
//     <div className="container mx-auto p-4 max-w-6xl">
//       <h1 className="text-3xl font-bold mb-6 text-center">Multi-Job Workflow Progress</h1>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
//         {jobs.map((job) => (
//           <Card key={job.id}>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg">{job.title}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Progress value={getJobProgress(job.steps)} className="mb-2" />
//               <p className="text-sm text-muted-foreground">
//                 {job.steps.filter((step) => step.status === "completed").length} of {job.steps.length} steps completed
//               </p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="grid grid-cols-4 mb-4">
//           {jobs.map((job) => (
//             <TabsTrigger key={job.id} value={job.id} className="flex items-center">
//               <Briefcase className="w-4 h-4 mr-2" />
//               {job.title}
//             </TabsTrigger>
//           ))}
//         </TabsList>
//         {/* <JobWorkflow currentStatus={"DRAFT"}/> */}
        
//       </Tabs>
//     </div>
//   );
// }
