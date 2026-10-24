import { useEffect, useState } from 'react'
import api from '../api/axios'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const today = () => new Date().toISOString().slice(0, 10)

// Date -> "YYYY-MM-DD" in local time
const toDateString = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// The next few dates (starting tomorrow) on which the doctor works
const nextWorkingDates = (workDays, count = 5) => {
  const dates = []
  const d = new Date()
  for (let i = 0; i < 60 && dates.length < count; i++) {
    d.setDate(d.getDate() + 1)
    if (workDays.includes(DAYS[d.getDay()])) dates.push(toDateString(d))
  }
  return dates
}

// "2026-10-26" -> "Mon, 26 Oct"
const niceDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

// Pick a date, then one of the doctor's free time slots
export default function SlotPicker({ doctorId, ignoreId, date, time, onChange }) {
  const [slots, setSlots] = useState([])
  const [workDays, setWorkDays] = useState([])

  // The days of the week this doctor works
  useEffect(() => {
    api.get(`/doctors/${doctorId}`).then((res) => setWorkDays(res.data.availability.map((a) => a.day)))
  }, [doctorId])

  useEffect(() => {
    if (!date) return
    api.get(`/doctors/${doctorId}/slots`, { params: { date, ignore: ignoreId } })
      .then((res) => setSlots(res.data))
  }, [doctorId, ignoreId, date])

  const dayName = date ? DAYS[new Date(`${date}T00:00:00`).getDay()] : ''
  const works = workDays.includes(dayName)
  const availableDays = DAYS.filter((d) => workDays.includes(d))

  return (
    <div className="space-y-3">
      <input type="date" className="input" min={today()} value={date}
        onChange={(e) => onChange({ date: e.target.value, time: '' })} />

      {!date && availableDays.length > 0 && (
        <p className="text-sm text-slate-500">Available on: {availableDays.join(', ')}</p>
      )}

      {date && slots.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {slots.map((s) => (
            <button type="button" key={s} onClick={() => onChange({ date, time: s })}
              className={`rounded-xl border px-3.5 py-2 text-sm font-medium ${time === s ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white hover:border-brand-500'}`}>
              {s}
            </button>
          ))}
        </div>
      )}

      {date && slots.length === 0 && (
        <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          <p className="font-semibold">
            {works ? 'No free slots on this day.' : `The doctor is not available on ${dayName}s.`}
          </p>
          {works && <p>All times are booked or already over.</p>}
          {availableDays.length > 0 && (
            <>
              <p className="mt-2">Available on: {availableDays.join(', ')}. Try one of these dates:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {nextWorkingDates(workDays).filter((d) => d !== date).map((d) => (
                  <button type="button" key={d} onClick={() => onChange({ date: d, time: '' })}
                    className="rounded-lg border border-amber-300 bg-white px-2.5 py-1 font-medium hover:border-brand-500">
                    {niceDate(d)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
