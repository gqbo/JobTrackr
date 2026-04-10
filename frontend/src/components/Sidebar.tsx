import { useLocation, NavLink } from 'react-router-dom'
import { Briefcase, Kanban, BarChart2, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const NAV_ITEMS = [
  {
    label: 'Applications',
    icon: Briefcase,
    to: '/dashboard',
    navigable: true,
  },
  {
    label: 'Kanban',
    icon: Kanban,
    to: null,
    navigable: false,
  },
  {
    label: 'Stats',
    icon: BarChart2,
    to: null,
    navigable: false,
  },
  {
    label: 'Settings',
    icon: Settings,
    to: null,
    navigable: false,
  },
]

export function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()

  const initials = user?.email ? user.email[0].toUpperCase() : '?'

  return (
    <aside className="w-60 flex flex-col bg-[#f5f1f5] min-h-screen">
      {/* Logo / brand */}
      <div className="px-5 py-6">
        <span className="font-display font-semibold text-[#323235] text-base tracking-tight">
          JobTrackr
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon

          if (item.navigable && item.to) {
            const isActive = location.pathname === item.to
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#005ac2]/10 text-[#005ac2] border-l-2 border-[#005ac2] rounded-r-md'
                    : 'text-[#5f5f61] hover:bg-[#eae7ea]'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            )
          }

          return (
            <div
              key={item.label}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[#5f5f61] opacity-40 cursor-not-allowed select-none"
            >
              <Icon size={16} />
              {item.label}
            </div>
          )
        })}
      </nav>

      {/* User section */}
      <div className="px-4 py-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#005ac2]/15 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-semibold text-[#005ac2]">{initials}</span>
        </div>
        <span className="text-xs text-[#5f5f61] truncate">{user?.email ?? ''}</span>
      </div>
    </aside>
  )
}
