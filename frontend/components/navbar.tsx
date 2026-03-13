"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Bell, User, LogIn, UserPlus, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const [notifications] = useState([
    { id: 1, message: "High crime risk detected in Zone A", time: "2 min ago", type: "warning" },
    { id: 2, message: "New crime incident reported", time: "15 min ago", type: "alert" },
    { id: 3, message: "Hotspot data updated", time: "1 hour ago", type: "info" },
  ])
  
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 bg-card/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Spacer for mobile menu button */}
        
        <div className="text-4xl font-extrabold text-gray-500 tracking-tight" style={{ fontFamily: "Times New Roman, Times, serif" }} >
  Crimora – AI-Powered Crime Intelligence & Hotspot Prediction
</div>
  

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ef4444] text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-3 py-2 border-b border-border">
                <h4 className="font-semibold text-foreground">Notifications</h4>
              </div>
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <span className="text-sm text-foreground">{notification.message}</span>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {user ? (
                  <User className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <div className="px-3 py-2 border-b border-border">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/signup" className="flex items-center">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                 
                 
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
