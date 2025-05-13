// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home      from './pages/Home'
import EventPage from './pages/EventPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:code" element={<EventPage />} />
      </Routes>
    </BrowserRouter>
  )
}








