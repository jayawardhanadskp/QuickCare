import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { HeartPulse, LogOut, LayoutDashboard, CalendarDays, Heart, UserRound, FileText, Star, CircleHelp, MessageCircle, Users, Gift } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'
import LanguageSwitcher from './LanguageSwitcher'

// Sidebar links for each role
const menus = {
  patient: [
    { to: '/patient', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/patient/appointments', label: 'Appointments', icon: CalendarDays },
    { to: '/patient/favourites', label: 'Favourite doctors', icon: Heart },
    { to: '/patient/records', label: 'Health records', icon: FileText },
    { to: '/patient/chat', label: 'Messages', icon: MessageCircle },
    { to: '/patient/profile', label: 'My profile', icon: UserRound },
  ],
  doctor: [
    { to: '/doctor', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/doctor/schedule', label: 'Schedule', icon: CalendarDays },
    { to: '/doctor/profile', label: 'Profile & availability', icon: UserRound },
    { to: '/doctor/patients', label: 'My patients', icon: Users },
    { to: '/doctor/records', label: 'Health records', icon: FileText },
    { to: '/doctor/chat', label: 'Messages', icon: MessageCircle },
    { to: '/doctor/reviews', label: 'Reviews', icon: Star },
  ],
  admin: [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/appointments', label: 'Appointments', icon: CalendarDays },
    { to: '/admin/loyalty', label: 'Loyalty points', icon: Gift },
    { to: '/admin/records', label: 'Health records', icon: FileText },
    { to: '/admin/faqs', label: 'FAQs', icon: CircleHelp },
  ],
}

// Sidebar + page area shared by all dashboards
export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-4 md:flex">
        <Link to="/" className="mb-6 flex items-center gap-2 text-xl font-extrabold text-brand-700">
          <HeartPulse /> QuickCare
        </Link>
        <nav className="flex-1 space-y-1">
          {menus[user.role].map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <m.icon size={18} /> {m.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex gap-4 md:hidden">
            {menus[user.role].map((m) => (
              <NavLink key={m.to} to={m.to} end={m.end} title={m.label}
                className={({ isActive }) => (isActive ? 'text-brand-600' : 'text-slate-400')}>
                <m.icon size={20} />
              </NavLink>
            ))}
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Avatar name={user.name} src={user.avatar} size={36} />
            <p className="text-sm text-slate-500">
              Signed in as <span translate="no" className="font-semibold text-slate-800">{user.name}</span> ({user.role})
            </p>
          </div>
          <LanguageSwitcher />
        </header>
        <main className="p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  )
}
