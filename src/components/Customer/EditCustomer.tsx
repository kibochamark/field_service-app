"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Input } from "@/shadcn/ui/input";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { RootState } from '../../../store/Store';
import { handleEdit } from '../../../store/CustomerSlice';
import { baseUrl } from '@/utils/constants';

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  notes: Yup.string(),
  profile: Yup.object({
    address: Yup.object({
      street: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      zip: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
    }),
    phone: Yup.string().required('Required'),
  }),
  roleId: Yup.string(),
  companyId: Yup.string().required(),
});

const EditCustomer = ({ customerId }: { customerId: string }) => {
  const [initialValues, setInitialValues] = useState<any>(null);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const edit = useSelector((state: RootState) => state.customerForm.isedit);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get(`${baseUrl}customer/${customerId}`, {
          headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
          },
        });
        setInitialValues(response.data);
      } catch (error) {
        console.error('Failed to fetch customer details:', error);
        toast.error('Failed to fetch customer details.');
      }
    };
    fetchCustomerDetails();
  }, [customerId, edit, session]);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      // Build the correct payload structure
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        notes: values.notes,
        profile: {
          phone: values.profile.phone,
          address: {
            street: values.profile.address.street,
            city: values.profile.address.city,
            zip: values.profile.address.zip,
            state: values.profile.address.state,
          },
        },
        roleId: values.roleId,
        companyId: values.companyId,
      };

      await axios.put(
        `${baseUrl}customer/${customerId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
          },
        }
      );
      toast.success('Customer details updated successfully!');
      dispatch(handleEdit({ edit: false, data: null })); // Clear edit state
      router.push('/callpro/customer'); // Navigate to customer list
    } catch (error) {
      console.error('Failed to update customer details:', error);
      toast.error('Failed to update customer details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialValues) return <p>Loading...</p>;

  return (
    <div className="p-8 bg-white">
      <h2 className="text-2xl font-semibold mb-4">Edit Customer</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
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
                  <label>Street</label>
                  <Field name="profile.address.street">
                    {({ field }: { field: any }) => (
                      <Input {...field} type="text" placeholder="Street" />
                    )}
                  </Field>
                  <ErrorMessage name="profile.address.street" component="div" className="text-red-600" />
                </div>

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
              <button
                type="submit"
                className="bg-primary700 hover:bg-primary400 text-white px-4 py-2 rounded"
                disabled={isSubmitting}
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-red-500"
                onClick={() => router.push('/callpro/customer')}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditCustomer;
