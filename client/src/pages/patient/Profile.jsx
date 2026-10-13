import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import Field from '../../components/Field'
import PictureUpload from '../../components/PictureUpload'

// Patient edits their own details and picture
export default function PatientProfile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.put('/auth/me', form)
      updateUser(data)
      toast.success('Profile saved')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save')
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-extrabold">My profile</h1>
      <div className="card"><PictureUpload /></div>
      <form onSubmit={handleSubmit} className="card grid gap-4 sm:grid-cols-2">
        <Field label="Full name"><input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Phone"><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <Field label="Email" className="sm:col-span-2"><input className="input bg-slate-50" disabled value={user.email} /></Field>
        <div className="sm:col-span-2"><button className="btn">Save changes</button></div>
      </form>
    </div>
  )
}
