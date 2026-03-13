"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { Layers, MapPin, Flame, Target } from "lucide-react"


const CrimeMap = dynamic(() => import("@/components/crime-map"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-12rem)] bg-secondary rounded-xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
})

export default function CrimeMapPage() {
  const [crimes, setCrimes] = useState<any[]>([])
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [showMarkers, setShowMarkers] = useState(true)
  const [showPredictions, setShowPredictions] = useState(true)
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/crimes")
      .then(res => res.json())
      .then(data => {
        setCrimes(data)
        console.log("Fetched crimes:", data.length)

      })
  }, [])
  
  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Crime Map</h1>
          <p className="text-muted-foreground">Interactive crime hotspot visualization and prediction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Controls */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Map Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#ef4444]" />
                <span className="text-sm font-medium text-foreground">Heatmap</span>
              </div>
              <Switch 
                checked={showHeatmap} 
                onCheckedChange={setShowHeatmap}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Crime Markers</span>
              </div>
              <Switch 
                checked={showMarkers} 
                onCheckedChange={setShowMarkers}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#f59e0b]" />
                <span className="text-sm font-medium text-foreground">Predictions</span>
              </div>
              <Switch 
                checked={showPredictions} 
                onCheckedChange={setShowPredictions}
              />
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-2xl font-semibold text-foreground mb-3">Legend</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
                  <span className="text-sm text-muted-foreground">High Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <span className="text-sm text-muted-foreground">Medium Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
                  <span className="text-sm text-muted-foreground">Low Risk</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Click anywhere on the map to get a crime prediction for that location.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <div className="lg:col-span-3">
          <CrimeMap
            crimes={crimes} 
            showHeatmap={showHeatmap}
            showMarkers={showMarkers}
            showPredictions={showPredictions}
          />
        </div>
      </div>
    </div>
  )
}
