"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import api from "@/components/axiosInstance"
import { Plus, Edit, Trash2, Users, Save, X, Search, Star, MapPin, Calendar, MessageCircle, CheckCircle, Upload, Image } from "lucide-react"
import { profile } from "console"

interface Mentor {
  id: number
  full_name: string
  email: string
  job_title: string
  company: string
  years_of_experience: number
  bio: string
  location: string
  availability: string
  expertise_areas: string
  expertise_areas_list: string[]
  specializations: string
  specializations_list: string[]
  languages: string
  languages_list: string[]
  linkedin_profile?: string
  profile_picture?: string
  profile_picture_url?: string
  status: "approved" | "pending" | "rejected"
  created_at: string
}

const API_BASE_URL = "http://127.0.0.1:8000/api"

export default function AdminMentorshipPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(false)
  const [isAddingMentor, setIsAddingMentor] = useState(false)
  const [editingMentor, setEditingMentor] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    job_title: "",
    company: "",
    years_of_experience: "",
    bio: "",
    location: "",
    availability: "",
    expertise_areas: "",
    specializations: "",
    languages: "",
    linkedin_profile: "",
  })

  const statusOptions = ["All", "approved", "pending", "rejected"]

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB')
        return
      }

      setSelectedFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  // Fetch mentors from API
  const fetchMentors = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/mentore/`)
      const data = await response.data
      setMentors(data)
    } catch (err) {
      setError('Failed to load mentors')
      console.error('Error fetching mentors:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load mentors on component mount
  useEffect(() => {
     if (typeof window === "undefined") return;
    fetchMentors()
  }, [])

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.job_title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || mentor.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleAddMentor = async () => {
    if (!formData.full_name || !formData.email || !formData.job_title) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      // Create FormData for file upload
      const mentorData = new FormData()
      
      // Append form fields
      mentorData.append('full_name', formData.full_name)
      mentorData.append('email', formData.email)
      mentorData.append('job_title', formData.job_title)
      mentorData.append('company', formData.company)
      mentorData.append('years_of_experience', formData.years_of_experience || '0')
      mentorData.append('bio', formData.bio)
      mentorData.append('location', formData.location)
      mentorData.append('availability', formData.availability)
      mentorData.append('expertise_areas', formData.expertise_areas)
      mentorData.append('specializations', formData.specializations)
      mentorData.append('languages', formData.languages)
      mentorData.append('linkedin_profile', formData.linkedin_profile)
      
      // Append profile picture if selected
      if (selectedFile) {
        mentorData.append('profile_picture', selectedFile)
      }

      const response = await api.post('/mentore/', mentorData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      const newMentor = response.data
      setMentors([...mentors, newMentor])
      setSuccessMessage("Mentor added successfully!")
      resetForm()
    } catch (err) {
      setError('Failed to add mentor')
      console.error('Error adding mentor:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditMentor = async (id: number) => {
    setLoading(true)
    try {
      const response = await api.get(`/mentore/${id}/`)
      const mentor = await response.data
      
      setFormData({
        full_name: mentor.full_name,
        email: mentor.email,
        job_title: mentor.job_title,
        company: mentor.company,
        years_of_experience: mentor.years_of_experience.toString(),
        bio: mentor.bio,
        location: mentor.location,
        availability: mentor.availability,
        expertise_areas: mentor.expertise_areas,
        specializations: mentor.specializations,
        languages: mentor.languages,
        linkedin_profile: mentor.linkedin_profile || "",
      })
      
      // Set existing profile picture as preview
      if (mentor.profile_picture_url) {
        setPreviewUrl(mentor.profile_picture_url)
      }
      
      setEditingMentor(id)
    } catch (err) {
      setError('Failed to load mentor details')
      console.error('Error fetching mentor:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateMentor = async () => {
    try {
      // Create FormData for file upload
      const mentorData = new FormData()
      
      // Append form fields
      mentorData.append('full_name', formData.full_name)
      mentorData.append('email', formData.email)
      mentorData.append('job_title', formData.job_title)
      mentorData.append('company', formData.company)
      mentorData.append('years_of_experience', formData.years_of_experience || '0')
      mentorData.append('bio', formData.bio)
      mentorData.append('location', formData.location)
      mentorData.append('availability', formData.availability)
      mentorData.append('expertise_areas', formData.expertise_areas)
      mentorData.append('specializations', formData.specializations)
      mentorData.append('languages', formData.languages)
      mentorData.append('linkedin_profile', formData.linkedin_profile)
      
      // Append profile picture if a new one is selected
      if (selectedFile) {
        mentorData.append('profile_picture', selectedFile)
      }

      const response = await api.patch(`/mentore/${editingMentor}/`, mentorData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      const updatedMentor = response.data
      setMentors(mentors.map(mentor => 
        mentor.id === editingMentor ? updatedMentor : mentor
      ))
      setSuccessMessage("Mentor updated successfully!")
      resetForm()
    } catch (err) {
      setError("Failed to update mentor")
      console.error("Error updating mentor:", err)
    }
  }

  // 🗑️ DELETE mentor
  const handleDeleteMentor = async (id: number) => {
    if (!confirm("Are you sure you want to remove this mentor? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    try {
      await api.delete(`/mentore/${id}/`)

      setMentors(mentors.filter(mentor => mentor.id !== id))
      setSuccessMessage("Mentor deleted successfully!")
    } catch (err) {
      setError("Failed to delete mentor")
      console.error("Error deleting mentor:", err)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Approve mentor
  const handleApproveMentor = async (id: number) => {
    setLoading(true)
    try {
      const response = await api.post("/mentore/bulk-approve/", {
        mentor_ids: [id],
        action: "approve",
      })

      await fetchMentors()
      setSuccessMessage(response.data.message)
    } catch (err) {
      setError("Failed to approve mentor")
      console.error("Error approving mentor:", err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      full_name: "",
      email: "",
      job_title: "",
      company: "",
      years_of_experience: "",
      bio: "",
      location: "",
      availability: "",
      expertise_areas: "",
      specializations: "",
      languages: "",
      linkedin_profile: "",
    })
    setSelectedFile(null)
    setPreviewUrl(null)
    setIsAddingMentor(false)
    setEditingMentor(null)
    setError("")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mentorship Management</h1>
            <p className="text-gray-600">Manage mentor profiles and mentorship programs</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsAddingMentor(true)} 
          className="bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Mentor
        </Button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search mentors by name, company, or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {mentors.filter((m) => m.status === "approved").length}
            </p>
            <p className="text-sm text-gray-600">Active Mentors</p>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {(isAddingMentor || editingMentor) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{isAddingMentor ? "Add New Mentor" : "Edit Mentor"}</CardTitle>
            <CardDescription>
              {isAddingMentor ? "Add a new mentor to the platform" : "Update mentor information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Picture Upload Section */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <Label className="text-base font-medium">Profile Picture</Label>
              
              <div className="flex items-start space-x-4">
                {/* Current/Preview Image */}
                <div className="flex-shrink-0">
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                        onClick={removeSelectedFile}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="profile-picture-upload"
                    />
                    <Label
                      htmlFor="profile-picture-upload"
                      className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {previewUrl ? "Change Picture" : "Upload Picture"}
                    </Label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Recommended: Square image, at least 200x200px. Max size: 5MB.
                    Supported formats: JPG, PNG, GIF
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="mentor@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title *</Label>
                <Input
                  id="job_title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years_of_experience">Years of Experience</Label>
                <Input
                  id="years_of_experience"
                  name="years_of_experience"
                  type="number"
                  value={formData.years_of_experience}
                  onChange={handleInputChange}
                  placeholder="Years of experience"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Brief professional bio"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Karachi, Pakistan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Input
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  placeholder="e.g., Weekends, Evenings"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expertise_areas">Expertise Areas (comma-separated)</Label>
                <Textarea
                  id="expertise_areas"
                  name="expertise_areas"
                  value={formData.expertise_areas}
                  onChange={handleInputChange}
                  placeholder="Software Development, Machine Learning"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                <Textarea
                  id="specializations"
                  name="specializations"
                  value={formData.specializations}
                  onChange={handleInputChange}
                  placeholder="Full Stack Development, AI/ML"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="languages">Languages (comma-separated)</Label>
                <Textarea
                  id="languages"
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  placeholder="English, Urdu"
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin_profile">LinkedIn Profile (optional)</Label>
              <Input
                id="linkedin_profile"
                name="linkedin_profile"
                value={formData.linkedin_profile}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={isAddingMentor ? handleAddMentor : handleUpdateMentor}
                className="bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : isAddingMentor ? "Add Mentor" : "Update Mentor"}
              </Button>
              <Button variant="outline" onClick={resetForm} disabled={loading}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && !isAddingMentor && !editingMentor && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading mentors...</p>
        </div>
      )}

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={mentor.profile_picture_url || "/placeholder.svg?height=150&width=150"}
                  alt={mentor.full_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{mentor.full_name}</h3>
                    <Badge className={getStatusColor(mentor.status)}>
                      {mentor.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{mentor.job_title}</p>
                  <p className="text-sm text-gray-500">{mentor.company}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {mentor.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {mentor.availability}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
                  {mentor.years_of_experience} years experience
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {mentor.expertise_areas_list?.slice(0, 2).map((exp, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {exp}
                  </Badge>
                )) || mentor.expertise_areas.split(', ').slice(0, 2).map((exp, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {exp}
                  </Badge>
                ))}
                {(mentor.expertise_areas_list?.length || mentor.expertise_areas.split(', ').length) > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{(mentor.expertise_areas_list?.length || mentor.expertise_areas.split(', ').length) - 2}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => handleEditMentor(mentor.id)}
                  disabled={loading}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                {mentor.status === "pending" && (
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700" 
                    onClick={() => handleApproveMentor(mentor.id)}
                    disabled={loading}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleDeleteMentor(mentor.id)}
                  disabled={loading}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMentors.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm
              ? "No mentors found matching your search."
              : "No mentors added yet. Click 'Add Mentor' to get started."}
          </p>
        </div>
      )}
    </div>
  )
}