"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/Store'; // Adjust the path as necessary
import { closeForm } from '../../../store/CustomerSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Input } from "@/shadcn/ui/input"; // Assuming you have a customized Input component
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast'; // Import toast
import { baseUrl } from '@/utils/constants';
import { getRoles } from '../Employee/EmployeeActions';
import { Revalidate } from '@/utils/Revalidate';


// Validation schema
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
});

const CustomerForm = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.customerForm.isOpen);
  const { data: session } = useSession();
  const [roles, setRoles] = useState<any[]>([]); 
  console.log(roles,"roles here")// State for roles

  // Fetch roles after component mounts
  useEffect(() => {
    const fetchRoles = async () => {
      if (session?.user?.access_token) {
        const fetchedRoles = await getRoles(session?.user?.access_token);
        setRoles(fetchedRoles ?? []);
      }
    };
    fetchRoles();
  }, [session]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Add New Customer</h2>
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
              toast.success('Customer created successfully!'); // Use toast for success message
              Revalidate("getcustomers")
              dispatch(closeForm());
            } catch (error: any) {
              if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
                toast.error(`Failed to create customer. Server responded with status ${error.response.status}.`);
              } else if (error.request) {
                console.error('Error request:', error.request);
                toast.error('Failed to create customer. No response received from server.');
              } else {
                console.error('Error message:', error.message);
                toast.error(`Failed to create customer. Error: ${error.message}`);
              }
              console.error('Error config:', error.config);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Email</label>
                  <Field name="email">
                    {({ field }: { field: any }) => (
                      <Input {...field} type="email" placeholder="Email" />
                    )}
                  </Field>
                  <ErrorMessage name="email" component="div" className="text-red-600" />
                </div>

                <div>
                  <label>First Name</label>
                  <Field name="firstName">
                    {({ field }: { field: any }) => (
                      <Input {...field} type="text" placeholder="First Name" />
                    )}
                  </Field>
                  <ErrorMessage name="firstName" component="div" className="text-red-600" />
                </div>

                <div>
                  <label>Last Name</label>
                  <Field name="lastName">
                    {({ field }: { field: any }) => (
                      <Input {...field} type="text" placeholder="Last Name" />
                    )}
                  </Field>
                  <ErrorMessage name="lastName" component="div" className="text-red-600" />
                </div>

                <div>
                  <label>Notes</label>
                  <Field name="notes">
                    {({ field }: { field: any }) => (
                      <Input {...field} type="text" placeholder="Notes" />
                    )}
                  </Field>
                  <ErrorMessage name="notes" component="div" className="text-red-600" />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Personal Profile</h3>
                <div className="grid grid-cols-2 gap-4">
                  

                  <div>
                    <label>City</label>
                    <Field name="profile.address.city">
                      {({ field }: { field: any }) => (
                        <Input {...field} type="text" placeholder="City" />
                      )}
                    </Field>
                    <ErrorMessage name="profile.address.city" component="div" className="text-red-600" />
                  </div>

                  <div>
                    <label>Zip</label>
                    <Field name="profile.address.zip">
                      {({ field }: { field: any }) => (
                        <Input {...field} type="text" placeholder="Zip" />
                      )}
                    </Field>
                    <ErrorMessage name="profile.address.zip" component="div" className="text-red-600" />
                  </div>

                  <div>
                    <label>State</label>
                    <Field name="profile.address.state">
                      {({ field }: { field: any }) => (
                        <Input {...field} type="text" placeholder="State" />
                      )}
                    </Field>
                    <ErrorMessage name="profile.address.state" component="div" className="text-red-600" />
                  </div>

                  <div className="mt-4">
                    <label>Phone</label>
                    <Field name="profile.phone">
                      {({ field }: { field: any }) => (
                        <Input {...field} type="text" placeholder="Phone" />
                      )}
                    </Field>
                    <ErrorMessage name="profile.phone" component="div" className="text-red-600" />
                  </div>
                </div>
              </div>          

              <div className="mt-6 flex justify-end gap-4">
                <button type="submit" className="bg-primary700 hover:bg-primary500 text-white px-4 py-2 rounded" disabled={isSubmitting}>
                  Submit
                </button>
                <button type="button" className="bg-gray-500 text-white px-4 py-2 hover:bg-red-600  rounded" onClick={() => dispatch(closeForm())}>
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CustomerForm;
