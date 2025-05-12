import { Routes, Route, Navigate } from 'react-router-dom'
import Admin from './pages/Admin'
import Event from './pages/Event'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/e/:code" element={<Event />} />
    </Routes>
  )
}
