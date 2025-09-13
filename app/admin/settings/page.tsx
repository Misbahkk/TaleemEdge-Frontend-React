"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Save, Upload, Settings, Home, Bell, Palette, Globe, Loader2 } from "lucide-react"
import api from "@/components/axiosInstance"

interface PlatformSettings {
  id?: number
  site_name: string
  site_description: string
  primary_color: string
  secondary_color: string
  logo: File | string | null
  favicon: File | string | null
  maintenance_mode: boolean
  allow_new_registrations: boolean
  hero_title: string
  hero_subtitle: string
  hero_image: File | string | null
  announcement_enabled: boolean
  announcement_text: string
  announcement_link: string
  announcement_type: "info" | "warning" | "success"
  contact_email: string
  contact_phone: string
  contact_address: string
  facebook_url: string
  twitter_url: string
  linkedin_url: string
  instagram_url: string
  youtube_url: string
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"homepage" | "platform" | "notifications">("homepage")
  const [settings, setSettings] = useState<PlatformSettings>({
    site_name: "",
    site_description: "",
    primary_color: "#10B981",
    secondary_color: "#3B82F6",
    logo: null,
    favicon: null,
    maintenance_mode: false,
    allow_new_registrations: true,
    hero_title: "",
    hero_subtitle: "",
    hero_image: null,
    announcement_enabled: false,
    announcement_text: "",
    announcement_link: "",
    announcement_type: "info",
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    facebook_url: "",
    twitter_url: "",
    linkedin_url: "",
    instagram_url: "",
    youtube_url: ""
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/auth/admin/settings/')
      setSettings(response.data)
    } catch (error: any) {
      console.error('Error fetching settings:', error)
      setError(error.response?.data?.error || 'Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSettingsChange = (field: keyof PlatformSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (field: keyof PlatformSettings, file: File | null) => {
    setSettings(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      // Create FormData for file uploads
      const formData = new FormData()
      
      // Append all fields to FormData
      Object.entries(settings).forEach(([key, value]) => {
        if (key === 'logo' || key === 'favicon' || key === 'hero_image') {
          // Handle file fields
          if (value instanceof File) {
            formData.append(key, value)
          }
          // If it's a string (existing file URL), don't append it
        } else {
          formData.append(key, String(value))
        }
      })

      const response = await api.put('/auth/admin/settings/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setSettings(response.data)
      setSuccessMessage('Settings saved successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error: any) {
      console.error('Error saving settings:', error)
      setError(error.response?.data?.error || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: "homepage", label: "Home Page Content", icon: Home },
    { id: "platform", label: "Platform Settings", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
  ]

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center space-x-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600">Manage home page content and platform configuration</p>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-red-800">{error}</div>
          </CardContent>
        </Card>
      )}

      {successMessage && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="text-green-800">{successMessage}</div>
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id as any)}
                className={activeTab === tab.id ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Home Page Content Tab */}
      {activeTab === "homepage" && (
        <div className="space-y-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main banner content on the landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    value={settings.hero_title}
                    onChange={(e) => handleSettingsChange("hero_title", e.target.value)}
                    placeholder="Main title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Textarea
                    id="heroSubtitle"
                    value={settings.hero_subtitle}
                    onChange={(e) => handleSettingsChange("hero_subtitle", e.target.value)}
                    placeholder="Subtitle"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="heroImage">Hero Image</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="heroImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload("hero_image", e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  {settings.hero_image && typeof settings.hero_image === 'string' && (
                    <span className="text-sm text-gray-500">Current: {settings.hero_image.split('/').pop()}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Announcement Banner */}
          <Card>
            <CardHeader>
              <CardTitle>Announcement Banner</CardTitle>
              <CardDescription>Featured announcement at the top of the page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="announcementEnabled"
                  checked={settings.announcement_enabled}
                  onChange={(e) => handleSettingsChange("announcement_enabled", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="announcementEnabled">Show announcement banner</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="announcementText">Announcement Text</Label>
                  <Textarea
                    id="announcementText"
                    value={settings.announcement_text}
                    onChange={(e) => handleSettingsChange("announcement_text", e.target.value)}
                    placeholder="Announcement message"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="announcementType">Type</Label>
                  <select
                    id="announcementType"
                    value={settings.announcement_type}
                    onChange={(e) => handleSettingsChange("announcement_type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="announcementLink">Announcement Link (Optional)</Label>
                <Input
                  id="announcementLink"
                  value={settings.announcement_link}
                  onChange={(e) => handleSettingsChange("announcement_link", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Contact details displayed in footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => handleSettingsChange("contact_email", e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contact_phone}
                    onChange={(e) => handleSettingsChange("contact_phone", e.target.value)}
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactAddress">Contact Address</Label>
                <Textarea
                  id="contactAddress"
                  value={settings.contact_address}
                  onChange={(e) => handleSettingsChange("contact_address", e.target.value)}
                  placeholder="Physical address"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Social media profiles for the footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebookUrl">Facebook</Label>
                  <Input
                    id="facebookUrl"
                    value={settings.facebook_url}
                    onChange={(e) => handleSettingsChange("facebook_url", e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitterUrl">Twitter</Label>
                  <Input
                    id="twitterUrl"
                    value={settings.twitter_url}
                    onChange={(e) => handleSettingsChange("twitter_url", e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn</Label>
                  <Input
                    id="linkedinUrl"
                    value={settings.linkedin_url}
                    onChange={(e) => handleSettingsChange("linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagramUrl">Instagram</Label>
                  <Input
                    id="instagramUrl"
                    value={settings.instagram_url}
                    onChange={(e) => handleSettingsChange("instagram_url", e.target.value)}
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">YouTube</Label>
                  <Input
                    id="youtubeUrl"
                    value={settings.youtube_url}
                    onChange={(e) => handleSettingsChange("youtube_url", e.target.value)}
                    placeholder="https://youtube.com/yourchannel"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Platform Settings Tab */}
      {activeTab === "platform" && (
        <div className="space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Platform Settings</CardTitle>
              <CardDescription>Core platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.site_name}
                    onChange={(e) => handleSettingsChange("site_name", e.target.value)}
                    placeholder="Platform name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.site_description}
                    onChange={(e) => handleSettingsChange("site_description", e.target.value)}
                    placeholder="Brief description"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Theme & Branding
              </CardTitle>
              <CardDescription>Customize the look and feel of your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => handleSettingsChange("primary_color", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.primary_color}
                      onChange={(e) => handleSettingsChange("primary_color", e.target.value)}
                      placeholder="#10B981"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondary_color}
                      onChange={(e) => handleSettingsChange("secondary_color", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.secondary_color}
                      onChange={(e) => handleSettingsChange("secondary_color", e.target.value)}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUpload">Logo Upload</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="logoUpload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload("logo", e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {settings.logo && typeof settings.logo === 'string' && (
                      <span className="text-sm text-gray-500">Current: {settings.logo.split('/').pop()}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faviconUpload">Favicon Upload</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="faviconUpload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload("favicon", e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {settings.favicon && typeof settings.favicon === 'string' && (
                      <span className="text-sm text-gray-500">Current: {settings.favicon.split('/').pop()}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Platform Controls
              </CardTitle>
              <CardDescription>Control platform availability and features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    checked={settings.maintenance_mode}
                    onChange={(e) => handleSettingsChange("maintenance_mode", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowNewRegistrations"
                    checked={settings.allow_new_registrations}
                    onChange={(e) => handleSettingsChange("allow_new_registrations", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="allowNewRegistrations">Allow New Registrations</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure how the platform sends notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-600">
                Notification settings will be available in a future update. Current focus is on platform configuration.
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}