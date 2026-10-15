import { Link } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'

// Split screen for login and register: photo on the left, form on the right
export default function AuthLayout({ title, text, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink-900 lg:block">
        <img src="/images/about-img1.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500"><HeartPulse size={20} /></span>
            QuickCare
          </Link>
          <div>
            <h2 className="text-4xl font-extrabold leading-tight !text-white">Book your doctor in a few clicks</h2>
            <p className="mt-4 max-w-md text-slate-300">Find trusted specialists, manage your appointments and keep your health records safe in one place.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2 text-xl font-extrabold text-ink-900 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white"><HeartPulse size={20} /></span>
            QuickCare
          </Link>
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <p className="mt-2 text-slate-500">{text}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
