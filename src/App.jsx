import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EventPage from './pages/Event';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventPage />} />
        <Route path="/vitoedaniela" element={<EventPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;












