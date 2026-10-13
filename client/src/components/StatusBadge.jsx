// Coloured label for an appointment status
const styles = {
  booked: 'bg-brand-100 text-brand-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function StatusBadge({ status }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status]}`}>{status}</span>
}
