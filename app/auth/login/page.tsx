"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, Github, Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import api from "@/components/axiosInstance"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { login, loginWithOAuth, setUser } = useAuth()
  const router = useRouter()

  // Django API login function
  const loginWithDjango = async (email: string, password: string) => {
     if (typeof window === "undefined") return null;
    try {
      const response = await api.post("/auth/login/", { email, password })
        
     
      const data = await response.data
     
      // if (!response.ok) {
      //   throw new Error(data.email?.[0] || data.password?.[0] || data.non_field_errors?.[0] || data.message || "Login failed")
      // }

      return data
    } catch (error) {
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
     if (typeof window === "undefined") return;
    setError(null)
    setSuccess(null)
    setIsLoading(true)
    

    try {
      // Call Django API for login
      const result = await loginWithDjango(email, password)
      console.log(result.tokens)
      if (result.tokens && result.user){
        // Store tokens and user data
        localStorage.setItem("access_token", result.tokens.access)
        localStorage.setItem("refresh_token", result.tokens.refresh)
        localStorage.setItem("user_data", JSON.stringify(result.user))

        setUser(result.user)
        

      }else{
        throw new Error("Invalid respone from server")
      }
      
      
      // Show success message
      setSuccess(result.message || "Login successful!")
      console.log("Redirecting to:", result.user.role)

      
      // Redirect based on user role
      setTimeout(() => {
        if (result.user.role === "admin") {
          router.push("/admin")
        } else if (result.user.role === "student") {
         router.push("/dashboard")
        } 
      }, 1500) // Give time to show success message

    } catch (error: any) {
      console.error("Login failed:", error)
      setError(error.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setOauthLoading(provider)
    setError(null)
    setSuccess(null)

    try {
      const success = await loginWithOAuth(provider)
      if (success) {
        setSuccess("Login successful!")
        setTimeout(() => {
          router.replace("/dashboard")
        }, 1500)
      }
    } catch (error) {
      console.error("OAuth login failed:", error)
      setError("OAuth login failed. Please try again.")
    } finally {
      setOauthLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-10 w-10 text-green-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">Taleem Edge</span>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue learning</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Success Message */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || success !== null}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || success !== null}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700" 
              disabled={isLoading || success !== null}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Redirecting...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={() => handleOAuthLogin("google")} 
              disabled={oauthLoading === "google" || success !== null}
            >
              {oauthLoading === "google" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleOAuthLogin("github")} 
              disabled={oauthLoading === "github" || success !== null}
            >
              {oauthLoading === "github" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Github className="mr-2 h-4 w-4" />
              )}
              GitHub
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link href="/auth/signup" className="text-green-600 hover:underline">
              Sign up
            </Link>
          </div>

          <div className="text-center text-xs text-gray-500 space-y-1">
            <p className="font-medium">Test Credentials:</p>
            <div className="bg-green-50 p-2 rounded text-left">
              <p className="text-green-700">
                <strong>Valid User:</strong>
              </p>
              <p>Email: mishi@example.com</p>
              <p>Password: StrongPass123!</p>
            </div>
            <div className="bg-red-50 p-2 rounded text-left">
              <p className="text-red-700">
                <strong>Invalid Credentials:</strong>
              </p>
              <p>Email: misbah@gmail.com</p>
              <p>Password: 1234</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}