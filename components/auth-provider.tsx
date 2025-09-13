"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"


const isDevelopment = process.env.NODE_ENV === 'development'
const myBaseUrl = isDevelopment ? process.env.NEXT_PUBLIC_API_BASE_URL_LOCAL : process.env.NEXT_PUBLIC_API_BASE_URL_DEPLOY


interface User {
  id: string
  name: string
  email: string
  role: "student" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  loginWithOAuth: (provider: "google" | "github") => Promise<boolean>
  logout: () => void
  isLoading: boolean
  setUser: React.Dispatch<React.SetStateAction<User | null>> 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 🔑 On refresh, check if tokens and user exist
    const savedUser = localStorage.getItem("user_data")
    const token = localStorage.getItem("access_token")

    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${myBaseUrl}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Login failed")

      // ✅ Save tokens
      localStorage.setItem("access_token", data.tokens.access)
      localStorage.setItem("refresh_token", data.tokens.refresh)

      // ✅ Save user
      setUser(data.user)
      localStorage.setItem("user_data", JSON.stringify(data.user))

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const loginWithOAuth = async (provider: "google" | "github"): Promise<boolean> => {
    // Ye abhi mock hai, baad me API integrate karna hoga
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockUser: User = {
      id: "2",
      name: `${provider} User`,
      email: `user@${provider}.com`,
      role: "student",
    }

    setUser(mockUser)
    localStorage.setItem("user_data", JSON.stringify(mockUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user_data")
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithOAuth, logout, isLoading, setUser }}>
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
