import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function Gallery({ code }) {
  const [media, setMedia]     = useState([]);
  const [open,  setOpen]      = useState(false);
  const [current, setCurrent] = useState(0);

  // ---- scarica lista
  const load = async () => {
    const { data, error } = await supabase
      .from('media')
      .select('id, path, mime')
      .eq('code', code)
      .order('created_at', { ascending: false });
    if (!error) setMedia(data);
  };
  useEffect(() => { load(); }, [code]);

  const publicUrl = p =>
    supabase.storage.from('wedding-media').getPublicUrl(p).data.publicUrl;

  // -------- light-box helpers
  const openAt    = i => { setCurrent(i); setOpen(true); };
  const close     = () => setOpen(false);
  const prev      = () => setCurrent((current-1+media.length)%media.length);
  const next      = () => setCurrent((current+1)%media.length);

  if (!media.length) return (
    <p className="text-gray-500 italic mt-4">Ancora nessun ricordo… ✨</p>
  );

  return (
    <>
      {/* --- griglia responsive */}
      <div className="grid gap-4 mt-6
                      grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {media.map((m,i) => (
          m.mime.startsWith('image')
          ? <img  key={m.id} src={publicUrl(m.path)}
                  onClick={() => openAt(i)}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer"
            />
          : <video key={m.id} src={publicUrl(m.path)} controls
                   onClick={() => openAt(i)}
                   className="w-full h-48 object-cover rounded-lg cursor-pointer"/>
        ))}
      </div>

      {/* --- LIGHT-BOX --------------------------------------------------- */}
      {open && (
        <div className="fixed inset-0 bg-black/90 flex items-center
                        justify-center z-50">
          {/* chiudi */}
          <button onClick={close}
                  className="absolute top-4 right-4 text-white/80
                             hover:text-white">
            <XMarkIcon className="w-10 h-10"/>
          </button>

          {/* freccia sx */}
          <button onClick={prev}
                  className="absolute left-4 text-white/60
                             hover:text-white">
            <ChevronLeftIcon className="w-12 h-12"/>
          </button>

          {/* media corrente */}
          {media[current].mime.startsWith('image')
            ? <img  src={publicUrl(media[current].path)}
                    className="max-h-[90vh] max-w-[90vw] object-contain"/>
            : <video src={publicUrl(media[current].path)} controls
                     className="max-h-[90vh] max-w-[90vw]"/>}

          {/* freccia dx */}
          <button onClick={next}
                  className="absolute right-4 text-white/60
                             hover:text-white">
            <ChevronRightIcon className="w-12 h-12"/>
          </button>
        </div>
      )}
    </>
  );
}

