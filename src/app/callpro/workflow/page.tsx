// import { JobWorkflow } from '@/components/WorkFlow/JobworkFlow'
import MultipleWorkFlow from '@/components/WorkFlow/MultipleWorkFlow'
// import WorkFlow from '@/components/WorkFlow/WorkFlow'
import React from 'react'

const page = () => {
  return (
    <div>
        {/* <WorkFlow/> */}
        {/* <JobWorkflow currentStatus={'DRAFT'}/> */}
        <MultipleWorkFlow/>
    </div>
  )
}

export default page