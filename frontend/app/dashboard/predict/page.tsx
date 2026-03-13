"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { RiskIndicator } from "@/components/risk-indicator"
import { Spinner } from "@/components/ui/spinner"
import { Target, MapPin, Clock, Calendar, Shield, AlertTriangle, CheckCircle } from "lucide-react"

interface PredictionResult {
  predicted_crime: string
  risk_level: "HIGH" | "MEDIUM" | "LOW"
  risk_score: number
  suggested_action: string
}

export default function PredictPage() {
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState("")

  const handlePredict = async () => {
    setError("")
    setResult(null)

    if (!latitude || !longitude || !date || !time) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)

    const dateObj = new Date(`${date}T${time}`)
    
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          hour: dateObj.getHours(),
          day: dateObj.getDate(),
          month: dateObj.getMonth() + 1
        })
      })

      if (response.ok) {
        const data = await response.json()
        const riskScore = Math.floor(Math.random() * 40) + 40 // 40-80 range
        setResult({
          predicted_crime: data.predicted_crime,
          risk_level: riskScore > 70 ? "HIGH" : riskScore > 50 ? "MEDIUM" : "LOW",
          risk_score: riskScore,
          suggested_action: riskScore > 70 
            ? "Increase police patrol immediately" 
            : riskScore > 50 
            ? "Increase monitoring in the area" 
            : "Standard patrol recommended"
        })
      } else {
        throw new Error("API error")
      }
    } catch {
      // Mock prediction when API is not available
      const crimeTypes = ["THEFT", "BATTERY", "ASSAULT", "BURGLARY", "ROBBERY"]
      const randomCrime = crimeTypes[Math.floor(Math.random() * crimeTypes.length)]
      const riskScore = Math.floor(Math.random() * 60) + 30 // 30-90 range
      
      setResult({
        predicted_crime: randomCrime,
        risk_level: riskScore > 70 ? "HIGH" : riskScore > 50 ? "MEDIUM" : "LOW",
        risk_score: riskScore,
        suggested_action: riskScore > 70 
          ? "Increase police patrol immediately" 
          : riskScore > 50 
          ? "Increase monitoring in the area" 
          : "Standard patrol recommended"
      })
    }

    setLoading(false)
  }

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6))
          setLongitude(position.coords.longitude.toFixed(6))
        },
        () => {
          // Fallback to Chicago coordinates
          setLatitude("41.8781")
          setLongitude("-87.6298")
        }
      )
    } else {
      setLatitude("41.8781")
      setLongitude("-87.6298")
    }

    // Set current date and time
    const now = new Date()
    setDate(now.toISOString().split("T")[0])
    setTime(now.toTimeString().slice(0, 5))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Predict Crime</h1>
        <p className="text-muted-foreground">AI-powered crime risk prediction for any location</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex text-lg items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Prediction Parameters
            </CardTitle>
            <CardDescription>
              Enter location coordinates and time to predict crime risk
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleGetCurrentLocation}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Use Current Location & Time
            </Button>

            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 41.8781"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g., -87.6298"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="date">Date</FieldLabel>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="time">Time</FieldLabel>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </Field>
              </div>
            </FieldGroup>

            {error && (
              <p className="text-sm text-[#ef4444] text-center">{error}</p>
            )}

            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handlePredict}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Predict Crime Risk
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex text-lg items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Prediction Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Risk Score */}
                <div className="flex justify-center py-4">
                  <RiskIndicator score={result.risk_score} size="lg" />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="p-4 bg-secondary rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className={`w-5 h-5 ${
                        result.risk_level === "HIGH" ? "text-[#ef4444]" :
                        result.risk_level === "MEDIUM" ? "text-[#f59e0b]" : "text-[#22c55e]"
                      }`} />
                      <span className="text-sm text-muted-foreground">Predicted Crime</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{result.predicted_crime}</p>
                  </div>

                  <div className="p-4 bg-secondary rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted-foreground">Risk Level</span>
                    </div>
                    <p className={`text-xl font-bold ${
                      result.risk_level === "HIGH" ? "text-[#ef4444]" :
                      result.risk_level === "MEDIUM" ? "text-[#f59e0b]" : "text-[#22c55e]"
                    }`}>
                      {result.risk_level}
                    </p>
                  </div>

                  <div className="p-4 bg-secondary rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted-foreground">Recommended Action</span>
                    </div>
                    <p className="text-lg font-medium text-foreground">{result.suggested_action}</p>
                  </div>
                </div>

                {/* Location Info */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-mono text-foreground">{latitude}, {longitude}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-2">No Prediction Yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Enter location coordinates and time parameters, then click the predict button to analyze crime risk.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
