"use client"
import { useState } from "react"

export type NavigationStep = 1 | 2 | 3

export function useNavigation() {
  const [step, setStep] = useState<NavigationStep>(1)

  const goToStep = (newStep: NavigationStep) => {
    setStep(newStep)
  }

  const nextStep = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as NavigationStep)
    }
  }

  const previousStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as NavigationStep)
    }
  }

  const goToStart = () => {
    setStep(1)
  }

  const isFirstStep = step === 1
  const isLastStep = step === 3

  return {
    step,
    goToStep,
    nextStep,
    previousStep,
    goToStart,
    isFirstStep,
    isLastStep,
  }
}
