interface XPBarProps {
  currentXP: number
  maxXP: number
  level: number
  showLevel?: boolean
}

export function XPBar({ currentXP, maxXP, level, showLevel = true }: XPBarProps) {
  const percentage = Math.min((currentXP / maxXP) * 100, 100)

  return (
    <div className="flex items-center space-x-3">
      {showLevel && (
        <div className="text-sm font-semibold text-gray-700 bg-blue-100 px-2 py-1 rounded-full">Lv. {level}</div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-600">XP Progress</span>
          <span className="text-xs text-gray-500">
            {currentXP}/{maxXP}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
