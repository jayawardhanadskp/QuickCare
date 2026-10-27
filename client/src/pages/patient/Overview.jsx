import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, CheckCircle2, Search, Gift } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

// Patient home: a few numbers and shortcuts
export default function PatientOverview() {
  const { user } = useAuth()
  const [list, setList] = useState([])
  const [points, setPoints] = useState(0)

  useEffect(() => {
    api.get('/appointments').then((res) => setList(res.data))
    api.get('/auth/me').then((res) => setPoints(res.data.loyaltyPoints))
  }, [])

  const upcoming = list.filter((a) => a.status === 'booked')
  const next = [...upcoming].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0]

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Hello, <span translate="no">{user.name}</span></h1>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50"><CalendarDays className="text-brand-600" /></span><p className="mt-4 text-3xl font-extrabold">{upcoming.length}</p><p className="text-sm text-slate-500">Upcoming appointments</p></div>
        <div className="card"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50"><CheckCircle2 className="text-brand-600" /></span><p className="mt-4 text-3xl font-extrabold">{list.filter((a) => a.status === 'completed').length}</p><p className="text-sm text-slate-500">Completed visits</p></div>
        <div className="card"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50"><Gift className="text-brand-600" /></span><p className="mt-4 text-3xl font-extrabold">{points}</p><p className="text-sm text-slate-500">Loyalty points</p></div>
        <Link to="/doctors" className="card flex flex-col justify-between hover:border-brand-500"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50"><Search className="text-brand-600" /></span><p className="mt-2 font-bold">Find a doctor</p><p className="text-sm text-slate-500">Search and book</p></Link>
      </div>
      <div className="card mt-6">
        <h2 className="font-bold">Next appointment</h2>
        {next
          ? <p className="mt-2 text-slate-600"><span translate="no">{next.doctor.name}</span> · {next.date} at {next.time}</p>
          : <p className="mt-2 text-slate-500">You have nothing booked.</p>}
      </div>
    </div>
  )
}
