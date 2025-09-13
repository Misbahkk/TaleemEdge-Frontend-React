"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  BookOpen,
  MessageCircle,
  Video,
  Calendar,
  Users,
  Award,
  ArrowRight,
  Lightbulb,
  Target,
  BookMarked,
} from "lucide-react"
import Link from "next/link"

export default function DashboardHome() {
  const { user } = useAuth()
 const userName = typeof window === "undefined" ? "Guest" : user?.name || "Guest"
  const features = [
    {
      icon: MessageCircle,
      title: "AI Assistant",
      description: "Get instant help with your studies and questions",
      guide: "Need quick answers? Click here to chat with our AI assistant that's available 24/7.",
      href: "/dashboard/chatbot",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: Video,
      title: "Video Resources",
      description: "Access curated educational videos and tutorials",
      guide: "Want to learn through videos? Explore our collection of educational content here.",
      href: "/dashboard/youtube",
      color: "bg-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      icon: BookOpen,
      title: "Virtual Library",
      description: "Browse thousands of books and resources",
      guide: "Looking for books and study materials? Visit our virtual library section.",
      href: "/dashboard/library",
      color: "bg-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      icon: Calendar,
      title: "Workshops",
      description: "Join interactive learning sessions",
      guide: "Want to attend live workshops? Check out upcoming sessions and register here.",
      href: "/dashboard/workshops",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      icon: Users,
      title: "Mentorship",
      description: "Connect with experienced mentors",
      guide: "Need guidance from experts? Find and connect with mentors in your field.",
      href: "/dashboard/mentorship",
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
    {
      icon: Award,
      title: "Scholarships",
      description: "Discover funding opportunities",
      guide: "Looking for financial support? Explore available scholarships and apply here.",
      href: "/dashboard/scholarships",
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      icon: BookMarked,
      title: "Blog Posts",
      description: "Read educational articles and insights",
      guide: "Want to read educational content? Browse our collection of informative blog posts.",
      href: "/dashboard/blogs",
      color: "bg-teal-500",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
    },
  ]

  const quickTips = [
    {
      icon: Lightbulb,
      title: "Getting Started",
      tip: "Start by exploring the AI Assistant to get familiar with the platform's capabilities.",
    },
    {
      icon: Target,
      title: "Set Your Goals",
      tip: "Visit the Mentorship section to connect with experts who can guide your learning journey.",
    },
    {
      icon: BookOpen,
      title: "Build Your Knowledge",
      tip: "Use the Virtual Library and Video Resources to supplement your studies with quality content.",
    },
  ]

  return (
    <div className="main-content">
      <div className="page-container py-4 md:py-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome to Taleem Edge, {userName}! 👋</h1>
              <p className="text-gray-600 mt-1">Let's explore what you can do on this platform</p>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-green-50 rounded-2xl p-6 mb-8 border border-green-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 text-green-600 mr-2" />
            Quick Tips to Get Started
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {quickTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-gray-100">
                <div className="bg-green-100 p-2 rounded-lg">
                  <tip.icon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{tip.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Exploration Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Explore Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`${feature.bgColor} ${feature.borderColor} border-2 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
              >
                <Link href={feature.href}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-gray-900 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white/70 p-3 rounded-lg border border-white/50">
                      <p className="text-sm text-gray-700 font-medium">💡 {feature.guide}</p>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <Card className="bg-gray-50 border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MessageCircle className="h-5 w-5 text-blue-600 mr-2" />
              Need Help Getting Started?
            </CardTitle>
            <CardDescription>Don't worry! We're here to help you make the most of Taleem Edge.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/dashboard/chatbot">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ask AI Assistant
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/mentorship">
                  <Users className="h-4 w-4 mr-2" />
                  Find a Mentor
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
