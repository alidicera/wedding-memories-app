import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import ScrollLock from 'react-scrolllock';

export default function Gallery({ code }) {
  const [media, setMedia]   = useState([]);
  const [open, setOpen]     = useState(false);
  const [index, setIndex]   = useState(0);

  useEffect(() => {
    supabase
      .from('media')
      .select('id, path, mime')
      .eq('code', code)
      .order('created_at', { ascending: false })
      .then(({ data }) => setMedia(data || []));
  }, [code]);

  const url = p => supabase.storage.from('wedding-media').getPublicUrl(p).data.publicUrl;

  /* ------ LIGHTBOX helpers ------ */
  const openBox  = i => { setIndex(i); setOpen(true); };
  const next     = () => setIndex((index + 1) % media.length);
  const prev     = () => setIndex((index - 1 + media.length) % media.length);

  if (!media.length) return <p className="text-sm text-gray-500">Nessun ricordo ancora… ✨</p>;

  return (
    <>
      {/* GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((m, i) => (
          m.mime.startsWith('image')
            ? <img key={m.id} src={url(m.path)} alt="" className="w-full h-56 object-cover rounded-lg cursor-pointer" onClick={() => openBox(i)} />
            : <video key={m.id} src={url(m.path)} controls className="w-full h-56 object-cover rounded-lg" />
        ))}
      </div>

      {/* LIGHTBOX */}
      {open && (
        <ScrollLock>
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <button className="absolute top-4 right-4 text-white" onClick={() => setOpen(false)}>
              <XMarkIcon className="w-8 h-8" />
            </button>

            <button className="absolute left-4 text-white" onClick={prev}>
              <ChevronLeftIcon className="w-10 h-10" />
            </button>

            <button className="absolute right-4 text-white" onClick={next}>
              <ChevronRightIcon className="w-10 h-10" />
            </button>

            {media[index].mime.startsWith('image')
              ? <img src={url(media[index].path)} alt="" className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg" />
              : <video src={url(media[index].path)} controls className="max-h-[90vh] max-w-[90vw] rounded-lg" />
            }
          </div>
        </ScrollLock>
      )}
    </>
  );
}

