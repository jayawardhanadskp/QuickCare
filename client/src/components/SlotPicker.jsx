import { useEffect, useState } from 'react'
import api from '../api/axios'

const today = () => new Date().toISOString().slice(0, 10)

// Pick a date, then one of the doctor's free time slots
export default function SlotPicker({ doctorId, ignoreId, date, time, onChange }) {
  const [slots, setSlots] = useState([])

  useEffect(() => {
    if (!date) return
    api.get(`/doctors/${doctorId}/slots`, { params: { date, ignore: ignoreId } })
      .then((res) => setSlots(res.data))
  }, [doctorId, ignoreId, date])

  return (
    <div className="space-y-3">
      <input type="date" className="input" min={today()} value={date}
        onChange={(e) => onChange({ date: e.target.value, time: '' })} />
      {date && (
        slots.length === 0
          ? <p className="text-sm text-slate-500">No free slots on this day.</p>
          : <div className="flex flex-wrap gap-2">
              {slots.map((s) => (
                <button type="button" key={s} onClick={() => onChange({ date, time: s })}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${time === s ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white hover:border-brand-500'}`}>
                  {s}
                </button>
              ))}
            </div>
      )}
    </div>
  )
}
