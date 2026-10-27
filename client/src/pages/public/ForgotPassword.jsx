import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import Field from '../../components/Field'
import AuthLayout from '../../components/AuthLayout'

// Ask for the account email and send a reset link
export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send the email')
    }
    setLoading(false)
  }

  return (
    <AuthLayout title="Forgot password" text="Enter your email and we will send you a link to reset your password.">
      {sent ? (
        <div className="rounded-2xl bg-brand-50 p-5 text-sm text-slate-700">
          If <b translate="no">{email}</b> is registered, a reset link is on its way. It works for 30 minutes.
          Check your spam folder if you do not see it.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Email"><input className="input" type="email" required
            value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <button className="btn w-full !py-3.5" disabled={loading}>{loading ? 'Please wait...' : 'Send reset link'}</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-slate-600">
        <Link to="/login" className="font-semibold text-brand-600">Back to login</Link>
      </p>
    </AuthLayout>
  )
}
