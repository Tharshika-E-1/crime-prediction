"use client"

import { useState } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { SOSButton } from "@/components/sos-button"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import "leaflet/dist/leaflet.css"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar - hidden on mobile, visible on lg+ */}
        <div className={`
          fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar />
        </div>

        <Navbar />
        
        {/* Main content - responsive margins */}
        <main className="pt-16 min-h-screen lg:ml-64 transition-all duration-300">
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </main>
        
        {pathname === "/dashboard" && <SOSButton />}
      </div>
    </AuthProvider>
  )
}
