import { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

/**
 * UploadArea
 * ----------
 * - mostra un drop-zone + input file nascosto
 * - carica immagini / video su Storage (bucket wedding-media)
 * - scrive un record nella tabella media
 * - mostra % di avanzamento e un messaggio di successo
 *   quando *tutti* i file sono stati caricati
 */
export default function UploadArea({ code, onDone }) {
  const [progress, setProgress]     = useState(0);   // 0-100 %
  const [msg, setMsg]               = useState('');  // esito
  const fileInput                   = useRef(null);  // ref al <input>

  // carica UN singolo file ➜ Storage + INSERT tabella media
  const uploadOne = async file => {
    const path = `${code}/${Date.now()}-${file.name}`;

    // --- upload su Storage
    const { error: upErr } =
      await supabase.storage.from('wedding-media').upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
    if (upErr) throw upErr;

    // --- INSERT in tabella media
    const { error: dbErr } = await supabase
      .from('media')
      .insert({ code, path, mime: file.type });
    if (dbErr) throw dbErr;
  };

  // handler principale
  const handleFiles = async list => {
    const files = Array.from(list);
    if (!files.length) return;

    try {
      for (let i = 0; i < files.length; i++) {
        setProgress(Math.round(((i + 1) / files.length) * 100));
        await uploadOne(files[i]);
      }
      setMsg('✅ File caricato con successo');
      onDone && onDone();               // dice al padre di ricaricare la gallery
    } catch (err) {
      console.error('Upload error:', err);
      setMsg('❌ Errore nel caricamento. Riprova.');
    } finally {
      setProgress(0);
      fileInput.current.value = '';
      setTimeout(() => setMsg(''), 3000); // messaggio sparisce dopo 3 s
    }
  };

  return (
    <div
      className="border-2 border-dashed rounded-2xl p-6 text-center
                 cursor-pointer hover:bg-gray-50"
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      onClick={() => fileInput.current.click()}
    >
      <p className="mb-2">
        Trascina o clicca per caricare foto/video
        {progress ? ` (${progress} %)` : ''}
      </p>

      {msg && <p className="text-sm italic">{msg}</p>}

      {/* input nascosto */}
      <input
        ref={fileInput}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  );
}










