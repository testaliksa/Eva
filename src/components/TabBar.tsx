import { Home, BookOpen, Calendar, User, AlertCircle } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/practices', icon: BookOpen, label: 'Практики' },
  { to: '/calendar', icon: Calendar, label: 'Календарь' },
  { to: '/profile', icon: User, label: 'Профиль' },
]

export function TabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 safe-area-bottom">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-text bg-peach/30'
                  : 'text-caption hover:text-text'
              }`
            }
          >
            <Icon size={22} strokeWidth={1.5} />
            <span className="text-xs">{label}</span>
          </NavLink>
        ))}

        {/* SOS Button - always visible */}
        <NavLink
          to="/sos"
          className="flex flex-col items-center gap-1 px-3 py-2 text-sos hover:bg-sos/10 rounded-xl transition-all duration-200"
          aria-label="Экстренная помощь"
        >
          <AlertCircle size={22} strokeWidth={1.5} />
          <span className="text-xs">SOS</span>
        </NavLink>
      </div>
    </nav>
  )
}
