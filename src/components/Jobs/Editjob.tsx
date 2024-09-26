'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field, FormikErrors } from 'formik'
import * as Yup from 'yup'
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Textarea } from "@/shadcn/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shadcn/ui/card"
import { Select } from "@/shadcn/ui/select"
import { format, parse } from 'date-fns'
import toast from 'react-hot-toast'
import { baseUrl } from '@/utils/constants'
import { useSession } from 'next-auth/react'
import axios from 'axios'

const JobSchema = Yup.object().shape({
  name: Yup.string().required('Job name is required'),
  description: Yup.string(),
  status: Yup.string().required('Status is required'),
  jobType: Yup.string().required('Job type is required'),
  startDate: Yup.date().nullable().required('Start date is required'),
  endDate: Yup.date().nullable().min(Yup.ref('startDate'), "End date can't be before start date"),
  location: Yup.object().shape({
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zip: Yup.string(),
    otherinfo: Yup.string()
  })
})

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [initialValues, setInitialValues] = useState<any>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${baseUrl}${params.id}/retrievejob`, {
          headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
          },
        })

        const data = response.data?.data

        setInitialValues({
          name: data.name || '',
          description: data.description || '',
          status: data.status || '',
          jobType: data.jobType?.name || '',
          startDate: data.jobschedule?.startDate ? format(new Date(data.jobschedule.startDate), 'yyyy-MM-dd') : '',
          endDate: data.jobschedule?.endDate ? format(new Date(data.jobschedule.endDate), 'yyyy-MM-dd') : '',
          location: {
            city: data.location?.city || '',
            state: data.location?.state || '',
            zip: data.location?.zip || '',
            otherinfo: data.location?.otherinfo || '',
          }
        })
      } catch (error) {
        toast.error('Failed to load job details. Please try again.')
      }
    }

    fetchJob()
  }, [params.id])

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          jobSchedule: {
            startDate: values.startDate ? new Date(values.startDate).toISOString() : null,
            endDate: values.endDate ? new Date(values.endDate).toISOString() : null,
          },
          jobType: { name: values.jobType }
        })
      })

      if (!response.ok) throw new Error('Failed to update job')

      toast.success('Job updated successfully!')
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
        validate={(values) => {
          try {
            JobSchema.validateSync(values, { abortEarly: false })
          } catch (errors) {}
          return {}
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Job Name</Label>
                <Field name="name">
                  {({ field }: any) => (
                    <Input id="name" {...field} />
                  )}
                </Field>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Field name="description">
                  {({ field }: any) => (
                    <Textarea id="description" {...field} />
                  )}
                </Field>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Field name="status">
                  {({ field }: any) => (
                    <Select id="status" {...field}>
                      <option value="">Select a status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </Select>
                  )}
                </Field>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Field name="jobType">
                  {({ field }: any) => (
                    <Select id="jobType" {...field}>
                      <option value="">Select a job type</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Repair">Repair</option>
                      <option value="Installation">Installation</option>
                    </Select>
                  )}
                </Field>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Field name="startDate">
                  {({ field }: any) => (
                    <Input id="startDate" type="date" {...field} />
                  )}
                </Field>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Field name="endDate">
                  {({ field }: any) => (
                    <Input id="endDate" type="date" {...field} />
                  )}
                </Field>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location.city">City</Label>
                <Field name="location.city">
                  {({ field }: any) => (
                    <Input id="location.city" {...field} />
                  )}
                </Field>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location.state">State</Label>
                <Field name="location.state">
                  {({ field }: any) => (
                    <Input id="location.state" {...field} />
                  )}
                </Field>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location.zip">ZIP Code</Label>
                <Field name="location.zip">
                  {({ field }: any) => (
                    <Input id="location.zip" {...field} />
                  )}
                </Field>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location.otherinfo">Additional Location Info</Label>
                <Field name="location.otherinfo">
                  {({ field }: any) => (
                    <Input id="location.otherinfo" {...field} />
                  )}
                </Field>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push('/jobs')}>Cancel</Button>
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

