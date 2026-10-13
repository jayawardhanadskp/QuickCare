import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Field from '../../components/Field'
import api from '../../api/axios'

// Admin adds, edits and deletes FAQs
export default function Faqs() {
  const [faqs, setFaqs] = useState([])
  const [form, setForm] = useState(null)
  const [editingId, setEditingId] = useState(null)

  const load = () => api.get('/faqs').then((res) => setFaqs(res.data))
  useEffect(() => { load() }, [])

  const openForm = (faq) => {
    setEditingId(faq ? faq._id : null)
    setForm(faq ? { question: faq.question, answer: faq.answer } : { question: '', answer: '' })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editingId) await api.put(`/faqs/${editingId}`, form)
      else await api.post('/faqs', form)
      toast.success('FAQ saved')
      setForm(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this FAQ?')) return
    await api.delete(`/faqs/${id}`)
    toast.success('FAQ deleted')
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">FAQs</h1>
        <button className="btn" onClick={() => openForm(null)}><Plus size={16} /> Add FAQ</button>
      </div>

      <div className="mt-5 space-y-3">
        {faqs.map((f) => (
          <div key={f._id} className="card flex items-start justify-between gap-3">
            <div>
              <p className="font-bold">{f.question}</p>
              <p className="mt-1 text-sm text-slate-600">{f.answer}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline !py-1.5" onClick={() => openForm(f)}><Pencil size={16} /></button>
              <button className="btn-outline !py-1.5 !text-red-600" onClick={() => handleDelete(f._id)}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && <p className="text-slate-500">No FAQs yet.</p>}
      </div>

      {form && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSave} className="card w-full max-w-md space-y-3">
            <h2 className="text-lg font-bold">{editingId ? 'Edit FAQ' : 'Add FAQ'}</h2>
            <Field label="Question"><input className="input" required value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })} /></Field>
            <Field label="Answer"><textarea className="input" rows="4" required value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })} /></Field>
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
