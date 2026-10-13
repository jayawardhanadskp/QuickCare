import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created')
      navigate('/patient')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div>
      <Navbar />
      <div className="mx-auto mt-12 max-w-md px-4">
        <form onSubmit={handleSubmit} className="card space-y-4">
          <h2 className="text-2xl font-extrabold">Create account</h2>
          <input className="input" placeholder="Full name" required value={form.name} onChange={update('name')} />
          <input className="input" type="email" placeholder="Email" required value={form.email} onChange={update('email')} />
          <input className="input" placeholder="Phone" value={form.phone} onChange={update('phone')} />
          <input className="input" type="password" placeholder="Password (min 6 characters)" required minLength={6}
            value={form.password} onChange={update('password')} />
          <button className="btn w-full" disabled={loading}>{loading ? 'Please wait...' : 'Sign up'}</button>
          <p className="text-center text-sm text-slate-600">
            Already registered? <Link to="/login" className="font-semibold text-brand-600">Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
