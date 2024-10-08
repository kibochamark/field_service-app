"use client"
import ErrorComponent from '@/components/GlobalComponents/ErrorComponent';
import React from 'react'

const error = ({error, reset}:{error: Error & { digest?: string }; reset: () => void}) => {
  return (
    <div>
      <ErrorComponent error={error} reset={reset}/>
    </div>
  )
}

export default error
