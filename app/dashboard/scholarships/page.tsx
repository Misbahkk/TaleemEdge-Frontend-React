"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import api from "@/components/axiosInstance"
import { Search, Award, Calendar, DollarSign, ExternalLink, BookOpen, Users, Clock, AlertCircle } from "lucide-react"

// Types based on your API response
interface Scholarship {
  id: number
  title: string
  description:string
  provider: string
  amount: string
  deadline: string
  category: string
  academic_level: string
  country: string
  status: string
  has_applied: boolean
  application_status: string | null
  application_url:string
  total_applications: number
  is_full: boolean
  max_applicants: number
}

interface ScholarshipDetail {
  id: number
  title: string
  provider: string
  description: string
  amount: string
  deadline: string
  category: string
  max_applicants: number
  academic_level: string
  country: string
  application_url: string
  eligibility_criteria: string
  eligibility_criteria_list: string[]
  requirements: string
  requirements_list: string[]
  benefits: string
  benefits_list: string[]
  status: string
  created_at: string
  total_applications: number
  is_full: boolean
}

interface Stats {
  total_available_scholarships: number
  user_total_applications: number
  user_pending_applications: number
  user_approved_applications: number
}

interface ApiResponse {
  scholarships: Scholarship[]
  stats: Stats
}

interface ScholarshipDetailResponse {
  scholarship: ScholarshipDetail
  has_applied: boolean
  application_status: string | null
  can_apply: boolean
}

const categories = ["All", "Merit Based", "Need Based", "Diversity", "Research", "International"]
const levels = ["All", "undergraduate", "graduate", "phd"]

