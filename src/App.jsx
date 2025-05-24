import { Routes, Route, Navigate } from 'react-router-dom'
import EventPage  from './pages/Event.jsx'
import NotFound   from './pages/NotFound.jsx'

/**
 * Un solo evento pubblico: /viteodaniela
 * Se vai su /              → redirect al percorso evento
 * Per qualunque altra rotta → 404
 */
export default function App() {
  return (
    <Routes>
      <Route index         element={<Navigate to="/viteodaniela" replace />} />
      <Route path="/viteodaniela" element={<EventPage code="viteodaniela" />} />
      <Route path="*"      element={<NotFound />} />
    </Routes>
  )
}













