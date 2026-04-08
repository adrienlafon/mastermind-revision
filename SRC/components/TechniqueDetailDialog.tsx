/**
 * TechniqueDetailDialog.tsx — Dialog de détail d'une technique.
 *
 * Affiche pour une technique :
 * - Nom, catégorie, description complète
 * - Sélecteur de niveau de maîtrise (4 niveaux)
 * - Lien vers la vidéo Patreon
 * - Zone de notes personnelles
 * - Bouton pour ajouter/retirer du game plan
 *
 * Ce dialog est partagé entre tous les écrans (ouvert via setDetailId dans App.tsx).
 */
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { CATEGORY_CONFIG } from '../lib/types'
import { useAppStore, type AppState } from '../lib/store'
import { MasterySelector } from './MasterySelector'

interface Props {
  techniqueId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TechniqueDetailDialog({ techniqueId, open, onOpenChange }: Props) {
  const getAllTechniques = useAppStore((s: AppState) => s.getAllTechniques)
  const technique = getAllTechniques().find(t => t.id === techniqueId)
  const userTechniques = useAppStore((s: AppState) => s.userTechniques)
  const updateMastery = useAppStore((s: AppState) => s.updateMastery)
  const updateNotes = useAppStore((s: AppState) => s.updateNotes)
  const toggleGamePlan = useAppStore((s: AppState) => s.toggleGamePlan)

  if (!technique) return null

  const userTech = userTechniques[technique.id]
  const mastery = userTech?.masteryLevel ?? 'not_learned'
  const notes = userTech?.notes ?? ''
  const inGamePlan = userTech?.inGamePlan ?? false
  const catConfig = CATEGORY_CONFIG[technique.category]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: catConfig.color }}
            >
              {catConfig.icon} {catConfig.label}
            </span>
          </div>
          <DialogTitle className="text-lg">{technique.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {technique.videoUrl && (
            <a
              href={technique.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
            >
              ▶ Voir la vidéo
            </a>
          )}

          <div>
            <h4 className="text-sm font-semibold mb-1 text-muted-foreground uppercase tracking-wide">Description</h4>
            <p className="text-sm leading-relaxed">{technique.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Niveau de maîtrise</h4>
            <MasterySelector value={mastery} onChange={(level) => updateMastery(technique.id, level)} />
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-1 text-muted-foreground uppercase tracking-wide">Notes personnelles</h4>
            <textarea
              value={notes}
              onChange={(e) => updateNotes(technique.id, e.target.value)}
              placeholder="Ajoutez vos notes..."
              className="w-full min-h-[80px] p-3 rounded-lg border-2 bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          <label
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => toggleGamePlan(technique.id)}
          >
            <input
              type="checkbox"
              checked={inGamePlan}
              onChange={() => toggleGamePlan(technique.id)}
              className="w-5 h-5 rounded accent-primary cursor-pointer"
              onClick={e => e.stopPropagation()}
            />
            <span className="text-sm font-medium">Dans mon Game Plan</span>
          </label>

          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full"
          >
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
