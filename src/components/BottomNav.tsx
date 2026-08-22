import { NavLink } from 'react-router-dom'
import { m } from 'framer-motion'
import { Home, BookOpen, MessageCircle, BarChart3, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: '홈' },
  { to: '/dictionary', icon: BookOpen, label: '사전' },
  { to: '/conversation', icon: MessageCircle, label: '회화' },
  { to: '/stats', icon: BarChart3, label: '통계' },
  { to: '/settings', icon: Settings, label: '설정' },
] as const

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border-light safe-bottom z-50">
      <div className="flex items-center justify-around h-[72px] w-full px-6">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'relative flex flex-col items-center justify-center w-16 h-full transition-all duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <m.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                </m.div>
                <span className={cn(
                  'text-[10px] mt-1 font-medium transition-all',
                  isActive && 'font-semibold'
                )}>
                  {label}
                </span>
                {isActive && (
                  <m.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
