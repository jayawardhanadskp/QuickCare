import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import Field from '../../components/Field'
import AuthLayout from '../../components/AuthLayout'

// Choose a new password using the link from the email
export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password: form.password })
      toast.success(res.data.message)
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not reset the password')
    }
    setLoading(false)
  }

  return (
    <AuthLayout title="Reset password" text="Choose a new password for your account.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="New password"><input className="input" type="password" required minLength={6}
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
        <Field label="Confirm new password"><input className="input" type="password" required minLength={6}
          value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} /></Field>
        <button className="btn w-full !py-3.5" disabled={loading}>{loading ? 'Please wait...' : 'Change password'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        <Link to="/forgot-password" className="font-semibold text-brand-600">Need a new link?</Link>
      </p>
    </AuthLayout>
  )
}
