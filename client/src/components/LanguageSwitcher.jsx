import { useEffect } from 'react'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' },
]

// Current language is stored in the googtrans cookie
const getCurrent = () => {
  const match = document.cookie.match(/googtrans=\/en\/(\w+)/)
  return match ? match[1] : 'en'
}

// Set the cookie and reload so Google Translate applies it
const changeLanguage = (code) => {
  document.cookie = `googtrans=/en/${code}; path=/`
  window.location.reload()
}

// light = used on the dark navbar
export default function LanguageSwitcher({ light }) {
  // Load the free Google Website Translator once
  useEffect(() => {
    if (document.getElementById('gt-script')) return
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: 'en,si,ta' },
        'google_translate_element'
      )
    }
    const script = document.createElement('script')
    script.id = 'gt-script'
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    document.body.appendChild(script)
  }, [])

  return (
    <div className="flex items-center gap-1.5">
      <Globe size={16} className={light ? 'text-slate-300' : 'text-slate-500'} />
      <select
        value={getCurrent()}
        onChange={(e) => changeLanguage(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
      <div id="google_translate_element" className="hidden" />
    </div>
  )
}
