import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import StarRating from './StarRating'
import { Heart, MapPin, Stethoscope } from 'lucide-react'

// One doctor in the search results
export default function DoctorCard({ doctor, isFavourite, onToggleFavourite }) {
  return (
    <div className="card flex flex-col gap-4 transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(8,37,48,0.12)]">
      <div className="flex items-start justify-between">
        <Avatar name={doctor.user.name} src={doctor.user.avatar} size={64} />
        {onToggleFavourite && (
          <button onClick={() => onToggleFavourite(doctor.user._id)} title="Favourite"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 hover:bg-red-50">
            <Heart size={18} className={isFavourite ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
          </button>
        )}
      </div>
      <div>
        <h3 translate="no" className="text-lg font-bold">{doctor.user.name}</h3>
        <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"><Stethoscope size={13} /> {doctor.specialization}</p>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={14} /> {doctor.hospital}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <StarRating value={doctor.averageRating} size={14} /> {doctor.reviewCount ? `${doctor.averageRating} (${doctor.reviewCount})` : 'No reviews yet'}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-400">{doctor.experience} yrs experience</p>
          <p className="font-bold text-ink-900">LKR {doctor.fee}</p>
        </div>
        <Link to={`/doctors/${doctor.user._id}`} className="btn !py-2">Book now</Link>
      </div>
    </div>
  )
}
