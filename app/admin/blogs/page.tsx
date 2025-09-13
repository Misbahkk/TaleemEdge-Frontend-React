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
import { Plus, Edit, Trash2, FileText, Save, X, Search, ExternalLink, Calendar, User, Eye, AlertCircle } from "lucide-react"
import api from "@/components/axiosInstance"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  author: string
  content?: string
  read_time: string
  medium_url?: string
  status: "published" | "draft"
  tags: string
  tags_list: string[]
  views: number
  created_at: string
  updated_at: string
  published_date?: string
}

interface ApiError {
  message: string
  details?: any
}

interface UserRole {
  role: string
  is_admin: boolean
  is_student: boolean
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [isAddingBlog, setIsAddingBlog] = useState(false)
  const [editingBlog, setEditingBlog] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [submitLoading, setSubmitLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    author: "",
    content: "",
    read_time: "",
    tags: "",
    medium_url: "",
    status: "draft" as "published" | "draft",
  })

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await api.get('/blog/user/role/')
        setUserRole(response.data)
      } catch (error: any) {
        console.error('Error fetching user role:', error)
        // If not authenticated, assume public access
        setUserRole({ role: 'public', is_admin: false, is_student: false })
      }
    }
    fetchUserRole()
  }, [])

  // Fetch blog posts
  useEffect(() => {
    const fetchBlogs = async () => {
      if (typeof window === "undefined") return;

      try {
        setLoading(true)
        setError(null)
        
        // Use admin endpoint if user is admin, otherwise use public endpoint
        const endpoint = userRole?.is_admin ? '/blog/admin/posts/' : '/blog/posts/'
        const response = await api.get(endpoint)
        setBlogs(response.data.results || response.data)
      } catch (error: any) {
        console.error('Error fetching blogs:', error)
        setError({
          message: 'Failed to fetch blog posts',
          details: error.response?.data
        })
      } finally {
        setLoading(false)
      }
    }

    if (userRole) {
      fetchBlogs()
    }
  }, [userRole])

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags_list.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddBlog = async () => {
    if (!formData.title || !formData.author) {
      setError({ message: 'Title and Author are required' })
      return
    }

    try {
      if (typeof window === "undefined") return;

      setSubmitLoading(true)
      setError(null)
      
      const response = await api.post('/blog/admin/posts/create/', formData)
      setBlogs([response.data, ...blogs])
      resetForm()
    } catch (error: any) {
      console.error('Error creating blog:', error)
      setError({
        message: 'Failed to create blog post',
        details: error.response?.data
      })
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleEditBlog = (id: number) => {
    const blog = blogs.find((b) => b.id === id)
    if (blog) {
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        author: blog.author,
        content: blog.content || "",
        read_time: blog.read_time,
        tags: blog.tags,
        medium_url: blog.medium_url || "",
        status: blog.status,
      })
      setEditingBlog(id)
    }
  }

  const handleUpdateBlog = async () => {
    if (!formData.title || !formData.author || !editingBlog) {
      setError({ message: 'Title and Author are required' })
      return
    }

    try {
      setSubmitLoading(true)
      setError(null)
      
      const response = await api.put(`/blog/admin/posts/${editingBlog}/update/`, formData)
      setBlogs(blogs.map((blog) => blog.id === editingBlog ? response.data : blog))
      resetForm()
    } catch (error: any) {
      console.error('Error updating blog:', error)
      setError({
        message: 'Failed to update blog post',
        details: error.response?.data
      })
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteBlog = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      await api.delete(`/blog/admin/posts/${id}/delete/`)
      setBlogs(blogs.filter((blog) => blog.id !== id))
    } catch (error: any) {
      console.error('Error deleting blog:', error)
      setError({
        message: 'Failed to delete blog post',
        details: error.response?.data
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      author: "",
      content: "",
      read_time: "",
      tags: "",
      medium_url: "",
      status: "draft",
    })
    setIsAddingBlog(false)
    setEditingBlog(null)
    setError(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show access denied for non-admin users
  if (userRole && !userRole.is_admin) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need admin privileges to access blog management.</p>
          </div>
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
            <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600">Manage Medium blog articles and content</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsAddingBlog(true)} 
          className="bg-green-600 hover:bg-green-700"
          disabled={submitLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Blog Post
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">{error.message}</p>
            </div>
            {error.details && (
              <pre className="mt-2 text-sm text-red-600 overflow-auto">
                {JSON.stringify(error.details, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search blogs by title, author, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {(isAddingBlog || editingBlog) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{isAddingBlog ? "Add New Blog Post" : "Edit Blog Post"}</CardTitle>
            <CardDescription>
              {isAddingBlog ? "Create a new blog post entry" : "Update blog post information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Blog Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Author name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Brief description of the blog post"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Full Content (Optional)</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Full blog post content..."
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="read_time">Read Time</Label>
                <Input
                  id="read_time"
                  name="read_time"
                  value={formData.read_time}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 min read"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium_url">Medium URL</Label>
                <Input
                  id="medium_url"
                  name="medium_url"
                  value={formData.medium_url}
                  onChange={handleInputChange}
                  placeholder="https://medium.com/..."
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
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., Technology, Education, Career"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={isAddingBlog ? handleAddBlog : handleUpdateBlog}
                className="bg-green-600 hover:bg-green-700"
                disabled={submitLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {submitLoading 
                  ? (isAddingBlog ? "Adding..." : "Updating...") 
                  : (isAddingBlog ? "Add Blog Post" : "Update Blog Post")
                }
              </Button>
              <Button variant="outline" onClick={resetForm} disabled={submitLoading}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blog Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts ({filteredBlogs.length})</CardTitle>
          <CardDescription>Manage all blog posts and articles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{blog.title}</h3>
                      <Badge
                        variant={blog.status === "published" ? "default" : "secondary"}
                        className={blog.status === "published" ? "bg-green-100 text-green-800" : ""}
                      >
                        {blog.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>

                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {blog.author}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(blog.published_date || blog.created_at)}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {blog.views} views
                      </span>
                      <span>{blog.read_time}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {blog.tags_list.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {blog.medium_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={blog.medium_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleEditBlog(blog.id)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteBlog(blog.id)}
                      disabled={submitLoading}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBlogs.length === 0 && !loading && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm
                  ? "No blog posts found matching your search."
                  : "No blog posts added yet. Click 'Add Blog Post' to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}