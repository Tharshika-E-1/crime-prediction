"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SplashScreen } from "@/components/splash-screen"

export default function Home() {
  const router = useRouter()

  const handleSplashComplete = () => {
    router.push("/login")
  }

  return <SplashScreen onComplete={handleSplashComplete} />
}
