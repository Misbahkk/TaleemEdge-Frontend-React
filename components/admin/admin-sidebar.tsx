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
  LayoutDashboard,
  Video,
  FileText,
  Calendar,
  BookOpen,
  Award,
  Users,
  Settings,
  Shield,
  LogOut,
} from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Video, label: "YouTube Content", href: "/admin/youtube" },
  { icon: FileText, label: "Blog Management", href: "/admin/blogs" },
  { icon: Calendar, label: "Workshops", href: "/admin/workshops" },
  { icon: BookOpen, label: "Library Management", href: "/admin/library" },
  { icon: Award, label: "Scholarships", href: "/admin/scholarships" },
  { icon: Users, label: "Mentorships", href: "/admin/mentorship" },
  { icon: Settings, label: "Home Page & Settings", href: "/admin/settings" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <Sidebar className="border-r border-green-100">
      <SidebarHeader className="border-b border-green-100 p-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-600">Taleem Edge</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href} className="flex items-center space-x-3 p-3 rounded-lg hover: transition-colors">
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
            <p className="text-xs text-green-600 font-medium">Administrator</p>
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
