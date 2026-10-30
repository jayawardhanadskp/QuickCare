import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { Link } from 'react-router-dom'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import api from '../api/axios'
import { API_URL } from '../config'
import { useAuth } from '../context/AuthContext'

const quickReplies = ['Help with booking', 'Payment problem', 'Cancel or change an appointment']

// Floating support chat shown on every page. Patients message the admin team,
// visitors who are not logged in are asked to log in first.
export default function SupportChatbot() {
  const { user } = useAuth()
  const isPatient = user?.role === 'patient'
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const socketRef = useRef(null)
  const bottomRef = useRef(null)

  // Load old messages and listen for new ones
  useEffect(() => {
    if (!isPatient) return setMessages([])
    api.get('/support/mine').then((res) => setMessages(res.data))
    const socket = io(API_URL, { auth: { token: localStorage.getItem('token') } })
    socketRef.current = socket
    socket.on('support', (m) => setMessages((old) => [...old, m]))
    return () => socket.disconnect()
  }, [isPatient])

  useEffect(() => { bottomRef.current?.scrollIntoView() }, [messages, open])

  const send = (message) => {
    if (!message.trim()) return
    socketRef.current.emit('support', { text: message })
    setText('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    send(text)
  }

  // Doctors and admins have their own tools
  if (user && !isPatient) return null

  const bubble = 'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm'

  return (
    <div className="fixed bottom-4 right-4 z-30 sm:bottom-6 sm:right-6">
      {open && (
        <div className="mb-3 flex h-[28rem] max-h-[calc(100dvh-7rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-96">
          <div className="flex items-center gap-3 bg-brand-600 px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20"><Bot size={20} /></span>
            <div className="flex-1">
              <p className="font-bold" translate="no">QuickCare Support</p>
              <p className="text-xs text-white/80">We usually reply within a few hours</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat"><X size={20} /></button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            <div className={`${bubble} bg-white text-ink-800 shadow-sm`}>
              Hi! How can we help you today? Pick a topic or type your message below.
            </div>
            {!user && (
              <Link to="/login/patient" className="btn w-full">Login to chat with us</Link>
            )}
            {isPatient && messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((q) => (
                  <button key={q} onClick={() => send(q)}
                    className="rounded-full border border-brand-600 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50">{q}</button>
                ))}
              </div>
            )}
            {messages.map((m) => (
              <div key={m._id} className={`flex ${m.fromAdmin ? 'justify-start' : 'justify-end'}`}>
                <p className={`${bubble} ${m.fromAdmin ? 'bg-white text-ink-800 shadow-sm' : 'bg-brand-600 text-white'}`}>{m.text}</p>
              </div>
            ))}
            {messages.length > 0 && !messages[messages.length - 1].fromAdmin && (
              <div className={`${bubble} bg-white text-slate-500 shadow-sm`}>Thanks! An admin will reply here soon.</div>
            )}
            <div ref={bottomRef} />
          </div>

          {isPatient && <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 p-3">
            <input className="input" placeholder="Type your message" maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn !px-4" aria-label="Send"><Send size={16} /></button>
          </form>}
        </div>
      )}
      <button onClick={() => setOpen(!open)} aria-label="Support chat"
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl hover:bg-brand-700">
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  )
}
