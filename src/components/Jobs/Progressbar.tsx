"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronRight, FileText, Users, Calendar, Star } from 'lucide-react'
import { Button } from "@/shadcn/ui/button"

interface Step {
  id: number
  title: string
  icon: React.ReactNode
}






const steps: Step[] = [
  { id: 1, title: "Create", icon: <FileText className="w-6 h-6" /> },
  { id: 2, title: "Assign", icon: <Users className="w-6 h-6" /> },
  { id: 3, title: "Schedule", icon: <Calendar className="w-6 h-6" /> },
  { id: 4, title: "Review", icon: <Star className="w-6 h-6" /> },
]

export default function AnimatedStepProgression({next, back, step, setstep}:{next:any; back:any; step:number; setstep:any;}) {
 
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2" />
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2"
          initial={{ width: '0%' }}
          animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        <div className="relative flex justify-between">
          {steps.map((test, index) => (
            <div key={test.id} className="flex flex-col items-center">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  test.id <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
                initial={false}
                animate={{
                  scale: test.id === step ? 1.2 : 1,
                  transition: { duration: 0.3 }
                }}
              >
                {test.id < step ? (
                  <Check className="w-6 h-6" />
                ) : (
                  test.icon
                )}
              </motion.div>
              <span className="mt-2 text-sm font-medium">{test.title}</span>
            </div>
          ))}
        </div>
      </div>
     
    </div>
  )
}