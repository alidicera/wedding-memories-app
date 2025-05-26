// src/components/UploadArea.jsx
import { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import heic2any from 'heic2any';

export default function UploadArea({ code, onDone }) {
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  /* ────────────────── HEIC → JPEG ────────────────── */
  const normalizeFile = async (file) => {
    const isHeic =
      file.type === 'image/heic' ||
      file.name.toLowerCase().endsWith('.heic');

    if (!isHeic) return file;

    const blob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.85,               // quasi lossless
    });

    return new File([blob], file.name.replace(/\.heic$/i, '.jpg'), {
      type: 'image/jpeg',
      lastModified: file.lastModified,
    });
  };

  /* ────────────────── singolo upload ────────────────── */
  const uploadOne = async (file) => {
    const path = `${code}/${Date.now()}-${file.name}`;

    // Storage
    const { error: upErr } = await supabase
      .storage
      .from('wedding-media')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (upErr) throw upErr;

    // DB
    const { error: dbErr } = await supabase
      .from('media')
      .insert({ code, path, mime: file.type });

    if (dbErr) throw dbErr;
  };

  /* ────────────────── handle multi-file ────────────────── */
  const handleFiles = async (list) => {
    const files = Array.from(list);

    for (let i = 0; i < files.length; i++) {
      setProgress(Math.round(((i + 1) / files.length) * 100));

      try {
        const file = await normalizeFile(files[i]);
        await uploadOne(file);
        toast.success(`${file.name} caricato!`);
      } catch (err) {
        console.error(err);
        toast.error(`Errore su ${files[i].name}`);
      }
    }

    setProgress(0);
    inputRef.current.value = '';
    onDone && onDone();                 // ricarica galleria (facoltativo)
  };

  /* ────────────────── UI ────────────────── */
  return (
    <div
      className="border-2 border-dashed rounded-xl p-6 text-center
                 hover:bg-gray-50 cursor-pointer transition"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      onClick={() => inputRef.current.click()}
    >
      <p>
        Trascina / clicca per caricare foto o video
        {progress ? ` (${progress} %)` : ''}
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
}













