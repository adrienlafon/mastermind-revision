import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { CATEGORY_CONFIG, type Category } from '../lib/types'
import { useAppStore, type AppState } from '../lib/store'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CATEGORIES: Category[] = ['defense', 'guard', 'passing', 'submission']

export function AddTechniqueDialog({ open, onOpenChange }: Props) {
  const addCustomTechnique = useAppStore((s: AppState) => s.addCustomTechnique)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('guard')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const handleSubmit = () => {
    if (!name.trim()) return
    addCustomTechnique({
      name: name.trim(),
      category,
      description: description.trim(),
      videoUrl: videoUrl.trim() || undefined,
    })
    setName('')
    setCategory('guard')
    setDescription('')
    setVideoUrl('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter une technique</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Nom *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nom de la technique..."
              className="w-full mt-1 px-3 py-2.5 rounded-lg border-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Catégorie</label>
            <div className="flex gap-2 mt-1 flex-wrap">
              {CATEGORIES.map(cat => {
                const config = CATEGORY_CONFIG[cat]
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-colors ${
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
          </div>

          <div>
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description de la technique..."
              className="w-full mt-1 min-h-[60px] p-3 rounded-lg border-2 bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Lien vidéo</label>
            <input
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full mt-1 px-3 py-2.5 rounded-lg border-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={!name.trim()} className="flex-1">
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
