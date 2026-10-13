import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import StarRating from './StarRating'
import { Heart, MapPin, Stethoscope } from 'lucide-react'

// One doctor in the search results
export default function DoctorCard({ doctor, isFavourite, onToggleFavourite }) {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <Avatar name={doctor.user.name} src={doctor.user.avatar} size={48} />
        {onToggleFavourite && (
          <button onClick={() => onToggleFavourite(doctor.user._id)} title="Favourite">
            <Heart size={20} className={isFavourite ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
          </button>
        )}
      </div>
      <div>
        <h3 translate="no" className="font-bold">{doctor.user.name}</h3>
        <p className="flex items-center gap-1 text-sm text-brand-700"><Stethoscope size={14} /> {doctor.specialization}</p>
        <p className="flex items-center gap-1 text-sm text-slate-500"><MapPin size={14} /> {doctor.hospital}</p>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <StarRating value={doctor.averageRating} size={14} /> {doctor.reviewCount ? `${doctor.averageRating} (${doctor.reviewCount})` : 'No reviews yet'}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-sm text-slate-600">{doctor.experience} yrs · LKR {doctor.fee}</span>
        <Link to={`/doctors/${doctor.user._id}`} className="btn !py-1.5">View</Link>
      </div>
    </div>
  )
}
