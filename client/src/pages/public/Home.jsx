import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, Stethoscope, MessageCircle, FileText, ArrowRight, Check, Clock, Star, HeartPulse, Users, ShieldCheck } from 'lucide-react'
import api from '../../api/axios'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const features = [
  { icon: Stethoscope, title: 'Find the right doctor', text: 'Search by name or specialization and read real patient reviews.' },
  { icon: CalendarCheck, title: 'Book in seconds', text: 'Pick a free time slot, reschedule or cancel whenever you need.' },
  { icon: MessageCircle, title: 'Chat with your doctor', text: 'Ask follow up questions with live chat after your visit.' },
  { icon: FileText, title: 'Your health records', text: 'Keep your history, prescriptions and receipts in one place.' },
]

const points = ['Verified doctors', 'Free slot booking', 'Email reminders', 'Live doctor chat', 'Digital health records', 'Loyalty points']

const hours = [
  ['Monday', '08:00 - 19:00'],
  ['Tuesday', '08:00 - 19:00'],
  ['Wednesday', '08:00 - 19:00'],
  ['Thursday', '08:00 - 19:00'],
  ['Friday', '08:00 - 19:00'],
  ['Saturday', '08:00 - 14:00'],
]

// Stock photos used when a doctor has not uploaded a picture
const teamPhotos = ['team-img1.webp', 'team-img2.webp', 'team-img4.webp', 'about-img1.webp']

export default function Home() {
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    api.get('/doctors').then((res) => setDoctors(res.data.slice(0, 4)))
  }, [])

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100/60">
        <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="eyebrow">Trusted care, close to home</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.15] sm:text-5xl lg:text-6xl">
              Your health, <span className="text-brand-600">in expert hands</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              QuickCare makes it simple to find a doctor, book an appointment and keep track of your health, all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/doctors" className="btn !px-6 !py-3.5">Book an appointment <ArrowRight size={16} /></Link>
              <Link to="/register" className="btn-outline !px-6 !py-3.5">Create account</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-8">
              <div><p className="text-3xl font-extrabold text-ink-900">4+</p><p className="text-sm text-slate-500">Specialist doctors</p></div>
              <div><p className="text-3xl font-extrabold text-ink-900">24/7</p><p className="text-sm text-slate-500">Online booking</p></div>
              <div><p className="text-3xl font-extrabold text-ink-900">100%</p><p className="text-sm text-slate-500">Secure records</p></div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute inset-x-8 bottom-0 top-10 rounded-[2.5rem] bg-brand-500/15" />
            <img src="/images/hero-banner-img1.webp" alt="Smiling doctor" className="relative mx-auto w-full max-w-md" />

            <div className="absolute left-0 top-1/3 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl sm:-left-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><CalendarCheck size={22} /></span>
              <div>
                <p className="text-sm font-bold text-ink-900">Easy booking</p>
                <p className="text-xs text-slate-500">Pick a free slot</p>
              </div>
            </div>
            <div className="absolute bottom-10 right-0 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl">
              <img src="/images/hero-banner-heart.png" alt="" className="h-10 w-10" />
              <div>
                <p className="flex items-center gap-1 text-sm font-bold text-ink-900"><Star size={14} className="fill-amber-400 text-amber-400" /> 4.9 rating</p>
                <p className="text-xs text-slate-500">From our patients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">What you can do</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Everything for your visit, in one app</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(8,37,48,0.12)]">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon size={26} />
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About + opening hours */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md lg:mx-0">
            <img src="/images/about-img1.webp" alt="Doctor in clinic" className="aspect-[4/5] w-4/5 rounded-[2rem] object-cover" />
            <div className="absolute -bottom-6 right-0 w-64 rounded-3xl bg-brand-600 p-6 text-white shadow-xl">
              <h3 className="flex items-center gap-2 text-lg font-bold !text-white"><Clock size={18} /> Open hours</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {hours.map(([day, time]) => (
                  <li key={day} className="flex justify-between"><span className="text-brand-100">{day}</span><span className="font-semibold">{time}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 lg:pt-0">
            <p className="eyebrow">About QuickCare</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">Care that fits around your day</h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Skip the phone calls and the waiting room queues. Choose a doctor, see their free times and book in a few clicks.
              We email you the details and remind you the day before your visit.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm font-semibold text-ink-800">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-700"><Check size={12} /></span> {p}
                </li>
              ))}
            </ul>
            <Link to="/doctors" className="btn-dark mt-8 !px-6 !py-3.5">Meet our doctors <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Doctors */}
      {doctors.length > 0 && (
        <section className="container-page py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Our specialists</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Meet the doctors</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((d, i) => (
              <Link key={d._id} to={`/doctors/${d.user._id}`} className="group overflow-hidden rounded-3xl bg-white shadow-[0_4px_24px_rgba(8,37,48,0.06)] transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(8,37,48,0.12)]">
                <div className="flex h-64 items-end justify-center overflow-hidden bg-gradient-to-b from-brand-50 to-brand-100">
                  {d.user.avatar
                    ? <img src={d.user.avatar} alt={d.user.name} className="h-full w-full object-cover" />
                    : <img src={`/images/${teamPhotos[i % teamPhotos.length]}`} alt={d.user.name} className={`h-full w-full ${i % 4 === 3 ? 'object-cover object-top' : 'object-contain mix-blend-multiply'}`} />}
                </div>
                <div className="p-5 text-center">
                  <h3 translate="no" className="font-bold">{d.user.name}</h3>
                  <p className="mt-1 text-sm font-medium text-brand-700">{d.specialization}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Call to action */}
      <section className="container-page pb-16 lg:pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink-900 px-6 py-14 text-center sm:px-12">
          <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-brand-500/20" />
          <div className="absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-brand-500/20" />
          <div className="relative">
            <div className="mx-auto mb-5 flex w-fit gap-6 text-brand-500">
              <HeartPulse /> <Users /> <ShieldCheck />
            </div>
            <h2 className="text-3xl font-extrabold !text-white sm:text-4xl">Ready to see a doctor?</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">Create a free account and book your first appointment today.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn !px-6 !py-3.5">Get started</Link>
              <Link to="/doctors" className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">Browse doctors</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
