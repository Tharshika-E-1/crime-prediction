"use client"

import { useEffect } from "react"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    // Show splash for exactly 6 seconds then redirect
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
    <Image
      src="/crimora-splash.png"
      alt="Crimora - Predict. Protect. Prevail."
      width={700}
      height={500}
      className="object-contain"
      priority
    />
  </div>
)
}
