/**
 * GamePlanTreeScreen.tsx — Arbre de décision visuel.
 *
 * Interface en boîtes (cards) déplaçables avec connecteurs visuels.
 * - Chaque nœud est une boîte colorée, réorganisable par drag & drop
 * - Les branches sont reliées par des flèches verticales avec conditions
 * - Actions directes sur chaque boîte (éditer, lier, ajouter, supprimer)
 */
import { useState, useRef } from 'react'
import { useAppStore, type AppState } from '../lib/store'
import type { DecisionTree, DecisionTreeNode } from '../lib/types'
import { CATEGORY_CONFIG } from '../lib/types'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog'
import { ArrowLeft, Plus, Trash, PencilSimple, TreeStructure, ArrowDown, LinkSimple, DotsSixVertical, CaretDown, CaretRight } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Props {
  onOpenDetail: (id: number) => void
  onBack: () => void
}

export function GamePlanTreeScreen({ onOpenDetail, onBack }: Props) {
  const decisionTrees = useAppStore((s: AppState) => s.decisionTrees)
  const createDecisionTree = useAppStore((s: AppState) => s.createDecisionTree)
  const deleteDecisionTree = useAppStore((s: AppState) => s.deleteDecisionTree)

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

const DEPTH_COLORS = ['#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4']

function TreeEditor({ tree, onBack, onOpenDetail }: { tree: DecisionTree; onBack: () => void; onOpenDetail: (id: number) => void }) {
  const updateTreeNode = useAppStore((s: AppState) => s.updateTreeNode)
  const addTreeNode = useAppStore((s: AppState) => s.addTreeNode)
  const deleteTreeNode = useAppStore((s: AppState) => s.deleteTreeNode)
  const getAllTechniques = useAppStore((s: AppState) => s.getAllTechniques)

  const [addBranchNodeId, setAddBranchNodeId] = useState<string | null>(null)
  const [newBranchCondition, setNewBranchCondition] = useState('')
  const [newNodeLabel, setNewNodeLabel] = useState('')
  const [linkDialogNodeId, setLinkDialogNodeId] = useState<string | null>(null)
  const [searchTechnique, setSearchTechnique] = useState('')
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => new Set([tree.rootNodeId]))
  const [dragState, setDragState] = useState<{ parentId: string; dragIdx: number } | null>(null)

  const techniques = getAllTechniques()
  const rootNode = tree.nodes[tree.rootNodeId]

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }

  const expandAll = () => {
    setExpandedNodes(new Set(Object.keys(tree.nodes)))
  }

  const handleAddBranch = () => {
    if (!addBranchNodeId || !newBranchCondition.trim() || !newNodeLabel.trim()) return
    const nodeId = crypto.randomUUID()
    const newNode: DecisionTreeNode = {
      id: nodeId,
      label: newNodeLabel.trim(),
      children: [],
    }
    addTreeNode(tree.id, newNode, addBranchNodeId, newBranchCondition.trim())
    setExpandedNodes(prev => new Set(prev).add(addBranchNodeId!).add(nodeId))
    setAddBranchNodeId(null)
    setNewBranchCondition('')
    setNewNodeLabel('')
  }

  const handleDeleteNode = (nodeId: string) => {
    if (nodeId === tree.rootNodeId) {
      toast.error('Impossible de supprimer le nœud racine')
      return
    }
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

  // Drag & drop reorder branches within a parent
  const handleBranchDragStart = (parentId: string, index: number) => {
    setDragState({ parentId, dragIdx: index })
  }

  const handleBranchDragOver = (e: React.DragEvent, parentId: string, index: number) => {
    e.preventDefault()
    if (!dragState || dragState.parentId !== parentId || dragState.dragIdx === index) return
    const parent = tree.nodes[parentId]
    if (!parent) return
    const newChildren = [...parent.children]
    const [moved] = newChildren.splice(dragState.dragIdx, 1)
    newChildren.splice(index, 0, moved)
    updateTreeNode(tree.id, parentId, { children: newChildren })
    setDragState({ parentId, dragIdx: index })
  }

  const handleBranchDragEnd = () => setDragState(null)

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
        <Button size="sm" variant="ghost" onClick={expandAll}>
          Tout ouvrir
        </Button>
      </div>

      {/* Tree visualization — visual flowchart */}
      {rootNode && (
        <div className="flex flex-col items-center">
          <NodeBox
            tree={tree}
            nodeId={tree.rootNodeId}
            depth={0}
            expandedNodes={expandedNodes}
            onToggleExpand={toggleExpand}
            onAddBranch={setAddBranchNodeId}
            onDelete={handleDeleteNode}
            onLink={setLinkDialogNodeId}
            onOpenDetail={onOpenDetail}
            onBranchDragStart={handleBranchDragStart}
            onBranchDragOver={handleBranchDragOver}
            onBranchDragEnd={handleBranchDragEnd}
            dragState={dragState}
            techniques={techniques}
            updateTreeNode={(nodeId, updates) => updateTreeNode(tree.id, nodeId, updates)}
          />
        </div>
      )}

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

// ============== Node Box (visual card) ==============

interface NodeBoxProps {
  tree: DecisionTree
  nodeId: string
  depth: number
  expandedNodes: Set<string>
  onToggleExpand: (id: string) => void
  onAddBranch: (id: string) => void
  onDelete: (id: string) => void
  onLink: (id: string) => void
  onOpenDetail: (id: number) => void
  onBranchDragStart: (parentId: string, index: number) => void
  onBranchDragOver: (e: React.DragEvent, parentId: string, index: number) => void
  onBranchDragEnd: () => void
  dragState: { parentId: string; dragIdx: number } | null
  techniques: { id: number; name: string; category: string }[]
  updateTreeNode: (nodeId: string, updates: Partial<DecisionTreeNode>) => void
}

function NodeBox({
  tree, nodeId, depth, expandedNodes, onToggleExpand,
  onAddBranch, onDelete, onLink, onOpenDetail,
  onBranchDragStart, onBranchDragOver, onBranchDragEnd, dragState,
  techniques, updateTreeNode,
}: NodeBoxProps) {
  const node = tree.nodes[nodeId]
  const [editingLabel, setEditingLabel] = useState(false)
  const [editingDesc, setEditingDesc] = useState(false)
  const labelRef = useRef<HTMLInputElement>(null)

  if (!node) return null

  const linkedTechnique = node.techniqueId ? techniques.find(t => t.id === node.techniqueId) : null
  const depthColor = DEPTH_COLORS[depth % DEPTH_COLORS.length]
  const isRoot = nodeId === tree.rootNodeId
  const hasChildren = node.children.length > 0
  const isExpanded = expandedNodes.has(nodeId)

  return (
    <div className="flex flex-col items-center w-full">
      {/* ── The box ── */}
      <div
        className="relative w-full max-w-md rounded-2xl border-2 bg-card shadow-sm transition-all hover:shadow-md"
        style={{ borderColor: depthColor }}
      >
        {/* Color bar on top */}
        <div className="h-1.5 rounded-t-2xl" style={{ backgroundColor: depthColor }} />

        <div className="p-3 space-y-2">
          {/* Header row: label + actions */}
          <div className="flex items-start gap-2">
            {/* Expand/collapse toggle */}
            {hasChildren && (
              <button
                onClick={() => onToggleExpand(nodeId)}
                className="mt-0.5 p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                {isExpanded
                  ? <CaretDown size={16} weight="bold" />
                  : <CaretRight size={16} weight="bold" />
                }
              </button>
            )}

            {/* Editable label */}
            <div className="flex-1 min-w-0">
              {editingLabel ? (
                <input
                  ref={labelRef}
                  className="w-full text-sm font-bold bg-transparent border-b-2 border-primary outline-none py-0.5"
                  value={node.label}
                  onChange={(e) => updateTreeNode(nodeId, { label: e.target.value })}
                  onBlur={() => setEditingLabel(false)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setEditingLabel(false) }}
                  autoFocus
                />
              ) : (
                <p
                  className="text-sm font-bold cursor-text hover:text-primary transition-colors truncate"
                  onClick={() => setEditingLabel(true)}
                  title="Cliquer pour modifier"
                >
                  {node.label}
                </p>
              )}

              {/* Editable description */}
              {editingDesc ? (
                <input
                  className="w-full text-xs text-muted-foreground bg-transparent border-b border-muted-foreground/30 outline-none mt-0.5 py-0.5"
                  value={node.description || ''}
                  onChange={(e) => updateTreeNode(nodeId, { description: e.target.value })}
                  onBlur={() => setEditingDesc(false)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setEditingDesc(false) }}
                  placeholder="Ajouter une description..."
                  autoFocus
                />
              ) : (
                <p
                  className="text-xs text-muted-foreground cursor-text hover:text-foreground/70 transition-colors mt-0.5"
                  onClick={() => setEditingDesc(true)}
                >
                  {node.description || '+ description'}
                </p>
              )}

              {/* Linked technique badge */}
              {linkedTechnique && (
                <button
                  onClick={() => onOpenDetail(linkedTechnique.id)}
                  className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <LinkSimple size={12} weight="bold" />
                  {linkedTechnique.name}
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={() => onLink(nodeId)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title="Lier une technique"
              >
                <LinkSimple size={16} weight="bold" />
              </button>
              <button
                onClick={() => onAddBranch(nodeId)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title="Ajouter une branche"
              >
                <Plus size={16} weight="bold" />
              </button>
              {!isRoot && (
                <button
                  onClick={() => onDelete(nodeId)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Supprimer"
                >
                  <Trash size={16} weight="bold" />
                </button>
              )}
            </div>
          </div>

          {/* Children count badge when collapsed */}
          {hasChildren && !isExpanded && (
            <button
              onClick={() => onToggleExpand(nodeId)}
              className="text-[11px] font-medium text-muted-foreground bg-muted rounded-full px-2.5 py-0.5 hover:bg-muted/80 transition-colors"
            >
              {node.children.length} réaction{node.children.length > 1 ? 's' : ''} ▾
            </button>
          )}
        </div>
      </div>

      {/* ── Branches (children) ── */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col items-center w-full mt-0">
          {node.children.map((branch, i) => {
            const isDragging = dragState?.parentId === nodeId && dragState.dragIdx === i
            return (
              <div key={branch.nodeId} className="flex flex-col items-center w-full">
                {/* Vertical connector arrow */}
                <div className="flex flex-col items-center py-1">
                  <div className="w-0.5 h-4 bg-muted-foreground/30" />
                  {/* Draggable condition pill */}
                  <div
                    draggable
                    onDragStart={() => onBranchDragStart(nodeId, i)}
                    onDragOver={(e) => onBranchDragOver(e, nodeId, i)}
                    onDragEnd={onBranchDragEnd}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-grab active:cursor-grabbing transition-all select-none ${
                      isDragging
                        ? 'opacity-50 scale-95 bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <DotsSixVertical size={12} weight="bold" className="shrink-0 opacity-50" />
                    <span>Si : {branch.condition}</span>
                  </div>
                  <div className="w-0.5 h-4 bg-muted-foreground/30" />
                  <ArrowDown size={14} className="text-muted-foreground/50 -mt-1.5" weight="bold" />
                </div>

                {/* Child node (recursive) */}
                <NodeBox
                  tree={tree}
                  nodeId={branch.nodeId}
                  depth={depth + 1}
                  expandedNodes={expandedNodes}
                  onToggleExpand={onToggleExpand}
                  onAddBranch={onAddBranch}
                  onDelete={onDelete}
                  onLink={onLink}
                  onOpenDetail={onOpenDetail}
                  onBranchDragStart={onBranchDragStart}
                  onBranchDragOver={onBranchDragOver}
                  onBranchDragEnd={onBranchDragEnd}
                  dragState={dragState}
                  techniques={techniques}
                  updateTreeNode={updateTreeNode}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
