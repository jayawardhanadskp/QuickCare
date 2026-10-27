import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { HeartPulse, LogOut, Phone, Mail, Clock, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LanguageSwitcher from './LanguageSwitcher'

// Top info strip + main navigation bar
export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition hover:text-white ${isActive ? 'text-white' : 'text-slate-300'}`

  const mobileLink = ({ isActive }) =>
    `rounded-xl px-3 py-3.5 text-base font-medium ${isActive ? 'bg-white/10 text-white' : 'text-slate-300'}`

  return (
    <header className="sticky top-0 z-30">
      <div className="hidden border-b border-slate-100 bg-white lg:block">
        <div className="container-page flex h-11 items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><Phone size={14} className="text-brand-600" /> +94 11 234 5678</span>
            <span className="flex items-center gap-2"><Mail size={14} className="text-brand-600" /> care@quickcare.lk</span>
          </div>
          <span className="flex items-center gap-2"><Clock size={14} className="text-brand-600" /> Open Mon - Sat, 8:00 am to 7:00 pm</span>
        </div>
      </div>

      <div className="bg-ink-900">
        <div className="container-page flex h-16 items-center justify-between sm:h-[72px]">
          <Link to="/" className="flex shrink-0 items-center gap-2 text-xl font-extrabold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white"><HeartPulse size={20} /></span>
            <span translate="no">QuickCare</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/doctors" className={linkClass}>Doctors</NavLink>
            <NavLink to="/faq" className={linkClass}>FAQ</NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block"><LanguageSwitcher light /></div>
            {user ? (
              <>
                <div className="hidden sm:block"><Link to={`/${user.role}`} className="btn !px-4">Dashboard</Link></div>
                <button onClick={handleLogout} title="Logout" className="hidden text-slate-300 hover:text-white sm:block">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden text-sm font-medium text-slate-300 hover:text-white sm:inline">Login</Link>
                <div className="hidden sm:block"><Link to="/register" className="btn !px-4">Sign up</Link></div>
              </>
            )}
            <button onClick={() => setOpen(!open)} aria-label="Menu" className="flex h-11 w-11 items-center justify-center rounded-xl text-white hover:bg-white/10 md:hidden">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-white/10 px-5 pb-6 pt-4 md:hidden">
            <nav className="flex flex-col" onClick={() => setOpen(false)}>
              <NavLink to="/" end className={mobileLink}>Home</NavLink>
              <NavLink to="/doctors" className={mobileLink}>Doctors</NavLink>
              <NavLink to="/faq" className={mobileLink}>FAQ</NavLink>
            </nav>
            <div className="mt-4 flex flex-col gap-3" onClick={() => setOpen(false)}>
              {user ? (
                <>
                  <Link to={`/${user.role}`} className="btn !py-3">Dashboard</Link>
                  <button onClick={handleLogout} className="btn-outline !py-3"><LogOut size={16} /> Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-outline !py-3">Login</Link>
                  <Link to="/register" className="btn !py-3">Sign up</Link>
                </>
              )}
            </div>
            <div className="mt-5"><LanguageSwitcher light /></div>
          </div>
        )}
      </div>
    </header>
  )
}
