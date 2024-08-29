'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shadcn/ui/sheet';
import { CircleUserRound, ClipboardList, Menu, User, User2Icon } from 'lucide-react';
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import * as Icon from 'react-feather';
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { ThemeContext } from "./Provider";
import { SidebarMenu } from './sidebar';
import Link from "next/link";
import TestSidebar from "@/components/layout/TestSidebar";
import { handleOpen } from "../../store/SidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/Store";



export default function NavbarComponent() {

    const router = useRouter();
    const theme = useContext(ThemeContext);
    const { setTheme } = useTheme()

    const onDarkModeToggle = (e: boolean) => {
        setTheme(e ? 'dark' : 'light');
        theme?.setTheme(e ? 'dark' : 'light');
    }


    const logout = () => {
        localStorage.removeItem('user');

        router.replace('/');
        router.refresh();
    }

    // retrieve sidebar state to handle small screen navigation
    const isopen = useSelector((state: RootState) => state.sidebar.isopen)
    const dispatch = useDispatch()

    return (
        <header className="sticky top-0  z-50 flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-primary dark:bg-background dark:text-white text-sm py-4 dark:border-gray-600 border-b border-gray-600">
            <nav className="max-w-full w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
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
                                        <SheetTitle className='text-left text-xl font-bold ml-3 inline-flex text-primary gap-2 justify-start items-center'><ClipboardList /> HouseCall</SheetTitle>
                                        <SheetDescription>
                                            <TestSidebar />
                                        </SheetDescription>
                                    </SheetHeader>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <Link className="inline-flex items-center gap-2  flex-row-reverse text-xl ml-4 font-semibold text-white" href="/dashboard"><ClipboardList /> HouseCall</Link>
                    </div>
                    <div className="flex items-center flex-row-reverse gap-4 pr-4">
                        <DarkModeSwitch
                            className='mr-2 text-white sm:block'
                            checked={theme?.theme === 'dark'}
                            onChange={onDarkModeToggle}
                            size={20} />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Link className="font-medium text-white" href="#" aria-current="page">
                                    <CircleUserRound className="w-8 h-8" />
                                </Link>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => logout()} className="text-red-400 py-2">
                                    <span><Icon.LogOut size={15} className="mr-2" /></span> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </nav>
        </header>
    );



}