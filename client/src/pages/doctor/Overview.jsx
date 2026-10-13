import { useEffect, useState } from 'react'
import { CalendarDays, CheckCircle2 } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

// Doctor home: today's numbers
export default function DoctorOverview() {
  const { user } = useAuth()
  const [list, setList] = useState([])

  useEffect(() => { api.get('/appointments').then((res) => setList(res.data)) }, [])

  const today = new Date().toISOString().slice(0, 10)
  const todays = list.filter((a) => a.date === today && a.status === 'booked')

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Hello, <span translate="no">{user.name}</span></h1>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="card"><CalendarDays className="text-brand-600" /><p className="mt-2 text-3xl font-extrabold">{todays.length}</p><p className="text-sm text-slate-500">Appointments today</p></div>
        <div className="card"><CheckCircle2 className="text-brand-600" /><p className="mt-2 text-3xl font-extrabold">{list.filter((a) => a.status === 'booked').length}</p><p className="text-sm text-slate-500">Upcoming in total</p></div>
      </div>
      <div className="card mt-6">
        <h2 className="font-bold">Today</h2>
        <ul className="mt-2 space-y-1 text-slate-600">
          {todays.map((a) => <li key={a._id}>{a.time} · <span translate="no">{a.patient.name}</span></li>)}
          {todays.length === 0 && <li className="text-slate-500">No appointments today.</li>}
        </ul>
      </div>
    </div>
  )
}
