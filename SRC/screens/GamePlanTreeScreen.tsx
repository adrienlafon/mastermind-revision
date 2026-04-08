/**
 * GamePlanTreeScreen.tsx — Arbre de décision.
 *
 * Permet de créer des arbres de décision conditionnels :
 * - Chaque nœud représente une position ou technique
 * - Les branches représentent les réactions de l'adversaire ("Si il fait X...")
 * - Chaque nœud peut être lié à une technique de la bibliothèque
 * - L'arbre est affiché récursivement avec des couleurs par profondeur
 *
 * Trois composants :
 * - GamePlanTreeScreen : liste des arbres + création/suppression
 * - TreeEditor : édition d'un arbre (ajout de nœuds, branches, liens)
 * - TreeNodeView : affichage récursif d'un nœud et ses enfants
 */
import { useState } from 'react'
import { useAppStore, type AppState } from '../lib/store'
import type { DecisionTree, DecisionTreeNode, DecisionTreeBranch } from '../lib/types'
import { CATEGORY_CONFIG } from '../lib/types'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog'
import { ArrowLeft, Plus, Trash, PencilSimple, TreeStructure, CaretDown, LinkSimple } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Props {
  onOpenDetail: (id: number) => void
  onBack: () => void
}

export function GamePlanTreeScreen({ onOpenDetail, onBack }: Props) {
  const decisionTrees = useAppStore((s: AppState) => s.decisionTrees)
  const createDecisionTree = useAppStore((s: AppState) => s.createDecisionTree)
  const deleteDecisionTree = useAppStore((s: AppState) => s.deleteDecisionTree)
  const getAllTechniques = useAppStore((s: AppState) => s.getAllTechniques)

  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null)
  const [newTreeName, setNewTreeName] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const selectedTree = decisionTrees.find(t => t.id === selectedTreeId)

  const handleCreate = () => {
    if (!newTreeName.trim()) return
    const id = createDecisionTree(newTreeName.trim())
    setNewTreeName('')
    setCreateDialogOpen(false)
    setSelectedTreeId(id)
    toast.success('Arbre créé')
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Supprimer l'arbre "${name}" ?`)) return
    deleteDecisionTree(id)
    if (selectedTreeId === id) setSelectedTreeId(null)
    toast.success('Arbre supprimé')
  }

  if (selectedTree) {
    return (
      <TreeEditor
        tree={selectedTree}
        onBack={() => setSelectedTreeId(null)}
        onOpenDetail={onOpenDetail}
      />
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <ArrowLeft size={20} weight="bold" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Arbres de décision</h1>
            <p className="text-sm text-muted-foreground">
              {decisionTrees.length} arbre{decisionTrees.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
          <Plus weight="bold" className="mr-1" size={16} /> Nouveau
        </Button>
      </div>

      {decisionTrees.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🌳</div>
          <p className="text-muted-foreground font-medium">Aucun arbre de décision.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Créez un arbre pour planifier vos réactions selon les situations.
          </p>
          <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
            <Plus weight="bold" className="mr-1" /> Créer un arbre
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {decisionTrees.map(tree => (
            <div
              key={tree.id}
              className="flex items-center gap-3 bg-card rounded-xl border-2 border-border p-4 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setSelectedTreeId(tree.id)}
            >
              <TreeStructure size={24} className="text-primary shrink-0" weight="bold" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{tree.name}</p>
                <p className="text-xs text-muted-foreground">
                  {Object.keys(tree.nodes).length} nœud{Object.keys(tree.nodes).length > 1 ? 's' : ''} · 
                  Modifié {new Date(tree.updatedAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(tree.id, tree.name) }}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Nouvel arbre de décision</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Ex: Game plan depuis la garde fermée"
            value={newTreeName}
            onChange={(e) => setNewTreeName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
          <DialogFooter>
            <Button onClick={handleCreate} disabled={!newTreeName.trim()}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============== Tree Editor ==============

function TreeEditor({ tree, onBack, onOpenDetail }: { tree: DecisionTree; onBack: () => void; onOpenDetail: (id: number) => void }) {
  const updateTreeNode = useAppStore((s: AppState) => s.updateTreeNode)
  const addTreeNode = useAppStore((s: AppState) => s.addTreeNode)
  const deleteTreeNode = useAppStore((s: AppState) => s.deleteTreeNode)
  const updateDecisionTree = useAppStore((s: AppState) => s.updateDecisionTree)
  const getAllTechniques = useAppStore((s: AppState) => s.getAllTechniques)

  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [addBranchNodeId, setAddBranchNodeId] = useState<string | null>(null)
  const [newBranchCondition, setNewBranchCondition] = useState('')
  const [newNodeLabel, setNewNodeLabel] = useState('')
  const [linkDialogNodeId, setLinkDialogNodeId] = useState<string | null>(null)
  const [searchTechnique, setSearchTechnique] = useState('')

  const techniques = getAllTechniques()
  const rootNode = tree.nodes[tree.rootNodeId]

  const handleAddBranch = () => {
    if (!addBranchNodeId || !newBranchCondition.trim() || !newNodeLabel.trim()) return
    const nodeId = crypto.randomUUID()
    const newNode: DecisionTreeNode = {
      id: nodeId,
      label: newNodeLabel.trim(),
      children: [],
    }
    addTreeNode(tree.id, newNode, addBranchNodeId, newBranchCondition.trim())
    setAddBranchNodeId(null)
    setNewBranchCondition('')
    setNewNodeLabel('')
  }

  const handleDeleteNode = (nodeId: string) => {
    if (nodeId === tree.rootNodeId) {
      toast.error('Impossible de supprimer le nœud racine')
      return
    }
    // Also recursively delete children
    const deleteRecursive = (nid: string) => {
      const node = tree.nodes[nid]
      if (node) {
        node.children.forEach(c => deleteRecursive(c.nodeId))
      }
      deleteTreeNode(tree.id, nid)
    }
    deleteRecursive(nodeId)
  }

  const handleLinkTechnique = (nodeId: string, techniqueId: number) => {
    updateTreeNode(tree.id, nodeId, { techniqueId })
    setLinkDialogNodeId(null)
    setSearchTechnique('')
  }

  const filteredTechniques = techniques.filter(t =>
    t.name.toLowerCase().includes(searchTechnique.toLowerCase())
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <ArrowLeft size={20} weight="bold" />
          </button>
          <div>
            <h1 className="text-xl font-bold truncate">{tree.name}</h1>
            <p className="text-xs text-muted-foreground">
              {Object.keys(tree.nodes).length} nœud{Object.keys(tree.nodes).length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Tree visualization */}
      {rootNode && (
        <div className="space-y-0">
          <TreeNodeView
            tree={tree}
            nodeId={tree.rootNodeId}
            depth={0}
            onEdit={setEditingNodeId}
            onAddBranch={setAddBranchNodeId}
            onDelete={handleDeleteNode}
            onLink={setLinkDialogNodeId}
            onOpenDetail={onOpenDetail}
            techniques={techniques}
          />
        </div>
      )}

      {/* Edit node dialog */}
      <Dialog open={editingNodeId !== null} onOpenChange={(open) => { if (!open) setEditingNodeId(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Modifier le nœud</DialogTitle>
          </DialogHeader>
          {editingNodeId && tree.nodes[editingNodeId] && (
            <div className="space-y-3">
              <Input
                value={tree.nodes[editingNodeId].label}
                onChange={(e) => updateTreeNode(tree.id, editingNodeId, { label: e.target.value })}
                placeholder="Nom de la position / technique"
              />
              <Input
                value={tree.nodes[editingNodeId].description || ''}
                onChange={(e) => updateTreeNode(tree.id, editingNodeId, { description: e.target.value })}
                placeholder="Description (optionnel)"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add branch dialog */}
      <Dialog open={addBranchNodeId !== null} onOpenChange={(open) => { if (!open) setAddBranchNodeId(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Ajouter une réaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Si l'adversaire...</label>
              <Input
                value={newBranchCondition}
                onChange={(e) => setNewBranchCondition(e.target.value)}
                placeholder="Ex: défend en reculant ses hanches"
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Alors je fais...</label>
              <Input
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                placeholder="Ex: Passage en knee cut"
                onKeyDown={(e) => e.key === 'Enter' && handleAddBranch()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddBranch} disabled={!newBranchCondition.trim() || !newNodeLabel.trim()}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link technique dialog */}
      <Dialog open={linkDialogNodeId !== null} onOpenChange={(open) => { if (!open) { setLinkDialogNodeId(null); setSearchTechnique('') } }}>
        <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lier une technique</DialogTitle>
          </DialogHeader>
          <Input
            value={searchTechnique}
            onChange={(e) => setSearchTechnique(e.target.value)}
            placeholder="Rechercher..."
            autoFocus
          />
          <div className="space-y-1 max-h-[50vh] overflow-y-auto">
            {linkDialogNodeId && tree.nodes[linkDialogNodeId]?.techniqueId && (
              <button
                onClick={() => {
                  updateTreeNode(tree.id, linkDialogNodeId!, { techniqueId: undefined })
                  setLinkDialogNodeId(null)
                }}
                className="w-full text-left p-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                ✕ Retirer le lien
              </button>
            )}
            {filteredTechniques.map(t => {
              const catConfig = CATEGORY_CONFIG[t.category]
              return (
                <button
                  key={t.id}
                  onClick={() => handleLinkTechnique(linkDialogNodeId!, t.id)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <span className="text-[10px] px-1.5 py-0.5 rounded text-white shrink-0" style={{ backgroundColor: catConfig.color }}>
                    {catConfig.icon}
                  </span>
                  <span className="text-sm truncate">{t.name}</span>
                </button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============== Tree Node View (recursive) ==============

const DEPTH_COLORS = ['#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4']

interface TreeNodeViewProps {
  tree: DecisionTree
  nodeId: string
  depth: number
  onEdit: (id: string) => void
  onAddBranch: (id: string) => void
  onDelete: (id: string) => void
  onLink: (id: string) => void
  onOpenDetail: (id: number) => void
  techniques: { id: number; name: string; category: string }[]
}

function TreeNodeView({ tree, nodeId, depth, onEdit, onAddBranch, onDelete, onLink, onOpenDetail, techniques }: TreeNodeViewProps) {
  const node = tree.nodes[nodeId]
  if (!node) return null

  const linkedTechnique = node.techniqueId ? techniques.find(t => t.id === node.techniqueId) : null
  const depthColor = DEPTH_COLORS[depth % DEPTH_COLORS.length]
  const isRoot = nodeId === tree.rootNodeId

  return (
    <div className={`${depth > 0 ? 'ml-4 md:ml-8' : ''}`}>
      {/* Node card */}
      <div
        className="relative bg-card rounded-xl border-2 p-3 transition-colors hover:border-primary/30"
        style={{ borderLeftColor: depthColor, borderLeftWidth: '4px' }}
      >
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{node.label}</p>
            {node.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{node.description}</p>
            )}
            {linkedTechnique && (
              <button
                onClick={() => onOpenDetail(linkedTechnique.id)}
                className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <LinkSimple size={12} weight="bold" />
                {linkedTechnique.name}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => onLink(nodeId)} className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Lier une technique">
              <LinkSimple size={16} weight="bold" />
            </button>
            <button onClick={() => onEdit(nodeId)} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Modifier">
              <PencilSimple size={16} weight="bold" />
            </button>
            <button onClick={() => onAddBranch(nodeId)} className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Ajouter une branche">
              <Plus size={16} weight="bold" />
            </button>
            {!isRoot && (
              <button onClick={() => onDelete(nodeId)} className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Supprimer">
                <Trash size={16} weight="bold" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Branches */}
      {node.children.length > 0 && (
        <div className="mt-1 space-y-1">
          {node.children.map((branch, i) => (
            <div key={branch.nodeId}>
              {/* Condition label with connector line */}
              <div className="flex items-center gap-2 ml-4 md:ml-8 my-1">
                <CaretDown size={14} className="text-muted-foreground shrink-0" weight="bold" />
                <span className="text-xs font-medium text-muted-foreground italic bg-muted/50 px-2 py-0.5 rounded-full">
                  Si : {branch.condition}
                </span>
              </div>
              {/* Child node (recursive) */}
              <TreeNodeView
                tree={tree}
                nodeId={branch.nodeId}
                depth={depth + 1}
                onEdit={onEdit}
                onAddBranch={onAddBranch}
                onDelete={onDelete}
                onLink={onLink}
                onOpenDetail={onOpenDetail}
                techniques={techniques}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
