import { House, Target, ChartLineUp, Books, GearSix } from '@phosphor-icons/react'
import { useAuthStore } from '@/lib/auth-store'

export type Screen = 'dashboard' | 'gameplan' | 'progression' | 'library' | 'admin'

interface BottomNavProps {
  active: Screen
  onChange: (screen: Screen) => void
}

const NAV_ITEMS: { key: Screen; label: string; Icon: typeof House; adminOnly?: boolean }[] = [
  { key: 'dashboard', label: 'Accueil', Icon: House },
  { key: 'gameplan', label: 'Game Plan', Icon: Target },
  { key: 'progression', label: 'Progression', Icon: ChartLineUp },
  { key: 'library', label: 'Bibliothèque', Icon: Books },
  { key: 'admin', label: 'Admin', Icon: GearSix, adminOnly: true },
]

export function BottomNav({ active, onChange }: BottomNavProps) {
  const user = useAuthStore(s => s.user)
  const items = NAV_ITEMS.filter(item => !item.adminOnly || user?.isOwner)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {items.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              active === key
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={24} weight={active === key ? 'fill' : 'regular'} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
