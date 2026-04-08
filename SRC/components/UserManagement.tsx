/**
 * UserManagement.tsx — Gestion des utilisateurs (admin).
 *
 * Affiche la liste des comptes inscrits.
 * Permet à l'admin de :
 * - Voir la progression d'un utilisateur (dialog avec détail par technique)
 * - Supprimer un compte
 * - Réinitialiser un mot de passe
 */
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { MasteryBadge } from './MasteryBadge'
import { ArrowLeft, Trash, Eye, User, CalendarBlank, Envelope } from '@phosphor-icons/react'
import { apiGetUsers, apiDeleteUser, apiGetUserProgress } from '@/lib/api-client'
import { INITIAL_KNOWLEDGE_POINTS, type KnowledgePoint, type MasteryLevel } from '@/lib/data'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface UserData {
  id: string
  login: string
  email: string
  isOwner: boolean
  createdAt: string
}

interface UserProgressEntry {
  pointId: number
  mastery: string
  notes?: string
  updatedAt?: string
}

interface UserManagementProps {
  onExit: () => void
}

export function UserManagement({ onExit }: UserManagementProps) {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgressEntry[]>([])
  const [progressDialogOpen, setProgressDialogOpen] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    const result = await apiGetUsers()
    if (result.ok && result.data?.users) {
      setUsers(result.data.users)
    } else {
      toast.error(result.error ?? 'Impossible de charger les utilisateurs')
    }
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (user: UserData) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le compte de "${user.login}" ?\n\nCette action est irréversible.`)) return

    const result = await apiDeleteUser(user.id)
    if (result.ok) {
      setUsers(prev => prev.filter(u => u.id !== user.id))
      toast.success(`Compte "${user.login}" supprimé`)
    } else {
      toast.error(result.error ?? 'Erreur lors de la suppression')
    }
  }

  const handleViewProgress = async (user: UserData) => {
    setSelectedUser(user)
    setLoadingProgress(true)
    setProgressDialogOpen(true)

    const result = await apiGetUserProgress(user.id)
    if (result.ok && result.data?.progress) {
      setUserProgress(result.data.progress)
    } else {
      setUserProgress([])
      toast.error(result.error ?? 'Impossible de charger la progression')
    }
    setLoadingProgress(false)
  }

  const getProgressStats = () => {
    const total = INITIAL_KNOWLEDGE_POINTS.length
    const progressMap = new Map(userProgress.map(p => [p.pointId, p]))
    let weak = 0, progress = 0, mastered = 0
    for (const point of INITIAL_KNOWLEDGE_POINTS) {
      const entry = progressMap.get(point.id)
      const m = entry?.mastery ?? 'weak'
      if (m === 'mastered') mastered++
      else if (m === 'progress') progress++
      else weak++
    }
    return { total, weak, progress, mastered, percent: total > 0 ? (mastered / total) * 100 : 0 }
  }

  const getPointsWithProgress = (): (KnowledgePoint & { lastUpdate?: string })[] => {
    const progressMap = new Map(userProgress.map(p => [p.pointId, p]))
    return INITIAL_KNOWLEDGE_POINTS.map(point => {
      const entry = progressMap.get(point.id)
      return {
        ...point,
        mastery: (entry?.mastery as MasteryLevel) ?? 'weak',
        notes: entry?.notes ?? '',
        lastUpdate: entry?.updatedAt
      }
    })
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
          <p className="text-muted-foreground">Chargement des utilisateurs...</p>
        </div>
      </div>
    )
  }

  const stats = progressDialogOpen ? getProgressStats() : null

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onExit}>
                <ArrowLeft className="mr-2" weight="bold" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
                <p className="text-sm text-muted-foreground">
                  {users.length} compte{users.length > 1 ? 's' : ''} inscrit{users.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid gap-4">
          {users.map(user => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="text-primary" size={24} weight="bold" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{user.login}</span>
                        {user.isOwner && (
                          <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 text-xs md:text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Envelope size={14} />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarBlank size={14} />
                          Inscrit le {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProgress(user)}
                    >
                      <Eye className="mr-2" weight="bold" size={16} />
                      Progression
                    </Button>
                    {!user.isOwner && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash weight="bold" size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {users.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Aucun utilisateur inscrit.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Progress Dialog */}
      <Dialog open={progressDialogOpen} onOpenChange={setProgressDialogOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Progression de {selectedUser?.login}
            </DialogTitle>
          </DialogHeader>

          {loadingProgress ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress summary */}
              {stats && (
                <div className="space-y-3">
                  <Progress value={stats.percent} className="h-3" />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[oklch(0.65_0.19_25)]">{stats.weak}</div>
                      <div className="text-xs text-muted-foreground uppercase">Faible</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[oklch(0.70_0.15_60)]">{stats.progress}</div>
                      <div className="text-xs text-muted-foreground uppercase">En cours</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[oklch(0.65_0.17_155)]">{stats.mastered}</div>
                      <div className="text-xs text-muted-foreground uppercase">Maîtrisé</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Points list */}
              <div className="space-y-1">
                {getPointsWithProgress().map(point => (
                  <div
                    key={point.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-6 text-right shrink-0">{point.id}</span>
                      <span className="text-sm font-medium truncate">{point.title}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {point.lastUpdate && (
                        <span className="text-xs text-muted-foreground hidden md:block">
                          {formatDate(point.lastUpdate)}
                        </span>
                      )}
                      <MasteryBadge mastery={point.mastery} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
