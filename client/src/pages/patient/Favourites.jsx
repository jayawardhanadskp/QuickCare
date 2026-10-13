import { useEffect, useState } from 'react'
import api from '../../api/axios'
import DoctorCard from '../../components/DoctorCard'

// Doctors the patient has marked as favourite
export default function Favourites() {
  const [doctors, setDoctors] = useState([])
  const [ids, setIds] = useState([])

  useEffect(() => {
    Promise.all([api.get('/doctors'), api.get('/doctors/favourites/mine')]).then(([all, fav]) => {
      setIds(fav.data)
      setDoctors(all.data.filter((d) => fav.data.includes(d.user._id)))
    })
  }, [])

  // Un-favouriting removes the card from this page
  const remove = async (id) => {
    await api.post(`/doctors/${id}/favourite`)
    setDoctors(doctors.filter((d) => d.user._id !== id))
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Favourite doctors</h1>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {doctors.map((d) => <DoctorCard key={d._id} doctor={d} isFavourite={ids.includes(d.user._id)} onToggleFavourite={remove} />)}
      </div>
      {doctors.length === 0 && <p className="mt-5 text-slate-500">No favourites yet. Tap the heart on a doctor to save them here.</p>}
    </div>
  )
}
