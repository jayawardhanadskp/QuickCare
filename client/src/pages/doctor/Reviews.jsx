import { useEffect, useState } from 'react'
import api from '../../api/axios'
import StarRating from '../../components/StarRating'

// Reviews the doctor has received
export default function Reviews() {
  const [reviews, setReviews] = useState([])
  useEffect(() => { api.get('/reviews/mine').then((res) => setReviews(res.data)) }, [])

  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  return (
    <div>
      <h1 className="text-3xl font-extrabold">My reviews</h1>
      <div className="card mt-5 flex items-center gap-4">
        <p className="text-4xl font-extrabold">{average.toFixed(1)}</p>
        <div>
          <StarRating value={average} size={20} />
          <p className="text-sm text-slate-500">{reviews.length} review{reviews.length === 1 ? '' : 's'}</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {reviews.map((r) => (
          <div key={r._id} className="card">
            <div className="flex items-center justify-between">
              <p translate="no" className="font-bold">{r.patient.name}</p>
              <StarRating value={r.rating} />
            </div>
            {r.comment && <p className="mt-1 text-sm text-slate-600">{r.comment}</p>}
            <p className="mt-1 text-xs text-slate-400">{r.createdAt.slice(0, 10)}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-slate-500">No reviews yet.</p>}
      </div>
    </div>
  )
}
