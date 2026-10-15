import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import Field from '../../components/Field'
import AuthLayout from '../../components/AuthLayout'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}`)
      navigate(`/${user.role}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <AuthLayout title="Welcome back" text="Login to manage your appointments.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Email"><input className="input" type="email" required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Password"><input className="input" type="password" required
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
        <button className="btn w-full !py-3.5" disabled={loading}>{loading ? 'Please wait...' : 'Login'}</button>
        <p className="text-center text-sm text-slate-600">
          New here? <Link to="/register" className="font-semibold text-brand-600">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
