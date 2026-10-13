// Round profile picture, or the first letter of the name when there is none
export default function Avatar({ name = '', src, size = 40 }) {
  const letter = name.replace('Dr. ', '')[0] || '?'
  if (src) {
    return <img src={src} alt={name} style={{ width: size, height: size }} className="shrink-0 rounded-full object-cover" />
  }
  return (
    <div style={{ width: size, height: size, fontSize: size / 2.4 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
      {letter}
    </div>
  )
}
