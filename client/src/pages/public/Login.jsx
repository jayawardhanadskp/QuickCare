import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { User, Stethoscope, ShieldCheck, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import Field from '../../components/Field'
import AuthLayout from '../../components/AuthLayout'

// The three kinds of users, each with its own login page
const roles = {
  patient: { icon: User, label: 'Patient', text: 'Book appointments, chat with doctors and keep your records.' },
  doctor: { icon: Stethoscope, label: 'Doctor', text: 'Manage your schedule, patients and reviews.' },
  admin: { icon: ShieldCheck, label: 'Admin', text: 'Manage users, appointments and see reports.' },
}

// /login shows the three choices, /login/patient (or doctor, admin) shows the form
export default function Login() {
  const { role } = useParams()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const current = roles[role]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password, role)
      toast.success(`Welcome back, ${user.name}`)
      navigate(`/${user.role}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  // Step 1: choose who is logging in
  if (!current) {
    return (
      <AuthLayout title="Login" text="Choose how you want to log in.">
        <div className="space-y-3">
          {Object.entries(roles).map(([key, { icon: Icon, label, text }]) => (
            <Link key={key} to={`/login/${key}`}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-brand-500 hover:bg-brand-50">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon size={24} /></span>
              <span className="flex-1">
                <span className="block font-bold text-ink-900">{label} login</span>
                <span className="block text-sm text-slate-500">{text}</span>
              </span>
              <ArrowRight size={18} className="text-slate-400" />
            </Link>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-slate-600">
          New patient? <Link to="/register" className="font-semibold text-brand-600">Create an account</Link>
        </p>
      </AuthLayout>
    )
  }

  // Step 2: the login form for that user type
  const others = Object.keys(roles).filter((r) => r !== role)
  return (
    <AuthLayout title={`${current.label} login`} text={current.text}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Email"><input className="input" type="email" required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Password"><input className="input" type="password" required
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
        <div className="text-right text-sm">
          <Link to="/forgot-password" className="font-semibold text-brand-600">Forgot password?</Link>
        </div>
        <button className="btn w-full !py-3.5" disabled={loading}>{loading ? 'Please wait...' : 'Login'}</button>
        {role === 'patient' && (
          <p className="text-center text-sm text-slate-600">
            New here? <Link to="/register" className="font-semibold text-brand-600">Create an account</Link>
          </p>
        )}
        {role === 'doctor' && <p className="text-center text-sm text-slate-500">Doctor accounts are created by the admin.</p>}
        <p className="text-center text-sm text-slate-500">
          Not a {role}? Login as{' '}
          {others.map((o, i) => (
            <span key={o}>{i > 0 && ' or '}<Link to={`/login/${o}`} className="font-semibold text-brand-600">{roles[o].label.toLowerCase()}</Link></span>
          ))}
        </p>
      </form>
    </AuthLayout>
  )
}
