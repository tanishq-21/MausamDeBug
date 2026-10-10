import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import ReportDetail from './pages/ReportDetail'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import CitizenReport from './pages/CitizenReport'
import Analytics from './pages/Analytics'
import Verification from './pages/Verification'
import AdminPanel from './pages/AdminPanel'
import LiveMap from './pages/LiveMap'
import SystemHealth from './pages/SystemHealth'
import Architecture from './pages/Architecture'
import About from './pages/About'
import LiveNews from './pages/LiveNews'
import ImageVerification from './pages/ImageVerification'
import GloryOfHonour from './pages/GloryOfHonour'
import { useAppStore } from './store/appStore'

// ── Guards ─────────────────────────────────────────────────────────────────────
function AdminRoute({ children }) {
  const role = useAppStore(s => s.role)
  return role === 'admin' ? children : <Navigate to="/home" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* App — authenticated layout */}
        <Route element={<AppLayout />}>

          {/* ── SHARED: both user & admin ── */}
          <Route path="/home" element={<Home />} />
          <Route path="/map" element={<LiveMap />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/live-news" element={<LiveNews />} />
          <Route path="/report" element={<CitizenReport />} />
          <Route path="/image-verification" element={<ImageVerification />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/glory-of-honour" element={<GloryOfHonour />} />
          <Route path="/about" element={<About />} />

          {/* ── ADMIN ONLY ── */}
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/system" element={<AdminRoute><SystemHealth /></AdminRoute>} />
          <Route path="/architecture" element={<AdminRoute><Architecture /></AdminRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
