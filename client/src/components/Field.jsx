// A form input with a label above it
export default function Field({ label, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-ink-800">{label}</span>
      {children}
    </label>
  )
}
