"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useAuth } from "@/lib/auth-context"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
const crimeChartData = [
  { name: "Theft", value: 329460 },
  { name: "Battery", value: 263700 },
  { name: "Criminal Damage", value: 155455 },
  { name: "Narcotics", value: 135240 },
  { name: "Assault", value: 91289 }
]

const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#3b82f6",
  "#a855f7"
]

import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  MapPin,
  Activity,
  LogOut,
  Download
} from "lucide-react"

function AdminLogin({ onLogin }: { onLogin: () => void }) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)


  const { adminLogin } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const success = await adminLogin(email, password)

    if (success) {
      onLogin()
    } else {
      setError("Invalid admin credentials")
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">

      <Card className="w-full max-w-md shadow-xl border-border">

        <CardHeader className="text-center space-y-4">

          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Enter your admin credentials
            </CardDescription>
          </div>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-4">

            <FieldGroup>

              <Field>
                <FieldLabel>Admin Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Admin Password</FieldLabel>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>

                </div>
              </Field>

            </FieldGroup>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button className="w-full" disabled={loading}>
              {loading ? <Spinner/> : <> <Lock className="mr-2"/> Login </>}
            </Button>

          </form>

        </CardContent>

      </Card>

    </div>
  )
}



function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const exportPDF = async () => {

  const element = document.getElementById("admin-dashboard")

  if (!element) return

  const canvas = await html2canvas(element)

  const imgData = canvas.toDataURL("image/png")

  const pdf = new jsPDF("p", "mm", "a4")

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)

  pdf.save("Crimora_Admin_Report.pdf")
}

  const [stats, setStats] = useState<any>(null)
  const [recentCrimes, setRecentCrimes] = useState<any[]>([])

  useEffect(() => {

    fetch("http://127.0.0.1:5000/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data))

    fetch("http://127.0.0.1:5000/api/admin/recent-crimes")
      .then(res => res.json())
      .then(data => setRecentCrimes(data))

  }, [])


  return (
    <div id="admin-dashboard" className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Crime monitoring system</p>
        </div>

        <div className="flex gap-3">

          <Button variant="outline" onClick={exportPDF}>
            <Download className="mr-2"/> Export
          </Button>

          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2"/> Logout
          </Button>

        </div>

      </div>



      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {stats && (

          <Card>

            <CardContent className="p-6">

              <p className="text-muted-foreground">Total Crimes</p>

              <p className="text-3xl font-bold">
                {stats.total_crimes.toLocaleString()}
              </p>

            </CardContent>

          </Card>

        )}

      </div>



      {/* Main Grid */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Crimes */}

        <Card>

          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="text-red-500"/>
              Recent Crimes
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="space-y-4">

              {recentCrimes.map((crime, index) => (

                <div
                  key={index}
                  className="p-4 rounded-lg border"
                >

                  <div className="flex justify-between">

                    <span className="font-medium">
                      {crime["Primary Type"]}
                    </span>

                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                      CRIME
                    </span>

                  </div>

                  <div className="text-sm text-muted-foreground mt-1 flex gap-3">

                    <span className="flex items-center gap-1">
                      <MapPin size={14}/> {crime.Location || "Unknown"}
                    </span>

                    <span>{crime.Date}</span>

                    <span>{crime.Time}</span>

                  </div>

                </div>

              ))}

            </div>

          </CardContent>

        </Card>



        {/* System Status */}

        <Card className="h-fit">

          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Activity/>
              System Status
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Card className="bg-card border-border shadow-sm">
  <CardHeader>
    <CardTitle>Crime Distribution</CardTitle>
  </CardHeader>

  <CardContent className="h-[300px]">

    <ResponsiveContainer width="100%" height="100%">
      <PieChart>

        <Pie
          data={crimeChartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >

          {crimeChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}

        </Pie>

        <Tooltip />
        <Legend />

      </PieChart>
    </ResponsiveContainer>

  </CardContent>
</Card>

            <div className="space-y-3">

              {[
                "Prediction Engine",
                "Crime Data Feed",
                "Route Calculator",
                "Alert System",
                "Location Services"
              ].map((service) => (

                <div
                  key={service}
                  className="flex justify-between p-3 bg-secondary rounded-lg"
                >

                  <span>{service}</span>

                  <span className="text-green-500">
                    online
                  </span>

                </div>

              ))}

            </div>

          </CardContent>

        </Card>

      </div>


      {/* Activity */}

      <Card>

        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
        </CardHeader>

        <CardContent>

          <div className="space-y-3">

            {[
              "Hotspot prediction updated",
              "Crime data synchronized",
              "System optimization complete"
            ].map((item, i) => (

              <div key={i} className="p-3 bg-secondary rounded-lg">
                {item}
              </div>

            ))}

          </div>

        </CardContent>

      </Card>

    </div>
  )
}



export default function AdminPage() {

  const { isAdminAuthenticated, adminLogout } = useAuth()
  const [showDashboard, setShowDashboard] = useState(false)

  if (isAdminAuthenticated || showDashboard) {

    return (
      <AdminDashboard
        onLogout={() => {
          adminLogout()
          setShowDashboard(false)
        }}
      />
    )
  }

  return <AdminLogin onLogin={() => setShowDashboard(true)} />
}