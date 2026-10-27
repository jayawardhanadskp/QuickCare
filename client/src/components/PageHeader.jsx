import { Link } from 'react-router-dom'

// Dark banner with the page title, used at the top of public pages
export default function PageHeader({ title, text, children }) {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-500/20" />
      <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-brand-500/10" />
      <div className="container-page relative py-12 sm:py-16">
        <p className="text-sm text-slate-300"><Link to="/" className="hover:text-white">Home</Link> / {title}</p>
        <h1 className="mt-3 text-3xl font-extrabold !text-white sm:text-4xl">{title}</h1>
        {text && <p className="mt-3 max-w-xl text-slate-300">{text}</p>}
        {children}
      </div>
    </section>
  )
}
