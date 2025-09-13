import { Flame } from "lucide-react"

interface StreakCounterProps {
  days: number
  label?: string
}

export function StreakCounter({ days, label = "Day Streak" }: StreakCounterProps) {
  return (
    <div className="flex items-center space-x-2 bg-orange-100 px-3 py-2 rounded-full border border-orange-200">
      <Flame className={`w-4 h-4 ${days > 0 ? "text-orange-500" : "text-gray-400"}`} />
      <div className="text-sm">
        <span className="font-bold text-orange-600">{days}</span>
        <span className="text-orange-500 ml-1">{label}</span>
      </div>
    </div>
  )
}
