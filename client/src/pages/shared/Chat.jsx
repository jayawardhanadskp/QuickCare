import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { Send, ArrowLeft } from 'lucide-react'
import api from '../../api/axios'
import { API_URL } from '../../config'
import { useAuth } from '../../context/AuthContext'

// Live chat between a patient and a doctor they have an appointment with
export default function Chat() {
  const { user } = useAuth()
  const [contacts, setContacts] = useState([])
  const [active, setActive] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const socketRef = useRef(null)
  const activeRef = useRef(null)
  const bottomRef = useRef(null)

  // Connect once with the login token
  useEffect(() => {
    api.get('/chat/contacts').then((res) => setContacts(res.data))
    const socket = io(API_URL, { auth: { token: localStorage.getItem('token') } })
    socketRef.current = socket

    // Show a new message only if it belongs to the open conversation
    socket.on('message', (m) => {
      const other = activeRef.current
      if (other && (m.sender === other._id || m.receiver === other._id)) {
        setMessages((old) => [...old, m])
      }
    })
    return () => socket.disconnect()
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView() }, [messages])

  // Open a conversation and load old messages
  const openChat = async (contact) => {
    setActive(contact)
    activeRef.current = contact
    const { data } = await api.get(`/chat/${contact._id}`)
    setMessages(data)
  }

  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    socketRef.current.emit('send', { to: active._id, text })
    setText('')
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Messages</h1>
      <div className="card mt-5 flex h-[calc(100dvh-13rem)] min-h-[26rem] overflow-hidden !p-0 sm:h-[32rem]">
        <div className={`w-full shrink-0 overflow-y-auto border-r border-slate-200 sm:block sm:w-64 ${active ? 'hidden' : 'block'}`}>
          {contacts.map((c) => (
            <button key={c._id} onClick={() => openChat(c)} translate="no"
              className={`block w-full px-4 py-4 text-left text-sm font-semibold ${active?._id === c._id ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-50'}`}>
              {c.name}
            </button>
          ))}
          {contacts.length === 0 && (
            <p className="p-4 text-sm text-slate-500">
              {user.role === 'patient' ? 'Book an appointment to chat with a doctor.' : 'No patients yet.'}
            </p>
          )}
        </div>

        {active ? (
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-3">
              <button onClick={() => setActive(null)} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-800 hover:bg-slate-100 sm:hidden"><ArrowLeft size={20} /></button>
              <p translate="no" className="font-bold">{active.name}</p>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto bg-slate-50 p-4">
              {messages.map((m) => {
                const mine = m.sender === user._id
                return (
                  <div key={m._id} className={`flex ${mine ? 'justify-end' : ''}`}>
                    <p className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? 'bg-brand-600 text-white' : 'bg-white shadow-sm'}`}>{m.text}</p>
                  </div>
                )
              })}
              {messages.length === 0 && <p className="text-sm text-slate-400">No messages yet. Say hello!</p>}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={send} className="flex gap-2 border-t border-slate-200 p-3">
              <input className="input" placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} />
              <button className="btn" aria-label="Send"><Send size={18} /></button>
            </form>
          </div>
        ) : (
          <p className="m-auto hidden px-2 text-center text-slate-400 sm:block">Choose someone to start chatting</p>
        )}
      </div>
    </div>
  )
}
