"use client"

import { useState, useEffect, useRef } from "react"
import { AlertTriangle, X, MapPin, Phone, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface SOSButtonProps {
  onActivate?: (location: { lat: number; lng: number }) => void
}

export function SOSButton({ onActivate }: SOSButtonProps) {
  const [isActive, setIsActive] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [countdown, setCountdown] = useState(5)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Function to play emergency alert sound
  const playAlertSound = () => {
    try {
      // Create AudioContext for generating alert sound
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      audioContextRef.current = audioContext
      
      const playBeep = (startTime: number, frequency: number, duration: number) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = frequency
        oscillator.type = "square"
        
        gainNode.gain.setValueAtTime(0.3, startTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
        
        oscillator.start(startTime)
        oscillator.stop(startTime + duration)
      }
      
      // Play emergency siren pattern (alternating frequencies)
      const now = audioContext.currentTime
      for (let i = 0; i < 6; i++) {
        playBeep(now + i * 0.3, i % 2 === 0 ? 800 : 600, 0.25)
      }
    } catch (error) {
      console.error("Could not play alert sound:", error)
    }
  }

  useEffect(() => {
    if (showConfirm && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (showConfirm && countdown === 0) {
      activateSOS()
    }
  }, [showConfirm, countdown])

  const handleSOSClick = () => {
    setShowConfirm(true)
    setCountdown(5)
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => {
          // Fallback location (Chicago)
          setLocation({ lat: 41.8781, lng: -87.6298 })
        }
      )
    } else {
      setLocation({ lat: 41.8781, lng: -87.6298 })
    }
  }

  const activateSOS = () => {
    // Play alert sound
    playAlertSound()
    
    setIsActive(true)
    setShowConfirm(false)
    if (location && onActivate) {
      onActivate(location)
    }
  }

  const cancelSOS = () => {
    setShowConfirm(false)
    setIsActive(false)
    setCountdown(5)
    // Close audio context if exists
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
  }

  return (
    <>
      {/* SOS Button */}
      <button
        onClick={handleSOSClick}
        disabled={isActive}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full flex items-center justify-center",
          "shadow-lg transition-all duration-300",
          isActive 
            ? "bg-[#ef4444] animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.5)]" 
            : "bg-gradient-to-br from-[#ef4444] to-[#dc2626] hover:scale-110 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
        )}
      >
        <div className="flex flex-col items-center text-white">
          <AlertTriangle className="w-8 h-8" />
          <span className="text-xs font-bold mt-1">SOS</span>
        </div>
      </button>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-[#ef4444] text-2xl flex items-center justify-center gap-2">
              <AlertTriangle className="w-8 h-8" />
              Emergency SOS
            </DialogTitle>
            <DialogDescription className="text-center">
              An emergency alert will be sent to nearby authorities with your location.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="text-6xl font-bold text-[#ef4444]">{countdown}</div>
            <p className="text-sm text-muted-foreground">Alert will be sent automatically...</p>
            
            {location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Location captured: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={cancelSOS}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white"
              onClick={activateSOS}
            >
              <Phone className="w-4 h-4 mr-2" />
              Send Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Active SOS Panel */}
      {isActive && (
        <div className="fixed bottom-32 right-6 z-50 w-80 bg-card border border-[#ef4444] rounded-xl shadow-lg p-4 animate-in slide-in-from-right">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-[#ef4444]">
              <Radio className="w-5 h-5 animate-pulse" />
              <span className="font-bold">SOS ACTIVE</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#ef4444] hover:text-[#ef4444] hover:bg-[#ef4444]/10"
              onClick={cancelSOS}
            >
              End
            </Button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-secondary rounded-lg">
              <span className="text-muted-foreground">Status</span>
              <span className="text-[#22c55e] font-medium">Broadcasting</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-secondary rounded-lg">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium text-foreground">Tracking...</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-secondary rounded-lg">
              <span className="text-muted-foreground">Nearest Station</span>
              <span className="font-medium text-foreground">0.8 km</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
