import { useEffect, useState } from 'react'
import { Users, Stethoscope, CalendarDays, Wallet } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts'
import api from '../../api/axios'

const colors = ['#0d9488', '#14b8a6', '#5eead4', '#0f766e', '#99f6e4']

// Admin home: totals and charts (reports)
export default function AdminOverview() {
  const [stats, setStats] = useState(null)
  useEffect(() => { api.get('/admin/stats').then((res) => setStats(res.data)) }, [])

  if (!stats) return <p className="text-slate-500">Loading...</p>

  const cards = [
    { label: 'Patients', value: stats.patients, icon: Users },
    { label: 'Doctors', value: stats.doctors, icon: Stethoscope },
    { label: 'Appointments', value: stats.appointments, icon: CalendarDays },
    { label: 'Fees from completed visits', value: `LKR ${stats.revenue}`, icon: Wallet },
  ]
  const statusData = [
    { name: 'Booked', value: stats.booked },
    { name: 'Completed', value: stats.completed },
    { name: 'Cancelled', value: stats.cancelled },
  ].filter((s) => s.value > 0)

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Admin overview</h1>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50"><c.icon className="text-brand-600" /></span>
            <p className="mt-4 text-3xl font-extrabold">{c.value}</p>
            <p className="text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-3 font-bold">Appointments per month</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.months}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="appointments" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="mb-3 font-bold">Appointment status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={85}>
                {statusData.map((s) => <Cell key={s.name} fill={['#0d9488', '#22c55e', '#f87171'][['Booked', 'Completed', 'Cancelled'].indexOf(s.name)]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="mb-3 font-bold">Appointments by specialization</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={stats.specializations} dataKey="value" nameKey="name" outerRadius={85}>
                {stats.specializations.map((s, i) => <Cell key={s.name} fill={colors[i % colors.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="mb-3 font-bold">Top doctors (completed visits)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.topDoctors} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} fontSize={12} />
              <YAxis type="category" dataKey="name" width={120} fontSize={12} />
              <Tooltip />
              <Bar dataKey="visits" fill="#14b8a6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
