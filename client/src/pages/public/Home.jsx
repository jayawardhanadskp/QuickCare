import { Link } from 'react-router-dom'
import { CalendarCheck, Stethoscope, MessageCircle, FileText } from 'lucide-react'
import Navbar from '../../components/Navbar'

const features = [
  { icon: Stethoscope, title: 'Find the right doctor', text: 'Search by name or specialization and read real patient reviews.' },
  { icon: CalendarCheck, title: 'Book in seconds', text: 'Pick a free time slot, reschedule or cancel whenever you need.' },
  { icon: MessageCircle, title: 'Chat with your doctor', text: 'Ask follow up questions with live chat after your visit.' },
  { icon: FileText, title: 'Your health records', text: 'Keep your history, prescriptions and receipts in one place.' },
]

export default function Home() {
  return (
    <div>
      <Navbar />

      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            Your doctor, <span className="text-brand-600">one click away</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            QuickCare makes it simple to find a doctor, book an appointment and keep track of your health.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/doctors" className="btn">Find a doctor</Link>
            <Link to="/register" className="btn-outline">Create account</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Icon size={20} />
            </div>
            <h3 className="font-bold">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{text}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} QuickCare
      </footer>
    </div>
  )
}
