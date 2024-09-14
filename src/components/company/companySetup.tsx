"use client";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { BuildingIcon, Loader, LogOut, MoveLeftIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/shadcn/ui/tooltip"
import { signOut, useSession } from "next-auth/react";
import { company } from "./companyserveraction";
import toast from "react-hot-toast";


const CompanySetup = () => {
    const router = useRouter()

    // get client session
    const { data: session, status, update } = useSession()



    const CompanySchema: any = Yup.object().shape({});

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
                state: ""
            },
        },
        onSubmit: (values) => {
            console.log(values);
            companyMutation.mutate(values);
        },
    });


    const companyMutation = useMutation({
        mutationFn: async (values: any) => {
            return await company(values);
        },
        onSuccess(data) {

            if (data.status !== "success") {
                toast.error("Something went wrong", {
                    position: "top-center",
                });
            } else {
                update({ hascompany: true, company:data?.data?.id })

                toast.success("Company Details Added Successfully", {
                    position: "top-center",
                });
                companyFormik.resetForm();
                setTimeout(() => {
                    router.push("/callpro/dashboard");
                }, 4000)

            }

        },
        onError(error) {

            toast.error("Error, try again!", {
                position: "top-center",
            });
        },
    });


    return (
        <div className="w-full relative max-w-lg mx-auto my-6">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <LogOut className="md:absolute w-8 h-8 hover:cursor-pointer hover:text-primary800 transition-all duration-300 -left-20 rotate-180 m-2.5" onClick={async () => {
                            await signOut()
                        }} />

                    </TooltipTrigger>
                    <TooltipContent>
                        <p>sign out</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <form action="" onSubmit={companyFormik.handleSubmit}>
                <div className="w-full max-w-lg space-y-4 md:space-x-0  p-4 my-4 md:my-0">
                    <div className="text-center">
                        <h1 className="text-headlineLarge font-bold">
                            Tell us about your company
                        </h1>
                        <p className="text-titleSmall">Company Information</p>
                    </div>
                    <div className="md:grid md:grid-cols-2 gap-6">
                        <div className="mb-2 md:mb-0">
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
                        <div className="mb-2 md:mb-0">
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
                    <div className="mb-2 md:mb-0">
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
                        <div className="mb-2 md:mb-0">
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
                        <div className="mb-2 md:mb-0">
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
                    <div className="mb-2 md:mb-0">
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
                        <div className="mb-2 md:mb-0">
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
                        <div className="mb-2 md:mb-0">
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
                    <div className="mb-2 md:mb-0">
                        <div className="flex md:flex-row gap-2 content-center">
                            <label
                                htmlFor=""
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Country
                            </label>
                        </div>
                        <input
                            type="text"
                            id=""
                            name="address.state"
                            value={companyFormik.values.address.state}
                            onBlur={companyFormik.handleBlur}
                            onChange={companyFormik.handleChange}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                        />
                    </div>
                    <div className="md:grid md:grid-cols-2 gap-6">
                        <div className="mb-2 md:mb-0">
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

                        <div className="mb-2 md:mb-0">
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
                            type="submit"
                            className="bg-primary600 flex items-center justify-center hover:bg-primary800 rounded-md w-full py-3 shadow-md text-white text-bodyMedium font-semibold"
                            disabled={companyMutation.isPending}
                        >
                            {companyMutation.isPending ? (
                                <Loader className="animate animate-spin text-center" />

                                // <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <div>Submit</div>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CompanySetup
