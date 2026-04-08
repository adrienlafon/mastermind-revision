/**
 * MasterySelector.tsx — Sélecteur de niveau de maîtrise.
 *
 * 4 boutons horizontaux : Non appris → En cours → OK sparring → OK compétition.
 * Utilisé dans le dialog de détail et la progression.
 */
import { MASTERY_CONFIG, type MasteryLevel } from '../lib/types'

interface MasterySelectorProps {
  value: MasteryLevel
  onChange: (level: MasteryLevel) => void
  compact?: boolean
}

const LEVELS: MasteryLevel[] = ['not_learned', 'in_progress', 'sparring_ok', 'competition_ok']

export function MasterySelector({ value, onChange, compact = false }: MasterySelectorProps) {
  return (
    <div className={`flex ${compact ? 'gap-1' : 'gap-2 flex-wrap'}`}>
      {LEVELS.map((level) => {
        const config = MASTERY_CONFIG[level]
        const isActive = value === level
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
              isActive
                ? 'text-white border-transparent'
                : 'bg-card border-border hover:border-primary/50 text-muted-foreground'
            }`}
            style={isActive ? { backgroundColor: config.color } : undefined}
          >
            {compact ? config.shortLabel : `${config.shortLabel} ${config.label}`}
          </button>
        )
      })}
    </div>
  )
}
