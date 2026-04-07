import { useState, useMemo } from 'react'
import { CATEGORY_CONFIG, type Category } from '../lib/types'
import { useAppStore, type AppState } from '../lib/store'
import { TechniqueCard } from '../components/TechniqueCard'
import { AddTechniqueDialog } from '../components/AddTechniqueDialog'
import { ArrowLeft, MagnifyingGlass, X, Plus } from '@phosphor-icons/react'
import { Button } from '../components/ui/button'

interface Props {
  onOpenDetail: (id: number) => void
  onBack: () => void
}

const CATEGORIES: Category[] = ['defense', 'guard', 'passing', 'submission']

export function LibraryScreen({ onOpenDetail, onBack }: Props) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')
  const userTechniques = useAppStore((s: AppState) => s.userTechniques)
  const getAllTechniques = useAppStore((s: AppState) => s.getAllTechniques)
  const [addOpen, setAddOpen] = useState(false)

  const allTechniques = getAllTechniques()

  const filtered = useMemo(() => {
    let result = allTechniques
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      )
    }
    return result
  }, [search, categoryFilter, allTechniques])

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <ArrowLeft size={20} weight="bold" />
          </button>
          <h1 className="text-xl font-bold">Bibliothèque</h1>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus weight="bold" className="mr-1" size={16} /> Nouvelle
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une technique..."
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border-2 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-colors ${
            categoryFilter === 'all'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:border-primary/50'
          }`}
        >
          Tous ({allTechniques.length})
        </button>
        {CATEGORIES.map(cat => {
          const config = CATEGORY_CONFIG[cat]
          const count = allTechniques.filter(t => t.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-colors ${
                categoryFilter === cat
                  ? 'text-white border-transparent'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              style={categoryFilter === cat ? { backgroundColor: config.color } : undefined}
            >
              {config.icon} {config.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Technique list */}
      <div className="space-y-3">
        {filtered.map(t => {
          const ut = userTechniques[t.id]
          return (
            <TechniqueCard
              key={t.id}
              name={t.name}
              category={t.category}
              masteryLevel={ut?.masteryLevel ?? 'not_learned'}
              onClick={() => onOpenDetail(t.id)}
            />
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">Aucune technique trouvée.</p>
      )}

      <AddTechniqueDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
