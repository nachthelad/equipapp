"use client"

import { motion } from "framer-motion"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export function StepIndicator({ currentStep, totalSteps, className = "" }: StepIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <motion.div
          key={index}
          className={`w-3 h-3 rounded-full transition-colors duration-300 ${
            index + 1 <= currentStep ? "bg-white" : "bg-white/30"
          }`}
          initial={{ scale: 0.8 }}
          animate={{ scale: index + 1 === currentStep ? 1.2 : 1 }}
          transition={{ duration: 0.2 }}
        />
      ))}
    </div>
  )
}
