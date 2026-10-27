import { useEffect, useRef, useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import toast from 'react-hot-toast'
import api from '../api/axios'

// PayPal buttons: pay the consultation fee, then the appointment is booked
export default function PayPalCheckout({ doctorId, slot, reason, onBooked }) {
  const [clientId, setClientId] = useState(null)

  // The callbacks below always read the newest slot and reason from this ref
  const booking = useRef({})
  booking.current = { doctor: doctorId, ...slot, reason }

  useEffect(() => {
    api.get('/payments/config').then((res) => setClientId(res.data.clientId)).catch(() => setClientId(''))
  }, [])

  if (clientId === null) return <p className="text-sm text-slate-500">Loading payment...</p>
  if (!clientId) return <p className="text-sm text-red-600">Online payment is not set up yet.</p>

  // Make sure a slot is chosen before PayPal opens
  const onClick = (data, actions) => {
    if (booking.current.time) return actions.resolve()
    toast.error('Please pick a time slot')
    return actions.reject()
  }

  const createOrder = async () => {
    const res = await api.post('/payments/create-order', booking.current)
    return res.data.id
  }

  const onApprove = async (data) => {
    try {
      await api.post('/payments/capture-order', { ...booking.current, orderId: data.orderID })
      toast.success('Payment received and appointment booked')
      onBooked()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed')
    }
  }

  const onError = (err) => toast.error(err.response?.data?.message || 'PayPal error, please try again')

  return (
    <PayPalScriptProvider options={{ clientId, currency: 'USD' }}>
      <PayPalButtons style={{ layout: 'vertical', shape: 'pill' }}
        onClick={onClick} createOrder={createOrder} onApprove={onApprove} onError={onError} />
    </PayPalScriptProvider>
  )
}
