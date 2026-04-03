import { useState, useMemo, useEffect, createContext, useContext } from 'react'
import { INITIAL_KNOWLEDGE_POINTS, KnowledgePoint, MasteryLevel, ThemeType, THEME_CONFIG } from '@/lib/data'
import { storage, getCurrentUser, logoutUser, type UserInfo } from '@/lib/storage'
import { apiGetPoints, apiGetProgress, apiUpdateProgress, apiUpdatePoints, apiBulkProgress } from '@/lib/api-client'
import { LoginScreen } from '@/components/LoginScreen'
import { KnowledgeCard } from '@/components/KnowledgeCard'
import { KnowledgeDetailDialog } from '@/components/KnowledgeDetailDialog'
import { ImportDialog } from '@/components/ImportDialog'
import { DataTable } from '@/components/DataTable'
import { AdminPanel } from '@/components/AdminPanel'
import { StatsPanel } from '@/components/StatsPanel'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { List, Upload, Table, GearSix, SignOut, Moon, Sun, ChartBar, MagnifyingGlass } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getSpacedRepetitionData, updateSpacedRepetition, type SpacedRepetitionEntry, isDueForReview } from '@/lib/spaced-repetition'

// Theme context
type Theme = 'light' | 'dark'
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'light', toggle: () => {} })
export const useTheme = () => useContext(ThemeContext)

