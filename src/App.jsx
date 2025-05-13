// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EventPage from './pages/EventPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tutti arrivano qui (root) */}
        <Route path="/" element={<EventPage />} />
      </Routes>
    </BrowserRouter>
  )
}





