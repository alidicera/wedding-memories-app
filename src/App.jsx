import { Routes, Route, Navigate } from 'react-router-dom';
import EventPage from './pages/Event.jsx';

export default function App() {
  return (
    <Routes>
      {/* redirect root → /vitoedaniela */}
      <Route index element={<Navigate to="/vitoedaniela" replace />} />
      {/* pagina evento */}
      <Route path="/vitoedaniela" element={<EventPage />} />
      {/* qualunque altra rotta → 404 semplice */}
      <Route path="*" element={<p className="p-6 text-center">404 – Pagina non trovata</p>} />
    </Routes>
  );
}















