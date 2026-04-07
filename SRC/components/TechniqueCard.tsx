import { CATEGORY_CONFIG, MASTERY_CONFIG, type Category, type MasteryLevel } from '../lib/types'

interface TechniqueCardProps {
  name: string
  category: Category
  masteryLevel: MasteryLevel
  onClick: () => void
}

export function TechniqueCard({ name, category, masteryLevel, onClick }: TechniqueCardProps) {
  const catConfig = CATEGORY_CONFIG[category]
  const masteryConfig = MASTERY_CONFIG[masteryLevel]

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card rounded-xl border-2 border-border p-4 hover:border-primary/50 transition-all active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: catConfig.color }}
        >
          {catConfig.icon} {catConfig.label}
        </span>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: masteryConfig.color + '22', color: masteryConfig.color }}
        >
          {masteryConfig.shortLabel} {masteryConfig.label}
        </span>
      </div>
      <h3 className="font-semibold text-sm leading-tight">{name}</h3>
    </button>
  )
}
