import { useState, useEffect } from 'react'
import { BottomNav, type Screen } from '@/components/BottomNav'
import { TechniqueDetailDialog } from '@/components/TechniqueDetailDialog'
import { DashboardScreen } from '@/screens/DashboardScreen'
import { GamePlanScreen } from '@/screens/GamePlanScreen'
import { GamePlanTreeScreen } from '@/screens/GamePlanTreeScreen'
import { ProgressionScreen } from '@/screens/ProgressionScreen'
import { LibraryScreen } from '@/screens/LibraryScreen'
import { AdminScreen } from '@/screens/AdminScreen'
import { LoginScreen } from '@/components/LoginScreen'
import { Toaster } from '@/components/ui/sonner'
import { useAuthStore } from '@/lib/auth-store'
import { useAppStore } from '@/lib/store'
import type { ProgressionFilter } from '@/lib/types'

function App() {
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [detailId, setDetailId] = useState<number | null>(null)
  const [progressionFilter, setProgressionFilter] = useState<ProgressionFilter>(null)

  const user = useAuthStore(s => s.user)
  const authLoading = useAuthStore(s => s.loading)
  const initAuth = useAuthStore(s => s.init)
  const syncToCloud = useAuthStore(s => s.syncToCloud)

  // Init auth on mount
  useEffect(() => {
    initAuth()
  }, [])

  // Sync to cloud on store changes (debounced)
  useEffect(() => {
    if (!user) return
    let timeout: ReturnType<typeof setTimeout>
    const unsub = useAppStore.subscribe(() => {
      clearTimeout(timeout)
      timeout = setTimeout(() => { syncToCloud() }, 2000)
    })
    return () => { unsub(); clearTimeout(timeout) }
  }, [user, syncToCloud])

  const navigateToProgression = (filter: ProgressionFilter) => {
    setProgressionFilter(filter)
    setScreen('progression')
  }

  // Default to dark theme
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const theme = saved === 'light' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {screen === 'dashboard' && (
        <DashboardScreen onNavigate={setScreen} onNavigateProgression={navigateToProgression} />
      )}
      {screen === 'gameplan' && (
        <GamePlanScreen onOpenDetail={setDetailId} onBack={() => setScreen('dashboard')} />
      )}
      {screen === 'gameplan-tree' && (
        <GamePlanTreeScreen onOpenDetail={setDetailId} onBack={() => setScreen('dashboard')} />
      )}
      {screen === 'progression' && (
        <ProgressionScreen onOpenDetail={setDetailId} initialFilter={progressionFilter} onFilterConsumed={() => setProgressionFilter(null)} onBack={() => setScreen('dashboard')} />
      )}
      {screen === 'library' && (
        <LibraryScreen onOpenDetail={setDetailId} onBack={() => setScreen('dashboard')} />
      )}
      {screen === 'admin' && (
        <AdminScreen onBack={() => setScreen('dashboard')} />
      )}

      <TechniqueDetailDialog
        techniqueId={detailId}
        open={detailId !== null}
        onOpenChange={(open) => { if (!open) setDetailId(null) }}
      />

      <BottomNav active={screen} onChange={setScreen} />
      <Toaster />
    </div>
  )
}

export default App
