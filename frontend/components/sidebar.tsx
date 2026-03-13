"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { 
  LayoutDashboard, 
  Map, 
  Target, 
  BarChart3, 
  Route, 
  Shield,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Crime Map", href: "/dashboard/crime-map" },
  { icon: Target, label: "Predict Crime", href: "/dashboard/predict" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Route, label: "Safe Routes", href: "/dashboard/safe-routes" },
  { icon: UserCheck, label: "Women's Safety", href: "/dashboard/womens-safety" },  
  { icon: Shield, label: "Admin Panel", href: "/dashboard/admin" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border shadow-lg transition-all duration-300",
        collapsed ? "w-20" : "w-64",
        "w-64 lg:w-64" // Full width on mobile when open
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-0 px-6 border-b border-border min-h-[90px]">
          <Image
            src="/crimora-shield.png"
            alt="Crimora"
            width={300}
            height={300}
            className="object-contain flex-shrink-0 w-24 h-24 lg:w-28 lg:h-28"
          />
          {!collapsed && (
            <Image
              src="/crimora-text.png"
              alt="Crimora"
              width={400}
              height={100}
              className="object-contain w-[260px] lg:w-[340px] h-auto -ml-16"
              priority
            />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-lg">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-md hover:bg-secondary transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {/* Footer */}
        <div className={cn(
          "p-4 border-t border-border",
          collapsed && "flex justify-center"
        )}>
          {!collapsed ? (
            <div className="text-xs text-muted-foreground text-center w-full">
              <p>Predict. Protect. Prevail.</p>
          
            </div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          )}
        </div>
      </div>
    </aside>
  )
}
