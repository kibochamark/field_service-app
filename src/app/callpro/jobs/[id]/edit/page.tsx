
import EditJobPage from '@/components/Jobs/Editjob'
import React from 'react'

const EditJob = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <EditJobPage params={params} />
    </div>
  )
}

export default EditJob