"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import api from "@/components/axiosInstance"
import { Search, BookOpen, Download, Star, Eye, Activity, TrendingUp, Clock, User } from "lucide-react"

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api'

// API instance with authentication
// const api = {
//   get: async (url: string) => {
//     const token = localStorage.getItem('authToken') // Adjust based on your token storage
//     return fetch(`${API_BASE_URL}${url}`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     })
//   },
//   post: async (url: string, data?: any) => {
//     const token = localStorage.getItem('authToken') // Adjust based on your token storage
//     return fetch(`${API_BASE_URL}${url}`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: data ? JSON.stringify(data) : undefined,
//     })
//   }
// }

// Types based on your API responses
interface Book {
  id: number
  title: string
  author: string
  description: string
  category: string
  pages: number
  publish_year: number
  file_size: string
  language: string
  pdf_file: string | null
  status: string
  download_count: number
  read_count: number
  created_at: string
  is_read: boolean
  is_downloaded: boolean
  reading_progress: ReadingProgress | null
}

interface ReadingProgress {
  percentage: number
  last_page: number
  is_completed: boolean
  last_read_at: string
}

interface Activity {
  id: number
  book: number
  book_title: string
  book_author: string
  activity_type: 'read' | 'download'
  timestamp: string
}

interface LibraryStats {
  total_books_read: number
  total_books_downloaded: number
  currently_reading: number
  completed_books: number
  recent_activities: Activity[]
  reading_progress: ReadingProgress[]
}

interface Category {
  value: string
  label: string
  count: number
}

export default function IntegratedLibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [libraryStats, setLibraryStats] = useState<LibraryStats | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState<"title" | "read_count" | "download_count" | "publish_year">("title")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // API Functions
  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await api.get('/library/books/')
  
      const data = await response.data
      setBooks(data)
    } catch (err) {
      setError('Error fetching books')
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/library/categories/')
     
      const data = await response.data
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const fetchLibraryStats = async () => {
    try {
      const response = await api.get('/library/student/library/')
    
      const data = await response.data
      setLibraryStats(data)
    } catch (err) {
      console.error('Error fetching library stats:', err)
    }
  }

  const fetchActivities = async () => {
    try {
      const response = await api.get('/library/student/activities/')
   
      const data = await response.data
      setActivities(data)
    } catch (err) {
      console.error('Error fetching activities:', err)
    }
  }

  const handleReadBook = async (bookId: number) => {
    try {
      setLoading(true)
      const response = await api.get(`/library/books/${bookId}/read/`)
    
      const data = await response.data
      
      // Open PDF in new tab
      if (data.pdf_url) {
        window.open(data.pdf_url, '_blank')
      }
      
      // Refresh data
      await Promise.all([fetchBooks(), fetchLibraryStats(), fetchActivities()])
    } catch (err) {
      setError('Error opening book for reading')
      console.error('Error reading book:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadBook = async (bookId: number, bookTitle: string) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken') // Adjust based on your token storage
      
      // Create a direct download link
      const downloadUrl =  await api.get(`/library/books/${bookId}/download/`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    })
      
      // Create a temporary anchor element for download
      const link = document.createElement('a')
      // link.href = downloadUrl
      link.download = `${bookTitle}.pdf`
      
      // Add authorization header by fetching the file first
      // const response = await fetch(downloadUrl, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // })
      
      // if (!response.ok) {
      //   if (response.status === 404) {
      //     throw new Error('Book not found')
      //   } else if (response.status === 400) {
      //     throw new Error('PDF file not available')
      //   } else if (response.status === 401) {
      //     throw new Error('Authentication required')
      //   } else {
      //     throw new Error('Failed to download book')
      //   }
      // }
      
      // Get the blob data
      const blob = await downloadUrl.data
      const blobUrl = window.URL.createObjectURL(blob)
      
      // Trigger download
      link.href = blobUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl)
      
      // Refresh data to update download counts
      await Promise.all([fetchBooks(), fetchLibraryStats(), fetchActivities()])
      
    } catch (err) {
      if (err instanceof Error) {
        setError(`Download failed: ${err.message}`)
      } else {
        setError('Error downloading book')
      }
      console.error('Error downloading book:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchBooks(),
        fetchCategories(),
        fetchLibraryStats(),
        fetchActivities()
      ])
    }
    loadData()
  }, [])

  // Filter and sort books
  const filteredBooks = books
    .filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "read_count":
          return b.read_count - a.read_count
        case "download_count":
          return b.download_count - a.download_count
        case "publish_year":
          return b.publish_year - a.publish_year
        default:
          return a.title.localeCompare(b.title)
      }
    })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && books.length === 0) {
    return (
      <div className="main-content">
        <div className="page-container py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-500">Loading library...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="main-content">
      <div className="page-container py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Digital Library</h1>
              <p className="text-gray-600">Browse and manage your reading collection</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => {
                setError(null)
                Promise.all([fetchBooks(), fetchLibraryStats(), fetchActivities()])
              }}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Library Stats */}
        {libraryStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Books Read</p>
                    <p className="text-2xl font-bold text-gray-900">{libraryStats.total_books_read}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Download className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Downloaded</p>
                    <p className="text-2xl font-bold text-gray-900">{libraryStats.total_books_downloaded}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Currently Reading</p>
                    <p className="text-2xl font-bold text-gray-900">{libraryStats.currently_reading}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{libraryStats.completed_books}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Activities */}
        {activities.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {activity.activity_type === 'read' ? (
                        <Eye className="h-4 w-4 text-blue-600 mr-3" />
                      ) : (
                        <Download className="h-4 w-4 text-green-600 mr-3" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{activity.book_title}</p>
                        <p className="text-xs text-gray-600">by {activity.book_author}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={activity.activity_type === 'read' ? 'default' : 'secondary'}>
                        {activity.activity_type}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search books, authors, or topics..."
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
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className={selectedCategory === "all" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                >
                  All ({books.length})
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className={selectedCategory === category.value ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                  >
                    {category.label} ({category.count})
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 min-w-[80px]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              >
                <option value="title">Title</option>
                <option value="read_count">Most Read</option>
                <option value="download_count">Most Downloaded</option>
                <option value="publish_year">Latest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-lg flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-indigo-400" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 capitalize">
                      {book.category.replace('_', ' ')}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      {book.is_read && <Eye className="h-3 w-3 text-blue-600" />}
                      {book.is_downloaded && <Download className="h-3 w-3 text-green-600" />}
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{book.description}</p>

                  {book.reading_progress && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{book.reading_progress.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${book.reading_progress.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Page {book.reading_progress.last_page} of {book.pages}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{book.pages} pages</span>
                    <span>{book.download_count} downloads</span>
                    <span>{book.publish_year}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleReadBook(book.id)}
                      disabled={loading || !book.pdf_file}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      {book.is_read ? 'Continue' : 'Read'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadBook(book.id, book.title)}
                      disabled={loading || !book.pdf_file}
                      className="flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>

                  {!book.pdf_file && (
                    <p className="text-xs text-red-500 mt-2 text-center">PDF not available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No books found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}