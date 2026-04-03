import { useMemo } from 'react'
import { KnowledgePoint, CATEGORIES } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Calendar, TrendUp, Fire, ClockCountdown, Brain } from '@phosphor-icons/react'
import { MasteryBadge } from './MasteryBadge'
import { type SpacedRepetitionEntry, isDueForReview, daysUntilReview } from '@/lib/spaced-repetition'

interface StatsPanelProps {
  points: KnowledgePoint[]
  srData: Record<number, SpacedRepetitionEntry>
  onExit: () => void
}

export function StatsPanel({ points, srData, onExit }: StatsPanelProps) {
  const stats = useMemo(() => {
    const total = points.length
    const weak = points.filter(p => p.mastery === 'weak').length
    const progress = points.filter(p => p.mastery === 'progress').length
    const mastered = points.filter(p => p.mastery === 'mastered').length
    const masteryPercent = total > 0 ? (mastered / total) * 100 : 0
    const dueForReview = points.filter(p => isDueForReview(srData[p.id])).length

    // Total reviews done
    const totalReviews = Object.values(srData).reduce(
      (acc, entry) => acc + (entry.reviewHistory?.length ?? 0), 0
    )

    // Reviews in last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentReviews = Object.values(srData).reduce((acc, entry) => {
      return acc + (entry.reviewHistory?.filter(r => new Date(r.date) >= sevenDaysAgo).length ?? 0)
    }, 0)

    // Average ease factor
    const srEntries = Object.values(srData)
    const avgEaseFactor = srEntries.length > 0
      ? srEntries.reduce((acc, e) => acc + e.easeFactor, 0) / srEntries.length
      : 2.5

    // Category breakdown
    const categoryStats = CATEGORIES.map(cat => {
      const catPoints = points.filter(p => cat.pointIds.includes(p.id))
      const catMastered = catPoints.filter(p => p.mastery === 'mastered').length
      const catProgress = catPoints.filter(p => p.mastery === 'progress').length
      const catWeak = catPoints.filter(p => p.mastery === 'weak').length
      const catDue = catPoints.filter(p => isDueForReview(srData[p.id])).length
      const percent = catPoints.length > 0 ? (catMastered / catPoints.length) * 100 : 0
      return { ...cat, total: catPoints.length, mastered: catMastered, progress: catProgress, weak: catWeak, due: catDue, percent }
    })

    // Points due soonest (sorted)
    const upcomingReviews = points
      .map(p => ({ point: p, sr: srData[p.id], days: daysUntilReview(srData[p.id]) }))
      .sort((a, b) => a.days - b.days)
      .slice(0, 10)

    // Review activity last 30 days (for chart)
    const activityMap: Record<string, number> = {}
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    Object.values(srData).forEach(entry => {
      entry.reviewHistory?.forEach(r => {
        if (new Date(r.date) >= thirtyDaysAgo) {
          const day = r.date.slice(0, 10)
          activityMap[day] = (activityMap[day] ?? 0) + 1
        }
      })
    })
    
    // Build 30-day activity array
    const activity: { date: string; count: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      activity.push({ date: key, count: activityMap[key] ?? 0 })
    }

    // Current streak
    let streak = 0
    for (let i = activity.length - 1; i >= 0; i--) {
      if (activity[i].count > 0) streak++
      else break
    }

    return {
      total, weak, progress, mastered, masteryPercent, dueForReview,
      totalReviews, recentReviews, avgEaseFactor, categoryStats,
      upcomingReviews, activity, streak
    }
  }, [points, srData])

  const maxActivity = Math.max(...stats.activity.map(a => a.count), 1)

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onExit}>
                <ArrowLeft className="mr-1 md:mr-2" weight="bold" />
                <span className="hidden md:inline">Retour</span>
              </Button>
              <div>
                <h1 className="text-lg md:text-2xl font-bold">Statistiques</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Vue d'ensemble de votre progression</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <Brain className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 md:mb-2 text-primary" weight="bold" />
              <div className="text-2xl md:text-3xl font-bold">{stats.mastered}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Maîtrisés</div>
              <div className="text-sm text-primary font-medium">{Math.round(stats.masteryPercent)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <ClockCountdown className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 md:mb-2 text-[oklch(0.65_0.19_25)]" weight="bold" />
              <div className="text-2xl md:text-3xl font-bold">{stats.dueForReview}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">À réviser</div>
              <div className="text-sm text-muted-foreground">aujourd'hui</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <TrendUp className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 md:mb-2 text-[oklch(0.65_0.17_155)]" weight="bold" />
              <div className="text-2xl md:text-3xl font-bold">{stats.totalReviews}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Révisions totales</div>
              <div className="text-sm text-muted-foreground">{stats.recentReviews} cette semaine</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <Fire className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 md:mb-2 text-[oklch(0.70_0.15_60)]" weight="bold" />
              <div className="text-2xl md:text-3xl font-bold">{stats.streak}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Jours consécutifs</div>
              <div className="text-sm text-muted-foreground">série en cours</div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart (last 30 days) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar weight="bold" />
              Activité des 30 derniers jours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-0.5 md:gap-1 h-24 md:h-32">
              {stats.activity.map((day, i) => (
                <div key={day.date} className="flex-1 flex flex-col items-center group relative">
                  <div className="absolute -top-8 bg-popover border rounded px-2 py-0.5 text-xs hidden group-hover:block whitespace-nowrap z-10 shadow">
                    {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} — {day.count} révision{day.count > 1 ? 's' : ''}
                  </div>
                  <div 
                    className="w-full rounded-t transition-all duration-200 hover:opacity-80"
                    style={{
                      height: `${Math.max(day.count > 0 ? (day.count / maxActivity) * 100 : 0, 2)}%`,
                      backgroundColor: day.count === 0 
                        ? 'var(--muted)' 
                        : day.count <= 2 
                          ? 'oklch(0.70 0.15 60)' 
                          : day.count <= 5 
                            ? 'oklch(0.60 0.17 155)' 
                            : 'oklch(0.45 0.15 270)',
                      minHeight: '2px'
                    }}
                  />
                  {(i === 0 || i === stats.activity.length - 1 || i === Math.floor(stats.activity.length / 2)) && (
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Global Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progression globale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={stats.masteryPercent} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[oklch(0.65_0.19_25)]">{stats.weak}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Faible</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[oklch(0.70_0.15_60)]">{stats.progress}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">En cours</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[oklch(0.65_0.17_155)]">{stats.mastered}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Maîtrisé</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Progression par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.categoryStats.map(cat => (
                <div key={cat.id} className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-xs md:text-sm font-medium truncate">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{cat.mastered}/{cat.total} maîtrisés</span>
                      {cat.due > 0 && (
                        <span className="text-[oklch(0.65_0.19_25)]">{cat.due} à réviser</span>
                      )}
                    </div>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                    <div 
                      className="transition-all duration-300" 
                      style={{ width: `${cat.total > 0 ? (cat.mastered / cat.total) * 100 : 0}%`, backgroundColor: 'oklch(0.65 0.17 155)' }}
                    />
                    <div 
                      className="transition-all duration-300" 
                      style={{ width: `${cat.total > 0 ? (cat.progress / cat.total) * 100 : 0}%`, backgroundColor: 'oklch(0.70 0.15 60)' }}
                    />
                    <div 
                      className="transition-all duration-300" 
                      style={{ width: `${cat.total > 0 ? (cat.weak / cat.total) * 100 : 0}%`, backgroundColor: 'oklch(0.65 0.19 25)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Prochaines révisions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.upcomingReviews.map(({ point, days }) => (
                <div key={point.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <MasteryBadge mastery={point.mastery} />
                    <span className="text-sm font-medium">{point.title}</span>
                  </div>
                  <span className={`text-xs font-medium ${days <= 0 ? 'text-[oklch(0.65_0.19_25)]' : 'text-muted-foreground'}`}>
                    {days <= 0 ? 'Maintenant' : days === 1 ? 'Demain' : `Dans ${days} jours`}
                  </span>
                </div>
              ))}
              {stats.upcomingReviews.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune donnée de révision disponible. Commencez à évaluer vos techniques !
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
