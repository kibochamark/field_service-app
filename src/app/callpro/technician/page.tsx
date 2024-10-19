import { getTechicianJob } from '@/components/technian/ServerAction';
import Technician from '@/components/technian/Technician'
import TechnicianT from '@/components/technian/TechnicianT'
import React from 'react'

const page = async() => {
  const technicianData = await getTechicianJob();

  // console.log(technicianData, "the data tech");


  return (
    <div>
        {/* <Technician/> */}
        <TechnicianT technicianData={technicianData}/>

    </div>
  )
}

export default page