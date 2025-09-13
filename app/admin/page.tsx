"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Users,
  Video,
  BookOpen,
  Calendar,
  Award,
  MessageCircle,
  TrendingUp,
  Activity,
  Plus,
  Settings,
  BarChart3,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import api from "@/components/axiosInstance"

export default function AdminDashboard() {
  const [stats, setStats] = useState([])
  const [activities, setActivities] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const quickActions = [
    { title: "Add YouTube Video", icon: Video, href: "/admin/youtube", color: "bg-red-500" },
    { title: "Create Workshop", icon: Calendar, href: "/admin/workshops", color: "bg-orange-500" },
    { title: "Add Book", icon: BookOpen, href: "/admin/library", color: "bg-purple-500" },
    { title: "Post Scholarship", icon: Award, href: "/admin/scholarships", color: "bg-yellow-500" },
  ]

  useEffect(() => {
    if (typeof window === "undefined") return;
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch stats
      const statsResponse = await api.get('/auth/admin/dashboard/stats/')
      const statsData = statsResponse.data
      
      // Map API response to stats format
      const mappedStats = [
        { 
          title: "Total Users", 
          value: statsData.total_users.toString(), 
          change: statsData.users_growth, 
          icon: Users, 
          color: "bg-blue-500", 
          href: "/admin/users" 
        },
        { 
          title: "YouTube Videos", 
          value: statsData.youtube_videos.toString(), 
          change: statsData.videos_growth, 
          icon: Video, 
          color: "bg-red-500", 
          href: "/admin/youtube" 
        },
        {
          title: "Library Books",
          value: statsData.library_books.toString(),
          change: statsData.books_growth,
          icon: BookOpen,
          color: "bg-purple-500",
          href: "/admin/library",
        },
        {
          title: "Workshops",
          value: statsData.workshops.toString(),
          change: statsData.workshops_growth,
          icon: Calendar,
          color: "bg-orange-500",
          href: "/admin/workshops",
        },
        {
          title: "Scholarships",
          value: statsData.scholarships.toString(),
          change: statsData.scholarships_growth,
          icon: Award,
          color: "bg-yellow-500",
          href: "/admin/scholarships",
        },
        {
          title: "Active Mentors",
          value: statsData.active_mentors.toString(),
          change: statsData.mentors_growth,
          icon: MessageCircle,
          color: "bg-indigo-500",
          href: "/admin/mentorship",
        },
      ]
      
      setStats(mappedStats)
      
      // Fetch activities
      const activitiesResponse = await api.get('/auth/admin/dashboard/activities/')
      setActivities(activitiesResponse.data)
      
      // Fetch tasks
      const tasksResponse = await api.get('/auth/admin/dashboard/tasks/')
      setTasks(tasksResponse.data)
      
      setLoading(false)
    } catch (err) {
      setError("Failed to fetch dashboard data")
      setLoading(false)
      console.error("API Error:", err)
    }
  }

  // Function to map activity type to display properties
  const getActivityTypeProps = (activityType) => {
    switch(activityType) {
      case "user_registration":
        return { type: "user", action: "New user registration" }
      case "workshop_enrollment":
        return { type: "workshop", action: "Workshop enrollment" }
      case "book_download":
        return { type: "library", action: "Book downloaded" }
      case "scholarship_application":
        return { type: "scholarship", action: "Scholarship application" }
      case "mentor_application":
        return { type: "mentor", action: "Mentor connection" }
      default:
        return { type: "user", action: activityType }
    }
  }

  // Function to map priority to color
  const getPriorityColor = (priority) => {
    switch(priority.toLowerCase()) {
      case "high priority":
        return "high"
      case "medium priority":
        return "medium"
      case "low priority":
        return "low"
      default:
        return "medium"
    }
  }

  if (loading) {
    return (
      <div className="main-content">
        <div className="page-container py-4 md:py-6 flex items-center justify-center">
          <div className="text-center">
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="page-container py-4 md:py-6 flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <Button onClick={fetchDashboardData} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="main-content">
      <div className="page-container py-4 md:py-6">
        {/* Mobile Optimized Header */}
        <div className="mobile-header md:flex md:items-center md:justify-between mb-4 md:mb-8">
          <div className="mobile-header-top">
            <div className="flex items-center space-x-2 md:space-x-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-lg md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm md:text-base text-gray-600 hidden md:block">
                  Manage and monitor Taleem Edge platform
                </p>
              </div>
            </div>
          </div>

          <div className="mobile-header-bottom">
            <div className="flex space-x-2">
              <Button variant="outline" asChild size="sm" className="text-xs md:text-sm">
                <Link href="/admin/settings">
                  <Settings className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Settings
                </Link>
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-xs md:text-sm" size="sm">
                <BarChart3 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500 neuro-card"
            >
              <Link href={stat.href}>
                <CardContent className="p-3 md:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-600 uppercase tracking-wide">
                        {stat.title}
                      </p>
                      <p className="text-lg md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{stat.value}</p>
                      <p className="text-xs md:text-sm text-green-600 mt-1 font-medium">
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`${stat.color} p-2 md:p-3 rounded-lg`}>
                      <stat.icon className="h-4 w-4 md:h-8 md:w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-4 md:mb-8 glass-card">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="flex items-center text-base md:text-lg">
              <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-600" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-sm">Frequently used admin functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  asChild
                  variant="outline"
                  className="h-16 md:h-20 flex-col space-y-1 md:space-y-2 neuro-button text-xs md:text-sm"
                >
                  <Link href={action.href}>
                    <div className={`${action.color} p-1.5 md:p-2 rounded-lg mb-1 md:mb-2`}>
                      <action.icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
                    </div>
                    <span className="font-medium">{action.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-8">
          {/* Recent Activity */}
          <Card className="glass-card">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center text-base md:text-lg">
                <Activity className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
                Recent Platform Activity
              </CardTitle>
              <CardDescription className="text-sm">Latest user activities across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 md:space-y-4">
                {activities.slice(0, 5).map((activity, index) => {
                  const { type, action } = getActivityTypeProps(activity.activity_type)
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-2 md:p-4 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            type === "user"
                              ? "bg-blue-500"
                              : type === "workshop"
                                ? "bg-orange-500"
                                : type === "library"
                                  ? "bg-purple-500"
                                  : type === "scholarship"
                                    ? "bg-yellow-500"
                                    : "bg-indigo-500"
                          }`}
                        ></div>
                        <div>
                          <p className="font-medium text-xs md:text-sm text-gray-900">{action}</p>
                          <p className="text-xs md:text-sm text-gray-600">by {activity.user_name}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">{activity.time_ago}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card className="glass-card">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center text-base md:text-lg">
                <AlertCircle className="h-4 w-4 md:h-5 md:w-5 mr-2 text-orange-600" />
                Pending Tasks
              </CardTitle>
              <CardDescription className="text-sm">Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 md:space-y-4">
                {tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2 md:p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          getPriorityColor(task.priority) === "high"
                            ? "bg-red-500"
                            : getPriorityColor(task.priority) === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium text-xs md:text-sm text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500 capitalize">{task.priority}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        {task.count}
                      </span>
                      <Button size="sm" variant="outline" className="neuro-button text-xs">
                        {task.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Growth Chart */}
        <Card className="glass-card">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="flex items-center text-base md:text-lg">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-600" />
              Platform Growth & Performance
            </CardTitle>
            <CardDescription className="text-sm">Key metrics and performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-medium text-gray-700">User Engagement Rate</span>
                  <span className="text-xs md:text-sm font-bold text-green-600">+24%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                  <div
                    className="bg-green-600 h-2 md:h-3 rounded-full transition-all duration-500"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">75% of users active daily</p>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-medium text-gray-700">Course Completion Rate</span>
                  <span className="text-xs md:text-sm font-bold text-blue-600">+18%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                  <div
                    className="bg-blue-600 h-2 md:h-3 rounded-full transition-all duration-500"
                    style={{ width: "68%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">68% completion rate</p>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-medium text-gray-700">Scholarship Success Rate</span>
                  <span className="text-xs md:text-sm font-bold text-purple-600">+32%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                  <div
                    className="bg-purple-600 h-2 md:h-3 rounded-full transition-all duration-500"
                    style={{ width: "82%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">82% application success rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}