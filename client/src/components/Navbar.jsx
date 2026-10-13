import { Link, useNavigate } from 'react-router-dom'
import { HeartPulse, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex shrink-0 items-center gap-1.5 text-lg font-extrabold text-brand-700 sm:gap-2 sm:text-xl">
          <HeartPulse /> QuickCare
        </Link>

        <nav className="flex items-center gap-2 text-sm font-medium text-slate-600 sm:gap-5">
          <Link to="/doctors" className={`hover:text-brand-600 ${user ? 'hidden sm:inline' : ''}`}>Doctors</Link>
          <Link to="/faq" className={`hover:text-brand-600 ${user ? 'hidden sm:inline' : ''}`}>FAQ</Link>
          <LanguageSwitcher />
          {user ? (
            <>
              <Link to={`/${user.role}`} className="btn !px-3 sm:!px-4">Dashboard</Link>
              <button onClick={handleLogout} title="Logout" className="text-slate-500 hover:text-red-600">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-brand-600">Login</Link>
              <Link to="/register" className="btn !px-3 sm:!px-4">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
