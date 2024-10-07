'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shadcn/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { baseUrl } from '@/utils/constants';
import { useSession } from 'next-auth/react';
import axios from 'axios';

// Validation schema
const JobSchema = Yup.object().shape({
  name: Yup.string().required('Job name is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.string().required('Status is required'),
  jobType: Yup.string().required('Job Type is required'),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date().required('End Date is required'),
});

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<any>({
    name: '',
    description: '',
    status: '',
    jobType: '',
    startDate: '',
    endDate: '',
    location: { city: '', state: '', zip: '', otherinfo: '' },
    clients: [],
    technicians: [],
  });
  const { data: session } = useSession();
  const [jobTypes, setJobTypes] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const [jobResponse, jobTypesResponse, clientsResponse, techniciansResponse] = await Promise.all([
          axios.get(`${baseUrl}${params.id}/retrievejob`, {
            headers: { Authorization: `Bearer ${session?.user?.access_token}` },
          }),
          axios.get(`${baseUrl}jobtype`, {
            headers: { Authorization: `Bearer ${session?.user?.access_token}` },
          }),
          axios.get(`${baseUrl}customers/${session?.user?.companyId}`, {
            headers: { Authorization: `Bearer ${session?.user?.access_token}` },
          }),
          axios.get(`${baseUrl}${session?.user?.companyId}/technician`, {
            headers: { Authorization: `Bearer ${session?.user?.access_token}` },
          }),
        ]);

        const jobData = jobResponse.data?.data || {};
        setJobTypes(jobTypesResponse.data?.data || []);
        setClients(clientsResponse.data?.data || []);
        setTechnicians(techniciansResponse.data || []);
        setStatuses(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']); // Replace this with the actual status list if available

        setInitialValues({
          name: jobData.name || '',
          description: jobData.description || '',
          status: jobData.status || '',
          jobType: jobData.jobType?.id || '',
          startDate: jobData.jobschedule?.startDate ? format(new Date(jobData.jobschedule.startDate), 'yyyy-MM-dd') : '',
          endDate: jobData.jobschedule?.endDate ? format(new Date(jobData.jobschedule.endDate), 'yyyy-MM-dd') : '',
          location: {
            city: jobData.location?.city || '',
            state: jobData.location?.state || '',
            zip: jobData.location?.zip || '',
            otherinfo: jobData.location?.otherinfo || '',
          },
          clients: jobData.clients ? [jobData.clients.id] : [],
          technicians: jobData.technicians ? jobData.technicians.map((tech: any) => tech.technician.id) : [],
        });
      } catch (error) {
        toast.error('Failed to load job details. Please try again.');
        console.error('Error fetching job data:', error);
      }
    };

    if (session) {
      fetchJobData();
    }
  }, [params.id, session]);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        status: values.status,
        jobType: values.jobType,
        jobschedule: {
          startDate: values.startDate,
          endDate: values.endDate,
        },
        location: values.location,
        clients: values.clients.map((clientId: string) => ({ id: clientId })),
        technicians: values.technicians.map((techId: string) => ({ id: techId })),
      };

      await axios.put(`${baseUrl}${params.id}/updatejob`, payload, {
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
      });

      toast.success('Job updated successfully');
      router.push('/callpro/jobs');
    } catch (error) {
      console.error('Failed to update job details:', error);
      toast.error('Failed to update job details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Job: {initialValues.name || 'Loading...'}</CardTitle>
      </CardHeader>
      <Formik initialValues={initialValues} validationSchema={JobSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Job Name</Label>
                <Field name="name" as={Input} id="name" />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Field name="description" as={Textarea} id="description" />
              </div>
  
              <div className="space-y-2">
  <Label htmlFor="status">Status</Label>
  <Select 
    onValueChange={(value) => setFieldValue('status', value)} 
    value={values.status} // Set the current value
  >
    <SelectTrigger>
      <SelectValue placeholder="Select a status" />
    </SelectTrigger>
    <SelectContent>
      {/* List of statuses */}
      {['CREATED', 'ASSIGNED', 'SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'].map((status) => (
        <SelectItem key={status} value={status}>
          {status}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {/* Display the selected status below the Select component */}
  <div className="border p-2 rounded">
    {values.status || 'No status selected'}
  </div>
</div>

  
              <div className="space-y-2">
  <Label htmlFor="jobType">Job Type</Label>
  <Select 
    onValueChange={(value) => setFieldValue('jobType', value)} 
    value={values.jobType} // Set the current value
  >
    <SelectTrigger>
      <SelectValue placeholder="Select a job type" />
    </SelectTrigger>
    <SelectContent>
      {jobTypes.map((jobType) => (
        <SelectItem key={jobType.id} value={jobType.id}>
          {jobType.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {/* Display the selected job type name below the Select component */}
  <div className="border p-2 rounded">
    {jobTypes.find(jobType => jobType.id === values.jobType)?.name || 'No job type selected'}
  </div>
</div>

  
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Field name="startDate" type="date" as={Input} id="startDate" />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Field name="endDate" type="date" as={Input} id="endDate" />
              </div>
  
              <div className="space-y-2">
                <Label>Clients</Label>
                <div className="border p-2 rounded">
                  {clients.map((client) => (
                    <div key={client.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={client.id}
                        checked={values.clients.includes(client.id)}
                        onChange={(e) => {
                          const selectedClients = e.target.checked
                            ? [...values.clients, client.id]
                            : values.clients.filter((id: string) => id !== client.id);
                          setFieldValue('clients', selectedClients);
                        }}
                      />
                      <span>{client.firstName} {client.lastName}</span>
                    </div>
                  ))}
                </div>
              </div>
  
              <div className="space-y-2">
                <Label>Technicians</Label>
                <div className="border p-2 rounded">
                  {technicians.map((tech) => (
                    <div key={tech.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={tech.id}
                        checked={values.technicians.includes(tech.id)}
                        onChange={(e) => {
                          const selectedTechnicians = e.target.checked
                            ? [...values.technicians, tech.id]
                            : values.technicians.filter((id: string) => id !== tech.id);
                          setFieldValue('technicians', selectedTechnicians);
                        }}
                      />
                      <span>{tech.firstName} {tech.lastName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => router.push('/callpro/jobs')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
  
}