function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [points, setPoints] = useState<KnowledgePoint[]>(INITIAL_KNOWLEDGE_POINTS)
  const [selectedPoint, setSelectedPoint] = useState<KnowledgePoint | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filterLevel, setFilterLevel] = useState<MasteryLevel | 'all' | 'due'>('all')
  const [filterTheme, setFilterTheme] = useState<ThemeType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [isLoading, setIsLoading] = useState(true)
  const [adminMode, setAdminMode] = useState(false)
  const [statsMode, setStatsMode] = useState(false)
  const [srData, setSrData] = useState<Record<number, SpacedRepetitionEntry>>({})
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    return (saved === 'dark' ? 'dark' : 'light') as Theme
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const initializeUserData = async (user: UserInfo) => {
    try {
      setUserInfo(user)
      
      const hasSeenWelcome = storage.get<boolean>(`welcome-${user.id}`)

      // Load points from API
      let loadedPoints: KnowledgePoint[] = INITIAL_KNOWLEDGE_POINTS
      const pointsResult = await apiGetPoints()
      const apiPoints = pointsResult.data?.points
      if (pointsResult.ok && apiPoints && apiPoints.length > 0) {
        loadedPoints = apiPoints.map((p: any) => ({
          id: p.pointId ?? p.id,
          title: p.title,
          description: p.description,
          mastery: p.mastery || 'weak',
          notes: p.notes || '',
          videoLink: p.videoLink || ''
        }))
      }

      // Load user progress from API
      const progressResult = await apiGetProgress()
      const apiProgress = progressResult.data?.progress
      if (progressResult.ok && apiProgress && apiProgress.length > 0) {
        const progressMap = new Map(
          apiProgress.map((p: any) => [p.pointId, p])
        )
        loadedPoints = loadedPoints.map(point => {
          const prog = progressMap.get(point.id)
          if (prog) {
            return {
              ...point,
              mastery: (prog.mastery as MasteryLevel) || point.mastery,
              notes: prog.notes || point.notes
            }
          }
          return user.isOwner ? point : { ...point, mastery: 'weak' as MasteryLevel, notes: '' }
        })

        // Load SR data from progress entries
        const srFromApi: Record<number, SpacedRepetitionEntry> = {}
        apiProgress.forEach((p: any) => {
          if (p.srData) srFromApi[p.pointId] = p.srData
        })
        if (Object.keys(srFromApi).length > 0) {
          setSrData(srFromApi)
        } else {
          setSrData(getSpacedRepetitionData(user.id))
        }
      } else {
        // Fallback to local SR data
        setSrData(getSpacedRepetitionData(user.id))
      }

      setPoints(loadedPoints)
      
      if (!hasSeenWelcome) {
        setTimeout(() => {
          toast.success(`Bienvenue ${user.login} !`, {
            description: 'Votre progression est synchronisée avec le serveur.',
            duration: 5000
          })
          storage.set(`welcome-${user.id}`, true)
        }, 500)
      }
    } catch (error) {
      console.error('Error initializing user:', error)
      setPoints(INITIAL_KNOWLEDGE_POINTS)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      const existingUser = await getCurrentUser()
      if (existingUser) {
        await initializeUserData(existingUser)
      } else {
        setIsLoading(false)
      }
    }
    checkUser()
  }, [])

  const handleLogin = async (user: UserInfo) => {
    setIsLoading(true)
    await initializeUserData(user)
  }

  const handleLogout = () => {
    logoutUser()
    setUserInfo(null)
    setPoints(INITIAL_KNOWLEDGE_POINTS)
    setAdminMode(false)
    setStatsMode(false)
    toast.success('Déconnexion réussie')
  }

  // Debounced save to API
  const saveTimeoutRef = { current: null as ReturnType<typeof setTimeout> | null }
  
  useEffect(() => {
    if (userInfo && !isLoading && Array.isArray(points) && points.length > 0) {
      // Save to API with debounce
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        const entries = points.map(point => ({
          pointId: point.id,
          mastery: point.mastery,
          notes: point.notes,
          srData: srData[point.id] ?? null
        }))
        apiBulkProgress(entries).catch(err => console.error('Failed to sync progress:', err))
      }, 1000)
    }
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current) }
  }, [points, userInfo, isLoading])

  const stats = useMemo(() => {
    if (!points || !Array.isArray(points) || points.length === 0) {
      return { total: 0, weak: 0, progress: 0, mastered: 0, masteryPercent: 0, dueCount: 0 }
    }
    
    const total = points.length
    const weak = points.filter(p => p.mastery === 'weak').length
    const progress = points.filter(p => p.mastery === 'progress').length
    const mastered = points.filter(p => p.mastery === 'mastered').length
    const masteryPercent = total > 0 ? (mastered / total) * 100 : 0
    const dueCount = points.filter(p => isDueForReview(srData[p.id])).length
    
    return { total, weak, progress, mastered, masteryPercent, dueCount }
  }, [points, srData])

  const filteredPoints = useMemo(() => {
    if (!points || !Array.isArray(points)) return []
    let result = points
    
    // Filter by mastery level
    if (filterLevel === 'due') {
      result = result.filter(p => isDueForReview(srData[p.id]))
    } else if (filterLevel !== 'all') {
      result = result.filter(p => p.mastery === filterLevel)
    }
    
    // Filter by theme
    if (filterTheme !== 'all') {
      result = result.filter(p => p.theme === filterTheme)
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      )
    }
    
    return result
  }, [points, filterLevel, filterTheme, searchQuery, srData])

  const handleCardClick = (point: KnowledgePoint) => {
    setSelectedPoint(point)
    setDialogOpen(true)
  }

  const handleMasteryChange = (pointId: number, mastery: MasteryLevel) => {
    setPoints(currentPoints => 
      currentPoints.map(p => p.id === pointId ? { ...p, mastery } : p)
    )
    if (selectedPoint?.id === pointId) {
      setSelectedPoint({ ...selectedPoint, mastery })
    }
    // Update spaced repetition data
    if (userInfo) {
      const quality = mastery === 'mastered' ? 5 : mastery === 'progress' ? 3 : 1
      const updatedSr = updateSpacedRepetition(userInfo.id, pointId, quality)
      setSrData(prev => ({ ...prev, [pointId]: updatedSr }))
      // Sync to API
      const point = points.find(p => p.id === pointId)
      apiUpdateProgress(pointId, mastery, point?.notes, updatedSr).catch(err => 
        console.error('Failed to sync mastery:', err)
      )
    }
  }

  const handleImport = (importedPoints: KnowledgePoint[]) => {
    setPoints(importedPoints)
  }

  const handleAdminSave = async (updatedPoints: KnowledgePoint[]) => {
    setPoints(updatedPoints)
    setAdminMode(false)
    // Sync points to API (admin only)
    const result = await apiUpdatePoints(updatedPoints)
    if (result.ok) {
      toast.success('Points synchronisés avec le serveur')
    } else {
      toast.error('Erreur lors de la synchronisation : ' + (result.error ?? ''))
    }
  }

  const handlePointUpdate = (updatedPoint: KnowledgePoint) => {
    setPoints(currentPoints =>
      currentPoints.map(p => p.id === updatedPoint.id ? updatedPoint : p)
    )
    if (selectedPoint?.id === updatedPoint.id) {
      setSelectedPoint(updatedPoint)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Chargement de votre profil...</p>
        </div>
      </div>
    )
  }

  if (!userInfo) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </>
    )
  }

  if (adminMode) {
    return (
      <>
        <AdminPanel
          points={points}
          onSave={handleAdminSave}
          onExit={() => setAdminMode(false)}
        />
        <Toaster />
      </>
    )
  }

  if (statsMode) {
    return (
      <>
        <StatsPanel 
          points={points}
          srData={srData}
          onExit={() => setStatsMode(false)}
        />
        <Toaster />
      </>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle: toggleTheme }}>
    <div className="min-h-screen bg-background">
      <div className="border-b bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2 tracking-tight">MasterMind</h1>
              <p className="text-white/90 text-xs md:text-base truncate">
                Maîtrisez les 70 techniques de JJB
              </p>
            </div>
            <div className="flex gap-1.5 md:gap-2 items-center shrink-0">
              <Button
                onClick={toggleTheme}
                variant="secondary"
                size="icon"
                className="h-9 w-9 md:h-10 md:w-10 bg-white/20 text-white hover:bg-white/30 border border-white/30 md:border-2"
                title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
              >
                {theme === 'light' ? <Moon weight="bold" size={18} /> : <Sun weight="bold" size={18} />}
              </Button>
              {userInfo && userInfo.isOwner && (
                <>
                  <Button 
                    onClick={() => setAdminMode(true)}
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 md:h-auto md:w-auto md:px-4 md:py-2 bg-white/20 text-white hover:bg-white/30 font-semibold border border-white/30 md:border-2"
                  >
                    <GearSix weight="bold" size={18} />
                    <span className="hidden md:inline ml-2">Administration</span>
                  </Button>
                  <Button 
                    onClick={() => setImportDialogOpen(true)}
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 md:h-auto md:w-auto md:px-4 md:py-2 bg-white/20 text-white hover:bg-white/30 font-semibold border border-white/30 md:border-2"
                  >
                    <Upload weight="bold" size={18} />
                    <span className="hidden md:inline ml-2">Importer</span>
                  </Button>
                </>
              )}
              {userInfo && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/20">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={userInfo.avatarUrl} alt={userInfo.login} />
                        <AvatarFallback className="bg-white text-primary font-semibold">
                          {userInfo.login.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{userInfo.login}</p>
                        <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    {userInfo.isOwner && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setAdminMode(true)}>
                          <GearSix className="mr-2 h-4 w-4" weight="bold" />
                          Administration
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
                          <Upload className="mr-2 h-4 w-4" weight="bold" />
                          Importer des données
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setStatsMode(true)}>
                      <ChartBar className="mr-2 h-4 w-4" weight="bold" />
                      Statistiques
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                      <SignOut className="mr-2 h-4 w-4" weight="bold" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button 
                onClick={() => setStatsMode(true)} 
                size="icon"
                className="h-9 w-9 md:h-auto md:w-auto md:px-4 md:py-2 bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
              >
                <ChartBar weight="bold" size={18} />
                <span className="hidden md:inline ml-2">Statistiques</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <div className="bg-card rounded-xl border-2 p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Progression globale</h2>
            <span className="text-2xl font-bold text-primary">
              {Math.round(stats.masteryPercent)}%
            </span>
          </div>
          <Progress value={stats.masteryPercent} className="h-3 mb-4" />
          <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
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
        </div>

        {/* Search bar */}
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} weight="bold" />
          <input
            type="text"
            placeholder="Rechercher une technique..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        {/* Theme filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
          <button
            onClick={() => setFilterTheme('all')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium border-2 transition-colors ${
              filterTheme === 'all' 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            Tous
          </button>
          {(Object.entries(THEME_CONFIG) as [ThemeType, typeof THEME_CONFIG[ThemeType]][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilterTheme(filterTheme === key ? 'all' : key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium border-2 transition-colors ${
                filterTheme === key
                  ? 'text-white border-transparent'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              style={filterTheme === key ? { backgroundColor: config.color } : undefined}
            >
              {config.icon} {config.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 md:gap-4 flex-wrap">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-xl font-semibold">
                {filteredPoints.length} technique{filteredPoints.length > 1 ? 's' : ''}
              </h2>
            </div>
            
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <List weight="bold" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-l-none"
              >
                <Table weight="bold" />
              </Button>
            </div>
          </div>
          
          {viewMode === 'grid' && (
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <Tabs value={filterLevel} onValueChange={(v) => setFilterLevel(v as MasteryLevel | 'all' | 'due')}>
                <TabsList className="h-auto flex-wrap md:flex-nowrap">
                  <TabsTrigger value="all" className="text-xs md:text-sm">Tous ({stats.total})</TabsTrigger>
                  <TabsTrigger value="due" className="text-xs md:text-sm text-primary">À réviser ({stats.dueCount})</TabsTrigger>
                  <TabsTrigger value="weak" className="text-xs md:text-sm">Faible ({stats.weak})</TabsTrigger>
                  <TabsTrigger value="progress" className="text-xs md:text-sm">En cours ({stats.progress})</TabsTrigger>
                  <TabsTrigger value="mastered" className="text-xs md:text-sm">Maîtrisé ({stats.mastered})</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>

        {viewMode === 'grid' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredPoints.map(point => (
                <KnowledgeCard 
                  key={point.id}
                  point={point}
                  onClick={() => handleCardClick(point)}
                />
              ))}
            </div>

            {filteredPoints.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun point dans cette catégorie.</p>
              </div>
            )}
          </>
        ) : (
          <DataTable 
            points={points}
            onPointClick={handleCardClick}
            onPointUpdate={handlePointUpdate}
          />
        )}
      </div>
      <KnowledgeDetailDialog 
        point={selectedPoint}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onMasteryChange={handleMasteryChange}
        onPointUpdate={handlePointUpdate}
        isOwner={userInfo?.isOwner}
      />
      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImport}
        currentPoints={points}
      />
      <Toaster />
    </div>
    </ThemeContext.Provider>
  );
}

export default App
