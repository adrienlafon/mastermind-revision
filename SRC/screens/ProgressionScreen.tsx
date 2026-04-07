import { useState, useMemo, useEffect } from 'react'
import { useAppStore, type AppState } from '../lib/store'
import { CATEGORY_CONFIG, MASTERY_CONFIG, SYSTEM_CATEGORY_CONFIG, type Category, type MasteryLevel, type TechniqueWithProgress, type SystemCategory, type ProgressionFilter } from '../lib/types'
import { TechniqueCard } from '../components/TechniqueCard'
import { AddTechniqueDialog } from '../components/AddTechniqueDialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Button } from '../components/ui/button'
import { Plus, Trash, CheckCircle, Circle, X } from '@phosphor-icons/react'

interface Props {
  onOpenDetail: (id: number) => void
  initialFilter?: ProgressionFilter
  onFilterConsumed?: () => void
}

const CATEGORIES: Category[] = ['defense', 'guard', 'passing', 'submission']
const SYSTEM_CATEGORIES: SystemCategory[] = ['guard', 'passing', 'submission']

export function ProgressionScreen({ onOpenDetail, initialFilter, onFilterConsumed }: Props) {
  const [tab, setTab] = useState<'techniques' | 'systems'>('techniques')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [masteryFilter, setMasteryFilter] = useState<MasteryLevel | 'all'>('all')

  // Apply initial filter from navigation
  useEffect(() => {
    if (initialFilter) {
      if (initialFilter.tab === 'techniques') {
        setTab('techniques')
        setCategory(initialFilter.category)
      } else if (initialFilter.tab === 'systems') {
        setTab('systems')
      }
      onFilterConsumed?.()
    }
  }, [initialFilter])
  const userTechniques = useAppStore((s: AppState) => s.userTechniques)
  const getProgressionTechniques = useAppStore((s: AppState) => s.getProgressionTechniques)
  const getAllTechniquesWithProgress = useAppStore((s: AppState) => s.getAllTechniquesWithProgress)
  const getAllTechniques = useAppStore((s: AppState) => s.getAllTechniques)
  const updateMastery = useAppStore((s: AppState) => s.updateMastery)
  const systems = useAppStore((s: AppState) => s.systems)
  const createSystem = useAppStore((s: AppState) => s.createSystem)
  const deleteSystem = useAppStore((s: AppState) => s.deleteSystem)
  const addTechniqueToSystem = useAppStore((s: AppState) => s.addTechniqueToSystem)
  const removeTechniqueFromSystem = useAppStore((s: AppState) => s.removeTechniqueFromSystem)
  const validateSystem = useAppStore((s: AppState) => s.validateSystem)

  const [addOpen, setAddOpen] = useState(false)
  const [addFromLibOpen, setAddFromLibOpen] = useState(false)
  const [createSystemOpen, setCreateSystemOpen] = useState(false)
  const [newSystemName, setNewSystemName] = useState('')
  const [newSystemCategory, setNewSystemCategory] = useState<SystemCategory>('guard')
  const [addToSystemId, setAddToSystemId] = useState<number | null>(null)

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

  const handleCreateSystem = () => {
    if (!newSystemName.trim()) return
    createSystem(newSystemName.trim(), newSystemCategory)
    setNewSystemName('')
    setNewSystemCategory('guard')
    setCreateSystemOpen(false)
  }

  // For the "add technique to system" dialog
  const addToSystem = systems.find(s => s.id === addToSystemId)
  const allTechniques = getAllTechniques()
  const availableForSystem = addToSystem
    ? allTechniques.filter(t => t.category === addToSystem.category && !addToSystem.techniqueIds.includes(t.id))
    : []

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
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

      {/* Mobile tab toggle */}
      <div className="flex rounded-lg border-2 border-border overflow-hidden md:hidden">
        <button
          onClick={() => setTab('techniques')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            tab === 'techniques' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'
          }`}
        >
          Techniques
        </button>
        <button
          onClick={() => setTab('systems')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            tab === 'systems' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'
          }`}
        >
          Systèmes ({systems.length})
        </button>
      </div>

      {/* Two-column layout on desktop, tabs on mobile */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Left column: Systems */}
        <div className={`md:w-[340px] md:shrink-0 space-y-3 ${tab !== 'systems' ? 'hidden md:block' : ''}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Mes Systèmes</h2>
            <button
              onClick={() => setCreateSystemOpen(true)}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              <Plus weight="bold" size={20} />
            </button>
          </div>

          {systems.length === 0 ? (
            <div className="text-center py-8 bg-card rounded-xl border-2 border-dashed border-border">
              <div className="text-3xl mb-2">🔗</div>
              <p className="text-sm text-muted-foreground">Aucun système créé</p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => setCreateSystemOpen(true)}>
                <Plus weight="bold" className="mr-1" size={14} /> Créer un système
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {systems.map(system => {
                const catConfig = SYSTEM_CATEGORY_CONFIG[system.category]
                const systemTechniques = system.techniqueIds.map(id => allTechniques.find(t => t.id === id)).filter(Boolean)
                return (
                  <div key={system.id} className={`rounded-xl border-2 overflow-hidden ${system.validated ? 'border-green-500/50 bg-green-500/5' : 'border-border bg-card'}`}>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {system.validated ? (
                            <CheckCircle size={18} weight="fill" className="text-green-500 shrink-0" />
                          ) : (
                            <Circle size={18} className="text-muted-foreground shrink-0" />
                          )}
                          <h3 className="font-semibold text-sm truncate">{system.name}</h3>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded text-white"
                            style={{ backgroundColor: catConfig.color }}
                          >
                            {catConfig.icon}
                          </span>
                          {!system.validated && (
                            <button
                              onClick={() => deleteSystem(system.id)}
                              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {systemTechniques.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-1">Aucune technique</p>
                      ) : (
                        <div className="space-y-1 mb-2">
                          {systemTechniques.map(t => t && (
                            <div key={t.id} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-background/50 border border-border/50">
                              <p className="text-xs flex-1 truncate cursor-pointer hover:text-primary" onClick={() => onOpenDetail(t.id)}>{t.name}</p>
                              {!system.validated && (
                                <button onClick={() => removeTechniqueFromSystem(system.id, t.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {!system.validated ? (
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="outline" onClick={() => setAddToSystemId(system.id)} className="flex-1 text-xs h-8">
                            <Plus weight="bold" className="mr-1" size={12} /> Technique
                          </Button>
                          <Button size="sm" onClick={() => validateSystem(system.id)} disabled={systemTechniques.length === 0} className="flex-1 text-xs h-8">
                            ✓ Valider
                          </Button>
                        </div>
                      ) : (
                        <p className="text-xs text-green-500 font-medium">✓ Système validé</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right column: Techniques */}
        <div className={`flex-1 space-y-4 ${tab !== 'techniques' ? 'hidden md:block' : ''}`}>
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
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
          <div className="flex gap-2 overflow-x-auto pb-1">
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
        </div>
      </div>

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

      {/* Create system dialog */}
      <Dialog open={createSystemOpen} onOpenChange={setCreateSystemOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Créer un système</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Nom du système *</label>
              <input
                type="text"
                value={newSystemName}
                onChange={e => setNewSystemName(e.target.value)}
                placeholder="Ex: Garde fermée, Half guard..."
                className="w-full mt-1 px-3 py-2.5 rounded-lg border-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Catégorie</label>
              <div className="flex gap-2 mt-1">
                {SYSTEM_CATEGORIES.map(cat => {
                  const config = SYSTEM_CATEGORY_CONFIG[cat]
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewSystemCategory(cat)}
                      className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-colors ${
                        newSystemCategory === cat
                          ? 'text-white border-transparent'
                          : 'bg-card border-border hover:border-primary/50'
                      }`}
                      style={newSystemCategory === cat ? { backgroundColor: config.color } : undefined}
                    >
                      {config.icon} {config.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCreateSystemOpen(false)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={handleCreateSystem} disabled={!newSystemName.trim()} className="flex-1">
                Créer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add technique to system dialog */}
      <Dialog open={addToSystemId !== null} onOpenChange={(open) => { if (!open) setAddToSystemId(null) }}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter une technique au système</DialogTitle>
          </DialogHeader>
          {availableForSystem.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Aucune technique disponible pour cette catégorie.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {availableForSystem.map(t => {
                const catConfig = CATEGORY_CONFIG[t.category]
                return (
                  <button
                    key={t.id}
                    onClick={() => { if (addToSystemId) addTechniqueToSystem(addToSystemId, t.id); setAddToSystemId(null) }}
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
