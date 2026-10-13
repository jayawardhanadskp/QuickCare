import { Star } from 'lucide-react'

// Shows stars. Pass onChange to let the user pick a rating.
export default function StarRating({ value, onChange, size = 16 }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} onClick={onChange ? () => onChange(n) : undefined}
          className={`${n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} ${onChange ? 'cursor-pointer' : ''}`} />
      ))}
    </span>
  )
}
