import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MapPin, Stethoscope, Briefcase, Banknote } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Avatar from '../../components/Avatar'
import StarRating from '../../components/StarRating'
import SlotPicker from '../../components/SlotPicker'

// Doctor profile with the booking form
export default function DoctorDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [slot, setSlot] = useState({ date: '', time: '' })
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get(`/doctors/${id}`).then((res) => setDoctor(res.data)).catch(() => navigate('/doctors'))
  }, [id, navigate])

  useEffect(() => {
    api.get(`/reviews/doctor/${id}`).then((res) => setReviews(res.data))
  }, [id])

  const handleBook = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (!slot.time) return toast.error('Please pick a time slot')
    setLoading(true)
    try {
      await api.post('/appointments', { doctor: id, ...slot, reason })
      toast.success('Appointment booked')
      navigate('/patient/appointments')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not book')
    }
    setLoading(false)
  }

  if (!doctor) return <Navbar />

  return (
    <div>
      <Navbar />
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-5">
        <div className="card md:col-span-3">
          <div className="flex items-center gap-4">
            <Avatar name={doctor.user.name} src={doctor.user.avatar} size={72} />
            <div>
              <h1 translate="no" className="text-2xl font-extrabold">{doctor.user.name}</h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <StarRating value={doctor.averageRating} /> {doctor.reviewCount ? `${doctor.averageRating} (${doctor.reviewCount} reviews)` : 'No reviews yet'}
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p className="flex items-center gap-2"><Stethoscope size={16} className="text-brand-600" /> {doctor.specialization}</p>
            <p className="flex items-center gap-2"><MapPin size={16} className="text-brand-600" /> {doctor.hospital}</p>
            <p className="flex items-center gap-2"><Briefcase size={16} className="text-brand-600" /> {doctor.experience} years of experience</p>
            <p className="flex items-center gap-2"><Banknote size={16} className="text-brand-600" /> LKR {doctor.fee} (paid at the clinic)</p>
          </div>
          <h2 className="mt-6 font-bold">About</h2>
          <p className="mt-1 text-sm text-slate-600">{doctor.bio}</p>
          <h2 className="mt-6 font-bold">Working hours</h2>
          <ul className="mt-1 text-sm text-slate-600">
            {doctor.availability.map((a) => <li key={a._id}>{a.day}: {a.start} - {a.end}</li>)}
          </ul>
          <h2 className="mt-6 font-bold">Patient reviews</h2>
          <div className="mt-2 space-y-3">
            {reviews.map((r) => (
              <div key={r._id} className="rounded-lg bg-slate-50 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span translate="no" className="font-semibold">{r.patient.name}</span>
                  <StarRating value={r.rating} size={14} />
                </div>
                {r.comment && <p className="mt-1 text-slate-600">{r.comment}</p>}
              </div>
            ))}
            {reviews.length === 0 && <p className="text-sm text-slate-500">No reviews yet.</p>}
          </div>
        </div>

        <form onSubmit={handleBook} className="card space-y-4 md:col-span-2">
          <h2 className="text-lg font-bold">Book an appointment</h2>
          {user && user.role !== 'patient'
            ? <p className="text-sm text-slate-500">Only patients can book appointments.</p>
            : <>
                <SlotPicker doctorId={id} date={slot.date} time={slot.time} onChange={setSlot} />
                <textarea className="input" rows="3" placeholder="Reason for visit (optional)"
                  value={reason} onChange={(e) => setReason(e.target.value)} />
                <button className="btn w-full" disabled={loading}>{user ? 'Confirm booking' : 'Login to book'}</button>
              </>}
        </form>
      </div>
    </div>
  )
}
