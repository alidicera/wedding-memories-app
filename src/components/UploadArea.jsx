import { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

export default function UploadArea({ code }) {
  const [progress, setProgress] = useState(0);       // % di caricamento
  const fileInput   = useRef(null);

  /** Carica tutti i file ricevuti (foto o video) */
  async function uploadFiles(files) {
    for (const file of files) {
      // path univoco: <codice-evento>/<uuid>.<ext>
      const ext  = file.name.split('.').pop();
      const path = `${code}/${crypto.randomUUID()}.${ext}`;

      // upload sul bucket wedding‑media
      const { error } = await supabase.storage
        .from('wedding-media')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
          onUploadProgress: e =>
            setProgress(Math.round((e.loaded * 100) / e.total)),
        });

      if (error) {
        console.error('Upload error:', error.message);
        alert('Errore durante l’upload: ' + error.message);
        continue;
      }

      /* Scrive un record in tabella media
         (se hai già il trigger che lo fa in automatico,
         questa insert è opzionale e puoi toglierla) */
      await supabase
        .from('media')
        .insert({ code, path, mime_type: file.type });
    }
    setProgress(0);          // reset barra
  }

  /** Gestore del <input type="file"> */
  function handleSelect(e) {
    const files = e.target.files;
    if (files?.length) uploadFiles(files);
  }

  /** Gestore del drag‑and‑drop */
  function handleDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files?.length) uploadFiles(files);
  }

  return (
    <div
      className="border-2 border-dashed rounded-2xl p-6 text-center
                 cursor-pointer hover:bg-gray-50 transition"
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => fileInput.current.click()}
    >
      <p className="mb-2">
        Drag & drop oppure clicca per scegliere file
        {progress ? ` (${progress} %)` : ''}
      </p>

      {/* input nascosto */}
      <input
        ref={fileInput}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={handleSelect}
      />
    </div>
  );
}
