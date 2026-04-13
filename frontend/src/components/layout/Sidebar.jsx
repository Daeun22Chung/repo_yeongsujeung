import { BarChart2, Home, List, Upload } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, icon: Home,    label: '대시보드' },
  { to: ROUTES.UPLOAD,    icon: Upload,  label: '영수증 업로드' },
  { to: ROUTES.EXPENSES,  icon: List,    label: '지출 내역' },
  { to: ROUTES.STATS,     icon: BarChart2, label: '통계 분석' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-56 bg-white border-r border-gray-200 transition-transform md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex flex-col gap-1 p-3">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
