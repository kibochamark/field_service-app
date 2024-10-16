"use client";
import React, { Suspense } from "react";
import {
  ChevronDownIcon,
  Clipboard,
  Home,
  NotebookPen,
  Users,
  Workflow,
  List,
  CheckSquare,
  Loader,
  UserPen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { handleOpen } from "../../../store/SidebarSlice";
import Technician from "../../../public/technician.png";
import Image from 'next/image';

type Menu = {
  label: string;
  name: string;
  icon: React.ReactNode;
  submenu?: Submenu[];
  href?: string;
};

type Submenu = {
  name: string;
  icon: React.ReactNode;
  href: string;
};

const TestSidebar = () => {
  const pathname = usePathname();
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
    {
      label: "Job",
      name: "Job Management",
      icon: <Clipboard size={24} className="" />,
      submenu: [
        {
          name: "Jobs",
          icon: <List size={18} className="mr-2" />,
          href: "/callpro/jobs",
        },
        {
          name: "Workflow",
          icon: <CheckSquare size={18} className="mr-2" />,
          href: "/callpro/jobworkflow",
        },
      ],
    },
    {
      label: "invoice",
      name: "Invoices",
      icon: <NotebookPen className="" />,
      submenu: [
        {
          name: "Invoices",
          icon: <NotebookPen className="" />,
          href: "/callpro/invoice",

        },
        {
          name: "Work Flow",
          icon: <CheckSquare size={18} className="mr-2" />,
          href: "/callpro/workflow",
        },
        
      ],
      
    },
    // {
    //   label: "workflow",
    //   name: "Work Flow",
    //   icon: <Workflow className="" />,
    //   href: "/callpro/workflow",
    // },
    {
      label: "workflow",
      name: "Technician",
      icon: (
        <Image
          src={Technician}  // Use the imported image here
          alt="Technician Icon"
          width={18}         // Set desired width
          height={18}        // Set desired height
          className="mr-2"   // Add className for styling if needed
        />
      ),
      href: "/callpro/technician",
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
    // {
    //   name: "Workflow",
    //   icon: <Workflow className="" />,
    //   href: "/callpro/workflow",
    // }
  ];

  const { data: session } = useSession();
  const isopen = useSelector((state: RootState) => state.sidebar.isopen);
  const dispatch = useDispatch();
  const uniqueLabels = Array.from(new Set(menus.map((menu) => menu.label)));

  return (
    <div>
      <div className="flex h-screen flex-col w-full justify-between md:border-e bg-white">
        <div className="md:px-4 lg:py-20">
          <ul className="mt-6 space-y-4">
            {uniqueLabels.map((label) =>
              menus
                .filter((menu) => menu.label === label)
                .map((menu) =>
                  menu.submenu && menu.submenu.length > 0 ? (
                    <li key={menu.name}>
                      <details className="group [&_summary::-webkit-details-marker]:hidden" open={menu.submenu.some(sub => pathname.includes(sub.href))}>
                        <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                          <span className="text-sm text-gray-700 font-medium flex items-center justify-center gap-4">
                            {menu.icon} {menu.name}
                          </span>
                          <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                            <ChevronDownIcon size={16} />
                          </span>
                        </summary>
                        <ul className="mt-2 space-y-1 px-4">
                          {menu.submenu.map((submenu, idx) => (
                            <li key={idx}>
                              <Link
                                href={submenu.href}
                                onClick={() => {
                                  isopen && dispatch(handleOpen());
                                }}
                                className={`rounded-lg flex items-start gap-4 justify-start hover:bg-gray-100 transition-all duration-500 px-4 py-2 text-sm font-medium ${pathname.includes(submenu.href)
                                    ? "bg-primary500 hover:bg-primary400 text-white"
                                    : ""
                                  }`}
                              >
                                {submenu.icon} {submenu.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  ) : (
                    <li key={menu.name}>
                      <Link
                        href={menu.href ? menu.href : ""}
                        onClick={() => {
                          isopen && dispatch(handleOpen());
                        }}
                        className={`rounded-lg flex items-center gap-4 justify-start hover:bg-gray-100 transition-all duration-500 px-4 py-2 text-sm font-medium ${pathname.includes(menu.href ?? "")
                            ? "bg-primary500 hover:bg-primary400 text-white"
                            : ""
                          }`}
                      >
                        {menu.icon} {menu.name}
                      </Link>
                    </li>
                  )
                )
            )}
          </ul>
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
          <Suspense
            fallback={<Loader className="animate animate-spin text-primary600" />}
          >
            <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                className="size-10 rounded-full object-cover"
              />

              <div>
                <p className="text-xs">
                  <strong className="block font-medium">
                    {session?.user?.name}
                  </strong>
                  <span>{session?.user?.email}</span>
                </p>
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default TestSidebar;
