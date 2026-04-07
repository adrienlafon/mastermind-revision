import { useAppStore, type AppState } from '../lib/store'
import { BELT_CONFIG, type Belt, type ProgressionFilter } from '../lib/types'
import { Target, ChartLineUp, Books, CheckCircle, CaretRight } from '@phosphor-icons/react'
import type { Screen } from '../components/BottomNav'

interface Props {
  onNavigate: (screen: Screen) => void
  onNavigateProgression: (filter: ProgressionFilter) => void
}

const BELTS: Belt[] = ['white', 'blue', 'purple', 'brown', 'black']

export function DashboardScreen({ onNavigate, onNavigateProgression }: Props) {
  const belt = useAppStore((s: AppState) => s.belt)
  const setBelt = useAppStore((s: AppState) => s.setBelt)
  const getBeltObjectives = useAppStore((s: AppState) => s.getBeltObjectives)
  const getGamePlanTechniques = useAppStore((s: AppState) => s.getGamePlanTechniques)
  const getProgressionTechniques = useAppStore((s: AppState) => s.getProgressionTechniques)
  const objectives = getBeltObjectives()
  const gamePlanCount = getGamePlanTechniques().length
  const progressionCount = getProgressionTechniques().length
  const completedCount = objectives.filter(o => o.completed).length

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">MasterMind</h1>
        <p className="text-muted-foreground text-sm">Votre parcours JJB</p>
      </div>

      {/* Belt selector */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Ma ceinture</h2>
        <select
          value={belt}
          onChange={e => setBelt(e.target.value as Belt)}
          className="w-full px-3 py-2.5 rounded-lg border-2 bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors cursor-pointer"
        >
          {BELTS.map(b => {
            const config = BELT_CONFIG[b]
            return (
              <option key={b} value={b}>
                {config.icon} Ceinture {config.label}
              </option>
            )
          })}
        </select>
      </div>

      {/* Belt objectives */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Objectifs ceinture {BELT_CONFIG[belt].label.toLowerCase()}
          </h2>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {completedCount}/{objectives.length}
          </span>
        </div>

        {/* Overall progress bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${objectives.length > 0 ? Math.round((completedCount / objectives.length) * 100) : 0}%` }}
          />
        </div>

        <div className="space-y-2">
          {objectives.map((obj, i) => (
            <button
              key={i}
              onClick={() => onNavigateProgression(obj.filter)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left active:scale-[0.98] ${
                obj.completed
                  ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40'
                  : 'bg-card border-border hover:border-primary/40'
              }`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                obj.completed ? 'bg-green-500/20' : 'bg-muted'
              }`}>
                {obj.completed ? (
                  <CheckCircle size={20} weight="fill" className="text-green-500" />
                ) : (
                  <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${obj.completed ? 'text-green-400' : 'text-foreground'}`}>
                  {obj.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{obj.description}</p>
              </div>
              <CaretRight size={16} className="text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
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
              <p className="text-sm text-muted-foreground">Explorez les techniques</p>
            </div>
            <span className="text-muted-foreground">→</span>
          </div>
        </button>
      </div>
    </div>
  )
}
