'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shadcn/ui/sheet';
import { CircleUser, CircleUserRound, ClipboardList, Loader, Menu, User, User2Icon } from 'lucide-react';
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Suspense, useContext, useEffect, useState } from "react";
import * as Icon from 'react-feather';
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { ThemeContext } from "./Provider";
import { SidebarMenu } from './sidebar';
import Link from "next/link";
import TestSidebar from "@/components/layout/TestSidebar";
import { handleOpen } from "../../store/SidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { signOut, useSession } from "next-auth/react";
import { clockout } from "@/components/Clock/ClockinActions";



export default function NavbarComponent() {
    // retrieve user session
    const { data: session } = useSession()

    const router = useRouter();
    const theme = useContext(ThemeContext);
    const { setTheme } = useTheme()

    // get clock in id for this session
    const currentclockinsession = useSelector((state:RootState)=> state.clock.data)

    const onDarkModeToggle = (e: boolean) => {
        setTheme(e ? 'dark' : 'light');
        theme?.setTheme(e ? 'dark' : 'light');
    }


    const logout = async () => {
        await clockout(currentclockinsession)
        await signOut()
    }

    // retrieve sidebar state to handle small screen navigation
    const isopen = useSelector((state: RootState) => state.sidebar.isopen)
    const dispatch = useDispatch()

    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])



    return (

        // <header className="sticky top-0  z-50 flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-primary600 dark:bg-background dark:text-white text-sm py-4 dark:border-gray-600 border-b border-gray-600">
        <header className={`fixed top-0 left-0 h-16 bg-primary800 flex flex-wrap sm:flex-nowrap w-full dark:bg-background dark:text-white text-sm  right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-background/80 backdrop-blur-sm'
                : 'bg-background'
            }`}>
            <nav className="max-w-full my-2 container w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <div className="lg:hidden">
                            <Menu onClick={() => {
                                dispatch(handleOpen())
                            }} className="text-white cursor-pointer" />
                            <Sheet open={isopen} onOpenChange={() => {
                                isopen && dispatch(handleOpen())
                            }}>
                                <SheetContent side={"left"} className="w-[300px] sm:w-[340px]">
                                    <SheetHeader>
                                        <SheetTitle className='text-left text-xl font-bold ml-3 inline-flex text-primary gap-2 justify-start items-center'><ClipboardList /> DispatchRhino</SheetTitle>
                                        <SheetDescription>
                                            <TestSidebar />
                                        </SheetDescription>
                                    </SheetHeader>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <Link className="inline-flex items-center gap-2  flex-row-reverse text-xl ml-4 font-semibold text-white" href="/dashboard"><ClipboardList /> DispatchRhino</Link>
                    </div>
                    <div className="flex items-center flex-row gap-4 pr-4">
                        {/* <DarkModeSwitch
                            className='mr-2 text-white sm:block'
                            checked={theme?.theme === 'dark'}
                            onChange={onDarkModeToggle}
                            size={20} /> */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>

                                <p className="font-medium rounded-full px-3  cursor-pointer py-2 text-md bg-white text-gray-900">
                                    <Suspense fallback={<Loader className="animate animate-spin text-primary600" />}>

                                        {session ? session?.user?.name?.charAt(0).toUpperCase() : "D"}
                                    </Suspense>

                                </p>

                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => logout()} className="flex items-center cursor-pointer justify-center text-sm py-2">
                                    <span><Icon.LogOut size={15} className="mr-2" /></span> signout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </nav>
        </header>
    );



}