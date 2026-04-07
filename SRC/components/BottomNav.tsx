import { House, Target, ChartLineUp, Books } from '@phosphor-icons/react'

export type Screen = 'dashboard' | 'gameplan' | 'progression' | 'library'

interface BottomNavProps {
  active: Screen
  onChange: (screen: Screen) => void
}

const NAV_ITEMS: { key: Screen; label: string; Icon: typeof House }[] = [
  { key: 'dashboard', label: 'Accueil', Icon: House },
  { key: 'gameplan', label: 'Game Plan', Icon: Target },
  { key: 'progression', label: 'Progression', Icon: ChartLineUp },
  { key: 'library', label: 'Bibliothèque', Icon: Books },
]

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ key, label, Icon }) => (
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
