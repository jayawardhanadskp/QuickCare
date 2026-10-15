import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle2, XCircle } from 'lucide-react'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'

// Admin sees every appointment and can complete or cancel booked ones
export default function AdminAppointments() {
  const [list, setList] = useState([])
  const [filter, setFilter] = useState('all')

  const load = () => api.get('/appointments').then((res) => setList(res.data))
  useEffect(() => { load() }, [])

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
      <h1 className="text-3xl font-extrabold">All appointments</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {['all', 'booked', 'completed', 'cancelled'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold capitalize ${filter === f ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:text-brand-700'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="card mt-5 overflow-x-auto !p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-brand-50 text-xs uppercase tracking-wide text-ink-700">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((a) => (
              <tr key={a._id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">{a.date} {a.time}</td>
                <td translate="no" className="px-4 py-3 font-semibold">{a.patient.name}</td>
                <td translate="no" className="px-4 py-3">{a.doctor.name}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3">
                  {a.status === 'booked' && (
                    <div className="flex justify-end gap-2">
                      <button className="btn !py-1.5" onClick={() => update(a._id, 'complete')}><CheckCircle2 size={16} /> Complete</button>
                      <button className="btn-outline !py-1.5 !text-red-600" onClick={() => update(a._id, 'cancel')}><XCircle size={16} /> Cancel</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="p-4 text-slate-500">No appointments.</p>}
      </div>
    </div>
  )
}
