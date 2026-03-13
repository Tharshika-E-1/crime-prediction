"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  isAdmin?: boolean
}

interface AuthContextType {
  user: User | null
  isAdminAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  adminLogin: (email: string, password: string) => Promise<boolean>
  logout: () => void
  adminLogout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  useEffect(() => {
  const savedUser = localStorage.getItem("user")
  if (savedUser) {
    setUser(JSON.parse(savedUser))
  }
}, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, accept any valid-looking credentials
    if (email && password.length >= 6) {
      setUser({
        id: "user-1",
        name: email.split("@")[0],
        email,
      })
      return true
    }
    return false
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (name && email && password.length >= 6) {
      setUser({
        id: "user-" + Date.now(),
        name,
        email,
      })
      return true
    }
    return false
  }, [])

  const adminLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Admin authentication - accepts any valid admin credentials
    if (email && password.length >= 6) {
      setIsAdminAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const adminLogout = useCallback(() => {
    setIsAdminAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdminAuthenticated, 
      login, 
      signup, 
      adminLogin, 
      logout, 
      adminLogout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
