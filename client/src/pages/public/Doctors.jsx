import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import DoctorCard from '../../components/DoctorCard'
import PageHeader from '../../components/PageHeader'
import Footer from '../../components/Footer'

// Search and browse all doctors
export default function Doctors() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [favourites, setFavourites] = useState([])
  const [q, setQ] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [specializations, setSpecializations] = useState([])

  // Load the list of specializations once
  useEffect(() => {
    api.get('/doctors').then((res) => setSpecializations([...new Set(res.data.map((d) => d.specialization))]))
  }, [])

  // Reload doctors when the search changes
  useEffect(() => {
    api.get('/doctors', { params: { q, specialization } }).then((res) => setDoctors(res.data))
  }, [q, specialization])

  useEffect(() => {
    if (user?.role === 'patient') api.get('/doctors/favourites/mine').then((res) => setFavourites(res.data))
  }, [user])

  const toggleFavourite = async (id) => {
    if (!user) return navigate('/login')
    try {
      const res = await api.post(`/doctors/${id}/favourite`)
      setFavourites(res.data.favourite ? [...favourites, id] : favourites.filter((f) => f !== id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Only patients can add favourites')
    }
  }

  return (
    <div>
      <Navbar />
      <PageHeader title="Find a doctor" text="Search by name, speciality or hospital and book a free time slot.">
        <div className="mt-6 flex max-w-3xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
            <input className="input !border-0 !pl-11" placeholder="Search doctors or hospitals"
              value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="sm:w-64">
            <select className="input" value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
              <option value="">All specializations</option>
              {specializations.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </PageHeader>

      <div className="container-page py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {doctors.map((d) => (
            <DoctorCard key={d._id} doctor={d}
              isFavourite={favourites.includes(d.user._id)} onToggleFavourite={toggleFavourite} />
          ))}
        </div>
        {doctors.length === 0 && <p className="mt-10 text-center text-slate-500">No doctors found.</p>}
      </div>
      <Footer />
    </div>
  )
}
