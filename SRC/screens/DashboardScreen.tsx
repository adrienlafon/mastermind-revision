import { useAppStore, type AppState } from '../lib/store'
import { CATEGORY_CONFIG, type Category } from '../lib/types'
import { Target, ChartLineUp, Books } from '@phosphor-icons/react'
import type { Screen } from '../components/BottomNav'

interface Props {
  onNavigate: (screen: Screen) => void
}

const CATEGORIES: Category[] = ['defense', 'guard', 'passing', 'submission']

export function DashboardScreen({ onNavigate }: Props) {
  const getProgressByCategory = useAppStore((s: AppState) => s.getProgressByCategory)
  const getGamePlanTechniques = useAppStore((s: AppState) => s.getGamePlanTechniques)
  const getProgressionTechniques = useAppStore((s: AppState) => s.getProgressionTechniques)
  const progress = getProgressByCategory()
  const gamePlanCount = getGamePlanTechniques().length
  const progressionCount = getProgressionTechniques().length

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">MasterMind</h1>
        <p className="text-muted-foreground text-sm">Votre parcours JJB</p>
      </div>

      {/* Progress indicators */}
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map(cat => {
          const config = CATEGORY_CONFIG[cat]
          const prog = progress[cat]
          return (
            <div key={cat} className="bg-card rounded-xl border-2 border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{config.icon}</span>
                <span className="text-sm font-semibold">{config.label}</span>
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: config.color }}>
                {prog.percentage}%
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${prog.percentage}%`, backgroundColor: config.color }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {prog.learned}/{prog.total} maîtrisées
              </p>
            </div>
          )
        })}
      </div>

      {/* Navigation cards */}
      <div className="space-y-3">
        <button
          onClick={() => onNavigate('gameplan')}
          className="w-full bg-card rounded-xl border-2 border-border p-5 text-left hover:border-primary/50 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target size={22} className="text-primary" weight="fill" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Mon Game Plan</h3>
              <p className="text-sm text-muted-foreground">
                {gamePlanCount} technique{gamePlanCount !== 1 ? 's' : ''} sélectionnée{gamePlanCount !== 1 ? 's' : ''}
              </p>
            </div>
            <span className="text-muted-foreground">→</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('progression')}
          className="w-full bg-card rounded-xl border-2 border-border p-5 text-left hover:border-primary/50 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ChartLineUp size={22} className="text-primary" weight="fill" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Ma Progression</h3>
              <p className="text-sm text-muted-foreground">
                {progressionCount} technique{progressionCount !== 1 ? 's' : ''} en cours
              </p>
            </div>
            <span className="text-muted-foreground">→</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('library')}
          className="w-full bg-card rounded-xl border-2 border-border p-5 text-left hover:border-primary/50 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Books size={22} className="text-primary" weight="fill" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Bibliothèque de techniques</h3>
              <p className="text-sm text-muted-foreground">Explorez les 70 techniques</p>
            </div>
            <span className="text-muted-foreground">→</span>
          </div>
        </button>
      </div>
    </div>
  )
}
