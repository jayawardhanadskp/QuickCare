import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

// Patients who have booked with this doctor
export default function Patients() {
  const [patients, setPatients] = useState([])
  useEffect(() => { api.get('/records/patients').then((res) => setPatients(res.data)) }, [])

  return (
    <div>
      <h1 className="text-2xl font-extrabold">My patients</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patients.map((p) => (
          <div key={p._id} className="card">
            <p translate="no" className="font-bold">{p.name}</p>
            <p translate="no" className="text-sm text-slate-500">{p.email}</p>
            {p.phone && <p className="text-sm text-slate-500">{p.phone}</p>}
            <div className="mt-3 flex gap-3 text-sm font-semibold text-brand-700">
              <Link to="/doctor/records">Health records</Link>
              <Link to="/doctor/chat">Message</Link>
            </div>
          </div>
        ))}
        {patients.length === 0 && <p className="text-slate-500">No patients yet.</p>}
      </div>
    </div>
  )
}
