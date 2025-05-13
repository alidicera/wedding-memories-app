import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Admin     from './pages/Admin'
import EventPage from './pages/EventPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/:code" element={<EventPage />} />
      </Routes>
    </BrowserRouter>
  )
}






