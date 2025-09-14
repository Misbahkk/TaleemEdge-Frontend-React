"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, BookOpen, MessageCircle, Play, Star, ArrowRight } from "lucide-react"

interface HeroData {
  title: string
  subtitle: string
  heading: string
  description: string
  hero_video: string | null
  hero_image: string | null
  video_poster: string | null
  stats: {
    rating: number
    students: string
    resources: string
  }
  buttons: {
    primary: { text: string; link: string }
    secondary: { text: string; link: string }
  }
}
// const BASE_URL = "http://127.0.0.1:8000"

const isDevelopment = process.env.NODE_ENV === 'development'
const myBaseUrl = isDevelopment ? process.env.NEXT_PUBLIC_API_BASE_URL_LOCAL : process.env.NEXT_PUBLIC_API_BASE_URL_DEPLOY


export function Hero() {
  const [data, setData] = useState<HeroData | null>(null)

  useEffect(() => {
    fetch(`${myBaseUrl}/hero-section/`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error fetching hero section:", err))
  }, [])

  if (!data) {
    return (
      <section className="pt-24 pb-20 text-center">
        <p className="text-gray-500">Loading...</p>
      </section>
    )
  }

  return (
    <section className="relative bg-green-50 pt-24 pb-20 px-4 w-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="max-w-7xl mx-auto relative w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                  {data.title} <span className="text-green-600">{/* highlight if needed */}</span>
                </h1>
                <p className="text-lg text-green-600 font-medium">{data.subtitle}</p>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">{data.heading}</h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{data.description}</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-sm font-medium">{data.stats.rating}/5 Rating</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium">{data.stats.students} Students</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium">{data.stats.resources} Resources</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full">
                <Link href={data.buttons.primary.link} className="flex items-center">
                  {data.buttons.primary.text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-full"
              >
                <Link href={data.buttons.secondary.link} className="flex items-center">
                  <Play className="mr-2 h-4 w-4" />
                  {data.buttons.secondary.text}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Hero Video */}
          <div className="relative">
            <div className="relative bg-green-100 rounded-3xl p-8 shadow-2xl">
              <div
                className="relative rounded-2xl overflow-hidden shadow-lg w-full bg-gray-900"
                style={{ aspectRatio: "600/500" }}
              >
                {data.hero_video ? (
                  <video
                    className="w-full h-full object-cover"
                   poster={data.video_poster ? `${myBaseUrl}${data.video_poster}` : "/placeholder.svg"}
                    controls
                    preload="metadata"
                  >
                     <source src={`${myBaseUrl}${data.hero_video}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={data.hero_image || "/placeholder.svg?height=500&width=600"}
                    alt="Hero"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
    

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="group text-center p-8 bg-white rounded-2xl shadow-sm border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Expert Mentorship</h3>
            <p className="text-gray-600">
              Connect with experienced mentors for personalized guidance and career advice
            </p>
          </div>

          <div className="group text-center p-8 bg-white rounded-2xl shadow-sm border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Rich Resources</h3>
            <p className="text-gray-600">Access comprehensive library, videos, and curated learning materials</p>
          </div>

          <div className="group text-center p-8 bg-white rounded-2xl shadow-sm border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
              <MessageCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Assistant</h3>
            <p className="text-gray-600">Get instant help and learning support with our intelligent chatbot</p>
          </div>
        </div>
      </div>
    </section>
  )
}
