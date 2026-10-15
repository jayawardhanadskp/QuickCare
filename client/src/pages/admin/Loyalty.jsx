import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../api/axios'

// Admin gives or removes loyalty points (patients earn 10 per completed visit)
export default function Loyalty() {
  const [patients, setPatients] = useState([])
  const [change, setChange] = useState({})

  const load = () => api.get('/admin/users', { params: { role: 'patient' } }).then((res) => setPatients(res.data))
  useEffect(() => { load() }, [])

  const save = async (id) => {
    try {
      await api.put(`/admin/users/${id}/points`, { change: change[id] })
      toast.success('Points updated')
      setChange({ ...change, [id]: '' })
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update points')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Loyalty points</h1>
      <p className="mt-1 text-sm text-slate-500">Patients earn 10 points for every completed visit. Use a negative number to remove points.</p>
      <div className="mt-5 space-y-3">
        {patients.map((p) => (
          <div key={p._id} className="card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p translate="no" className="font-bold">{p.name}</p>
              <p translate="no" className="text-sm text-slate-500">{p.email}</p>
            </div>
            <p className="text-2xl font-extrabold text-brand-700">{p.loyaltyPoints} <span className="text-sm font-medium text-slate-500">points</span></p>
            <div className="flex gap-2">
              <input className="input !w-28" type="number" placeholder="+ / -" value={change[p._id] || ''}
                onChange={(e) => setChange({ ...change, [p._id]: e.target.value })} />
              <button className="btn" disabled={!change[p._id]} onClick={() => save(p._id)}>Apply</button>
            </div>
          </div>
        ))}
        {patients.length === 0 && <p className="text-slate-500">No patients yet.</p>}
      </div>
    </div>
  )
}
