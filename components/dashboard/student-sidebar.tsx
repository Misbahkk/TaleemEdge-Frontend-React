"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Home,
  MessageCircle,
  Video,
  FileText,
  Calendar,
  BookOpen,
  Award,
  Users,
  GraduationCap,
  LogOut,
} from "lucide-react"

const menuItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: MessageCircle, label: "Chatbot", href: "/dashboard/chatbot" },
  { icon: Video, label: "YouTube Resources", href: "/dashboard/youtube" },
  { icon: FileText, label: "Medium Blogs", href: "/dashboard/blogs" },
  { icon: Calendar, label: "Workshops", href: "/dashboard/workshops" },
  { icon: BookOpen, label: "Library", href: "/dashboard/library" },
  { icon: Award, label: "Scholarships", href: "/dashboard/scholarships" },
  { icon: Users, label: "Mentorship", href: "/dashboard/mentorship" },
]

export function StudentSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <Sidebar className="border-r border-green-100">
      <SidebarHeader className="border-b border-green-100 p-4">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Taleem Edge</h2>
            <p className="text-sm text-gray-600">Student Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-green-100 p-4">
        <div className="space-y-3">
          <div className="text-sm">
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="w-full justify-start">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
