import heic2any from 'heic2any';
import { supabase } from '../supabaseClient';
import { useState, useRef } from 'react';

export default function UploadArea({ code, onDone }) {
  const [progress, setProgress] = useState(0);
  const ref = useRef(null);

  // 🔄  HEIC → JPEG
  const normalizeFile = async f => {
    const isHeic = f.type === 'image/heic' ||
                   f.name.toLowerCase().endsWith('.heic');

    if (!isHeic) return f;

    const blob = await heic2any({
      blob: f,
      toType: 'image/jpeg',
      quality: 0.8,
    });

    return new File([blob], f.name.replace(/\.heic$/i, '.jpg'), {
      type: 'image/jpeg',
      lastModified: f.lastModified,
    });
  };

  const handle = async list => {
    const files = Array.from(list);

    for (let i = 0; i < files.length; i++) {
      setProgress(Math.round(((i + 1) / files.length) * 100));

      // --- conversione se serve
      const file = await normalizeFile(files[i]);

      const path = `${code}/${Date.now()}-${file.name}`;
      const { error: upErr } =
        await supabase.storage.from('wedding-media')
          .upload(path, file, { cacheControl: '3600', upsert: false });

      if (upErr) {
        alert('Errore: ' + upErr.message);
        continue;
      }
      await supabase.from('media')
        .insert({ code, path, mime: file.type });
    }

    setProgress(0);
    ref.current.value = '';
    onDone?.();              // ricarica la galleria se vuoi
  };

  return (
    <div
      className="border-2 border-dashed rounded-xl p-4 text-center
                 cursor-pointer hover:bg-gray-50"
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); handle(e.dataTransfer.files); }}
      onClick={() => ref.current.click()}
    >
      <p>
        Trascina o clicca per caricare foto / video
        {progress ? ` (${progress} %)` : ''}
      </p>
      <input
        ref={ref}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={e => handle(e.target.files)}
      />
    </div>
  );
}














