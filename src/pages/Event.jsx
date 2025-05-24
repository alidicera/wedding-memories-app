import { useState } from 'react';
import UploadArea from '../components/UploadArea.jsx';
import Gallery    from '../components/Gallery.jsx';

const EVENT_CODE =
  import.meta.env.VITE_EVENT_CODE?.trim() || 'vitoedaniela';

export default function EventPage() {
  const [show, setShow]       = useState(false);   // mostro/nascondo galleria
  const [refresh, setRefresh] = useState(0);       // forza reload media

  /** scatta quando UploadArea ha finito */
  const handleDone = () => {
    if (show) setRefresh(Date.now());  // se galleria già visibile, ricarica
  };

  /** clic sul pulsante in basso */
  const toggleGallery = () => {
    if (show) setRefresh(Date.now());  // se è già aperta ⇒ “Aggiorna”
    setShow(true);                     // altrimenti la faccio comparire
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Matrimonio 3 Giugno a Molfetta
      </h1>

      <UploadArea code={EVENT_CODE} onDone={handleDone} />

      {/* pulsante per mostrare / aggiornare */}
      <div className="text-center mt-8">
        <button
          onClick={toggleGallery}
          className="inline-block bg-blue-600 hover:bg-blue-700
                     text-white px-4 py-2 rounded transition"
        >
          {show ? 'Aggiorna galleria' : 'Mostra galleria'}
        </button>
      </div>

      {/* galleria visibile solo dopo il click */}
      {show && (
        <div className="mt-8">
          <Gallery code={EVENT_CODE} refresh={refresh} />
        </div>
      )}
    </div>
  );
}







