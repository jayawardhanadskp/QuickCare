import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Paperclip, FileText, X } from 'lucide-react'
import Field from '../../components/Field'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const categories = ['condition', 'allergy', 'medication', 'lab result', 'other']
const today = () => new Date().toISOString().slice(0, 10)
const emptyForm = { title: '', category: 'condition', details: '', date: today(), attachments: [] }

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
    setForm({ title: r.title, category: r.category, details: r.details, date: r.date, attachments: r.attachments || [] })
  }

  // Read chosen PDFs and images into the form (max 3 files, 2MB each)
  const addFiles = (e) => {
    const chosen = Array.from(e.target.files)
    e.target.value = ''
    for (const file of chosen) {
      if (form.attachments.length + 1 > 3) return toast.error('You can attach up to 3 files')
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') return toast.error('Only PDF and image files are allowed')
      if (file.size > 2 * 1024 * 1024) return toast.error(`${file.name} is bigger than 2MB`)
      const reader = new FileReader()
      reader.onload = () => setForm((f) => f.attachments.length >= 3 ? f
        : { ...f, attachments: [...f.attachments, { name: file.name, mimeType: file.type, data: reader.result }] })
      reader.readAsDataURL(file)
    }
  }

  const removeFile = (index) => setForm({ ...form, attachments: form.attachments.filter((_, i) => i !== index) })

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
        <h1 className="text-3xl font-extrabold">Health records</h1>
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
              {r.attachments?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.attachments.map((f, i) => (
                    <a key={i} href={f.data} download={f.name} title={f.name}
                      className="flex max-w-full items-center gap-2 rounded-xl border border-slate-200 p-1.5 pr-3 text-xs font-medium text-ink-800 hover:bg-slate-50">
                      {f.mimeType.startsWith('image/')
                        ? <img src={f.data} alt={f.name} className="h-10 w-10 rounded-lg object-cover" />
                        : <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600"><FileText size={20} /></span>}
                      <span className="max-w-[9rem] truncate" translate="no">{f.name}</span>
                    </a>
                  ))}
                </div>
              )}
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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm p-4">
          <form onSubmit={handleSave} className="card max-h-[90dvh] w-full max-w-md overflow-y-auto space-y-3">
            <h2 className="text-lg font-bold">{editingId ? 'Edit record' : 'Add record'}</h2>
            <Field label="Title"><input className="input" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
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
            <Field label="Attachments (PDF or image, up to 3 files, 2MB each)">
              <input type="file" accept="image/*,application/pdf" multiple onChange={addFiles}
                disabled={form.attachments.length >= 3} className="input !p-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:font-semibold file:text-brand-700" />
            </Field>
            {form.attachments.length > 0 && (
              <ul className="space-y-2">
                {form.attachments.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                    <Paperclip size={14} className="shrink-0 text-slate-400" />
                    <span className="min-w-0 flex-1 truncate" translate="no">{f.name}</span>
                    <button type="button" aria-label="Remove file" onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-600"><X size={16} /></button>
                  </li>
                ))}
              </ul>
            )}
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
