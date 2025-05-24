import { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function Gallery({ code, refresh = 0 }) {
  const [media, setMedia]       = useState([]);
  const [index, setIndex]       = useState(null);   // null = nessun overlay aperto
  const current                 = media[index] ?? {};

  /* signed-URL helper */
  const publicUrl = p => supabase
    .storage
    .from("wedding-media")
    .getPublicUrl(p).data.publicUrl;

  /* scarica lista media */
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("media")
        .select("id, path, mime")
        .eq("code", code)
        .order("created_at", { ascending: false });
      setMedia(data || []);
      setIndex(null);           // chiudi eventuale viewer se stai ricaricando
    })();
  }, [code, refresh]);

  /* navigazione viewer */
  const prev = useCallback(() => setIndex(i => (i > 0 ? i - 1 : i)), []);
  const next = useCallback(() => setIndex(i => (i < media.length - 1 ? i + 1 : i)), [media]);

  /* ESC per chiudere, ← / → per nav */
  useEffect(() => {
    const onKey = e => {
      if (index === null) return;
      if (e.key === "Escape")  setIndex(null);
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, prev, next]);

  /* griglia vuota */
  if (!media.length)
    return <p className="text-gray-500 text-center">Nessun ricordo ancora… ✨</p>;

  return (
    <>
      {/* ───────────── Griglia miniature ───────────── */}
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {media.map((m, i) =>
          m.mime.startsWith("image") ? (
            <img
              key={m.id}
              src={publicUrl(m.path)}
              alt=""
              loading="lazy"
              onClick={() => setIndex(i)}
              className="aspect-square object-cover rounded-lg cursor-pointer"
            />
          ) : (
            <video
              key={m.id}
              src={publicUrl(m.path)}
              muted
              onClick={() => setIndex(i)}
              className="aspect-square object-cover rounded-lg cursor-pointer"
            />
          )
        )}
      </div>

      {/* ───────────── Overlay viewer ───────────── */}
      {index !== null && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50
                     flex items-center justify-center"
          onClick={() => setIndex(null)}
        >
          {/* stop-propagation per evitare chiusura clic interno */}
          <div onClick={e => e.stopPropagation()} className="max-w-full max-h-full">
            {/* MEDIA full */}
            {current.mime?.startsWith("image") ? (
              <img src={publicUrl(current.path)} alt="" className="max-h-screen" />
            ) : (
              <video
                src={publicUrl(current.path)}
                controls
                autoPlay
                className="max-h-screen"
              />
            )}

            {/* buttons */}
            <button
              onClick={() => setIndex(null)}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>

            {index > 0 && (
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              >
                <ChevronLeftIcon className="h-10 w-10" />
              </button>
            )}
            {index < media.length - 1 && (
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              >
                <ChevronRightIcon className="h-10 w-10" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}










