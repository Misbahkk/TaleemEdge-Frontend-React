"use client"

import { useAuth } from "@/components/auth-provider"

export function DebugUser() {
  const { user } = useAuth()

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed top-0 right-0 bg-black text-white p-2 text-xs z-50">
      <div>User: {user?.email}</div>
      <div>Role: {user?.role}</div>
      <div>ID: {user?.id}</div>
    </div>
  )
}
