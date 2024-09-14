import { auth } from '@/auth'
import { getEmployees } from '@/components/Employee/EmployeeActions'
import { EmployeeManagement } from '@/components/Employee/EmployeeManagement'
import { baseUrl } from '@/utils/constants'
import axios from 'axios'
import React from 'react'


const page = async() => {    

  return (
    <div className='w-full min-h-screen'>
      <EmployeeManagement />
    </div>
  )
}

export default page
