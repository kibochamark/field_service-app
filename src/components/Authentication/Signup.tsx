"use client";
import { company, signup } from "@/app/(authentication)/signup/page";
import { ToastAction } from "@/shadcn/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { BuildingIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Bounce, toast } from "react-toastify";
import { googlsingUp } from "./Requests";
import { signIn, useSession } from "next-auth/react";

const Signup = ({ role }: { role: any }) => {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const roles = role.map(
    (type: { id: string; name: string }, index: number) => (
      <option value={type.id} key={index}>
        {type.name}
      </option>
    )
  );

  const SignupSchema: any = Yup.object().shape({
    firstname: Yup.string().required("Required"),
    lastname: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
    phonenumber: Yup.string().required("Required"),
    roleId: Yup.string().required("Required"),
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      console.log(values);
      return await signup(values);
    },
    onSuccess() {
      formik.resetForm();
      toast.success("Personal Details Added Successfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    },
    onError() {
      toast.error("Error, try again!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      phonenumber: "",
      roleId: "",
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      console.log(values);
      mutation.mutate(values);
    },
  });

  const CompanySchema: any = Yup.object().shape({});

  const companyMutation = useMutation({
    mutationFn: async (values: any) => {
      console.log(values);
      return await company(values);
    },
    onSuccess() {
      toast.success("Company Details Added Successfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      formik.resetForm();
      router.push("/login");
    },
    onError() {
      toast.error("Error, try again!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
  });

  const companyFormik = useFormik({
    initialValues: {
      name: "",
      description: "",
      companySize: "",
      email: "",
      poBox: "",
      addressline1: "",
      address: {
        city: "",
        street: "",
        zip: "",
      },
    },
    validationSchema: CompanySchema,
    onSubmit: (values) => {
      console.log(values);
      companyMutation.mutate(values);
    },
  });

  const handleGoogleSignIn = async () => {
    await signIn("google");
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 min-h-screen">
        <div className="bg-primary50 flex flex-col items-center justify-center p-8">
          <span>Field Service Inc</span>
          <p className="mt-4 max-w-md text-center text-lg">
            Create your account to access our powerful tools and features.
          </p>
          <nav className="mt-8 space-y-8">
            <button
              className={`flex items-center gap-2 text-lg font-medium ${
                step === 1 ? "text-primary600" : "text-muted-foreground"
              }`}
              onClick={() => setStep(1)}
            >
              <UserIcon className="w-5 h-5" />
              Personal Information
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 text-lg font-medium ${
                step === 2 ? "text-primary600" : "text-muted-foreground"
              }`}
              onClick={() => setStep(2)}
            >
              <BuildingIcon className="w-5 h-5" />
              Company Information
            </button>
          </nav>
        </div>
        <div className="flex items-center justify-center w-full p-8 col-span-2">
          {step === 1 && (
            <div className="w-full max-w-lg">
              <form action="" onSubmit={formik.handleSubmit}>
                <div className="w-full max-w-lg space-y-4">
                  <div className="text-center">
                    <h1 className="text-headlineLarge font-bold">
                      Tell us about yourself
                    </h1>
                    <p className="text-titleSmall">Personal Information</p>
                  </div>
                  <div className="md:grid md:grid-cols-2 gap-6">
                    <div className="">
                      <div className="flex md:flex-row gap-2 content-center">
                        <label
                          htmlFor=""
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          First Name
                        </label>
                      </div>
                      <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={formik.values.firstname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                      />
                    </div>
                    <div className="">
                      <div className="flex md:flex-row gap-2 content-center">
                        <label
                          htmlFor=""
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Last Name
                        </label>
                      </div>
                      <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={formik.values.lastname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex md:flex-row gap-2 content-center">
                      <label
                        htmlFor=""
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email
                      </label>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                    />
                  </div>
                  <div className="md:grid md:grid-cols-2 gap-6">
                    <div className="">
                      <div className="flex md:flex-row gap-2 content-center">
                        <label
                          htmlFor=""
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Password
                        </label>
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                      />
                    </div>
                    <div className="">
                      <div className="flex md:flex-row gap-2 content-center">
                        <label
                          htmlFor=""
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Confirm Password
                        </label>
                      </div>
                      <input
                        type="password"
                        id="confirm"
                        name="remarks"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex md:flex-row gap-2 content-center">
                      <label
                        htmlFor=""
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Phone Number
                      </label>
                    </div>
                    <input
                      type="text"
                      id="phonenumber"
                      name="phonenumber"
                      value={formik.values.phonenumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                    />
                  </div>
                  <div>
                    <div className="flex md:flex-row gap-2 content-center">
                      <label
                        htmlFor=""
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Role
                      </label>
                    </div>
                    <select
                      id="suffix"
                      name="roleId"
                      onChange={(event) => {
                        formik.handleChange(event);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.roleId}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#2E96D0] focus:border-[#2E96D0] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#2E96D0] dark:focus:border-[#2E96D0] disabled:bg-gray-200"
                    >
                      <option>Select Role</option>
                      {roles}
                    </select>
                  </div>
                  <div className="md:flex md:justify-between gap-4">
                    <button
                      type="submit"
                      className="bg-primary600 hover:bg-primary800 rounded-md w-full py-3 shadow-md text-white text-bodyMedium font-semibold"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <div>Submit Details</div>
                      )}
                    </button>
                    <button
                      type="button"
                      className="bg-white border border-primary600 hover:bg-primary50 rounded-md w-full py-3 shadow-md text-primary600 text-bodyMedium font-semibold"
                      onClick={() => setStep(2)}
                    >
                      Next
                    </button>
                  </div>
                  <div className="text-center">or</div>
                  <div>
                    <button
                    type="button"
                      className="bg-white w-full border border-purple-600 py-3 shadow-md text-bodyMedium font-semibold text-primary600 rounded-md"
                      onClick={handleGoogleSignIn}
                    >
                      Sign up with Google
                    </button>
                  </div>

                  <div className="text-center text-bodyMedium">
                    <Link href={"/login"}>
                      Already have an account?{" "}
                      <span className="text-primary600 font-semibold">
                        Login
                      </span>{" "}
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          )}
          {step === 2 && (
            <div className="w-full max-w-lg">
              <form action="" onSubmit={companyFormik.handleSubmit}>
                <div className="w-full max-w-lg space-y-4">
                  <div className="text-center">
                    <h1 className="text-headlineLarge font-bold">
                      Tell us about your company
                    </h1>
                    <p className="text-titleSmall">Company Information</p>
                  </div>
                  <div className="md:grid md:grid-cols-2 gap-6">
                    <div className="">
                      <div className="flex md:flex-row gap-2 content-center">
                        <label
                          htmlFor=""
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Company Name
                        </label>
                      </div>
                      <input
                        type="text"
                        id=""
                        name="name"
                        value={companyFormik.values.name}
                        onBlur={companyFormik.handleBlur}
                        onChange={companyFormik.handleChange}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                      />
                    </div>
                    <div className="">
                      <div className="flex md:flex-row gap-2 content-center">
                        <label
                          htmlFor=""
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Company Website (optional)
                        </label>
                      </div>
                      <input
                        type="text"
                        id=""
                        name="remarks"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex md:flex-row gap-2 content-center">
                      <label
                        htmlFor=""
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email Address
                      </label>
                    </div>
                    <input
                      type="email"
                      id=""
                      name="email"
                      value={companyFormik.values.email}
                      onBlur={companyFormik.handleBlur}
                      onChange={companyFormik.handleChange}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                    />
                  </div>
                  <div className="md:grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex md:flex-row gap-2 content-center">
                        <label
                          htmlFor=""
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Industry
                        </label>
                      </div>
                      <input
                        type="text"
                        id=""
                        name="description"
                        value={companyFormik.values.description}
                        onBlur={companyFormik.handleBlur}
                        onChange={companyFormik.handleChange}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                      />
                    </div>
                    <div>
                      <div className="flex md:flex-row gap-2 content-center">
                        <label
                          htmlFor=""
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Company Size
                        </label>
                      </div>
                      <input
                        type="text"
                        id=""
                        name="companySize"
                        value={companyFormik.values.companySize}
                        onBlur={companyFormik.handleBlur}
                        onChange={companyFormik.handleChange}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex md:flex-row gap-2 content-center">
                      <label
                        htmlFor=""
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Address
                      </label>
                    </div>
                    <input
                      type="text"
                      id=""
                      name="addressline1"
                      value={companyFormik.values.addressline1}
                      onBlur={companyFormik.handleBlur}
                      onChange={companyFormik.handleChange}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                    />
                  </div>
                  <div className="md:grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex md:flex-row gap-2 content-center">
                        <label
                          htmlFor=""
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          P.O BOX
                        </label>
                      </div>
                      <input
                        type="text"
                        id=""
                        name="poBox"
                        value={companyFormik.values.poBox}
                        onBlur={companyFormik.handleBlur}
                        onChange={companyFormik.handleChange}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                      />
                    </div>
                    <div>
                      <div className="flex md:flex-row gap-2 content-center">
                        <label
                          htmlFor=""
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          City
                        </label>
                      </div>
                      <input
                        type="text"
                        id=""
                        name="address.city"
                        value={companyFormik.values.address.city}
                        onBlur={companyFormik.handleBlur}
                        onChange={companyFormik.handleChange}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                      />
                    </div>
                  </div>
                  <div className="md:grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex md:flex-row gap-2 content-center">
                        <label
                          htmlFor=""
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Street
                        </label>
                      </div>
                      <input
                        type="text"
                        id=""
                        name="address.street"
                        value={companyFormik.values.address.street}
                        onBlur={companyFormik.handleBlur}
                        onChange={companyFormik.handleChange}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                      />
                    </div>
                    <div>
                      <div className="flex md:flex-row gap-2 content-center">
                        <label
                          htmlFor=""
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Zip Code
                        </label>
                      </div>
                      <input
                        type="text"
                        id=""
                        name="address.zip"
                        value={companyFormik.values.address.zip}
                        onBlur={companyFormik.handleBlur}
                        onChange={companyFormik.handleChange}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="bg-white border border-primary600 hover:bg-primary50 rounded-md w-full py-3 shadow-md text-primary600 text-bodyMedium font-semibold"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </button>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="bg-primary600 hover:bg-primary800 rounded-md w-full py-3 shadow-md text-white text-bodyMedium font-semibold"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <div>Sign up</div>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
