"use client"
import React, { Suspense } from 'react'
import { ChevronDownIcon, Home, ListVideo, Loader, Menu, Mic2, Music, Play, RadioIcon, SquareStack, User, UserPen, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/Store';
import { handleOpen } from '../../../store/SidebarSlice';

type Menu = {
    label: string
    name: string
    icon: React.ReactNode
    submenu?: Submenu[]
    href: string
}

type Submenu = {
    name: string
    icon: React.ReactNode
    href:string

}
const TestSidebar = () => {
    // get pathname
    const pathname = usePathname()
    const menus: Menu[] = [
        {
            label: "home",
            name: "Dashboard",
            icon: <Home size={24} className="" />,
            href: "/callpro/dashboard",
        },
        {
            label: "Employee management",
            name: "Employees",
            icon: <Users size={24} className="" />,
            href: "/callpro/employee",
        },
        {
            label: "Clients",
            name: "Customers",
            icon: <UserPen size={24} className="" />,
            href: "/callpro/customer",
        },


        // {
        //     label: "Library",
        //     name: "Songs",
        //     icon: <Music size={15} className="mr-2" />,
        //     href: "/home/",
        // },
        // {
        //     label: "Library",
        //     name: "Made for You",
        //     icon: <User size={15} className="mr-2" />,
        //     href: "/home/",
        // },
        // {
        //     label: "Library",
        //     name: "Artist",
        //     icon: <Mic2 size={15} className="mr-2" />,
        //     href: "/home/",
        // },
    ];

    // retrieve user session

    const { data: session } = useSession()


    // retrieve sidebar state to handle small screen navigation
    const isopen= useSelector((state:RootState)=> state.sidebar.isopen)
    const dispatch = useDispatch()

    const uniqueLabels = Array.from(new Set(menus.map((menu) => menu.label)));

    return (
        <div>
            <div className="flex h-screen flex-col w-full justify-between md:border-e bg-white">
                <div className="md:px-4 py-6">


                    <ul className="mt-6 space-y-4">
                        {uniqueLabels.map((label, index) => (
                            menus.filter((menu) => menu.label === label)
                                .map((menu) => (
                                    menu.submenu && menu.submenu.length > 0 ? (

                                        <li>
                                            <details className="group [&_summary::-webkit-details-marker]:hidden">
                                                <summary
                                                    className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                >
                                                    <span className="text-sm text-gray-700 font-medium flex items-center justify-center gap-4">{menu.icon} {menu.name} </span>

                                                    <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="size-5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </span>
                                                </summary>

                                                <ul className="mt-2 space-y-1 px-4">
                                                    {menu.submenu.map((submenu) => (
                                                        <li>
                                                            <Link
                                                                href={submenu.href}
                                                                onClick={()=>{
                                                                    isopen && dispatch(handleOpen())
                                                                }}
                                                                className={`rounded-lg flex items-start gap-4 justify-start hover:bg-gray-100 transition-all duration-500  px-4 py-2 text-sm font-medium ${pathname.includes(menu.href) ? "bg-primary500 hover:bg-primary400 text-white" : ""}`}
                                                            >
                                                                {submenu.icon}   {submenu.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </details>
                                        </li>
                                    ) : (
                                        <li>
                                            <Link
                                                href={menu.href}
                                                onClick={()=>{
                                                    isopen && dispatch(handleOpen())
                                                }}
                                                className={`rounded-lg flex items-center gap-4 justify-center hover:bg-gray-100 transition-all duration-500  px-4 py-2 text-sm font-medium ${pathname.includes(menu.href) ? "bg-primary500 hover:bg-primary400 text-white" : ""}`}
                                            >
                                                {menu.icon} {menu.name}
                                            </Link>
                                        </li>
                                    )
                                ))
                        ))}

                    </ul>
                </div>

                <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                    <Suspense fallback={<Loader className='animate animate-spin text-primary600'/>}>
                        <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
                            <img
                                alt=""
                                src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                                className="size-10 rounded-full object-cover"
                            />

                            <div>
                                <p className="text-xs">
                                    <strong className="block font-medium">{session?.user?.name}</strong>

                                    <span> {session?.user?.email} </span>
                                </p>
                            </div>
                        </div>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default TestSidebar
