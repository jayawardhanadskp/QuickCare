import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import api from '../../api/axios'
import Navbar from '../../components/Navbar'
import PageHeader from '../../components/PageHeader'
import Footer from '../../components/Footer'

// Public read-only FAQ page
export default function Faq() {
  const [faqs, setFaqs] = useState([])
  const [open, setOpen] = useState(null)

  useEffect(() => { api.get('/faqs').then((res) => setFaqs(res.data)) }, [])

  return (
    <div>
      <Navbar />
      <PageHeader title="Frequently asked questions" text="Quick answers about booking, records and your account." />
      <div className="container-page max-w-3xl py-12">
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f._id} className="card !p-0">
              <button onClick={() => setOpen(open === f._id ? null : f._id)}
                className="flex w-full items-center justify-between gap-3 p-6 text-left font-bold text-ink-900">
                {f.question}
                <ChevronDown size={18} className={`shrink-0 text-brand-600 transition ${open === f._id ? 'rotate-180' : ''}`} />
              </button>
              {open === f._id && <p className="px-6 pb-6 text-sm leading-relaxed text-slate-600">{f.answer}</p>}
            </div>
          ))}
          {faqs.length === 0 && <p className="text-slate-500">No questions yet.</p>}
        </div>
      </div>
      <Footer />
    </div>
  )
}
