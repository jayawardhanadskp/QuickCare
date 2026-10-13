import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Field from '../../components/Field'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const categories = ['condition', 'allergy', 'medication', 'lab result', 'other']
const today = () => new Date().toISOString().slice(0, 10)
const emptyForm = { title: '', category: 'condition', details: '', date: today() }

// Health records page used by patients, doctors and admins
export default function HealthRecords() {
  const { user } = useAuth()
  const isPatient = user.role === 'patient'
  const [patients, setPatients] = useState([])
  const [patientId, setPatientId] = useState('')
  const [records, setRecords] = useState([])
  const [form, setForm] = useState(null) // null = form closed
  const [editingId, setEditingId] = useState(null)

  // Doctors and admins pick a patient first
  useEffect(() => {
    if (!isPatient) api.get('/records/patients').then((res) => setPatients(res.data))
  }, [isPatient])

  const load = () => {
    if (!isPatient && !patientId) return setRecords([])
    api.get('/records', { params: { patient: patientId } }).then((res) => setRecords(res.data))
  }
  useEffect(load, [patientId, isPatient]) // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd = () => { setEditingId(null); setForm(emptyForm) }
  const openEdit = (r) => {
    setEditingId(r._id)
    setForm({ title: r.title, category: r.category, details: r.details, date: r.date })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editingId) await api.put(`/records/${editingId}`, form)
      else await api.post('/records', { ...form, patient: patientId })
      toast.success('Record saved')
      setForm(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return
    await api.delete(`/records/${id}`)
    toast.success('Record deleted')
    load()
  }

  // Patients can only edit entries they wrote themselves
  const canEdit = (r) => !isPatient || r.createdBy._id === user.id || r.createdBy._id === user._id

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Health records</h1>
        {(isPatient || patientId) && <button className="btn" onClick={openAdd}><Plus size={16} /> Add record</button>}
      </div>

      {!isPatient && (
        <select className="input mt-4 max-w-sm" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
          <option value="">Select a patient</option>
          {patients.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.email})</option>)}
        </select>
      )}

      <div className="mt-5 space-y-3">
        {records.map((r) => (
          <div key={r._id} className="card flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-bold">{r.title}
                <span className="ml-2 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold capitalize text-brand-700">{r.category}</span>
              </p>
              <p className="text-sm text-slate-500">
                {r.date} · added by <span translate="no">{r.createdBy.name}</span>
              </p>
              {r.details && <p className="mt-1 text-sm text-slate-600">{r.details}</p>}
            </div>
            <div className="flex gap-2">
              {canEdit(r) && <button className="btn-outline !py-1.5" onClick={() => openEdit(r)}><Pencil size={16} /> Edit</button>}
              {user.role === 'admin' && (
                <button className="btn-outline !py-1.5 !text-red-600" onClick={() => handleDelete(r._id)}><Trash2 size={16} /></button>
              )}
            </div>
          </div>
        ))}
        {records.length === 0 && (
          <p className="text-slate-500">{isPatient || patientId ? 'No records yet.' : 'Select a patient to see their records.'}</p>
        )}
      </div>

      {form && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSave} className="card w-full max-w-md space-y-3">
            <h2 className="text-lg font-bold">{editingId ? 'Edit record' : 'Add record'}</h2>
            <Field label="Title"><input className="input" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <select className="input capitalize" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Date"><input type="date" className="input" required value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            </div>
            <Field label="Details"><textarea className="input" rows="4" value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })} /></Field>
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
