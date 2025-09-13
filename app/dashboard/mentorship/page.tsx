"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import api from "@/components/axiosInstance" 
import { Search, Users, Star, MapPin, Calendar, MessageCircle, Filter, Loader2 } from "lucide-react"

interface Mentor {
  id: number
  expertise_areas_list: string[]
  specializations_list: string[]
  languages_list: string[]
  profile_picture_url: string
  full_name: string
  email: string
  job_title: string
  company: string
  years_of_experience: number
  bio: string
  location: string
  availability: string
  expertise_areas: string
  specializations: string
  languages: string
  linkedin_profile: string
  profile_picture: string
  status: string
  created_at: string
}



// Helper function to get authentication token
const getAuthToken = () => {
  // Try to get token from localStorage first
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken') || 
           localStorage.getItem('access_token') || 
           localStorage.getItem('token')
  }
  return null
}

// Helper function to get authorization headers
const getAuthHeaders = () => {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    // Try both Bearer and Token format
    headers['Authorization'] = `Bearer ${token}`
    // Some Django APIs use Token instead of Bearer
    // headers['Authorization'] = `Token ${token}`
  }
  
  return headers
}

export default function MentorshipPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState("All")
  const [connectedMentors, setConnectedMentors] = useState<number[]>([])
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [loadingMentorDetail, setLoadingMentorDetail] = useState(false)

  // Fetch all mentors
  const fetchMentors = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // const response = await fetch(`${API_BASE_URL}/mentors/`, {
      //   method: 'GET',
      //   headers: getAuthHeaders(),
      // })
      const response = await api.get("/mentore/student/mentors/")
      
      // if (!response.ok) {
      //   if (response.status === 401) {
      //     throw new Error('Authentication required. Please login again.')
      //   }
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      
      // const data = await response.json()
      // setMentors(data)
      setMentors(response.data)
    } catch (err) {
      console.error('Error fetching mentors:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch mentors')
    } finally {
      setLoading(false)
    }
  }

  // Fetch mentor details by ID
  const fetchMentorDetails = async (mentorId: number) => {
    try {
      setLoadingMentorDetail(true)
      
      // const response = await fetch(`${API_BASE_URL}/mentors/${mentorId}/`, {
      //   method: 'GET',
      //   headers: getAuthHeaders(),
      // })
      
      // if (!response.ok) {
      //   if (response.status === 401) {
      //     throw new Error('Authentication required. Please login again.')
      //   }
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      
      // const data = await response.json()
      const response = await api.get(`/mentore/student/mentors/${mentorId}/`)
      setSelectedMentor(response.data)
    } catch (err) {
      console.error('Error fetching mentor details:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch mentor details')
    } finally {
      setLoadingMentorDetail(false)
    }
  }

  // Load mentors on component mount
  useEffect(() => {
    fetchMentors()
  }, [])

  // Get unique expertise areas for filtering
  const expertiseAreas = ["All", ...Array.from(new Set(
    mentors.flatMap(mentor => mentor.expertise_areas_list)
  ))]

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise_areas_list.some((exp) => exp.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesExpertise =
      selectedExpertise === "All" || 
      mentor.expertise_areas_list.some((exp) => exp.includes(selectedExpertise))
    
    return matchesSearch && matchesExpertise
  })

  const handleConnect = (mentorId: number) => {
    setConnectedMentors((prev) => [...prev, mentorId])
    // Here you can add API call to actually connect with mentor
  }

  const isConnected = (mentorId: number) => connectedMentors.includes(mentorId)

  const handleViewProfile = async (mentor: Mentor) => {
    await fetchMentorDetails(mentor.id)
  }

  // Loading state
  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center space-x-4 p-6 border-b bg-white">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mentorship Programs</h1>
            <p className="text-gray-600">Connect with industry experts and experienced professionals</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Loading mentors...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center space-x-4 p-6 border-b bg-white">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mentorship Programs</h1>
            <p className="text-gray-600">Connect with industry experts and experienced professionals</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <Button onClick={fetchMentors} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center space-x-4 p-6 border-b bg-white">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mentorship Programs</h1>
          <p className="text-gray-600">Connect with industry experts and experienced professionals</p>
        </div>
      </div>

      {selectedMentor && (
        <div className="p-6 border-b bg-gray-50">
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <img
                    src={selectedMentor.profile_picture_url || "/placeholder.svg"}
                    alt={selectedMentor.full_name}
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=80"
                    }}
                  />
                  <div>
                    <CardTitle>{selectedMentor.full_name}</CardTitle>
                    <CardDescription>
                      {selectedMentor.job_title} at {selectedMentor.company}
                    </CardDescription>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-sm text-gray-600">{selectedMentor.years_of_experience} years exp.</span>
                      <span className="text-sm text-gray-600">{selectedMentor.email}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedMentor(null)}>
                  {loadingMentorDetail ? <Loader2 className="h-4 w-4 animate-spin" /> : "Close Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-gray-600">{selectedMentor.bio}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMentor.specializations_list.map((spec, index) => (
                      <Badge key={index} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMentor.languages_list.map((lang, index) => (
                      <Badge key={index} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Expertise Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMentor.expertise_areas_list.map((area, index) => (
                    <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedMentor.location}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {selectedMentor.availability}
                  </span>
                </div>
                <div className="flex gap-2">
                  {selectedMentor.linkedin_profile && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedMentor.linkedin_profile, '_blank')}
                    >
                      LinkedIn
                    </Button>
                  )}
                  <Button
                    className={`${
                      isConnected(selectedMentor.id)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                    onClick={() => handleConnect(selectedMentor.id)}
                    disabled={isConnected(selectedMentor.id)}
                  >
                    {isConnected(selectedMentor.id) ? "Connected" : "Connect"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="p-6 w-full">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg border p-6 mb-6 w-full">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search mentors by name, company, expertise, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {/* Filter Buttons */}
            <div className="w-full">
              <div className="flex items-center gap-3 mb-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by Expertise:</span>
              </div>
              <div className="flex flex-wrap gap-2 w-full">
                {expertiseAreas.map((expertise) => (
                  <Button
                    key={expertise}
                    variant={selectedExpertise === expertise ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedExpertise(expertise)}
                    className={`${
                      selectedExpertise === expertise
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {expertise}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-500">
              Showing {filteredMentors.length} mentor{filteredMentors.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={mentor.profile_picture_url || "/placeholder.svg"}
                    alt={mentor.full_name}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64"
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{mentor.full_name}</h3>
                    <p className="text-sm text-gray-600">{mentor.job_title}</p>
                    <p className="text-sm text-gray-500">{mentor.company}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">{mentor.years_of_experience} years exp.</span>
                  <Badge variant="outline" className="text-xs">
                    {mentor.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {mentor.expertise_areas_list.slice(0, 2).map((exp, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {exp}
                    </Badge>
                  ))}
                  {mentor.expertise_areas_list.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{mentor.expertise_areas_list.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {mentor.location}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {mentor.availability}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => handleViewProfile(mentor)}
                    disabled={loadingMentorDetail}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {loadingMentorDetail ? "Loading..." : "View Profile"}
                  </Button>
                  <Button
                    size="sm"
                    className={`flex-1 ${
                      isConnected(mentor.id) ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                    }`}
                    onClick={() => handleConnect(mentor.id)}
                    disabled={isConnected(mentor.id)}
                  >
                    {isConnected(mentor.id) ? (
                      "Connected"
                    ) : (
                      <>
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No mentors found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm("")
                setSelectedExpertise("All")
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