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
import { Plus, Edit, Trash2, Video, Eye, Save, X, Loader2 } from "lucide-react"
import api from "@/components/axiosInstance"

interface VideoContent {
  id: number
  title: string
  description: string
  youtube_video_id: string
  category: string
  duration: string
  views: string
  thumbnail_url?: string
  youtube_url: string
  youtube_embed_url: string
  created_at: string
  updated_at: string
}

interface FormData {
  title: string
  description: string
  youtube_video_id: string
  category: string
  duration: string
  views: string
  thumbnail_url: string
}

export default function AdminYouTubePage() {
  const [videos, setVideos] = useState<VideoContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingVideo, setIsAddingVideo] = useState(false)
  const [editingVideo, setEditingVideo] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    youtube_video_id: "",
    category: "",
    duration: "",
    views: "0",
    thumbnail_url: "",
  })

  // Fetch videos from API
  const fetchVideos = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.get('/vedios/vedeos/')
      setVideos(response.data.results || response.data)
    } catch (error: any) {
      console.error('Error fetching videos:', error)
      setError('Failed to fetch videos. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Load videos on component mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    fetchVideos()
  }, [])

  const handleAddVideo = async () => {
    if (!formData.title || !formData.youtube_video_id) {
      setError('Title and YouTube Video ID are required.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      const response = await api.post('/vedios/vedeos/', formData)
      setVideos(prevVideos => [response.data, ...prevVideos])
      resetForm()
      setIsAddingVideo(false)
    } catch (error: any) {
      console.error('Error adding video:', error)
      setError(error.response?.data?.detail || 'Failed to add video. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditVideo = (id: number) => {
    const video = videos.find((v) => v.id === id)
    if (video) {
      setFormData({
        title: video.title,
        description: video.description,
        youtube_video_id: video.youtube_video_id,
        category: video.category,
        duration: video.duration,
        views: video.views,
        thumbnail_url: video.thumbnail_url || "",
      })
      setEditingVideo(id)
    }
  }

  const handleUpdateVideo = async () => {
    if (!formData.title || !formData.youtube_video_id || !editingVideo) {
      setError('Title and YouTube Video ID are required.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        duration: formData.duration,
        views: formData.views,
        thumbnail_url: formData.thumbnail_url,
      }
      const response = await api.put(`/vedios/vedeos/${editingVideo}/`, updateData)
      setVideos(prevVideos => 
        prevVideos.map(video => video.id === editingVideo ? response.data : video)
      )
      resetForm()
      setEditingVideo(null)
    } catch (error: any) {
      console.error('Error updating video:', error)
      setError(error.response?.data?.detail || 'Failed to update video. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteVideo = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return
    }

    try {
      await api.delete(`/vedios/vedeos/${id}/`)
      setVideos(prevVideos => prevVideos.filter(video => video.id !== id))
    } catch (error: any) {
      console.error('Error deleting video:', error)
      setError('Failed to delete video. Please try again.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      youtube_video_id: "",
      category: "",
      duration: "",
      views: "0",
      thumbnail_url: "",
    })
    setError(null)
  }

  const cancelForm = () => {
    setIsAddingVideo(false)
    setEditingVideo(null)
    resetForm()
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading videos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">YouTube Content Management</h1>
            <p className="text-gray-600">Manage educational video content</p>
          </div>
        </div>
        <Button onClick={() => setIsAddingVideo(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Video
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {(isAddingVideo || editingVideo) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{isAddingVideo ? "Add New Video" : "Edit Video"}</CardTitle>
            <CardDescription>
              {isAddingVideo ? "Add a new educational video to the platform" : "Update video information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Video Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter video title"
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
                  placeholder="e.g., Programming, Mathematics"
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
                placeholder="Enter video description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="youtube_video_id">YouTube Video ID *</Label>
                <Input
                  id="youtube_video_id"
                  name="youtube_video_id"
                  value={formData.youtube_video_id}
                  onChange={handleInputChange}
                  placeholder="e.g., dQw4w9WgXcQ"
                  required
                  disabled={!!editingVideo}
                />
                {editingVideo && (
                  <p className="text-xs text-gray-500">Video ID cannot be changed when editing</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 45:30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="views">Views</Label>
                <Input
                  id="views"
                  name="views"
                  value={formData.views}
                  onChange={handleInputChange}
                  placeholder="e.g., 125K"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
              <Input
                id="thumbnail_url"
                name="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleInputChange}
                placeholder="https://example.com/thumbnail.jpg"
                type="url"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={isAddingVideo ? handleAddVideo : handleUpdateVideo}
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSubmitting 
                  ? (isAddingVideo ? "Adding..." : "Updating...") 
                  : (isAddingVideo ? "Add Video" : "Update Video")
                }
              </Button>
              <Button variant="outline" onClick={cancelForm} disabled={isSubmitting}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_video_id}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=180&width=320"
                  }}
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {video.category || 'Uncategorized'}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500">
                    <Eye className="h-3 w-3 mr-1" />
                    {video.views}
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{video.description}</p>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => handleEditVideo(video.id)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDeleteVideo(video.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && videos.length === 0 && (
        <div className="text-center py-12">
          <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No videos added yet. Click "Add Video" to get started.</p>
        </div>
      )}
    </div>
  )
}