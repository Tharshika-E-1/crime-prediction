"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RiskIndicator } from "@/components/risk-indicator"
import { 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

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
  AreaChart,
  Area
} from "recharts"

export default function DashboardPage() {

  const [dashboardData, setDashboardData] = useState<any | null>(null)

  useEffect(() => {

    fetch("http://127.0.0.1:5000/api/dashboard")
      .then(res => res.json())
      .then(data => {
        console.log("Dashboard Data:", data)
        setDashboardData(data)
      })

  }, [])

  if (!dashboardData) {
    return <div className="p-6">Loading dashboard...</div>
  }
  const COLORS = [
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6"
]
  const crimeDistribution = Object.entries(dashboardData.top_crimes).map(
    ([crime, count]: any, index) => ({
      name: crime,
      value: count,
      color: COLORS[index % COLORS.length]
    })
  )

  const monthlyTrend = [
    { month: "Jan", crimes: 200 },
    { month: "Feb", crimes: 240 },
    { month: "Mar", crimes: 310 },
    { month: "Apr", crimes: 280 },
    { month: "May", crimes: 360 },
    { month: "Jun", crimes: 400 },
  ]

  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of crime intelligence and analytics
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-[#22c55e]/10 text-[#22c55e] rounded-lg">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"/>
          <span className="text-sm font-medium">System Active</span>
        </div>

      </div>


      {/* Statistic Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Crimes */}

        <Card>
          <CardContent className="p-6">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-lg font-semibold text-muted-foreground">
                  Total Crimes
                </p>

                <p className="text-3xl font-bold mt-1">
                  {dashboardData.total_crimes.toLocaleString()}
                </p>

                <div className="flex items-center gap-1 mt-2 text-[#22c55e]">
                  <ArrowDownRight className="w-4 h-4"/>
                  <span className="text-sm">Dataset statistics</span>
                </div>

              </div>

              <AlertTriangle className="w-8 h-8 text-primary"/>

            </div>

          </CardContent>
        </Card>


        {/* Most Frequent Crime */}

        <Card>
          <CardContent className="p-6">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-lg font-semibold text-muted-foreground">
                  Most Frequent Crime
                </p>

                <p className="text-3xl font-bold mt-1">
                  {dashboardData.most_common_crime}
                </p>

                <p className="text-sm text-muted-foreground mt-2">
                  Based on dataset
                </p>
              </div>

              <ShieldAlert className="w-8 h-8 text-[#f59e0b]"/>

            </div>

          </CardContent>
        </Card>


        {/* High Risk Crimes */}

        <Card>
          <CardContent className="p-6">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-lg font-semibold text-muted-foreground">
                  High Risk Crimes
                </p>

                <p className="text-3xl font-bold mt-1">
                  {dashboardData.high_risk.toLocaleString()}
                </p>

                <div className="flex items-center gap-1 mt-2 text-[#ef4444]">
                  <ArrowUpRight className="w-4 h-4"/>
                  <span className="text-sm">Danger zones</span>
                </div>

              </div>

              <MapPin className="w-8 h-8 text-[#ef4444]"/>

            </div>

          </CardContent>
        </Card>


        {/* Medium Risk */}

        <Card>
          <CardContent className="p-6">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-lg font-semibold text-muted-foreground">
                  Medium Risk Crimes
                </p>

                <p className="text-3xl font-bold mt-1">
                  {dashboardData.medium_risk.toLocaleString()}
                </p>

                <div className="flex items-center gap-1 mt-2 text-primary">
                  <TrendingUp className="w-4 h-4"/>
                  <span className="text-sm">Moderate alerts</span>
                </div>

              </div>

              <TrendingUp className="w-8 h-8 text-primary"/>

            </div>

          </CardContent>
        </Card>

      </div>



      {/* Charts Section */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Crime Distribution */}

        <Card>

          <CardHeader>
            <CardTitle>Crime Distribution</CardTitle>
          </CardHeader>

          <CardContent>

            <div className="h-[280px]">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={crimeDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                  >

                    {crimeDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color}/>
                    ))}

                  </Pie>

                  <Tooltip/>

                </PieChart>

              </ResponsiveContainer>

            </div>

          </CardContent>

        </Card>


        {/* Crime Trend */}

        <Card className="lg:col-span-2">

          <CardHeader>
            <CardTitle>Crime Trend</CardTitle>
          </CardHeader>

          <CardContent>

            <div className="h-[300px]">

              <ResponsiveContainer width="100%" height="100%">

                <AreaChart data={monthlyTrend}>

                  <CartesianGrid strokeDasharray="3 3"/>

                  <XAxis dataKey="month"/>

                  <YAxis/>

                  <Tooltip/>

                  <Area
                    type="monotone"
                    dataKey="crimes"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.3}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          </CardContent>

        </Card>

      </div>


      {/* Risk Indicator */}

      <Card>

        <CardHeader>
          <CardTitle>Current Area Risk</CardTitle>
        </CardHeader>

        <CardContent className="flex justify-center py-8">

          <RiskIndicator score={72} size="lg"/>

        </CardContent>

      </Card>

    </div>

  )

}