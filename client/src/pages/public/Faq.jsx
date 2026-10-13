import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import api from '../../api/axios'
import Navbar from '../../components/Navbar'

// Public read-only FAQ page
export default function Faq() {
  const [faqs, setFaqs] = useState([])
  const [open, setOpen] = useState(null)

  useEffect(() => { api.get('/faqs').then((res) => setFaqs(res.data)) }, [])

  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-extrabold">Frequently asked questions</h1>
        <div className="mt-6 space-y-3">
          {faqs.map((f) => (
            <div key={f._id} className="card !p-0">
              <button onClick={() => setOpen(open === f._id ? null : f._id)}
                className="flex w-full items-center justify-between gap-3 p-5 text-left font-semibold">
                {f.question}
                <ChevronDown size={18} className={`shrink-0 text-brand-600 transition ${open === f._id ? 'rotate-180' : ''}`} />
              </button>
              {open === f._id && <p className="px-5 pb-5 text-sm text-slate-600">{f.answer}</p>}
            </div>
          ))}
          {faqs.length === 0 && <p className="text-slate-500">No questions yet.</p>}
        </div>
      </div>
    </div>
  )
}
