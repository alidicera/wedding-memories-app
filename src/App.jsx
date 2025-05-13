// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import EventPage from './pages/Event'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* rotta dinamica che prende il codice */}
      <Route path="/:code" element={<EventPage />} />
      {/* opzionale: una rotta admin separata */}
      <Route path="/admin" element={<Admin />} />
      {/* fallback su home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}







