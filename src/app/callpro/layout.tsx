import React, { ReactNode } from 'react'
import NavbarComponent from '@/app/navbar'
import { SidebarMenu } from '@/app/sidebar'
import NextAuthProvider from '../NexAuthProvider'
import { Toaster } from 'react-hot-toast'

function layout({ children }: { children: ReactNode }) {
    return (
        <NextAuthProvider>
            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    // Define default options
                    className: '',
                    duration: 5000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },

                    // Default options for specific types
                    success: {
                        duration: 3000,
                    },
                }}
            />
            <div className="h-screen flex flex-col w-full">
                {/* Navbar at the top */}
                <NavbarComponent />

                <div className="flex flex-1">
                    {/* Sidebar on the left */}
                    <div className='hidden md:block'>
                        <SidebarMenu />
                    </div>
                    {/* Main content (Dashboard) on the right/center */}
                    <div className="flex-1 p-4 bg-gray-100">
                        {children}
                    </div>
                </div>
            </div>
        </NextAuthProvider>
    )
}

export default layout
