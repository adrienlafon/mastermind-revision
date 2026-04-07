import { useState, useMemo } from 'react'
import { useAppStore, type AppState } from '../lib/store'
import { TECHNIQUES } from '../lib/techniques'
import { CATEGORY_CONFIG, MASTERY_CONFIG, BELT_CONFIG, type Category, type Technique, type MasteryLevel, type Belt } from '../lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Button } from '../components/ui/button'
import { PencilSimple, Trash, Plus, MagnifyingGlass, Export, X } from '@phosphor-icons/react'

type AdminTab = 'techniques' | 'progression' | 'export'

const CATEGORIES: Category[] = ['defense', 'guard', 'passing', 'submission']

export function AdminScreen() {
  const [tab, setTab] = useState<AdminTab>('techniques')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold">Administration</h1>
        <p className="text-sm text-muted-foreground">Gérer les techniques et voir la progression</p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg border-2 border-border overflow-hidden">
        {([
          { key: 'techniques' as AdminTab, label: 'Techniques' },
          { key: 'progression' as AdminTab, label: 'Progression' },
          { key: 'export' as AdminTab, label: 'Export / Import' },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'techniques' && <TechniquesTab search={search} setSearch={setSearch} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />}
      {tab === 'progression' && <ProgressionTab />}
      {tab === 'export' && <ExportTab />}
    </div>
  )
}

// ─── Techniques Tab ──────────────────────────────────────────

function TechniquesTab({ search, setSearch, categoryFilter, setCategoryFilter }: {
  search: string
  setSearch: (s: string) => void
  categoryFilter: Category | 'all'
  setCategoryFilter: (c: Category | 'all') => void
}) {
  const getAllTechniques = useAppStore((s: AppState) => s.getAllTechniques)
  const customTechniques = useAppStore((s: AppState) => s.customTechniques)
  const addCustomTechnique = useAppStore((s: AppState) => s.addCustomTechnique)
  const editTechnique = useAppStore((s: AppState) => s.editTechnique)
  const deleteTechnique = useAppStore((s: AppState) => s.deleteTechnique)

  const [editDialog, setEditDialog] = useState<{ open: boolean; technique: Technique | null }>({ open: false, technique: null })
  const [addOpen, setAddOpen] = useState(false)
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState<Category>('guard')
  const [formDescription, setFormDescription] = useState('')
  const [formVideoUrl, setFormVideoUrl] = useState('')

  const allTechniques = getAllTechniques()
  const customIds = new Set(customTechniques.map(t => t.id))

  const filtered = useMemo(() => {
    let result = allTechniques
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    }
    return result
  }, [search, categoryFilter, allTechniques])

  const openEdit = (t: Technique) => {
    setFormName(t.name)
    setFormCategory(t.category)
    setFormDescription(t.description)
    setFormVideoUrl(t.videoUrl ?? '')
    setEditDialog({ open: true, technique: t })
  }

  const openAdd = () => {
    setFormName('')
    setFormCategory('guard')
    setFormDescription('')
    setFormVideoUrl('')
    setAddOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editDialog.technique || !formName.trim()) return
    editTechnique(editDialog.technique.id, {
      name: formName.trim(),
      category: formCategory,
      description: formDescription.trim(),
      videoUrl: formVideoUrl.trim() || undefined,
    })
    setEditDialog({ open: false, technique: null })
  }

  const handleAdd = () => {
    if (!formName.trim()) return
    addCustomTechnique({
      name: formName.trim(),
      category: formCategory,
      description: formDescription.trim(),
      videoUrl: formVideoUrl.trim() || undefined,
    })
    setAddOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-10 py-2 rounded-lg border-2 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          )}
        </div>
        <Button onClick={openAdd}>
          <Plus weight="bold" className="mr-1" size={16} /> Nouvelle technique
        </Button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
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

      {/* Table */}
      <div className="rounded-xl border-2 border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nom</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Catégorie</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Vidéo</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Type</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const catConfig = CATEGORY_CONFIG[t.category]
                const isCustom = customIds.has(t.id)
                return (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2.5 text-muted-foreground text-xs font-mono">{t.id}</td>
                    <td className="px-4 py-2.5 font-medium">{t.name}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: catConfig.color }}
                      >
                        {catConfig.icon} {catConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      {t.videoUrl ? (
                        <a href={t.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">🔗 Lien</a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${isCustom ? 'bg-blue-500/20 text-blue-400' : 'bg-muted text-muted-foreground'}`}>
                        {isCustom ? 'Custom' : 'Base'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isCustom && (
                          <>
                            <button
                              onClick={() => openEdit(t)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                              <PencilSimple size={16} />
                            </button>
                            <button
                              onClick={() => { if (confirm(`Supprimer "${t.name}" ?`)) deleteTechnique(t.id) }}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash size={16} />
                            </button>
                          </>
                        )}
                        {!isCustom && (
                          <span className="text-[10px] text-muted-foreground">Lecture seule</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Aucune technique trouvée.</p>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} technique{filtered.length !== 1 ? 's' : ''} affichée{filtered.length !== 1 ? 's' : ''}</p>

      {/* Edit dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => { if (!open) setEditDialog({ open: false, technique: null }) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier la technique</DialogTitle>
          </DialogHeader>
          <TechniqueForm
            name={formName} setName={setFormName}
            category={formCategory} setCategory={setFormCategory}
            description={formDescription} setDescription={setFormDescription}
            videoUrl={formVideoUrl} setVideoUrl={setFormVideoUrl}
            onSubmit={handleSaveEdit}
            onCancel={() => setEditDialog({ open: false, technique: null })}
            submitLabel="Enregistrer"
          />
        </DialogContent>
      </Dialog>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter une technique</DialogTitle>
          </DialogHeader>
          <TechniqueForm
            name={formName} setName={setFormName}
            category={formCategory} setCategory={setFormCategory}
            description={formDescription} setDescription={setFormDescription}
            videoUrl={formVideoUrl} setVideoUrl={setFormVideoUrl}
            onSubmit={handleAdd}
            onCancel={() => setAddOpen(false)}
            submitLabel="Ajouter"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Shared Technique Form ───────────────────────────────────

function TechniqueForm({ name, setName, category, setCategory, description, setDescription, videoUrl, setVideoUrl, onSubmit, onCancel, submitLabel }: {
  name: string; setName: (s: string) => void
  category: Category; setCategory: (c: Category) => void
  description: string; setDescription: (s: string) => void
  videoUrl: string; setVideoUrl: (s: string) => void
  onSubmit: () => void; onCancel: () => void
  submitLabel: string
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Nom *</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
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
        <Button variant="outline" onClick={onCancel} className="flex-1">Annuler</Button>
        <Button onClick={onSubmit} disabled={!name.trim()} className="flex-1">{submitLabel}</Button>
      </div>
    </div>
  )
}

// ─── Progression Tab ─────────────────────────────────────────

function ProgressionTab() {
  const getAllTechniquesWithProgress = useAppStore((s: AppState) => s.getAllTechniquesWithProgress)
  const systems = useAppStore((s: AppState) => s.systems)
  const belt = useAppStore((s: AppState) => s.belt)
  const getProgressByCategory = useAppStore((s: AppState) => s.getProgressByCategory)
  const getGamePlanTechniques = useAppStore((s: AppState) => s.getGamePlanTechniques)
  const userTechniques = useAppStore((s: AppState) => s.userTechniques)

  const allTechniques = getAllTechniquesWithProgress()
  const progress = getProgressByCategory()
  const gamePlan = getGamePlanTechniques()

  const masteryBreakdown = useMemo(() => {
    const counts: Record<MasteryLevel, number> = { not_learned: 0, in_progress: 0, sparring_ok: 0, competition_ok: 0 }
    allTechniques.forEach(t => { counts[t.masteryLevel]++ })
    return counts
  }, [allTechniques])

  const totalWithProgress = allTechniques.filter(t => t.masteryLevel !== 'not_learned').length
  const totalWithNotes = Object.values(userTechniques).filter(ut => ut.notes.trim()).length

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Ceinture" value={BELT_CONFIG[belt].icon + ' ' + BELT_CONFIG[belt].label} />
        <StatCard label="Techniques totales" value={String(allTechniques.length)} />
        <StatCard label="En apprentissage" value={String(totalWithProgress)} />
        <StatCard label="Game Plan" value={String(gamePlan.length)} />
      </div>

      {/* Mastery distribution */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Répartition par niveau</h3>
        <div className="space-y-2">
          {(['not_learned', 'in_progress', 'sparring_ok', 'competition_ok'] as MasteryLevel[]).map(level => {
            const config = MASTERY_CONFIG[level]
            const count = masteryBreakdown[level]
            const pct = allTechniques.length > 0 ? Math.round((count / allTechniques.length) * 100) : 0
            return (
              <div key={level} className="flex items-center gap-3">
                <span className="text-sm w-28 shrink-0">{config.shortLabel} {config.label}</span>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: config.color }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-16 text-right">{count} ({pct}%)</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Progress by category */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Progression par catégorie</h3>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(cat => {
            const config = CATEGORY_CONFIG[cat]
            const prog = progress[cat]
            return (
              <div key={cat} className="bg-card rounded-xl border-2 border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>{config.icon}</span>
                  <span className="text-sm font-semibold">{config.label}</span>
                </div>
                <div className="text-xl font-bold mb-1" style={{ color: config.color }}>{prog.percentage}%</div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${prog.percentage}%`, backgroundColor: config.color }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{prog.learned}/{prog.total} maîtrisées</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Systems overview */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Systèmes ({systems.length})
        </h3>
        {systems.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun système créé.</p>
        ) : (
          <div className="rounded-xl border-2 border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-2 font-semibold text-muted-foreground">Nom</th>
                  <th className="text-left px-4 py-2 font-semibold text-muted-foreground">Catégorie</th>
                  <th className="text-left px-4 py-2 font-semibold text-muted-foreground">Techniques</th>
                  <th className="text-left px-4 py-2 font-semibold text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {systems.map(s => {
                  const catConfig = CATEGORY_CONFIG[s.category]
                  return (
                    <tr key={s.id} className="border-b border-border/50">
                      <td className="px-4 py-2 font-medium">{s.name}</td>
                      <td className="px-4 py-2">
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: catConfig.color }}>
                          {catConfig.icon} {catConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">{s.techniqueIds.length}</td>
                      <td className="px-4 py-2">
                        {s.validated ? (
                          <span className="text-xs font-medium text-green-500">✓ Validé</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">En cours</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Extra stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Notes rédigées" value={String(totalWithNotes)} />
        <StatCard label="Systèmes validés" value={String(systems.filter(s => s.validated).length)} />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-xl border-2 border-border p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

// ─── Export / Import Tab ─────────────────────────────────────

function ExportTab() {
  const userTechniques = useAppStore((s: AppState) => s.userTechniques)
  const customTechniques = useAppStore((s: AppState) => s.customTechniques)
  const systems = useAppStore((s: AppState) => s.systems)
  const belt = useAppStore((s: AppState) => s.belt)
  const [importText, setImportText] = useState('')

  const exportData = () => {
    const data = {
      version: 1,
      exportDate: new Date().toISOString(),
      belt,
      userTechniques,
      customTechniques,
      systems,
    }
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bjj-tracker-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = () => {
    try {
      const data = JSON.parse(importText)
      if (data.version !== 1) {
        alert('Format non reconnu')
        return
      }
      const store = useAppStore.getState()
      if (data.belt) store.setBelt(data.belt)
      if (data.customTechniques) {
        useAppStore.setState({ customTechniques: data.customTechniques })
      }
      if (data.userTechniques) {
        useAppStore.setState({ userTechniques: data.userTechniques })
      }
      if (data.systems) {
        useAppStore.setState({ systems: data.systems })
      }
      setImportText('')
      alert('Import réussi !')
    } catch {
      alert('JSON invalide')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Exporter les données</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Télécharger toutes vos données (progression, techniques custom, systèmes) en fichier JSON.
        </p>
        <Button onClick={exportData}>
          <Export weight="bold" className="mr-1" size={16} /> Exporter en JSON
        </Button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Importer des données</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Collez le contenu d'un fichier JSON exporté précédemment. Attention : ceci remplacera vos données actuelles.
        </p>
        <textarea
          value={importText}
          onChange={e => setImportText(e.target.value)}
          placeholder="Collez le JSON ici..."
          className="w-full min-h-[120px] p-3 rounded-lg border-2 bg-background text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
        <Button onClick={importData} disabled={!importText.trim()} variant="outline" className="mt-2">
          Importer
        </Button>
      </div>
    </div>
  )
}
