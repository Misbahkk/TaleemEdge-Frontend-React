"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, Play, Clock, Eye, Loader2 } from "lucide-react"
import api from "@/components/axiosInstance"

interface Video {
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

export default function YouTubePage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch videos from API
  const fetchVideos = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.get('/vedios/vedeos/')
      const videosData = response.data.results || response.data
      setVideos(videosData)
      setFilteredVideos(videosData)
      
      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(videosData.map((video: Video) => video.category).filter(Boolean))]
      setCategories(uniqueCategories)
    } catch (error: any) {
      console.error('Error fetching videos:', error)
      setError('Failed to fetch videos. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Load videos on component mount
  useEffect(() => {
    fetchVideos()
  }, [])

  // Filter videos based on search term and category
  useEffect(() => {
    let filtered = videos

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((video) => video.category === selectedCategory)
    }

    setFilteredVideos(filtered)
  }, [videos, searchTerm, selectedCategory])

  // Increment view count when video is played
  const handleVideoPlay = async (video: Video) => {
    try {
      // Call the retrieve endpoint to increment view count
      await api.get(`/vedios/vedeos/${video.id}/`)
      setSelectedVideo(video)
      
      // Update local state to reflect new view count
      fetchVideos() // Refresh to get updated view count
    } catch (error) {
      console.error('Error incrementing view count:', error)
      // Still allow video to play even if view count update fails
      setSelectedVideo(video)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">YouTube Resources</h1>
            <p className="text-gray-600">Curated educational videos for your learning journey</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading videos...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">YouTube Resources</h1>
            <p className="text-gray-600">Curated educational videos for your learning journey</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 max-w-md mx-auto">
            {error}
          </div>
          <Button onClick={fetchVideos} className="bg-green-600 hover:bg-green-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">YouTube Resources</h1>
          <p className="text-gray-600">Curated educational videos for your learning journey</p>
        </div>
      </div>

      {selectedVideo && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="aspect-video mb-4">
              <iframe
                width="100%"
                height="100%"
                src={selectedVideo.youtube_embed_url}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 mr-4">
                <h2 className="text-xl font-semibold mb-2">{selectedVideo.title}</h2>
                <p className="text-gray-600 mb-2">{selectedVideo.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {selectedVideo.views} views
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {selectedVideo.duration}
                  </span>
                  <Badge variant="secondary">{selectedVideo.category || 'Uncategorized'}</Badge>
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedVideo(null)}>
                Close Player
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search videos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="max-w-md"
          />
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
                className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-0">
              <div className="relative group">
                <img
                  src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_video_id}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=180&width=320"
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center rounded-t-lg">
                  <Button
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-green-600 hover:bg-green-700"
                    onClick={() => handleVideoPlay(video)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Play
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {video.category || 'Uncategorized'}
                  </Badge>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {video.views}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && filteredVideos.length === 0 && videos.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No videos found matching your criteria.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("All")
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {!isLoading && videos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No videos available yet.</p>
        </div>
      )}
    </div>
  )
}