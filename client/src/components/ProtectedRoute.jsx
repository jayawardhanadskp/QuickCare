import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Only let logged in users with the right role in
export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}
