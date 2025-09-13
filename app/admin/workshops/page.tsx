"use client"

import type React from "react"
import { Suspense, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus, Edit, Trash2, Calendar, Save, X, Search, Users, Clock, MapPin, Star, DollarSign, Loader2 } from "lucide-react"
import api from "@/components/axiosInstance"

interface EnrolledStudent {
  id: number
  name: string
  email: string
  enrolled_at: string
}

interface Workshop {
  id: number
  title: string
  description: string
  instructor: string
  date: string
  time: string
  duration: string
  capacity: number
  enrolled_students_count: number
  enrolled_students: EnrolledStudent[]
  level: "beginner" | "intermediate" | "advanced"
  category: string
  location: "online" | "offline"
  price: string
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  main_image_url?: string | null
  video_url?: string | null
  main_image?: string | null
  video?: string | null
  enrolled_count: number
  created_at: string
  updated_at: string
  created_by: number
}

interface DashboardStats {
  total_workshops: number
  upcoming_workshops: number
  ongoing_workshops: number
  completed_workshops: number
  total_enrollments: number
  recent_workshops: Workshop[]
}

interface FormData {
  title: string
  description: string
  instructor: string
  date: string
  time: string
  duration: string
  capacity: string
  level: "beginner" | "intermediate" | "advanced"
  category: string
  location: "online" | "offline"
  price: string
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  main_image?: File | null
  video?: File | null
}

