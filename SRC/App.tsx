import { useState, useEffect } from 'react'
import { BottomNav, type Screen } from '@/components/BottomNav'
import { TechniqueDetailDialog } from '@/components/TechniqueDetailDialog'
import { DashboardScreen } from '@/screens/DashboardScreen'
import { GamePlanScreen } from '@/screens/GamePlanScreen'
import { ProgressionScreen } from '@/screens/ProgressionScreen'
import { LibraryScreen } from '@/screens/LibraryScreen'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [detailId, setDetailId] = useState<number | null>(null)

  // Default to dark theme
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const theme = saved === 'light' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [])

  return (
    <div className="min-h-screen bg-background pb-20">
      {screen === 'dashboard' && (
        <DashboardScreen onNavigate={setScreen} />
      )}
      {screen === 'gameplan' && (
        <GamePlanScreen onOpenDetail={setDetailId} />
      )}
      {screen === 'progression' && (
        <ProgressionScreen onOpenDetail={setDetailId} />
      )}
      {screen === 'library' && (
        <LibraryScreen onOpenDetail={setDetailId} />
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
