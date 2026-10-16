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
import PageHeader from '../../components/PageHeader'
import Footer from '../../components/Footer'

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
    if (!user) return navigate('/login/patient')
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
      <PageHeader title="Doctor profile" />
      <div className="container-page grid gap-6 py-8 sm:gap-8 sm:py-12 lg:grid-cols-5">
        <div className="card lg:col-span-3">
          <div className="flex items-center gap-4">
            <Avatar name={doctor.user.name} src={doctor.user.avatar} size={96} />
            <div>
              <h1 translate="no" className="text-2xl font-extrabold">{doctor.user.name}</h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <StarRating value={doctor.averageRating} /> {doctor.reviewCount ? `${doctor.averageRating} (${doctor.reviewCount} reviews)` : 'No reviews yet'}
              </p>
            </div>
          </div>
          <div className="mt-5 lg:hidden"><a href="#book" className="btn w-full !py-3">Book an appointment</a></div>
          <div className="mt-6 grid gap-3 rounded-2xl bg-brand-50 p-5 text-sm text-ink-800 sm:grid-cols-2">
            <p className="flex items-center gap-2"><Stethoscope size={16} className="text-brand-600" /> {doctor.specialization}</p>
            <p className="flex items-center gap-2"><MapPin size={16} className="text-brand-600" /> {doctor.hospital}</p>
            <p className="flex items-center gap-2"><Briefcase size={16} className="text-brand-600" /> {doctor.experience} years of experience</p>
            <p className="flex items-center gap-2"><Banknote size={16} className="text-brand-600" /> LKR {doctor.fee} (paid at the clinic)</p>
          </div>
          <h2 className="mt-8 text-lg font-bold">About</h2>
          <p className="mt-1 text-sm text-slate-600">{doctor.bio}</p>
          <h2 className="mt-8 text-lg font-bold">Working hours</h2>
          <ul className="mt-1 text-sm text-slate-600">
            {doctor.availability.map((a) => <li key={a._id}>{a.day}: {a.start} - {a.end}</li>)}
          </ul>
          <h2 className="mt-8 text-lg font-bold">Patient reviews</h2>
          <div className="mt-2 space-y-3">
            {reviews.map((r) => (
              <div key={r._id} className="rounded-xl bg-slate-50 p-4 text-sm">
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

        <form id="book" onSubmit={handleBook} className="card h-fit scroll-mt-24 space-y-4 lg:sticky lg:top-28 lg:col-span-2">
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
      <Footer />
    </div>
  )
}
