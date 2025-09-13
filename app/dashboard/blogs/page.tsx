"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, ExternalLink, Calendar, User, Eye, AlertCircle } from "lucide-react"
import api from "@/components/axiosInstance"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  author: string
  content?: string
  read_time: string
  medium_url?: string
  status: string
  tags: string
  tags_list: string[]
  views: number
  created_at: string
  updated_at: string
  published_date?: string
}

interface BlogStats {
  total_posts: number
  published_posts: number
  total_views: number
}

interface ApiError {
  message: string
  details?: any
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([])
  const [stats, setStats] = useState<BlogStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Extract unique tags from blogs
  const allTags = Array.from(new Set(blogs.flatMap((blog) => blog.tags_list)))

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch published blog posts
        const blogsResponse = await api.get('/blog/posts/', {
          params: {
            status: 'published',
            ordering: '-created_at'
          }
        })

        // Fetch blog stats
        const statsResponse = await api.get('/blog/stats/')

        // Fetch featured posts (most viewed)
        const featuredResponse = await api.get('/blog/featured/')

        setBlogs(blogsResponse.data.results || blogsResponse.data)
        setStats(statsResponse.data)
        setFeaturedBlogs(featuredResponse.data)

      } catch (error: any) {
        console.error('Error fetching blog data:', error)
        setError({
          message: 'Failed to load blog posts',
          details: error.response?.data
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter blogs based on search term and selected tag
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || blog.tags_list.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  // Handle reading a blog post (increment views)
  const handleReadBlog = async (blog: BlogPost) => {
    try {
      // Increment views
      await api.post(`/blog/posts/${blog.id}/increment-views/`)
      
      // Update local state
      setBlogs(blogs.map(b => 
        b.id === blog.id ? { ...b, views: b.views + 1 } : b
      ))

      // Open Medium URL if available
      if (blog.medium_url) {
        window.open(blog.medium_url, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      console.error('Error incrementing views:', error)
      // Still open the URL even if view increment fails
      if (blog.medium_url) {
        window.open(blog.medium_url, '_blank', 'noopener,noreferrer')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Handle tag filtering
  const handleTagFilter = async (tag: string | null) => {
    setSelectedTag(tag)
    
    if (tag) {
      try {
        setLoading(true)
        const response = await api.get(`/blog/tags/${encodeURIComponent(tag)}/`)
        setBlogs(response.data)
      } catch (error: any) {
        console.error('Error filtering by tag:', error)
        setError({
          message: `Failed to load posts for tag: ${tag}`,
          details: error.response?.data
        })
      } finally {
        setLoading(false)
      }
    } else {
      // Reset to all posts
      try {
        setLoading(true)
        const response = await api.get('/blog/posts/', {
          params: {
            status: 'published',
            ordering: '-created_at'
          }
        })
        setBlogs(response.data.results || response.data)
      } catch (error: any) {
        console.error('Error loading all posts:', error)
        setError({
          message: 'Failed to load blog posts',
          details: error.response?.data
        })
      } finally {
        setLoading(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medium Blog Articles</h1>
            <p className="text-gray-600">Loading articles...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medium Blog Articles</h1>
          <p className="text-gray-600">
            Curated articles and insights from our community
            {stats && (
              <span className="ml-2">
                • {stats.published_posts} articles • {stats.total_views.toLocaleString()} total views
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

     
      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleTagFilter(null)}
            className={selectedTag === null ? "bg-green-600 hover:bg-green-700" : ""}
          >
            All Topics ({blogs.length})
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagFilter(tag)}
              className={selectedTag === tag ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <Card key={blog.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              {/* Placeholder thumbnail - you can add actual images later */}
              <div className="w-full h-48 bg-gradient-to-br from-green-400 to-blue-500 rounded-t-lg flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <h4 className="font-semibold line-clamp-2">{blog.title}</h4>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-1 mb-3">
                  {blog.tags_list.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {blog.author}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(blog.published_date || blog.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {blog.views}
                    </span>
                    <span>{blog.read_time}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleReadBlog(blog)}
                  className="w-full bg-green-600 hover:bg-green-700" 
                  size="sm"
                  disabled={!blog.medium_url}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {blog.medium_url ? 'Read on Medium' : 'Coming Soon'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBlogs.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-center">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No articles found</p>
            <p className="text-gray-400">
              {searchTerm || selectedTag
                ? "Try adjusting your search or filter criteria"
                : "Check back soon for new articles!"}
            </p>
            {(searchTerm || selectedTag) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("")
                  handleTagFilter(null)
                }}
                className="mt-4"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}