import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { Send, ArrowLeft } from 'lucide-react'
import api from '../../api/axios'
import { API_URL } from '../../config'

// Admin answers the support messages sent by patients
export default function Support() {
  const [list, setList] = useState([])
  const [active, setActive] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const socketRef = useRef(null)
  const activeRef = useRef(null)
  const bottomRef = useRef(null)

  const loadList = () => api.get('/support/conversations').then((res) => setList(res.data))

  useEffect(() => {
    loadList()
    const socket = io(API_URL, { auth: { token: localStorage.getItem('token') } })
    socketRef.current = socket
    // Show the message if its chat is open, and refresh the list on the left
    socket.on('support', (m) => {
      if (activeRef.current && m.patient === activeRef.current._id) setMessages((old) => [...old, m])
      loadList()
    })
    return () => socket.disconnect()
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView() }, [messages])

  const openChat = async (c) => {
    const patient = { _id: c._id, name: c.patient.name }
    setActive(patient)
    activeRef.current = patient
    const { data } = await api.get(`/support/${c._id}`)
    setMessages(data)
  }

  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    socketRef.current.emit('support', { patient: active._id, text })
    setText('')
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Support</h1>
      <div className="card mt-5 flex h-[calc(100dvh-13rem)] min-h-[26rem] overflow-hidden !p-0 sm:h-[32rem]">
        <div className={`w-full shrink-0 overflow-y-auto border-r border-slate-200 sm:block sm:w-72 ${active ? 'hidden' : 'block'}`}>
          {list.map((c) => (
            <button key={c._id} onClick={() => openChat(c)}
              className={`block w-full px-4 py-3 text-left ${active?._id === c._id ? 'bg-brand-50' : 'hover:bg-slate-50'}`}>
              <span translate="no" className="block text-sm font-semibold">{c.patient.name}</span>
              <span className="block truncate text-xs text-slate-500">{c.fromAdmin ? 'You: ' : ''}{c.last}</span>
            </button>
          ))}
          {list.length === 0 && <p className="p-4 text-sm text-slate-500">No support messages yet.</p>}
        </div>

        <div className={`min-w-0 flex-1 flex-col ${active ? 'flex' : 'hidden sm:flex'}`}>
          {active ? <>
            <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 font-bold">
              <button onClick={() => { setActive(null); activeRef.current = null }} className="sm:hidden" aria-label="Back"><ArrowLeft size={20} /></button>
              <span translate="no">{active.name}</span>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto bg-slate-50 p-4">
              {messages.map((m) => (
                <div key={m._id} className={`flex ${m.fromAdmin ? 'justify-end' : 'justify-start'}`}>
                  <p className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.fromAdmin ? 'bg-brand-600 text-white' : 'bg-white text-ink-800 shadow-sm'}`}>{m.text}</p>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={send} className="flex gap-2 border-t border-slate-200 p-3">
              <input className="input" placeholder="Write a reply" maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} />
              <button className="btn !px-4" aria-label="Send"><Send size={16} /></button>
            </form>
          </> : <p className="m-auto text-sm text-slate-500">Select a patient to reply.</p>}
        </div>
      </div>
    </div>
  )
}
