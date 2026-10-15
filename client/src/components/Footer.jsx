import { Link } from 'react-router-dom'
import { HeartPulse, Phone, Mail, MapPin } from 'lucide-react'

// Dark footer shared by the public pages
export default function Footer() {
  return (
    <footer className="bg-ink-900 text-slate-300">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500"><HeartPulse size={20} /></span>
            QuickCare
          </Link>
          <p className="mt-4 text-sm leading-relaxed">Find a trusted doctor, book a time that suits you and keep your health records in one place.</p>
        </div>

        <div>
          <h3 className="font-bold text-white">Quick links</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/doctors" className="hover:text-white">Find a doctor</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/register" className="hover:text-white">Create account</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white">Opening hours</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Mon - Fri: 8:00 am - 7:00 pm</li>
            <li>Saturday: 8:00 am - 2:00 pm</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone size={16} className="text-brand-500" /> +94 11 234 5678</li>
            <li className="flex items-center gap-2"><Mail size={16} className="text-brand-500" /> care@quickcare.lk</li>
            <li className="flex items-center gap-2"><MapPin size={16} className="text-brand-500" /> Colombo, Sri Lanka</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} QuickCare. All rights reserved.
      </div>
    </footer>
  )
}
