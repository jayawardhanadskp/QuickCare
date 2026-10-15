import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { HeartPulse, LogOut, LayoutDashboard, CalendarDays, Heart, UserRound, FileText, Star, CircleHelp, MessageCircle, Users, Gift, Menu, X } from 'lucide-react'
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
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen">
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-ink-900/60 backdrop-blur-sm md:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-ink-900 p-5 transition-transform md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500"><HeartPulse size={20} /></span>
            QuickCare
          </Link>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-slate-300 hover:text-white md:hidden"><X size={22} /></button>
        </div>
        <div className="mb-5 flex items-center gap-3 rounded-xl bg-white/5 p-3 md:hidden">
          <Avatar name={user.name} src={user.avatar} size={40} />
          <div className="min-w-0">
            <p translate="no" className="truncate text-sm font-bold text-white">{user.name}</p>
            <p className="text-xs capitalize text-slate-400">{user.role}</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {menus[user.role].map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
              <m.icon size={18} /> {m.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-100 bg-white/90 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setOpen(true)} aria-label="Open menu" className="flex h-11 w-11 items-center justify-center rounded-xl text-ink-900 hover:bg-brand-50">
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2 font-extrabold text-ink-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white"><HeartPulse size={18} /></span>
              QuickCare
            </Link>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Avatar name={user.name} src={user.avatar} size={42} />
            <div>
              <p translate="no" className="text-sm font-bold text-ink-900">{user.name}</p>
              <p className="text-xs capitalize text-slate-500">{user.role}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </header>
        <main className="p-4 sm:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
