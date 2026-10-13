import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Download, CalendarClock, XCircle, Star } from 'lucide-react'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'
import StarRating from '../../components/StarRating'
import SlotPicker from '../../components/SlotPicker'
import { downloadReceipt } from '../../utils/receipt'

// Patient's upcoming appointments and history
export default function Appointments() {
  const [list, setList] = useState([])
  const [tab, setTab] = useState('upcoming')
  const [editing, setEditing] = useState(null) // appointment being rescheduled
  const [slot, setSlot] = useState({ date: '', time: '' })

  const [reviewed, setReviewed] = useState([]) // ids of reviewed appointments
  const [reviewing, setReviewing] = useState(null) // appointment being reviewed
  const [review, setReview] = useState({ rating: 5, comment: '' })

  const load = () => {
    api.get('/appointments').then((res) => setList(res.data))
    api.get('/reviews/mine').then((res) => setReviewed(res.data.map((r) => r.appointment)))
  }
  useEffect(() => { load() }, [])

  const shown = list.filter((a) => (tab === 'upcoming' ? a.status === 'booked' : a.status !== 'booked'))

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return
    try {
      await api.put(`/appointments/${id}/cancel`)
      toast.success('Appointment cancelled')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel')
    }
  }

  const handleReschedule = async () => {
    if (!slot.time) return toast.error('Please pick a new time slot')
    try {
      await api.put(`/appointments/${editing._id}/reschedule`, slot)
      toast.success('Appointment rescheduled')
      setEditing(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not reschedule')
    }
  }

  const handleReview = async () => {
    try {
      await api.post('/reviews', { appointment: reviewing._id, ...review })
      toast.success('Thanks for your review')
      setReviewing(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save review')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold">My appointments</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {['upcoming', 'history'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${tab === t ? 'bg-brand-600 text-white' : 'bg-white text-slate-600'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {shown.map((a) => (
          <div key={a._id} className="card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p translate="no" className="font-bold">{a.doctor.name}</p>
              <p className="text-sm text-slate-500">{a.specialization} · {a.date} at {a.time}</p>
              {a.reason && <p className="text-sm text-slate-500">Reason: {a.reason}</p>}
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={a.status} />
              {a.status === 'booked' && <>
                <button className="btn-outline !py-1.5" onClick={() => { setEditing(a); setSlot({ date: '', time: '' }) }}>
                  <CalendarClock size={16} /> Reschedule
                </button>
                <button className="btn-outline !py-1.5 !text-red-600" onClick={() => handleCancel(a._id)}>
                  <XCircle size={16} /> Cancel
                </button>
              </>}
              {a.status === 'completed' && !reviewed.includes(a._id) && (
                <button className="btn-outline !py-1.5" onClick={() => { setReviewing(a); setReview({ rating: 5, comment: '' }) }}>
                  <Star size={16} /> Review
                </button>
              )}
              {a.status !== 'cancelled' && (
                <button className="btn-outline !py-1.5" onClick={() => downloadReceipt(a)}>
                  <Download size={16} /> Receipt
                </button>
              )}
            </div>
          </div>
        ))}
        {shown.length === 0 && <p className="text-slate-500">Nothing here yet.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold">Reschedule with <span translate="no">{editing.doctor.name}</span></h2>
            <SlotPicker doctorId={editing.doctor._id} ignoreId={editing._id}
              date={slot.date} time={slot.time} onChange={setSlot} />
            <div className="flex justify-end gap-2">
              <button className="btn-outline" onClick={() => setEditing(null)}>Close</button>
              <button className="btn" onClick={handleReschedule}>Save</button>
            </div>
          </div>
        </div>
      )}
      {reviewing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold">Rate <span translate="no">{reviewing.doctor.name}</span></h2>
            <StarRating value={review.rating} size={28} onChange={(n) => setReview({ ...review, rating: n })} />
            <textarea className="input" rows="3" placeholder="Share your experience (optional)"
              value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />
            <div className="flex justify-end gap-2">
              <button className="btn-outline" onClick={() => setReviewing(null)}>Close</button>
              <button className="btn" onClick={handleReview}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
