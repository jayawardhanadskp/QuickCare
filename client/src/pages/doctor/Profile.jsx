import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import api from '../../api/axios'
import Field from '../../components/Field'
import PictureUpload from '../../components/PictureUpload'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Doctor edits their profile and weekly availability
export default function DoctorProfilePage() {
  const [form, setForm] = useState({ specialization: '', experience: 0, fee: 0, hospital: '', bio: '', availability: [] })

  useEffect(() => {
    api.get('/doctors/me/profile').then((res) => res.data && setForm(res.data))
  }, [])

  const set = (key, value) => setForm({ ...form, [key]: value })

  const addDay = () => set('availability', [...form.availability, { day: 'Monday', start: '09:00', end: '13:00' }])
  const removeDay = (i) => set('availability', form.availability.filter((_, idx) => idx !== i))
  const changeDay = (i, key, value) =>
    set('availability', form.availability.map((a, idx) => (idx === i ? { ...a, [key]: value } : a)))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.availability.some((a) => a.start >= a.end)) return toast.error('End time must be after start time')
    try {
      await api.put('/doctors/me/profile', form)
      toast.success('Profile saved')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <h1 className="text-3xl font-extrabold">Profile & availability</h1>

      <div className="card"><PictureUpload /></div>

      <div className="card grid gap-4 sm:grid-cols-2">
        <Field label="Specialization"><input className="input" required value={form.specialization} onChange={(e) => set('specialization', e.target.value)} /></Field>
        <Field label="Hospital / clinic"><input className="input" value={form.hospital} onChange={(e) => set('hospital', e.target.value)} /></Field>
        <Field label="Years of experience"><input className="input" type="number" min="0" value={form.experience} onChange={(e) => set('experience', e.target.value)} /></Field>
        <Field label="Consultation fee (LKR)"><input className="input" type="number" min="0" value={form.fee} onChange={(e) => set('fee', e.target.value)} /></Field>
        <Field label="About you" className="sm:col-span-2"><textarea className="input" rows="3" value={form.bio} onChange={(e) => set('bio', e.target.value)} /></Field>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Weekly availability</h2>
          <button type="button" className="btn-outline !py-1.5" onClick={addDay}><Plus size={16} /> Add</button>
        </div>
        {form.availability.map((a, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <select className="input !w-auto" value={a.day} onChange={(e) => changeDay(i, 'day', e.target.value)}>
              {days.map((d) => <option key={d}>{d}</option>)}
            </select>
            <input type="time" className="input !w-auto" value={a.start} onChange={(e) => changeDay(i, 'start', e.target.value)} />
            <span>to</span>
            <input type="time" className="input !w-auto" value={a.end} onChange={(e) => changeDay(i, 'end', e.target.value)} />
            <button type="button" onClick={() => removeDay(i)} className="text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
          </div>
        ))}
        {form.availability.length === 0 && <p className="text-sm text-slate-500">No working hours yet. Patients cannot book until you add some.</p>}
      </div>

      <button className="btn">Save changes</button>
    </form>
  )
}
