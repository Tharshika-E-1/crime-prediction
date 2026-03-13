"use client"

import { cn } from "@/lib/utils"
import { Shield, AlertTriangle, AlertCircle } from "lucide-react"

interface RiskIndicatorProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function RiskIndicator({ score, size = "md", showLabel = true, className }: RiskIndicatorProps) {
  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: "High", color: "#ef4444", icon: AlertTriangle }
    if (score >= 40) return { level: "Moderate", color: "#f59e0b", icon: AlertCircle }
    return { level: "Low", color: "#22c55e", icon: Shield }
  }

  const { level, color, icon: Icon } = getRiskLevel(score)

  const sizes = {
    sm: { container: "w-16 h-16", text: "text-lg", icon: "w-4 h-4", label: "text-xs" },
    md: { container: "w-24 h-24", text: "text-2xl", icon: "w-5 h-5", label: "text-sm" },
    lg: { container: "w-32 h-32", text: "text-3xl", icon: "w-6 h-6", label: "text-base" },
  }

  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className={cn("relative", sizes[size].container)}>
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-secondary"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className={sizes[size].icon} style={{ color }} />
          <span className={cn("font-bold", sizes[size].text)} style={{ color }}>
            {score}%
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="flex flex-col items-center">
          <span className={cn("font-semibold", sizes[size].label)} style={{ color }}>
            {level} Risk
          </span>
        </div>
      )}
    </div>
  )
}
