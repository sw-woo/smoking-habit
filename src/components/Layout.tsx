import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Home, BarChart3, Award, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/dashboard', icon: Home, label: '홈' },
  { path: '/statistics', icon: BarChart3, label: '통계' },
  { path: '/achievements', icon: Award, label: '업적' },
  { path: '/settings', icon: Settings, label: '설정' },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-[var(--color-background)]">
      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] safe-area-pb">
        <div className="max-w-lg mx-auto flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center w-16 h-full relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-x-2 top-1 h-1 bg-[var(--color-primary)] rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon
                  size={24}
                  className={`transition-colors ${
                    isActive
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                />
                <span
                  className={`text-xs mt-1 transition-colors ${
                    isActive
                      ? 'text-[var(--color-primary)] font-medium'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
