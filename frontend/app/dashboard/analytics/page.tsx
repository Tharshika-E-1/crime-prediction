"use client"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Filter, Download, RefreshCw, BarChart3 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"

// Mock data
const crimeByType = [
  { name: "Theft", value: 2450, color: "#0ea5e9" },
  { name: "Battery", value: 1823, color: "#f59e0b" },
  { name: "Assault", value: 1245, color: "#ef4444" },
  { name: "Burglary", value: 987, color: "#06b6d4" },
  { name: "Robbery", value: 654, color: "#8b5cf6" },
  { name: "Vandalism", value: 432, color: "#22c55e" },
]

const monthlyTrend = [
  { month: "Jan", theft: 245, battery: 180, assault: 120 },
  { month: "Feb", theft: 238, battery: 165, assault: 105 },
  { month: "Mar", theft: 312, battery: 198, assault: 145 },
  { month: "Apr", theft: 287, battery: 175, assault: 130 },
  { month: "May", theft: 356, battery: 210, assault: 165 },
  { month: "Jun", theft: 398, battery: 245, assault: 180 },
  { month: "Jul", theft: 425, battery: 278, assault: 195 },
  { month: "Aug", theft: 378, battery: 256, assault: 175 },
  { month: "Sep", theft: 342, battery: 223, assault: 155 },
  { month: "Oct", theft: 298, battery: 198, assault: 140 },
  { month: "Nov", theft: 276, battery: 178, assault: 125 },
  { month: "Dec", theft: 265, battery: 165, assault: 115 },
]

const hourlyData = [
  { hour: "00:00", count: 145 },
  { hour: "01:00", count: 98 },
  { hour: "02:00", count: 78 },
  { hour: "03:00", count: 65 },
  { hour: "04:00", count: 58 },
  { hour: "05:00", count: 72 },
  { hour: "06:00", count: 135 },
  { hour: "07:00", count: 178 },
  { hour: "08:00", count: 245 },
  { hour: "09:00", count: 312 },
  { hour: "10:00", count: 287 },
  { hour: "11:00", count: 298 },
  { hour: "12:00", count: 378 },
  { hour: "13:00", count: 345 },
  { hour: "14:00", count: 356 },
  { hour: "15:00", count: 398 },
  { hour: "16:00", count: 425 },
  { hour: "17:00", count: 478 },
  { hour: "18:00", count: 512 },
  { hour: "19:00", count: 489 },
  { hour: "20:00", count: 423 },
  { hour: "21:00", count: 356 },
  { hour: "22:00", count: 287 },
  { hour: "23:00", count: 198 },
]

const locationData = [
  { location: "Downtown", incidents: 2856 },
  { location: "North Side", incidents: 2142 },
  { location: "West Loop", incidents: 1823 },
  { location: "South Shore", incidents: 1687 },
  { location: "Lincoln Park", incidents: 1234 },
  { location: "Hyde Park", incidents: 987 },
  { location: "Logan Square", incidents: 876 },
  { location: "Wicker Park", incidents: 765 },
]

const riskFactors = [
  { factor: "Time of Day", score: 85 },
  { factor: "Location", score: 92 },
  { factor: "Day of Week", score: 68 },
  { factor: "Weather", score: 45 },
  { factor: "Events", score: 72 },
  { factor: "Population", score: 78 },
]

export default function AnalyticsPage() {
  const [crimeType, setCrimeType] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("all")
  const [data, setData] = useState<any>(null)
  const [prediction, setPrediction] = useState<any>(null)
  const exportPDF = async () => {

  const element = document.getElementById("analytics-report")

  if (!element) return

  const canvas = await html2canvas(element)

  const imgData = canvas.toDataURL("image/png")

  const pdf = new jsPDF("p", "mm", "a4")

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width
  pdf.text("Crimora Crime Intelligence Report", 10, 10)

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)

  pdf.save("crimora-analytics-report.pdf")
}

useEffect(() => {
  fetch("http://127.0.0.1:5000/api/analytics")
    .then(res => res.json())
    .then(result => {
      setData(result)
    })
}, [])
const crimeByType = data
  ? Object.entries(data.crime_distribution).map(([crime, count]) => ({
      name: crime,
      value: count,
      color: "#0ea5e9"
    }))
  : []

const monthlyTrend = data
  ? Object.entries(data.monthly_trend).map(([month, count]) => ({
      month: month,
      theft: count
    }))
  : []
if (!data) {
  return <div className="p-6">Loading analytics...</div>
}
const COLORS = [
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4"
]

const handlePredict = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        crime_type: crimeType,
        date_from: dateFrom,
        date_to: dateTo,
        time: time,
        location: location
      })
    })

    const result = await response.json()

    setPrediction(result)

  } catch (error) {
    console.error("Prediction error:", error)
  }
}
  return (
    <div id="analytics-report" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Comprehensive crime data analysis and insights</p>
        </div>
        <div className="flex items-center gap-2">
          
          <Button variant="outline" size="sm" onClick={exportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-lg text-foreground">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Field>
              <FieldLabel>Crime Type</FieldLabel>
              <Select value={crimeType} onValueChange={setCrimeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="theft">Theft</SelectItem>
                  <SelectItem value="battery">Battery</SelectItem>
                  <SelectItem value="assault">Assault</SelectItem>
                  <SelectItem value="burglary">Burglary</SelectItem>
                  <SelectItem value="robbery">Robbery</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>From Date</FieldLabel>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>To Date</FieldLabel>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </Field>
            <Field>
  <FieldLabel>Time</FieldLabel>
  <Input
    type="time"
    value={time}
    onChange={(e) => setTime(e.target.value)}
  />
</Field>
            
            <Field>
              <FieldLabel>Location</FieldLabel>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="downtown">North</SelectItem>
                  <SelectItem value="north">South</SelectItem>
                  <SelectItem value="south">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end mt-4">
  
  

</div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crime Distribution */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Crime Distribution by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={crimeByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {crimeByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {crimeByType.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle>Crime Trends by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="theft" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="battery" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="assault" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Frequency */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle>Crime Frequency by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="var(--muted-foreground)" 
                    fontSize={10}
                    interval={3}
                  />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorHourly)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Peak crime hours: 5PM - 8PM
            </p>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle>Top Crime Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis 
                    dataKey="location" 
                    type="category" 
                    stroke="var(--muted-foreground)" 
                    fontSize={11}
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="incidents" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors Radar */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle>Risk Factor Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={riskFactors}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis 
                  dataKey="factor" 
                  stroke="var(--muted-foreground)" 
                  fontSize={12}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                />
                <Radar
                  name="Risk Score"
                  dataKey="score"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Location and time of day are the strongest predictors of crime risk
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
