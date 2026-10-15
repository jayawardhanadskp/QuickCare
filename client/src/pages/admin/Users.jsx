import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2, Search } from 'lucide-react'
import Field from '../../components/Field'
import api from '../../api/axios'

const emptyDoctor = { name: '', email: '', password: '', phone: '', specialization: '', fee: '', hospital: '' }

// Admin manages patients and doctors
export default function Users() {
  const [role, setRole] = useState('patient')
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(null)

  const load = () => api.get('/admin/users', { params: { role } }).then((res) => setUsers(res.data))
  useEffect(() => { load() }, [role])

  const toggle = async (u) => {
    await api.put(`/admin/users/${u._id}/active`)
    toast.success(u.isActive ? 'Account deactivated' : 'Account activated')
    load()
  }

  const remove = async (u) => {
    if (!confirm(`Delete ${u.name} and all their appointments and records?`)) return
    await api.delete(`/admin/users/${u._id}`)
    toast.success('User deleted')
    load()
  }

  const addDoctor = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/doctors', form)
      toast.success('Doctor added')
      setForm(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add doctor')
    }
  }

  const shown = users.filter((u) => (u.name + u.email).toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Users</h1>
        {role === 'doctor' && <button className="btn" onClick={() => setForm(emptyDoctor)}><Plus size={16} /> Add doctor</button>}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {['patient', 'doctor'].map((r) => (
          <button key={r} onClick={() => setRole(r)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold capitalize ${role === r ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:text-brand-700'}`}>
            {r}s
          </button>
        ))}
        <div className="relative ml-auto w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input className="input !pl-9" placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card mt-5 overflow-x-auto !p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-brand-50 text-xs uppercase tracking-wide text-ink-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">{role === 'doctor' ? 'Specialization' : 'Phone'}</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((u) => (
              <tr key={u._id} className="border-b border-slate-100 last:border-0">
                <td translate="no" className="px-4 py-3 font-semibold">{u.name}</td>
                <td translate="no" className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3 text-slate-600">{role === 'doctor' ? u.specialization : u.phone || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="btn-outline !py-1.5" onClick={() => toggle(u)}>{u.isActive ? 'Deactivate' : 'Activate'}</button>
                    <button className="btn-outline !py-1.5 !text-red-600" onClick={() => remove(u)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="p-4 text-slate-500">No users found.</p>}
      </div>

      {form && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm p-4">
          <form onSubmit={addDoctor} className="card max-h-[90dvh] w-full max-w-md overflow-y-auto space-y-3">
            <h2 className="text-lg font-bold">Add doctor</h2>
            <Field label="Full name"><input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Email"><input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Password (min 6 characters)"><input className="input" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
            <Field label="Phone"><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Specialization"><input className="input" required value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Fee (LKR)"><input className="input" type="number" min="0" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} /></Field>
              <Field label="Hospital"><input className="input" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} /></Field>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-outline" onClick={() => setForm(null)}>Close</button>
              <button className="btn">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
