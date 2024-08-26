
import AddEmployee from '@/components/Employee/AddEmployee'
import { SidebarMenu } from "../sidebar";
import NavbarComponent from "../navbar";
import React from 'react'

const page = () => {
    return (
        <div className="h-screen flex flex-col">
      
      <NavbarComponent />

      <div className="flex flex-1">
       =
        <SidebarMenu />

       
        <div className="flex-1 p-4">
          <AddEmployee/>
        </div>
      </div>
    </div>
    )
}

export default page
