import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Target, Zap, BookOpen } from "lucide-react"

interface AchievementBadgeProps {
  type: "trophy" | "star" | "target" | "zap" | "book"
  title: string
  description: string
  earned: boolean
  size?: "sm" | "md" | "lg"
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  target: Target,
  zap: Zap,
  book: BookOpen,
}

export function AchievementBadge({ type, title, description, earned, size = "md" }: AchievementBadgeProps) {
  const Icon = iconMap[type]

  const sizeClasses = {
    sm: "w-12 h-12 text-xs",
    md: "w-16 h-16 text-sm",
    lg: "w-20 h-20 text-base",
  }

  return (
    <div
      className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
        earned
          ? "bg-yellow-100 border-2 border-yellow-300"
          : "bg-gray-50 border-2 border-gray-200 opacity-60"
      }`}
    >
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center mb-2 ${
          earned ? "bg-yellow-400 text-white shadow-lg" : "bg-gray-300 text-gray-500"
        }`}
      >
        <Icon className="w-1/2 h-1/2" />
      </div>
      <h4 className={`font-semibold text-center ${earned ? "text-gray-900" : "text-gray-500"}`}>{title}</h4>
      <p className={`text-xs text-center mt-1 ${earned ? "text-gray-600" : "text-gray-400"}`}>{description}</p>
      {earned && (
        <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
          Earned!
        </Badge>
      )}
    </div>
  )
}