export default function DynamicScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipDetailResponse | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Replace with your actual base URL and authentication token
  const BASE_URL = "http://127.0.0.1:8000"
  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust based on your auth method
    'Content-Type': 'application/json',
  })

  // Fetch scholarships list
  const fetchScholarships = async () => {
    try {
      setLoading(true)
      setError(null)
      // const response = await fetch(`${BASE_URL}/api/scholarship/student/`, {
      //   headers: getAuthHeaders(),
      // })
      
      // if (!response.ok) {
      //   if (response.status === 401) {
      //     throw new Error('Authentication required. Please login.')
      //   }
      //   throw new Error(`Failed to fetch scholarships: ${response.statusText}`)
      // }
      const response = await api.get(`/scholarship/student/`)
      
      
      const data: ApiResponse = await response.data
      setScholarships(data.scholarships)
      setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch scholarships')
    } finally {
      setLoading(false)
    }
  }

  // Fetch scholarship details
  const fetchScholarshipDetail = async (id: number) => {
    try {
      setLoadingDetail(true)
      // const response = await fetch(`${BASE_URL}/api/scholarship/student/${id}/`, {
      //   headers: getAuthHeaders(),
      // })
      
      // if (!response.ok) {
      //   throw new Error(`Failed to fetch scholarship details: ${response.statusText}`)
      // }
      const response = await api.get(`/scholarship/student/${id}/`)
      
      
      const data: ScholarshipDetailResponse = await response.data
      setSelectedScholarship(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch scholarship details')
    } finally {
      setLoadingDetail(false)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    fetchScholarships()
  }, [])

  // Filter scholarships
  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || scholarship.category === selectedCategory
    const matchesLevel = selectedLevel === "All" || scholarship.academic_level === selectedLevel
    return matchesSearch && matchesCategory && matchesLevel
  })

  // Handle application redirect
  const handleApply = (scholarship: Scholarship) => {
    // If scholarship has application_url, redirect there
    // Otherwise, you might want to handle internal application process
    window.open(scholarship.application_url || '#', '_blank')
  }

  // Calculate days until deadline
  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get application status color
  const getApplicationStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="main-content">
        <div className="page-container py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Loading scholarships...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="page-container py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Scholarships</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={fetchScholarships} className="bg-green-600 hover:bg-green-700">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
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
              <h1 className="text-2xl font-bold text-gray-900">Scholarship Opportunities</h1>
              <p className="text-gray-600">Discover and apply for educational scholarships</p>
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-2 gap-4 text-right">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total_available_scholarships}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Applied</p>
                <p className="text-2xl font-bold text-green-600">{stats.user_total_applications}</p>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-blue-600" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold">{stats.user_total_applications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold">{stats.user_pending_applications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-green-600" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold">{stats.user_approved_applications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-600">Available</p>
                    <p className="text-2xl font-bold">{stats.total_available_scholarships}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Scholarship Detail Modal */}
        {selectedScholarship && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-green-600" />
                    {selectedScholarship.scholarship.title}
                    {selectedScholarship.has_applied && (
                      <Badge className={`ml-2 ${getApplicationStatusColor(selectedScholarship.application_status)}`}>
                        {selectedScholarship.application_status || 'Applied'}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>by {selectedScholarship.scholarship.provider}</CardDescription>
                  <p className="text-sm text-gray-600 mt-2">{selectedScholarship.scholarship.description}</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedScholarship(null)}>
                  Close Details
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingDetail ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading details...</p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Requirements</h4>
                      <ul className="space-y-1">
                        {selectedScholarship.scholarship.requirements_list?.map((req, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Benefits</h4>
                      <ul className="space-y-1">
                        {selectedScholarship.scholarship.benefits_list?.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedScholarship.scholarship.eligibility_criteria_list?.map((criteria, index) => (
                        <Badge key={index} variant="outline" className="bg-green-100 text-green-800">
                          {criteria}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          {selectedScholarship.scholarship.total_applications}/{selectedScholarship.scholarship.max_applicants} applied
                        </span>
                      </div>
                      {selectedScholarship.scholarship.is_full && (
                        <Badge variant="destructive">Full</Badge>
                      )}
                    </div>
                    {selectedScholarship.can_apply && !selectedScholarship.has_applied && (
                      <Button 
                        onClick={() => window.open(selectedScholarship.scholarship.application_url, '_blank')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply Now
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search scholarships..."
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
                    {level === "All" ? "All" : level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => {
            const daysLeft = getDaysUntilDeadline(scholarship.deadline)
            return (
              <Card key={scholarship.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{scholarship.title}</CardTitle>
                      <CardDescription>{scholarship.provider}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {scholarship.category}
                      </Badge>
                      <Badge className={getStatusColor(scholarship.status)}>
                        {scholarship.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-green-600">
                        
                        <CardDescription>{scholarship.description}</CardDescription>
                      </span>
                      
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-green-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        PKR {parseFloat(scholarship.amount).toLocaleString()}
                      </span>
                      <Badge variant="outline">
                        {scholarship.academic_level.charAt(0).toUpperCase() + scholarship.academic_level.slice(1)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(scholarship.deadline).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          daysLeft <= 7
                            ? "bg-red-100 text-red-700"
                            : daysLeft <= 30
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {scholarship.total_applications}/{scholarship.max_applicants} applied
                      </span>
                      {scholarship.is_full && (
                        <Badge variant="destructive" className="text-xs">Full</Badge>
                      )}
                    </div>
                  </div>

                  {scholarship.has_applied && (
                    <div className="flex items-center justify-center">
                      <Badge className={getApplicationStatusColor(scholarship.application_status)}>
                        Application: {scholarship.application_status || 'Submitted'}
                      </Badge>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => fetchScholarshipDetail(scholarship.id)}
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                    <Button
                      size="sm"
                      className={`flex-1 ${
                        scholarship.has_applied
                          ? "bg-gray-400 cursor-not-allowed"
                          : scholarship.is_full
                            ? "bg-gray-400 cursor-not-allowed"
                            : daysLeft <= 0
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                      onClick={() => handleApply(scholarship)}
                      disabled={scholarship.has_applied || scholarship.is_full || daysLeft <= 0}
                    >
                      {scholarship.has_applied ? (
                        "Applied"
                      ) : scholarship.is_full ? (
                        "Full"
                      ) : daysLeft <= 0 ? (
                        "Expired"
                      ) : (
                        <>
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Apply
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredScholarships.length === 0 && !loading && (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No scholarships found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}