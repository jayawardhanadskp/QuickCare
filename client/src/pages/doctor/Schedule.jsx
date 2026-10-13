import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle2, XCircle } from 'lucide-react'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'

// Doctor's appointments, with complete / cancel actions
export default function Schedule() {
  const [list, setList] = useState([])
  const [filter, setFilter] = useState('booked')

  const load = () => api.get('/appointments').then((res) => setList(res.data))
  useEffect(() => { load() }, [])

  // action is "complete" or "cancel"
  const update = async (id, action) => {
    try {
      await api.put(`/appointments/${id}/${action}`)
      toast.success(action === 'complete' ? 'Marked as completed' : 'Appointment cancelled')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  const shown = list.filter((a) => filter === 'all' || a.status === filter)

  return (
    <div>
      <h1 className="text-2xl font-extrabold">My schedule</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {['booked', 'completed', 'cancelled', 'all'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${filter === f ? 'bg-brand-600 text-white' : 'bg-white text-slate-600'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {shown.map((a) => (
          <div key={a._id} className="card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p translate="no" className="font-bold">{a.patient.name}</p>
              <p className="text-sm text-slate-500">{a.date} at {a.time}</p>
              {a.reason && <p className="text-sm text-slate-500">Reason: {a.reason}</p>}
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={a.status} />
              {a.status === 'booked' && <>
                <button className="btn !py-1.5" onClick={() => update(a._id, 'complete')}><CheckCircle2 size={16} /> Complete</button>
                <button className="btn-outline !py-1.5 !text-red-600" onClick={() => update(a._id, 'cancel')}><XCircle size={16} /> Cancel</button>
              </>}
            </div>
          </div>
        ))}
        {shown.length === 0 && <p className="text-slate-500">No appointments.</p>}
      </div>
    </div>
  )
}
