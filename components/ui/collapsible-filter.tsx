"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"

interface CollapsibleFilterProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
}

export function CollapsibleFilter({ title, children, defaultExpanded = false }: CollapsibleFilterProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="w-full">
      {/* Mobile Toggle Button */}
      <div className="mobile-filter-toggle md:hidden" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium text-sm">{title}</span>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>

      {/* Filter Content */}
      <div className={`filter-content ${isExpanded ? "expanded" : ""} md:block`}>
        <div className="filter-section md:block">{children}</div>
      </div>
    </div>
  )
}
