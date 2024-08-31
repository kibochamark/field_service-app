"use client"
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/Store'; // Adjust the path as necessary
import { closeForm } from '../../../store/CustomerSlice';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import * as Yup from 'yup';
import { Input } from "@/shadcn/ui/input"; // Assuming you have this component

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
    }).nullable(),
    phone: Yup.string().nullable(),
  }).nullable(),
});

const CustomerForm = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.customerForm.isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4 sm:p-8">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h2 className="text-lg font-semibold mb-6">Add New Customer</h2>
        <Formik
          initialValues={{
            email: '',
            firstName: '',
            lastName: '',
            notes: '',
            profile: {
              address: {
                street: '',
                city: '',
                zip: '',
                state: '',
              },
              phone: ''
            },
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
              dispatch(closeForm());
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Field name="email">
                  {({ field }: FieldProps) => (
                    <Input {...field} type="email" placeholder="Email" className="w-full text-base" />
                  )}
                </Field>
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <Field name="firstName">
                    {({ field }: FieldProps) => (
                      <Input {...field} type="text" placeholder="First Name" className="w-full text-base" />
                    )}
                  </Field>
                  <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <Field name="lastName">
                    {({ field }: FieldProps) => (
                      <Input {...field} type="text" placeholder="Last Name" className="w-full text-base" />
                    )}
                  </Field>
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <Field name="notes">
                  {({ field }: FieldProps) => (
                    <Input {...field} type="text" placeholder="Notes" className="w-full text-base" />
                  )}
                </Field>
                <ErrorMessage name="notes" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                {/* <h3 className="text-lg font-medium mt-4 mb-2">Profile</h3> */}
                <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <Field name="profile.phone">
                      {({ field }: FieldProps) => (
                        <Input {...field} type="text" placeholder="Phone" className="w-full text-base" />
                      )}
                    </Field>
                    <ErrorMessage name="profile.phone" component="div" className="text-red-500 text-sm mt-1" />
                  </div>



                  <div>
                    <label className="block text-sm font-medium mb-1">Street</label>
                    <Field name="profile.address.street">
                      {({ field }: FieldProps) => (
                        <Input {...field} type="text" placeholder="Street" className="w-full text-base" />
                      )}
                    </Field>
                    <ErrorMessage name="profile.address.street" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  

                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <Field name="profile.address.city">
                      {({ field }: FieldProps) => (
                        <Input {...field} type="text" placeholder="City" className="w-full text-base" />
                      )}
                    </Field>
                    <ErrorMessage name="profile.address.city" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Zip</label>
                    <Field name="profile.address.zip">
                      {({ field }: FieldProps) => (
                        <Input {...field} type="text" placeholder="Zip" className="w-full text-base" />
                      )}
                    </Field>
                    <ErrorMessage name="profile.address.zip" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <Field name="profile.address.state">
                      {({ field }: FieldProps) => (
                        <Input {...field} type="text" placeholder="State" className="w-full text-base" />
                      )}
                    </Field>
                    <ErrorMessage name="profile.address.state" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white py-2 px-4 rounded">
                  Submit
                </button>
                <button type="button" onClick={() => dispatch(closeForm())} className="bg-gray-500 text-white py-2 px-4 rounded">
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
