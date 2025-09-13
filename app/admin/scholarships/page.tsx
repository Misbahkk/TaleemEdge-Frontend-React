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
import { Plus, Edit, Trash2, Award, Save, X, Search, DollarSign, Calendar, Users, ExternalLink, Loader2 } from "lucide-react"
import api from "@/components/axiosInstance"

interface Scholarship {
  id: number
  title: string
  description?: string
  provider: string
  amount: string
  deadline: string
  eligibility_criteria?: string
  eligibility_criteria_list?: string[]
  category: string
  academic_level: "undergraduate" | "graduate" | "phd" | "all"
  country: string
  application_url?: string
  requirements?: string
  requirements_list?: string[]
  benefits?: string
  benefits_list?: string[]
  status: "active" | "closed" | "upcoming" | "expired"
  total_applications: number
  max_applicants?: number
  is_full: boolean
  created_at: string
}

interface ApiResponse {
  scholarships: Scholarship[]
  stats: {
    total_scholarships: number
    active_scholarships: number
    upcoming_scholarships: number
    closed_scholarships: number
    total_applications: number
  }
}

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [stats, setStats] = useState({
    total_scholarships: 0,
    active_scholarships: 0,
    upcoming_scholarships: 0,
    closed_scholarships: 0,
    total_applications: 0
  })
  const [loading, setLoading] = useState(true)
  const [isAddingScholarship, setIsAddingScholarship] = useState(false)
  const [editingScholarship, setEditingScholarship] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    provider: "",
    amount: "",
    deadline: "",
    eligibility_criteria: "",
    category: "",
    academic_level: "all" as "undergraduate" | "graduate" | "phd" | "all",
    country: "",
    application_url: "",
    requirements: "",
    benefits: "",
    status: "upcoming" as "active" | "closed" | "upcoming" | "expired",
    max_applicants: "",
  })

  const statusOptions = ["All", "active", "closed", "upcoming", "expired"]

  // Fetch scholarships from API
  const fetchScholarships = async () => {
    try {
      setLoading(true)
      const response = await api.get<ApiResponse>('/scholarship/admin/')
      setScholarships(response.data.scholarships)
      setStats(response.data.stats)
    } catch (error) {
      console.error('Error fetching scholarships:', error)
      alert('Failed to fetch scholarships. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScholarships()
  }, [])

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (scholarship.description && scholarship.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === "All" || scholarship.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleAddScholarship = async () => {
    if (!formData.title || !formData.provider || !formData.deadline) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        title: formData.title,
        provider: formData.provider,
        description: formData.description,
        amount: parseFloat(formData.amount) || 0,
        deadline: formData.deadline + 'T23:59:59Z',
        category: formData.category,
        max_applicants: formData.max_applicants ? parseInt(formData.max_applicants) : null,
        academic_level: formData.academic_level,
        country: formData.country,
        application_url: formData.application_url,
        eligibility_criteria: formData.eligibility_criteria,
        requirements: formData.requirements,
        benefits: formData.benefits,
        status: formData.status,
      }

      await api.post('/scholarship/admin/', payload)
      await fetchScholarships() // Refresh the list
      resetForm()
      alert('Scholarship created successfully!')
    } catch (error) {
      console.error('Error creating scholarship:', error)
      alert('Failed to create scholarship. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditScholarship = async (id: number) => {
    try {
      const response = await api.get(`/scholarship/admin/${id}/`)
      const scholarship = response.data.scholarship
      
      setFormData({
        title: scholarship.title,
        description: scholarship.description || "",
        provider: scholarship.provider,
        amount: scholarship.amount.toString(),
        deadline: scholarship.deadline.split('T')[0], // Convert to YYYY-MM-DD format
        eligibility_criteria: scholarship.eligibility_criteria || "",
        category: scholarship.category,
        academic_level: scholarship.academic_level,
        country: scholarship.country,
        application_url: scholarship.application_url || "",
        requirements: scholarship.requirements || "",
        benefits: scholarship.benefits || "",
        status: scholarship.status,
        max_applicants: scholarship.max_applicants?.toString() || "",
      })
      setEditingScholarship(id)
    } catch (error) {
      console.error('Error fetching scholarship details:', error)
      alert('Failed to fetch scholarship details. Please try again.')
    }
  }

  const handleUpdateScholarship = async () => {
    if (!formData.title || !formData.provider || !editingScholarship) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        title: formData.title,
        provider: formData.provider,
        description: formData.description,
        amount: parseFloat(formData.amount) || 0,
        deadline: formData.deadline + 'T23:59:59Z',
        category: formData.category,
        max_applicants: formData.max_applicants ? parseInt(formData.max_applicants) : null,
        academic_level: formData.academic_level,
        country: formData.country,
        application_url: formData.application_url,
        eligibility_criteria: formData.eligibility_criteria,
        requirements: formData.requirements,
        benefits: formData.benefits,
        status: formData.status,
      }

      await api.put(`/scholarship/admin/${editingScholarship}/`, payload)
      await fetchScholarships() // Refresh the list
      resetForm()
      alert('Scholarship updated successfully!')
    } catch (error) {
      console.error('Error updating scholarship:', error)
      alert('Failed to update scholarship. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteScholarship = async (id: number) => {
    if (!confirm("Are you sure you want to delete this scholarship? This action cannot be undone.")) {
      return
    }

    try {
      await api.delete(`/scholarship/admin/${id}/`)
      await fetchScholarships() // Refresh the list
      alert('Scholarship deleted successfully!')
    } catch (error) {
      console.error('Error deleting scholarship:', error)
      alert('Failed to delete scholarship. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      provider: "",
      amount: "",
      deadline: "",
      eligibility_criteria: "",
      category: "",
      academic_level: "all",
      country: "",
      application_url: "",
      requirements: "",
      benefits: "",
      status: "upcoming",
      max_applicants: "",
    })
    setIsAddingScholarship(false)
    setEditingScholarship(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatAmount = (amount: string) => {
    return parseFloat(amount).toLocaleString()
  }

  const getEligibilityDisplay = (scholarship: Scholarship) => {
    if (scholarship.eligibility_criteria_list && scholarship.eligibility_criteria_list.length > 0) {
      return scholarship.eligibility_criteria_list
    }
    if (scholarship.eligibility_criteria) {
      return scholarship.eligibility_criteria.split(',').map(item => item.trim())
    }
    return []
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading scholarships...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scholarship Management</h1>
            <p className="text-gray-600">Manage scholarship opportunities and applications</p>
          </div>
        </div>
        <Button onClick={() => setIsAddingScholarship(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Scholarship
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search scholarships..."
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
                  {status === "All" ? "All Status" : status}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.total_scholarships}</p>
            <p className="text-sm text-gray-600">Total Scholarships</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.total_applications}</p>
            <p className="text-sm text-gray-600">Total Applications</p>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {(isAddingScholarship || editingScholarship) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{isAddingScholarship ? "Add New Scholarship" : "Edit Scholarship"}</CardTitle>
            <CardDescription>
              {isAddingScholarship ? "Create a new scholarship opportunity" : "Update scholarship information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Scholarship Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter scholarship title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Provider *</Label>
                <Input
                  id="provider"
                  name="provider"
                  value={formData.provider}
                  onChange={handleInputChange}
                  placeholder="Organization or foundation name"
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
                placeholder="Detailed description of the scholarship"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($) *</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Scholarship amount"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline *</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Merit-Based, Need-Based"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_applicants">Max Applicants</Label>
                <Input
                  id="max_applicants"
                  name="max_applicants"
                  type="number"
                  value={formData.max_applicants}
                  onChange={handleInputChange}
                  placeholder="Optional limit"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="academic_level">Academic Level</Label>
                <select
                  id="academic_level"
                  name="academic_level"
                  value={formData.academic_level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Levels</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="phd">PhD</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="e.g., Pakistan, International"
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
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="application_url">Application URL</Label>
              <Input
                id="application_url"
                name="application_url"
                value={formData.application_url}
                onChange={handleInputChange}
                placeholder="https://example.com/apply"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eligibility_criteria">Eligibility Criteria (comma-separated)</Label>
                <Textarea
                  id="eligibility_criteria"
                  name="eligibility_criteria"
                  value={formData.eligibility_criteria}
                  onChange={handleInputChange}
                  placeholder="Minimum 85% marks, Pakistani citizen, Age under 25"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="Academic transcripts, CNIC copy, Application form"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (comma-separated)</Label>
                <Textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  placeholder="Full tuition coverage, Monthly stipend, Books allowance"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={isAddingScholarship ? handleAddScholarship : handleUpdateScholarship}
                className="bg-green-600 hover:bg-green-700"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {submitting 
                  ? (isAddingScholarship ? "Creating..." : "Updating...") 
                  : (isAddingScholarship ? "Add Scholarship" : "Update Scholarship")
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

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScholarships.map((scholarship) => {
          const daysLeft = getDaysUntilDeadline(scholarship.deadline)
          const eligibilityCriteria = getEligibilityDisplay(scholarship)
          
          return (
            <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{scholarship.title}</CardTitle>
                    <CardDescription>{scholarship.provider}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(scholarship.status)}>{scholarship.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {scholarship.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">{scholarship.description}</p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-green-600 font-semibold">
                      <DollarSign className="h-4 w-4 mr-1" />${formatAmount(scholarship.amount)}
                    </span>
                    <Badge variant={scholarship.academic_level === "all" ? "default" : "outline"}>
                      {scholarship.academic_level}
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
                      {scholarship.total_applications} applicants
                    </span>
                    {scholarship.max_applicants && (
                      <span className="text-xs text-gray-500">/ {scholarship.max_applicants} max</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {eligibilityCriteria.slice(0, 2).map((criteria, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {criteria}
                    </Badge>
                  ))}
                  {eligibilityCriteria.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{eligibilityCriteria.length - 2} more
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  {scholarship.application_url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={scholarship.application_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Apply
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleEditScholarship(scholarship.id)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteScholarship(scholarship.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredScholarships.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm
              ? "No scholarships found matching your search."
              : "No scholarships added yet. Click 'Add Scholarship' to get started."}
          </p>
        </div>
      )}
    </div>
  )
}