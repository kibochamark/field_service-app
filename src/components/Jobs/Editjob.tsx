"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Textarea } from "@/shadcn/ui/textarea"
import { Select, SelectItem } from "@/shadcn/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shadcn/ui/card"
import { format, parse } from 'date-fns'

// JobSchema for validation
const JobSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string(),
  status: Yup.string().required('Required'),
  jobTypeId: Yup.string().required('Required'),
  clientId: Yup.string().required('Required'),
  technicianId: Yup.string().required('Required'),
  startDate: Yup.date().nullable(),
  endDate: Yup.date().nullable().min(Yup.ref('startDate'), "End date can't be before start date"),
})

// Define JobEditor class to manage the editing process
class JobEditor {
  constructor(public jobId: string) {}

  // Fetch job details
  async fetchJobDetails() {
    const response = await fetch(`/api/jobs/${this.jobId}`);
    const jobData = await response.json();
    return jobData;
  }

  // Fetch all required data (jobTypes, clients, technicians)
  async fetchDependencies() {
    const [jobTypesRes, clientsRes, techniciansRes] = await Promise.all([
      fetch('/api/job-types'),
      fetch('/api/clients'),
      fetch('/api/technicians'),
    ]);

    return {
      jobTypes: await jobTypesRes.json(),
      clients: await clientsRes.json(),
      technicians: await techniciansRes.json(),
    };
  }
}

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [jobTypes, setJobTypes] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [technicians, setTechnicians] = useState<any[]>([])
  const [initialValues, setInitialValues] = useState<any>({
    name: '',
    description: '',
    status: '',
    jobTypeId: '',
    clientId: '',
    technicianId: '',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    const loadJobData = async () => {
      const jobEditor = new JobEditor(params.id);

      try {
        // Fetch job and dependencies
        const jobData = await jobEditor.fetchJobDetails();
        const { jobTypes, clients, technicians } = await jobEditor.fetchDependencies();

        setJobTypes(jobTypes);
        setClients(clients);
        setTechnicians(technicians);

        setInitialValues({
          ...jobData,
          jobTypeId: jobData.jobTypeId || '',
          clientId: jobData.clientId || '',
          technicianId: jobData.technicianId || '',
          startDate: jobData.jobSchedule?.startDate ? format(new Date(jobData.jobSchedule.startDate), 'yyyy-MM-dd') : '',
          endDate: jobData.jobSchedule?.endDate ? format(new Date(jobData.jobSchedule.endDate), 'yyyy-MM-dd') : '',
        });
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    }

    loadJobData();
  }, [params.id]);

  // Handle form submission
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          jobSchedule: {
            startDate: values.startDate ? parse(values.startDate, 'yyyy-MM-dd', new Date()).toISOString() : null,
            endDate: values.endDate ? parse(values.endDate, 'yyyy-MM-dd', new Date()).toISOString() : null,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to update job');
      router.push('/jobs'); // Navigate to job list after successful update
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Job</CardTitle>
      </CardHeader>
      <Formik
        initialValues={initialValues}
        validationSchema={JobSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <CardContent className="space-y-4">
              {/* Job Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Job Name</Label>
                <Field name="name">
                  {({ field }: any) => (
                    <Input id="name" {...field} className={errors.name && touched.name ? "border-red-500" : ""} />
                  )}
                </Field>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Field name="description">
                  {({ field }: any) => (
                    <Textarea id="description" {...field} />
                  )}
                </Field>
              </div>

              {/* Job Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Field name="status">
                  {({ field }: any) => (
                    <Input id="status" {...field} className={errors.status && touched.status ? "border-red-500" : ""} />
                  )}
                </Field>
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <Label htmlFor="jobTypeId">Job Type</Label>
                <Field name="jobTypeId" as="select">
                  {({ field }: any) => (
                    <Select {...field} className={errors.jobTypeId && touched.jobTypeId ? "border-red-500" : ""}>
                      {jobTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                </Field>
              </div>

              {/* Client */}
              <div className="space-y-2">
                <Label htmlFor="clientId">Client</Label>
                <Field name="clientId" as="select">
                  {({ field }: any) => (
                    <Select {...field} className={errors.clientId && touched.clientId ? "border-red-500" : ""}>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                </Field>
              </div>

              {/* Technician */}
              <div className="space-y-2">
                <Label htmlFor="technicianId">Technician</Label>
                <Field name="technicianId" as="select">
                  {({ field }: any) => (
                    <Select {...field} className={errors.technicianId && touched.technicianId ? "border-red-500" : ""}>
                      {technicians.map((technician) => (
                        <SelectItem key={technician.id} value={technician.id}>
                          {technician.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                </Field>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Field name="startDate">
                  {({ field }: any) => (
                    <Input id="startDate" type="date" {...field} />
                  )}
                </Field>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Field name="endDate">
                  {({ field }: any) => (
                    <Input id="endDate" type="date" {...field} />
                  )}
                </Field>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push('callpro/jobs')}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Job'}
              </Button>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
 
      )}