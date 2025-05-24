import { useState, useRef } from "react";
import { supabase } from "../supabaseClient";

/* ─────────────  mini-toast senza librerie  ───────────── */
function toast(msg, ok = true) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.cssText = `
    position:fixed;left:50%;top:20px;transform:translateX(-50%);
    padding:.6rem 1.1rem;border-radius:8px;font:600 14px/1 sans-serif;
    color:#fff;background:${ok ? "#22c55e" : "#ef4444"};
    z-index:9999;opacity:0;transition:.3s;box-shadow:0 3px 8px rgba(0,0,0,.2);
  `;
  document.body.appendChild(el);
  requestAnimationFrame(() => (el.style.opacity = 1));
  setTimeout(() => {
    el.style.opacity = 0;
    setTimeout(() => el.remove(), 400);
  }, 2500);
}
/* ─────────────────────────────────────────────────────── */

export default function UploadArea({ code, onDone }) {
  const [progress, setProgress] = useState(0);
  const fileInput               = useRef(null);

  /* ⋯ singolo file → Storage + record in media */
  const uploadOne = async file => {
    const path = `${code}/${Date.now()}-${file.name}`;

    const { error: upErr } = await supabase
      .storage
      .from("wedding-media")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (upErr) throw upErr;

    const { error: dbErr } = await supabase
      .from("media")
      .insert({ code, path, mime: file.type });
    if (dbErr) throw dbErr;
  };

  /* ⋯ ciclo su tutti i file selezionati / droppati  */
  const handleFiles = async list => {
    const files = Array.from(list);
    for (let i = 0; i < files.length; i++) {
      setProgress(Math.round(((i + 1) / files.length) * 100));
      try {
        await uploadOne(files[i]);
        toast(`✅ ${files[i].name} caricato!`);
      } catch (err) {
        console.error(err);
        toast(`❌ Errore su ${files[i].name}`, false);
      }
    }
    setProgress(0);
    fileInput.current.value = "";
    onDone && onDone();               // avvisa il padre di ricaricare la galleria
  };

  return (
    <div
      className="border-2 border-dashed rounded-2xl p-6 text-center
                 cursor-pointer hover:bg-gray-50 transition"
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      onClick={() => fileInput.current.click()}
    >
      <p>
        Trascina o clicca per caricare foto/video{" "}
        {progress ? `(${progress} %)` : ""}
      </p>

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













