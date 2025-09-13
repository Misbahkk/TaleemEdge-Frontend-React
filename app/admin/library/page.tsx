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
import { Plus, Edit, Trash2, BookOpen, Save, X, Search, Star, Upload, FileText } from "lucide-react"
import api from "@/components/axiosInstance"

interface Book {
  id: number
  title: string
  author: string
  description: string
  category: string
  pages: number
  publish_year: number
  isbn: string
  language: string
  status: "available" | "maintenance" | "archived"
  cover_image?: string
  pdf_file?: string
  file_size?: string
  download_count?: number
  read_count?: number
  created_at?: string
}

interface Category {
  value: string
  label: string
  count: number
}

export default function AdminLibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddingBook, setIsAddingBook] = useState(false)
  const [editingBook, setEditingBook] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    pages: "",
    publish_year: "",
    language: "English",
    status: "available" as "available" | "maintenance" | "archived",
    isbn: "",
    cover_image: null as File | null,
    pdf_file: null as File | null
  })

  // Fetch books and categories on component mount
  useEffect(() => {
    fetchBooks()
    fetchCategories()
  }, [])

  const fetchBooks = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/library/books/")
      setBooks(response.data)
    } catch (error) {
      console.error("Error fetching books:", error)
      alert("Failed to fetch books")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get("/library/categories/")
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddBook = async () => {
    if (!formData.title || !formData.author) return

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("author", formData.author)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("pages", formData.pages)
      formDataToSend.append("publish_year", formData.publish_year)
      formDataToSend.append("language", formData.language)
      formDataToSend.append("status", formData.status)
      formDataToSend.append("isbn", formData.isbn)
      console.log([...formDataToSend]); 

      if (formData.cover_image) {
        formDataToSend.append("cover_image", formData.cover_image)
      }
      
      if (formData.pdf_file) {
        formDataToSend.append("pdf_file", formData.pdf_file)
      }

      const response = await api.post("/library/books/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setBooks([...books, response.data])
      resetForm()
      alert("Book added successfully!")
    } catch (error) {
      console.error("Error adding book:", error)
      alert("Failed to add book")
    }
  }

  const handleEditBook = (id: number) => {
    const book = books.find((b) => b.id === id)
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        category: book.category,
        pages: book.pages.toString(),
        publish_year: book.publish_year.toString(),
        language: book.language,
        status: book.status,
        isbn: book.isbn,
        cover_image: null,
        pdf_file: null
      })
      setEditingBook(id)
    }
  }

  const handleUpdateBook = async () => {
    if (!formData.title || !formData.author || !editingBook) return

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("author", formData.author)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("pages", formData.pages)
      formDataToSend.append("publish_year", formData.publish_year)
      formDataToSend.append("language", formData.language)
      formDataToSend.append("status", formData.status)
      formDataToSend.append("isbn", formData.isbn)
      
      if (formData.cover_image) {
        formDataToSend.append("cover_image", formData.cover_image)
      }
      
      if (formData.pdf_file) {
        formDataToSend.append("pdf_file", formData.pdf_file)
      }

      const response = await api.patch(`/library/books/${editingBook}/`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setBooks(books.map((book) => (book.id === editingBook ? response.data : book)))
      resetForm()
      alert("Book updated successfully!")
    } catch (error) {
      console.error("Error updating book:", error)
      alert("Failed to update book")
    }
  }

  const handleDeleteBook = async (id: number) => {
    if (confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      try {
        await api.delete(`/library/books/${id}/`)
        setBooks(books.filter((book) => book.id !== id))
        alert("Book deleted successfully!")
      } catch (error) {
        console.error("Error deleting book:", error)
        alert("Failed to delete book")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      category: "",
      pages: "",
      publish_year: "",
      language: "English",
      status: "available",
      isbn: "",
      cover_image: null,
      pdf_file: null
    })
    setIsAddingBook(false)
    setEditingBook(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.files![0],
      }))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const categoryOptions = ["All", ...categories.map(cat => cat.label)]

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading books...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Library Management</h1>
            <p className="text-gray-600">Manage books and educational resources catalog</p>
          </div>
        </div>
        <Button onClick={() => setIsAddingBook(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search books by title, author, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{books.length}</p>
            <p className="text-sm text-gray-600">Total Books</p>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {(isAddingBook || editingBook) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{isAddingBook ? "Add New Book" : "Edit Book"}</CardTitle>
            <CardDescription>
              {isAddingBook ? "Add a new book to the library catalog" : "Update book information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Book Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter book title"
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Book description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
              
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                   <option value="">-- Select Category --</option> 
                  <option value="computer_science">Computer Science</option>
                  <option value="business">Business</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                  <option value="engineering">Engineering</option>
                  <option value="literature">Literature</option>
                  <option value="history">History</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  name="pages"
                  type="number"
                  value={formData.pages}
                  onChange={handleInputChange}
                  placeholder="Number of pages"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publish_year">Publish Year</Label>
                <Input
                  id="publish_year"
                  name="publish_year"
                  type="number"
                  value={formData.publish_year}
                  onChange={handleInputChange}
                  placeholder="e.g., 2023"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  placeholder="e.g., 978-0-123456-78-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="English">English</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Arabic">Arabic</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                </select>
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
                  <option value="available">Available</option>
                  <option value="maintenance">Under Maintenance</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cover_image">Book Cover Image</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="cover_image" 
                    name="cover_image"
                    type="file" 
                    accept="image/*" 
                    className="flex-1" 
                    onChange={handleFileChange}
                  />
                  <Button type="button" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Upload book cover image (max 5MB)</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pdf_file">PDF File</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="pdf_file" 
                    name="pdf_file"
                    type="file" 
                    accept=".pdf" 
                    className="flex-1" 
                    onChange={handleFileChange}
                  />
                  <Button type="button" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Upload PDF file (max 20MB)</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={isAddingBook ? handleAddBook : handleUpdateBook}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isAddingBook ? "Add Book" : "Update Book"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <img
                src={book.cover_image || "/placeholder.svg"}
                alt={book.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {book.category}
                  </Badge>
                  <Badge className={getStatusColor(book.status)}>{book.status}</Badge>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{book.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{book.pages} pages</span>
                  <span>{book.publish_year}</span>
                  <span>ISBN: {book.isbn}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">New</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    <span>{book.read_count || 0} reads</span>
                  </div>
                </div>
                
                {book.pdf_file && (
                  <div className="mb-3">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <FileText className="h-3 w-3 mr-1" />
                      PDF Available
                    </Badge>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditBook(book.id)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteBook(book.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm
              ? "No books found matching your search."
              : "No books added yet. Click 'Add Book' to get started."}
          </p>
        </div>
      )}
    </div>
  )
}