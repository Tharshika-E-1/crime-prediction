"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Shield, 
  AlertTriangle,
  Moon,
  CheckCircle,
  Route as RouteIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

const SafeRouteMap = dynamic(() => import("@/components/safe-route-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-secondary rounded-xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
})

interface RouteOption {
  id: string
  name: string
  type: "safest" | "balanced" | "fastest"
  distance: string
  duration: string
  safetyScore: number
  dangerZones: number
}

const mockRoutes: RouteOption[] = [
  {
    id: "1",
    name: "Safest Route",
    type: "safest",
    distance: "3.2 km",
    duration: "42 min",
    safetyScore: 92,
    dangerZones: 0
  },
  {
    id: "2",
    name: "Balanced Route",
    type: "balanced",
    distance: "2.5 km",
    duration: "32 min",
    safetyScore: 74,
    dangerZones: 2
  },
  {
    id: "3",
    name: "Fastest Route",
    type: "fastest",
    distance: "2.1 km",
    duration: "26 min",
    safetyScore: 45,
    dangerZones: 5
  }
]

export default function SafeRoutesPage() {
  const [startLocation, setStartLocation] = useState("")
  const [destination, setDestination] = useState("")
  const [nightMode, setNightMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [routes, setRoutes] = useState<RouteOption[]>([])
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)

  const handleFindRoutes = async () => {
    if (!startLocation || !destination) return

    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setRoutes(mockRoutes)
    setSelectedRoute(mockRoutes[0].id)
    setLoading(false)
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStartLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
        },
        () => {
          setStartLocation("41.8781, -87.6298")
        }
      )
    } else {
      setStartLocation("41.8781, -87.6298")
    }
  }

  const getRouteColor = (type: string) => {
    switch (type) {
      case "safest": return "#22c55e"
      case "balanced": return "#f59e0b"
      case "fastest": return "#ef4444"
      default: return "#0ea5e9"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Safe Routes</h1>
        <p className="text-muted-foreground">AI-powered route planning that avoids high-risk areas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex text-lg items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              Route Finder
            </CardTitle>
            <CardDescription>
              Enter your start and destination to find the safest route
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Starting Location</FieldLabel>
                <div className="space-y-2">
                  <Input
                    placeholder="Enter address or coordinates"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={handleUseCurrentLocation}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Use Current Location
                  </Button>
                </div>
              </Field>

              <Field>
                <FieldLabel>Destination</FieldLabel>
                <Input
                  placeholder="Enter destination address"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </Field>
            </FieldGroup>

            {/* Night Mode Toggle */}
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Night Safety Mode</span>
              </div>
              <Switch checked={nightMode} onCheckedChange={setNightMode} />
            </div>
            <p className="text-xs text-muted-foreground">
              Enables extra precautions for traveling at night
            </p>

            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleFindRoutes}
              disabled={loading || !startLocation || !destination}
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Finding Routes...
                </>
              ) : (
                <>
                  <RouteIcon className="w-4 h-4 mr-2" />
                  Find Safe Routes
                </>
              )}
            </Button>

            {/* Route Options */}
            {routes.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-border">
                <h4 className="font-medium text-foreground">Route Options</h4>
                {routes.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRoute(route.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all",
                      selectedRoute === route.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="font-medium"
                        style={{ color: getRouteColor(route.type) }}
                      >
                        {route.name}
                      </span>
                      {selectedRoute === route.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <RouteIcon className="w-3 h-3" />
                        {route.distance}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {route.duration}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4" style={{ color: getRouteColor(route.type) }} />
                        <span className="text-sm font-medium" style={{ color: getRouteColor(route.type) }}>
                          {route.safetyScore}% Safe
                        </span>
                      </div>
                      {route.dangerZones > 0 && (
                        <div className="flex items-center gap-1 text-[#ef4444]">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="text-xs">{route.dangerZones} danger zones</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map */}
        <div className="lg:col-span-2">
          <SafeRouteMap 
            selectedRoute={selectedRoute}
            routes={routes}
            nightMode={nightMode}
          />

          {/* Legend */}
          {routes.length > 0 && (
            <Card className="mt-4 bg-card border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-1 rounded bg-[#22c55e]" />
                      <span className="text-sm text-muted-foreground">Safe</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-1 rounded bg-[#f59e0b]" />
                      <span className="text-sm text-muted-foreground">Moderate Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-1 rounded bg-[#ef4444]" />
                      <span className="text-sm text-muted-foreground">Dangerous</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Routes updated with real-time crime data
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