function AdminWorkshopsContent() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isAddingWorkshop, setIsAddingWorkshop] = useState(false)
  const [editingWorkshop, setEditingWorkshop] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    instructor: "",
    date: "",
    time: "",
    duration: "",
    capacity: "",
    level: "beginner",
    category: "",
    location: "online",
    price: "",
    status: "upcoming",
    main_image: null,
    video: null,
  })

  // Fetch initial data
  useEffect(() => {
    if (typeof window === "undefined") return;
    fetchWorkshops()
    fetchCategories()
    fetchStats()
  }, [])

  const fetchWorkshops = async () => {
    try {
      setLoading(true)
      const response = await api.get('/workshops/admin/')
      setWorkshops(response.data)
    } catch (error) {
      console.error('Error fetching workshops:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/workshops/categories/')
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/workshops/admin/dashboard/stats/')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const filteredWorkshops = workshops.filter(
    (workshop) =>
      workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddWorkshop = async () => {
    if (!formData.title || !formData.instructor || !formData.date) return

    try {
      setSubmitting(true)
      const formDataToSend = new FormData()
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'main_image' && key !== 'video' && value !== null) {
          formDataToSend.append(key, value.toString())
        }
      })
      
      // Add files if they exist
      if (formData.main_image) {
        formDataToSend.append('main_image', formData.main_image)
      }
      if (formData.video) {
        formDataToSend.append('video', formData.video)
      }

      await api.post('/workshops/admin/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      await fetchWorkshops()
      await fetchStats()
      resetForm()
    } catch (error) {
      console.error('Error creating workshop:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditWorkshop = async (id: number) => {
    try {
      const response = await api.get(`/workshops/admin/${id}/`)
      const workshop = response.data
      
      setFormData({
        title: workshop.title,
        description: workshop.description,
        instructor: workshop.instructor,
        date: workshop.date,
        time: workshop.time,
        duration: workshop.duration,
        capacity: workshop.capacity.toString(),
        level: workshop.level,
        category: workshop.category,
        location: workshop.location,
        price: workshop.price.toString(),
        status: workshop.status,
        main_image: null,
        video: null,
      })
      setEditingWorkshop(id)
    } catch (error) {
      console.error('Error fetching workshop details:', error)
    }
  }

  const handleUpdateWorkshop = async () => {
    if (!formData.title || !formData.instructor || !editingWorkshop) return

    try {
      setSubmitting(true)
      const formDataToSend = new FormData()
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'main_image' && key !== 'video' && value !== null) {
          formDataToSend.append(key, value.toString())
        }
      })
      
      // Add files if they exist
      if (formData.main_image) {
        formDataToSend.append('main_image', formData.main_image)
      }
      if (formData.video) {
        formDataToSend.append('video', formData.video)
      }

      await api.patch(`/workshops/admin/${editingWorkshop}/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      await fetchWorkshops()
      await fetchStats()
      resetForm()
    } catch (error) {
      console.error('Error updating workshop:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteWorkshop = async (id: number) => {
    if (confirm("Are you sure you want to delete this workshop?")) {
      try {
        await api.delete(`/workshops/admin/${id}/`)
        await fetchWorkshops()
        await fetchStats()
      } catch (error) {
        console.error('Error deleting workshop:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      instructor: "",
      date: "",
      time: "",
      duration: "",
      capacity: "",
      level: "beginner",
      category: "",
      location: "online",
      price: "",
      status: "upcoming",
      main_image: null,
      video: null,
    })
    setIsAddingWorkshop(false)
    setEditingWorkshop(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement
      const file = fileInput.files?.[0] || null
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      return `${displayHour}:${minutes} ${ampm}`
    } catch {
      return time
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workshop Management</h1>
            <p className="text-gray-600">Create and manage educational workshops</p>
          </div>
        </div>
        <Button onClick={() => setIsAddingWorkshop(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Workshop
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats?.total_workshops || 0}</p>
            <p className="text-sm text-gray-600">Total Workshops</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats?.total_enrollments || 0}</p>
            <p className="text-sm text-gray-600">Total Enrollments</p>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {(isAddingWorkshop || editingWorkshop) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{isAddingWorkshop ? "Create New Workshop" : "Edit Workshop"}</CardTitle>
            <CardDescription>
              {isAddingWorkshop ? "Add a new workshop to the platform" : "Update workshop information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Workshop Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter workshop title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor *</Label>
                <Input
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  placeholder="Instructor name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Workshop description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 6 hours"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="Max participants"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="online">Online</option>
                  <option value="offline">In-Person</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="main_image">Workshop Image</Label>
                <Input
                  id="main_image"
                  name="main_image"
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video">Workshop Video</Label>
                <Input
                  id="video"
                  name="video"
                  type="file"
                  accept="video/*"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={isAddingWorkshop ? handleAddWorkshop : handleUpdateWorkshop}
                className="bg-green-600 hover:bg-green-700"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {submitting 
                  ? (isAddingWorkshop ? "Creating..." : "Updating...") 
                  : (isAddingWorkshop ? "Create Workshop" : "Update Workshop")
                }
              </Button>
              <Button variant="outline" onClick={resetForm} disabled={submitting}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workshops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkshops.map((workshop) => (
          <Card key={workshop.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <img
                src={workshop.main_image_url || workshop.main_image || "/placeholder.svg?height=200&width=300"}
                alt={workshop.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary">{workshop.category}</Badge>
                  <Badge className={getStatusColor(workshop.status)}>
                    {workshop.status.charAt(0).toUpperCase() + workshop.status.slice(1)}
                  </Badge>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{workshop.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{workshop.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(workshop.date).toLocaleDateString()} at {formatTime(workshop.time)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {workshop.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {workshop.location.charAt(0).toUpperCase() + workshop.location.slice(1)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {workshop.enrolled_students_count}/{workshop.capacity} enrolled
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Badge variant="outline" className="capitalize">
                      {workshop.level}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">by {workshop.instructor}</p>
                    <p className="font-semibold text-green-600 flex items-center">
                      <DollarSign className="h-3 w-3" />
                      {parseFloat(workshop.price) === 0 ? "Free" : workshop.price}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEditWorkshop(workshop.id)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteWorkshop(workshop.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkshops.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm
              ? "No workshops found matching your search."
              : "No workshops created yet. Click 'Create Workshop' to get started."}
          </p>
        </div>
      )}
    </div>
  )
}

export default function AdminWorkshopsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminWorkshopsContent />
    </Suspense>
  )
}