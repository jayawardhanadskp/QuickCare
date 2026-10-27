import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import SupportChatbot from './components/SupportChatbot'
import Home from './pages/public/Home'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import ForgotPassword from './pages/public/ForgotPassword'
import ResetPassword from './pages/public/ResetPassword'
import Doctors from './pages/public/Doctors'
import DoctorDetail from './pages/public/DoctorDetail'
import Faq from './pages/public/Faq'
import HealthRecords from './pages/shared/HealthRecords'
import Reviews from './pages/doctor/Reviews'
import Chat from './pages/shared/Chat'
import Patients from './pages/doctor/Patients'
import AdminOverview from './pages/admin/Overview'
import Users from './pages/admin/Users'
import AdminAppointments from './pages/admin/AdminAppointments'
import Loyalty from './pages/admin/Loyalty'
import Faqs from './pages/admin/Faqs'
import Support from './pages/admin/Support'
import DashboardLayout from './components/DashboardLayout'
import PatientOverview from './pages/patient/Overview'
import Appointments from './pages/patient/Appointments'
import Favourites from './pages/patient/Favourites'
import PatientProfile from './pages/patient/Profile'
import DoctorOverview from './pages/doctor/Overview'
import Schedule from './pages/doctor/Schedule'
import DoctorProfilePage from './pages/doctor/Profile'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/:role" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/faq" element={<Faq />} />

          <Route path="/patient" element={<ProtectedRoute role="patient"><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<PatientOverview />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="favourites" element={<Favourites />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="records" element={<HealthRecords />} />
            <Route path="chat" element={<Chat />} />
          </Route>

          <Route path="/doctor" element={<ProtectedRoute role="doctor"><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DoctorOverview />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="profile" element={<DoctorProfilePage />} />
            <Route path="records" element={<HealthRecords />} />
            <Route path="patients" element={<Patients />} />
            <Route path="chat" element={<Chat />} />
            <Route path="reviews" element={<Reviews />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute role="admin"><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<Users />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="loyalty" element={<Loyalty />} />
            <Route path="records" element={<HealthRecords />} />
            <Route path="faqs" element={<Faqs />} />
            <Route path="support" element={<Support />} />
          </Route>
        </Routes>
        <SupportChatbot />
      </BrowserRouter>
    </AuthProvider>
  )
}
