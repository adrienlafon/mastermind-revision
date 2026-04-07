import { useState, useMemo } from 'react'
import { useAppStore, type AppState } from '../lib/store'
import { CATEGORY_CONFIG, MASTERY_CONFIG, type Category, type MasteryLevel, type TechniqueWithProgress } from '../lib/types'
import { TechniqueCard } from '../components/TechniqueCard'
import { AddTechniqueDialog } from '../components/AddTechniqueDialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Button } from '../components/ui/button'
import { Plus } from '@phosphor-icons/react'

interface Props {
  onOpenDetail: (id: number) => void
}

const CATEGORIES: Category[] = ['defense', 'guard', 'passing', 'submission']

export function ProgressionScreen({ onOpenDetail }: Props) {
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [masteryFilter, setMasteryFilter] = useState<MasteryLevel | 'all'>('all')
  const userTechniques = useAppStore((s: AppState) => s.userTechniques)
  const getProgressionTechniques = useAppStore((s: AppState) => s.getProgressionTechniques)
  const getAllTechniquesWithProgress = useAppStore((s: AppState) => s.getAllTechniquesWithProgress)
  const updateMastery = useAppStore((s: AppState) => s.updateMastery)
  const [addOpen, setAddOpen] = useState(false)
  const [addFromLibOpen, setAddFromLibOpen] = useState(false)

  const notLearnedTechniques = useMemo(() => {
    return getAllTechniquesWithProgress().filter(t => t.masteryLevel === 'not_learned')
  }, [userTechniques])

  const techniques = useMemo(() => {
    let all: TechniqueWithProgress[] = getProgressionTechniques()
    if (category !== 'all') {
      all = all.filter(t => t.category === category)
    }
    if (masteryFilter !== 'all') {
      all = all.filter(t => t.masteryLevel === masteryFilter)
    }
    return all
  }, [category, masteryFilter, userTechniques])

  const totalInProgress = getProgressionTechniques().length

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Ma Progression</h1>
          <p className="text-sm text-muted-foreground">{totalInProgress} technique{totalInProgress !== 1 ? 's' : ''} en apprentissage</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
            <Plus weight="bold" className="mr-1" size={16} /> Nouvelle
          </Button>
          <Button size="sm" onClick={() => setAddFromLibOpen(true)}>
            <Plus weight="bold" className="mr-1" size={16} /> Ajouter
          </Button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        <button
          onClick={() => setCategory('all')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-colors ${
            category === 'all'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:border-primary/50'
          }`}
        >
          Tous
        </button>
        {CATEGORIES.map(cat => {
          const config = CATEGORY_CONFIG[cat]
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-colors ${
                category === cat
                  ? 'text-white border-transparent'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              style={category === cat ? { backgroundColor: config.color } : undefined}
            >
              {config.icon} {config.label}
            </button>
          )
        })}
      </div>

      {/* Mastery filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        <button
          onClick={() => setMasteryFilter('all')}
          className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
            masteryFilter === 'all'
              ? 'bg-foreground/10 border-foreground/20 text-foreground'
              : 'bg-card border-border text-muted-foreground'
          }`}
        >
          Tous niveaux
        </button>
        {(['in_progress', 'sparring_ok', 'competition_ok'] as MasteryLevel[]).map(level => {
          const config = MASTERY_CONFIG[level]
          return (
            <button
              key={level}
              onClick={() => setMasteryFilter(masteryFilter === level ? 'all' : level)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                masteryFilter === level
                  ? 'text-white border-transparent'
                  : 'bg-card border-border text-muted-foreground'
              }`}
              style={masteryFilter === level ? { backgroundColor: config.color } : undefined}
            >
              {config.shortLabel} {config.label}
            </button>
          )
        })}
      </div>

      {/* Technique list */}
      <div className="space-y-3">
        {techniques.map(t => (
          <TechniqueCard
            key={t.id}
            name={t.name}
            category={t.category}
            masteryLevel={t.masteryLevel}
            onClick={() => onOpenDetail(t.id)}
          />
        ))}
      </div>

      {techniques.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucune technique en progression.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Commencez par explorer la bibliothèque et changer le niveau de maîtrise d'une technique.
          </p>
        </div>
      )}

      <AddTechniqueDialog open={addOpen} onOpenChange={setAddOpen} />

      {/* Add from library dialog */}
      <Dialog open={addFromLibOpen} onOpenChange={setAddFromLibOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter depuis la bibliothèque</DialogTitle>
          </DialogHeader>
          {notLearnedTechniques.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Toutes les techniques sont déjà en progression.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notLearnedTechniques.map(t => {
                const catConfig = CATEGORY_CONFIG[t.category]
                return (
                  <button
                    key={t.id}
                    onClick={() => { updateMastery(t.id, 'in_progress'); setAddFromLibOpen(false) }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-border hover:border-primary/50 text-left transition-colors"
                  >
                    <span
                      className="text-xs px-1.5 py-0.5 rounded text-white shrink-0"
                      style={{ backgroundColor: catConfig.color }}
                    >
                      {catConfig.icon}
                    </span>
                    <p className="text-sm font-medium truncate flex-1">{t.name}</p>
                    <Plus size={18} className="text-primary shrink-0" />
                  </button>
                )
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
