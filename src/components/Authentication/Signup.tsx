"use client";
import { signup } from "@/app/(authentication)/signup/page";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { BuildingIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { googlsingUp } from "./Requests";
import { signIn, useSession } from "next-auth/react";
import { company } from "../company/companyserveraction";
import toast from "react-hot-toast";
import Image from "next/image";
import { Loader } from "lucide-react";

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
    password: Yup.string().min(6).required("Required"),
    confirmpassword: Yup.string().required("required").oneOf([Yup.ref('password')], "should match"),
    phonenumber: Yup.string().required("Required"),
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      console.log(values);
      return await signup(values);
    },
    onSuccess(data) {
      console.log(data)
      if (!data) {
        toast.error("user already exists!", {
          position: "top-center"

        });
      } else {
        formik.resetForm();
        toast.success("Personal Details Added Successfully", {
          position: "top-center"

        });
        router.push("/login")
      }

    },
    onError() {
      toast.error("Error, try again!", {
        position: "top-center"

      });
    },
  });

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
      phonenumber: "",
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      console.log(values);
      mutation.mutate(values);
    },
  });





  const handleGoogleSignIn = async () => {
    await signIn("google", {
      redirectTo: "/company"
    });
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
              className={`flex items-center gap-2 text-lg font-medium ${step === 1 ? "text-primary600" : "text-muted-foreground"
                }`}
              onClick={() => setStep(1)}
            >
              <UserIcon className="w-5 h-5" />
              Personal Information
            </button>

          </nav>
        </div>
        <div className="flex items-center justify-center w-full p-8 col-span-2">

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
                    {formik.touched.firstname && formik.errors.firstname && (
                      <p className="text-red-500 text-sm">{formik.errors.firstname}</p>
                    )}
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
                    {formik.touched.lastname && formik.errors.lastname && (
                      <p className="text-red-500 text-sm">{formik.errors.lastname}</p>
                    )}
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
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                  )}
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
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-500 text-sm">{formik.errors.password}</p>
                    )}
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
                    {formik.touched.confirmpassword && formik.errors.confirmpassword && (
                      <p className="text-red-500 text-sm">{formik.errors.confirmpassword}</p>
                    )}
                    <input
                      type="password"
                      id="confirm"
                      name="confirmpassword"
                      value={formik.values.confirmpassword}
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

                <div className="md:flex md:justify-between gap-4">
                  <button
                    type="submit"
                    className="bg-primary600 hover:bg-primary800 flex items-center justify-center rounded-md w-full py-3 shadow-md text-white text-bodyMedium font-semibold"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <Loader className="animate animate-spin text-center" />

                      // <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <div>Submit Details</div>
                    )}
                  </button>

                </div>
                <div className="text-center">or</div>
                <div>
                  <button
                    type="button"
                    className="bg-white gap-4 flex items-center justify-center w-full border border-purple-600 py-3 shadow-md text-bodyMedium font-semibold text-primary600 rounded-md"
                    onClick={handleGoogleSignIn}
                  >
                    <Image src={"/google.png"} width={30} height={30} alt="google svg" />

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

        </div>
      </div>
    </div>
  );
};

export default Signup;
