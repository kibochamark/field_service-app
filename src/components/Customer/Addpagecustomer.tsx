"use client"

import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Input } from "@/shadcn/ui/input"
import { Button } from "@/shadcn/ui/button"
import { Label } from "@/shadcn/ui/label"
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { baseUrl } from '@/utils/constants'
import { getRoles } from '../Employee/EmployeeActions';
import { Revalidate } from '@/utils/Revalidate'

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  notes: Yup.string(),
  roleId: Yup.string(),
  profile: Yup.object({
    address: Yup.object({      
      city: Yup.string().required('Required'),
      zip: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
    }).nullable(),
    phone: Yup.string().nullable(),
  }).nullable(),
})

export default function CreateCustomerPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [roles, setRoles] = useState<any[]>([])

  useEffect(() => {
    const fetchRoles = async () => {
      if (session?.user?.access_token) {
        const fetchedRoles = await getRoles(session.user.access_token)
        setRoles(fetchedRoles ?? [])
      }
    }
    fetchRoles()
  }, [session])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Customer</h1>
      <Formik
        initialValues={{
          email: '',
          firstName: '',
          lastName: '',
          notes: '',
          roleId: '',
          profile: {
            address: {                
              city: '',
              zip: '',
              state: '',
            },
            phone: '',
          },
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await axios.post(
                baseUrl + "customers",
                {
                  email: values.email,
                  firstName: values.firstName,
                  lastName: values.lastName,
                  notes: values.notes,
                  roleId: roles.find((role)=>role.name  === "client").id,
                  profile: {
                    address: values.profile?.address,
                    phone: values.profile?.phone,
                  },
                  companyId: session?.user.companyId,
                },
                {
                  headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                  },
                }
              );
            toast.success('Customer created successfully!')
            Revalidate("getcustomers")
            router.push('/callpro/createjob') 
          } catch (error: any) {
            if (error.response) {
              console.error('Error response:', error.response)
              toast.error(`Failed to create customer. Server responded with status ${error.response.status}.`)
            } else if (error.request) {
              console.error('Error request:', error.request)
              toast.error('Failed to create customer. No response received from server.')
            } else {
              console.error('Error:', error.message)
              toast.error(`Failed to create customer. Error: ${error.message}`)
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Field name="email">
                  {({ field }: { field: any }) => (
                    <Input {...field} id="email" type="email" placeholder="Email" />
                  )}
                </Field>
                <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Field name="firstName">
                  {({ field }: { field: any }) => (
                    <Input {...field} id="firstName" type="text" placeholder="First Name" />
                  )}
                </Field>
                <ErrorMessage name="firstName" component="div" className="text-red-600 text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Field name="lastName">
                  {({ field }: { field: any }) => (
                    <Input {...field} id="lastName" type="text" placeholder="Last Name" />
                  )}
                </Field>
                <ErrorMessage name="lastName" component="div" className="text-red-600 text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Field name="notes">
                  {({ field }: { field: any }) => (
                    <Input {...field} id="notes" type="text" placeholder="Notes" />
                  )}
                </Field>
                <ErrorMessage name="notes" component="div" className="text-red-600 text-sm" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Personal Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Field name="profile.address.city">
                    {({ field }: { field: any }) => (
                      <Input {...field} id="city" type="text" placeholder="City" />
                    )}
                  </Field>
                  <ErrorMessage name="profile.address.city" component="div" className="text-red-600 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">Zip</Label>
                  <Field name="profile.address.zip">
                    {({ field }: { field: any }) => (
                      <Input {...field} id="zip" type="text" placeholder="Zip" />
                    )}
                  </Field>
                  <ErrorMessage name="profile.address.zip" component="div" className="text-red-600 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Field name="profile.address.state">
                    {({ field }: { field: any }) => (
                      <Input {...field} id="state" type="text" placeholder="State" />
                    )}
                  </Field>
                  <ErrorMessage name="profile.address.state" component="div" className="text-red-600 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Field name="profile.phone">
                    {({ field }: { field: any }) => (
                      <Input {...field} id="phone" type="text" placeholder="Phone" />
                    )}
                  </Field>
                  <ErrorMessage name="profile.phone" component="div" className="text-red-600 text-sm" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Create Customer
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}