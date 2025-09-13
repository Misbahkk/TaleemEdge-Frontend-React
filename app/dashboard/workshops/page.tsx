"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, Calendar, Clock, Users, MapPin, Star, Loader2 } from "lucide-react"

interface Workshop {
  id: string
  title: string
  description: string
  instructor: string
  date: string
  time: string
  duration: string
  capacity: number
  enrolled_students_count: number
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
  location: "Online" | "In-Person"
  price: number
  rating?: number
  image?: string
  status: 'upcoming' | 'ongoing' | 'completed'
  main_image_url?: string | null
}

interface Category {
categories: string[]
}

interface EnrollmentResponse {
  total_enrollments: number
  upcoming_workshops: number
  completed_workshops: number
  recent_enrollments: any[]
}

const levels = ["All", "Beginner", "Intermediate", "Advanced"]

// API Base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api'

export default function WorkshopsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enrolling, setEnrolling] = useState<string | null>(null)

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('access_token') // Check both possible keys
  }
  console.log("Access Token: ",localStorage.getItem('access_token'))

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = getAuthToken()
    return !!token
  }

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const token = getAuthToken()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}/workshops/categories/`)
      
      if (response.ok) {
        const data: {categories: string[]} = await response.json()
        console.log("catogeries: ",data)
        const categoryNames = ["All", ...data.categories]
        setCategories(categoryNames)
      }else if (response.status === 401) {
        console.log('Categories API requires authentication, using default categories')
        setCategories(["All", "Python Development", "Web Development", "Programming", "Data Science", "Marketing", "Finance", "Design"])
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      // Use default categories if API fails
      setCategories(["All", "Programming", "Data Science", "Marketing", "Finance", "Design", "Web Development"])
    }
  }

  // Fetch workshops from backend
  const fetchWorkshops = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory !== 'All') params.append('category', selectedCategory)
      if (selectedLevel !== 'All') params.append('level', selectedLevel.toLowerCase())

      const response = await fetch(`${API_BASE_URL}/workshops/student/?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch workshops')
      }

      const data = await response.json()
      setWorkshops(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching workshops:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch enrollment dashboard data
  const fetchEnrollmentData = async () => {
    const token = getAuthToken()
    if (!token) return

    try {
      const response = await fetch(`${API_BASE_URL}/workshops/student/dashboard/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data: EnrollmentResponse = await response.json()
        setEnrollmentData(data)
      }
    } catch (err) {
      console.error('Error fetching enrollment data:', err)
    }
  }

  // Handle workshop enrollment
  const handleEnroll = async (workshopId: string) => {
    const token = getAuthToken()
    if (!token) {
      setError('Please login to enroll in workshops')
      return
    }

    try {
      setEnrolling(workshopId)
      const response = await fetch(`${API_BASE_URL}/workshops/student/${workshopId}/enroll/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        // Update the enrolled count for the workshop
        setWorkshops(prev => 
          prev.map(workshop => 
            workshop.id === workshopId 
              ? { ...workshop, enrolled_students_count: workshop.enrolled_students_count + 1 }
              : workshop
          )
        )
        
        // Refresh enrollment data
        await fetchEnrollmentData()
        
        setError(null)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to enroll in workshop')
      }
    } catch (err) {
      setError('Failed to enroll in workshop')
      console.error('Error enrolling:', err)
    } finally {
      setEnrolling(null)
    }
  }

  // Check if user is enrolled in a workshop
  const isEnrolled = (workshopId: string) => {
    if (!enrollmentData || !enrollmentData.recent_enrollments) return false
    return enrollmentData.recent_enrollments.some(enrollment => 
      enrollment.workshop.id.toString() === workshopId
    )
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchCategories()
    fetchEnrollmentData()
  }, [])

  // Fetch workshops when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchWorkshops()
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedCategory, selectedLevel])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const getLevelVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner": return "default"
      case "intermediate": return "secondary"
      case "advanced": return "destructive"
      default: return "default"
    }
  }

  const formatLevel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
  }

  if (loading && workshops.length === 0) {
    return (
      <div className="main-content">
        <div className="page-container py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading workshops...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="main-content">
      <div className="page-container py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workshops</h1>
              <p className="text-gray-600">Join interactive workshops to enhance your skills</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">Enrolled Workshops</p>
            <p className="text-2xl font-bold text-green-600">
              {enrollmentData?.total_enrollments || 0}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Login Warning */}
        {!isLoggedIn() && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700">Please login to enroll in workshops and view your enrollments.</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search workshops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 min-w-[80px]">Category:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 min-w-[80px]">Level:</span>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <Button
                    key={level}
                    variant={selectedLevel === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLevel(level)}
                    className={selectedLevel === level ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((workshop) => (
            <Card key={workshop.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <img
                  src={workshop.main_image_url || workshop.image || "/placeholder.svg?height=200&width=300"}
                  alt={workshop.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {workshop.category}
                    </Badge>
                    <Badge variant={getLevelVariant(workshop.level)}>
                      {formatLevel(workshop.level)}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{workshop.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{workshop.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(workshop.date)} at {workshop.time || 'TBA'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {workshop.duration || 'Duration TBA'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {workshop.location || 'Location TBA'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {workshop.enrolled_students_count}/{workshop.capacity} enrolled
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {workshop.rating && (
                        <>
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium">{workshop.rating}</span>
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">by {workshop.instructor}</p>
                      <p className="font-semibold text-green-600">
                        {workshop.price === 0 ? "Free" : `$${workshop.price}`}
                      </p>
                    </div>
                  </div>

                  <Button
                    className={`w-full ${
                      isEnrolled(workshop.id)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                    onClick={() => handleEnroll(workshop.id)}
                    disabled={
                      !isLoggedIn() ||
                      isEnrolled(workshop.id) || 
                      workshop.enrolled_students_count >= workshop.capacity ||
                      enrolling === workshop.id
                    }
                  >
                    {enrolling === workshop.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {!isLoggedIn()
                      ? "Login to Enroll"
                      : isEnrolled(workshop.id)
                        ? "Enrolled"
                        : workshop.enrolled_students_count >= workshop.capacity
                          ? "Full"
                          : enrolling === workshop.id
                            ? "Enrolling..."
                            : "Enroll Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {workshops.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No workshops found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
                setSelectedLevel("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}