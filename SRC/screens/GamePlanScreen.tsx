/**
 * GamePlanScreen.tsx — Game Plan linéaire.
 *
 * Permet à l'utilisateur de construire un enchaînement ordonné de techniques.
 * Fonctionnalités :
 * - Ajouter des techniques depuis la progression ou en créer de nouvelles
 * - Réordonner par drag & drop
 * - Supprimer une technique du plan
 * - Cliquer pour voir le détail
 */
import { useState } from 'react'
import { useAppStore, type AppState } from '../lib/store'
import { CATEGORY_CONFIG, MASTERY_CONFIG, type TechniqueWithProgress } from '../lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Button } from '../components/ui/button'
import { AddTechniqueDialog } from '../components/AddTechniqueDialog'
import { ArrowLeft, DotsSixVertical, Plus, Trash } from '@phosphor-icons/react'

interface Props {
  onOpenDetail: (id: number) => void
  onBack: () => void
}

export function GamePlanScreen({ onOpenDetail, onBack }: Props) {
  const getGamePlanTechniques = useAppStore((s: AppState) => s.getGamePlanTechniques)
  const getProgressionTechniques = useAppStore((s: AppState) => s.getProgressionTechniques)
  const toggleGamePlan = useAppStore((s: AppState) => s.toggleGamePlan)
  const reorderGamePlan = useAppStore((s: AppState) => s.reorderGamePlan)
  const userTechniques = useAppStore((s: AppState) => s.userTechniques)

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addTechniqueOpen, setAddTechniqueOpen] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const gamePlanTechniques: TechniqueWithProgress[] = getGamePlanTechniques()
  const allProgression: TechniqueWithProgress[] = getProgressionTechniques()
  const progressionTechniques = allProgression.filter(t => !t.inGamePlan)

  const handleDragStart = (index: number) => setDragIndex(index)
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== index) {
      reorderGamePlan(dragIndex, index)
      setDragIndex(index)
    }
  }
  const handleDragEnd = () => setDragIndex(null)

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <ArrowLeft size={20} weight="bold" />
          </button>
          <div>
          <h1 className="text-xl font-bold">Mon Game Plan</h1>
          <p className="text-sm text-muted-foreground">
            {gamePlanTechniques.length} technique{gamePlanTechniques.length !== 1 ? 's' : ''}
          </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setAddTechniqueOpen(true)}>
            <Plus weight="bold" className="mr-1" size={16} /> Nouvelle
          </Button>
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus weight="bold" className="mr-1" size={16} /> Ajouter
          </Button>
        </div>
      </div>

      {gamePlanTechniques.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-muted-foreground font-medium">Aucune technique dans votre game plan.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Ajoutez des techniques depuis votre progression.
          </p>
          <Button className="mt-4" onClick={() => setAddDialogOpen(true)}>
            <Plus weight="bold" className="mr-1" /> Ajouter depuis ma progression
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {gamePlanTechniques.map((t, index) => {
            const catConfig = CATEGORY_CONFIG[t.category]
            const masteryConfig = MASTERY_CONFIG[t.masteryLevel]
            return (
              <div
                key={t.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 bg-card rounded-xl border-2 p-3 cursor-grab active:cursor-grabbing transition-all ${
                  dragIndex === index ? 'opacity-50 border-primary scale-[0.98]' : 'border-border'
                }`}
              >
                <div className="shrink-0 flex flex-col items-center">
                  <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>
                  <DotsSixVertical size={18} className="text-muted-foreground" weight="bold" />
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onOpenDetail(t.id)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded text-white"
                      style={{ backgroundColor: catConfig.color }}
                    >
                      {catConfig.icon} {catConfig.label}
                    </span>
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: masteryConfig.color }}
                    >
                      {masteryConfig.shortLabel} {masteryConfig.label}
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate">{t.name}</p>
                </div>
                <button
                  onClick={() => toggleGamePlan(t.id)}
                  className="shrink-0 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash size={18} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Add from progression dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter depuis ma progression</DialogTitle>
          </DialogHeader>
          {progressionTechniques.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                Aucune technique disponible.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Changez le niveau de maîtrise d'une technique dans la bibliothèque pour la voir ici.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {progressionTechniques.map(t => {
                const catConfig = CATEGORY_CONFIG[t.category]
                const masteryConfig = MASTERY_CONFIG[t.masteryLevel]
                return (
                  <button
                    key={t.id}
                    onClick={() => { toggleGamePlan(t.id); setAddDialogOpen(false) }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-border hover:border-primary/50 text-left transition-colors"
                  >
                    <span
                      className="text-xs px-1.5 py-0.5 rounded text-white shrink-0"
                      style={{ backgroundColor: catConfig.color }}
                    >
                      {catConfig.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.name}</p>
                      <span className="text-[10px]" style={{ color: masteryConfig.color }}>
                        {masteryConfig.shortLabel} {masteryConfig.label}
                      </span>
                    </div>
                    <Plus size={18} className="text-primary shrink-0" />
                  </button>
                )
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AddTechniqueDialog open={addTechniqueOpen} onOpenChange={setAddTechniqueOpen} />
    </div>
  )
}
