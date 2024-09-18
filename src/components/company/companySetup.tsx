"use client";
import { useMutation } from "@tanstack/react-query";
import { Formik, useFormik } from "formik";
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
import Select from "react-select";
import { countries } from "countries-list"; // Can use a list with country codes and flags
import { parsePhoneNumberFromString } from "libphonenumber-js";



const countryOptions = Object.entries(countries).map(([code, country]: any) => ({
    label: (
        <div className="flex items-center">
            <img src={`https://flagcdn.com/16x12/${code.toLowerCase()}.png`} alt={country.name} className="mr-2" />
            {country.name}
        </div>
    ),
    value: code,
    countryCode: country.phone,
}));

const industryOptions = [
    { value: 'hvac', label: 'HVAC (Heating, Ventilation, and Air Conditioning)' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical Services' },
    { value: 'landscaping', label: 'Landscaping' },
    { value: 'pest-control', label: 'Pest Control' },
    { value: 'cleaning', label: 'Cleaning Services' },
    { value: 'appliance-repair', label: 'Appliance Repair' },
    { value: 'it-networking', label: 'IT and Networking' },
    { value: 'telecommunications', label: 'Telecommunications' },
    { value: 'security-systems', label: 'Security Systems' },
    { value: 'automotive-repair', label: 'Automotive Repair' },
    { value: 'construction', label: 'Construction' },
    { value: 'facilities-management', label: 'Facilities Management' },
    { value: 'solar-energy', label: 'Solar Energy Services' },
    { value: 'roofing', label: 'Roofing' },
    { value: 'locksmith', label: 'Locksmith Services' },
    { value: 'painting', label: 'Painting Services' },
    { value: 'pool-maintenance', label: 'Pool Maintenance' },
    { value: 'property-management', label: 'Property Management' },
    { value: 'general-contracting', label: 'General Contracting' },
];



const CompanySetup = ({ size }: { size: any }) => {
    const router = useRouter()

    const [selectedCountry, setSelectedCountry] = useState<any>(null);



    // get client session
    const { data: session, status, update } = useSession()




    const sizeoptions = Object.keys(size)?.map((key: string, idx: number) => {
        return <option key={idx} value={size[key] as string}>{key}</option>
    })

    const CompanySchema: any = Yup.object().shape({});

    const companyFormik = useFormik({
        initialValues: {
            name: "",
            description: "",
            companySize: "",
            email: "",
            poBox: "",
            addressline1: "",
            address: "",
            stateinfo: {
                city: "",
                zip: "",
                state: ""
            },
        },
        onSubmit: (values) => {
            console.log(values);
            companyMutation.mutate(values);
        },
    });



    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const phoneNumber = e.target.value;
        if (selectedCountry) {
            // Validate phone number with country code
            const parsedNumber = parsePhoneNumberFromString(phoneNumber, selectedCountry.value);
            if (parsedNumber && parsedNumber.isValid()) {
                companyFormik.setFieldValue("addressline1", `${selectedCountry.countryCode}${phoneNumber}`);
            } else {
                companyFormik.setFieldError("addressline1", "Invalid phone number");
            }
        }


    };

    // Function to extract and clean up the error message
    const getReadableErrorMessage = (error:any) => {
        // Extract the error message, which may vary in format
        const rawMessage = error?.error[0] || "An unexpected error occurred";

        // Clean up the error message (e.g., remove quotes, structure it better)
        const readableMessage = rawMessage.replace(/\"/g, '').replace(/\./g, ' ');

        return readableMessage;
    };

    const companyMutation = useMutation({
        mutationFn: async (values: any) => {
            return await company(values);
        },
        onSuccess(data) {

            if (data.status !== "success") {
                toast.error(getReadableErrorMessage(data.message), {
                    position: "top-center",
                });
            } else {
                update({ hascompany: true, company: data?.data?.id })

                toast.success("Company created  Successfully", {
                    position: "top-center",
                });
                toast.success("you will be redirected shortly", {
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
                            {companyFormik.touched.name && companyFormik.errors.name && (
                                <p className="text-sm text-red-600">{companyFormik.errors.name}</p>
                            )}
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
                                Company Email Address
                            </label>
                        </div>
                        {companyFormik.touched.email && companyFormik.errors.email && (
                            <p className="text-sm text-red-600">{companyFormik.errors.email}</p>
                        )}
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
                            {companyFormik.touched.description && companyFormik.errors.description && (
                                <p className="text-sm text-red-600">{companyFormik.errors.description}</p>)}

                            <Select
                                options={industryOptions}
                                onChange={(option) => companyFormik.setFieldValue("description", option?.value)}
                                placeholder="Select industry"
                                isSearchable
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full"

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
                            {companyFormik.touched.companySize && companyFormik.errors.companySize && (
                                <p className="text-sm text-red-600">{companyFormik.errors.companySize}</p>
                            )}
                            <select
                                name="companySize"
                                value={companyFormik.values.companySize}
                                onBlur={companyFormik.handleBlur}
                                onChange={companyFormik.handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary">
                                <option>Choose company size</option>
                                {sizeoptions}
                            </select>
                        </div>
                    </div>
                    <div className="mb-2 md:mb-0">
                        {/* Phone Number */}
                        <div className="flex md:flex-row gap-2 content-center">
                            <label
                                htmlFor=""
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Company Contact
                            </label>
                        </div>
                        <div className="flex gap-4 mb-4">
                            <div className="w-1/3">
                                <Select
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full"
                                    options={countryOptions}
                                    onChange={(option) => setSelectedCountry(option)}
                                    placeholder="Select country"
                                />
                            </div>
                            <div className="w-2/3">
                                <input
                                    type="text"
                                    placeholder="769347882"
                                    onChange={handlePhoneNumberChange}
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "

                                />
                            </div>
                        </div>
                        {companyFormik.errors.addressline1 && <p className="text-red-400">{companyFormik.errors.addressline1}</p>}

                        {/* Country */}
                        <div>
                            <div className="flex md:flex-row gap-2 content-center">
                                <label
                                    htmlFor=""
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Country
                                </label>
                            </div>
                            {companyFormik.touched.stateinfo?.state && companyFormik.errors.stateinfo?.state && (
                                <p className="text-sm text-red-600">{companyFormik.errors.stateinfo?.state}</p>
                            )}
                            <Select
                                options={countryOptions}
                                onChange={(option) => companyFormik.setFieldValue("stateinfo.state", option?.label.toLocaleString())}
                                placeholder="Select country"
                                isSearchable
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
                        {companyFormik.touched.address && companyFormik.errors.address && (
                            <p className="text-sm text-red-600">{companyFormik.errors.address}</p>
                        )}
                        <input
                            type="text"
                            id=""
                            name="address"
                            value={companyFormik.values.address}
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
                            {companyFormik.touched.poBox && companyFormik.errors.poBox && (
                                <p className="text-sm text-red-600">{companyFormik.errors.poBox}</p>
                            )}
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
                            {companyFormik.touched?.stateinfo?.city && companyFormik.errors.stateinfo?.city && (
                                <p className="text-sm text-red-600">{companyFormik.errors.stateinfo?.city}</p>
                            )}
                            <input
                                type="text"
                                id=""
                                name="stateinfo.city"
                                value={companyFormik.values.stateinfo.city}
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
                                Zip code
                            </label>
                        </div>
                        {companyFormik.touched?.stateinfo?.zip && companyFormik.errors.stateinfo?.zip && (
                            <p className="text-sm text-red-600">{companyFormik.errors.stateinfo?.zip}</p>
                        )}
                        <input
                            type="text"
                            id=""
                            name="stateinfo.zip"
                            value={companyFormik.values?.stateinfo?.zip}
                            onBlur={companyFormik.handleBlur}
                            onChange={companyFormik.handleChange}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                        />
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
