'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field, FieldArray } from 'formik'
import * as Yup from 'yup'
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Textarea } from "@/shadcn/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shadcn/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { baseUrl } from '@/utils/constants'
import { useSession } from 'next-auth/react'
import axios from 'axios'

const JobSchema = Yup.object().shape({
  name: Yup.string().required('Job name is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.string().required('Status is required'),
  jobType: Yup.string().required('Job Type is required'),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date().required('End Date is required'),
})

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [initialValues, setInitialValues] = useState<any>(null)
  const { data: session } = useSession()  
  const [jobTypes, setJobTypes] = useState<any[]>([])
  const statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'] // Assuming these are your statuses

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const [jobResponse, jobTypesResponse] = await Promise.all([
          axios.get(`${baseUrl}${params.id}/retrievejob`, {
            headers: {
              Authorization: `Bearer ${session?.user?.access_token}`,
            },
          }),         
          axios.get(`${baseUrl}jobtype`, {
            headers: {
              Authorization: `Bearer ${session?.user?.access_token}`,
            },
          })
        ])

        const jobData = jobResponse.data?.data
        
        setJobTypes(jobTypesResponse.data?.data || [])

        setInitialValues({
          name: jobData.name || '',
          description: jobData.description || '',
          status: jobData.status || '',
          jobType: jobData.jobType?.id || '', // set jobType as id
          startDate: jobData.jobschedule?.startDate ? format(new Date(jobData.jobschedule.startDate), 'yyyy-MM-dd') : '',
          endDate: jobData.jobschedule?.endDate ? format(new Date(jobData.jobschedule.endDate), 'yyyy-MM-dd') : '',
          location: {
            city: jobData.location?.city || '',
            state: jobData.location?.state || '',
            zip: jobData.location?.zip || '',
            otherinfo: jobData.location?.otherinfo || ''
          },
          clients: jobData.clients.map((client: any) => ({
            id: client.client.id,
            firstName: client.client.firstName,
            lastName: client.client.lastName
          })),
          technicians: jobData.technicians.map((tech: any) => ({
            id: tech.technician.id,
            firstName: tech.technician.firstName,
            lastName: tech.technician.lastName
          }))
        })
      } catch (error) {
        toast.error('Failed to load job details. Please try again.')
      }
    }

    fetchJobData()
  }, [params.id, session])

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      await axios.put(`${baseUrl}${params.id}/updatejob`, values, {
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
      })
      toast.success('Job updated successfully')
      router.push('/jobs')
    } catch (error) {
      toast.error('Failed to update job. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!initialValues) return <div>Loading...</div>

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Job: {initialValues.name}</CardTitle>
      </CardHeader>
      <Formik
        initialValues={initialValues}
        validationSchema={JobSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <CardContent className="space-y-4">
              {/* Job Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Job Name</Label>
                <Field name="name" as={Input} id="name" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Field name="description" as={Textarea} id="description" />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => setFieldValue('status', value)}
                  defaultValue={values.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select
                  onValueChange={(value) => setFieldValue('jobType', value)}
                  defaultValue={values.jobType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((jobType) => (
                      <SelectItem key={jobType.id} value={jobType.id}>
                        {jobType.name} {/* Display jobType name */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Field name="startDate" type="date" as={Input} id="startDate" />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Field name="endDate" type="date" as={Input} id="endDate" />
              </div>

              {/* Clients */}
              <div className="space-y-2">
  <Label>Clients</Label>
  <FieldArray name="clients">
    {({ remove, push }) => (
      <>
        {values.clients.map((client: any, index: number) => (
          <div key={index} className="space-y-2">
            <Field name={`clients.${index}.firstName`} as={Input} placeholder="First Name" />
            <Field name={`clients.${index}.lastName`} as={Input} placeholder="Last Name" />
            
            {/* Wrap buttons in a flex container */}
            <div className="flex space-x-2 justify-end">
              <Button type="button" className="bg-red-500 text-white hover:bg-red-600" onClick={() => remove(index)}>Remove Client</Button>
              {index === values.clients.length - 1 && (
                <Button type="button" onClick={() => push({ firstName: '', lastName: '' })}>Add Client</Button>
              )}
            </div>
          </div>
        ))}
      </>
    )}
  </FieldArray>
</div>


              {/* Technicians */}
              <div className="space-y-2">
  <Label>Technicians</Label>
  <FieldArray name="technicians">
    {({ remove, push }) => (
      <>
        {values.technicians.map((technician: any, index: number) => (
          <div key={index} className="space-y-2">
            <Field name={`technicians.${index}.firstName`} as={Input} placeholder="First Name" />
            <Field name={`technicians.${index}.lastName`} as={Input} placeholder="Last Name" />
            
            {/* Wrap buttons in a flex container */}
            <div className="flex space-x-2 justify-end">
              {/* Red Remove Technician button */}
              <Button
                type="button"
                variant="destructive"  // Assuming you have a red destructive variant, or you can use className
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => remove(index)}
              >
                Remove Technician
              </Button>
              
              {/* Only show Add button next to the last technician */}
              {index === values.technicians.length - 1 && (
                <Button type="button" onClick={() => push({ firstName: '', lastName: '' })}>
                  Add Technician
                </Button>
              )}
            </div>
          </div>
        ))}
      </>
    )}
  </FieldArray>
</div>

            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push('/callpro/jobs')}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Job'}
              </Button>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  )
}
