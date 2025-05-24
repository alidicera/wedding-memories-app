import { useState, useRef } from "react";
import { supabase } from "../supabaseClient";

// ↓ Mini-helper per popup a scomparsa
function toast(msg, ok = true) {
  const div = document.createElement("div");
  div.textContent = msg;
  div.style.cssText = `
    position:fixed;left:50%;top:20px;transform:translateX(-50%);
    padding:.7rem 1.2rem;border-radius:8px;font:600 14px sans-serif;
    color:#fff;background:${ok ? "#22c55e" : "#ef4444"};z-index:9999;
    box-shadow:0 3px 8px rgba(0,0,0,.2);opacity:0;transition:.3s;
  `;
  document.body.appendChild(div);
  requestAnimationFrame(() => (div.style.opacity = 1));
  setTimeout(() => {
    div.style.opacity = 0;
    setTimeout(() => div.remove(), 400);
  }, 2500);
}

export default function UploadArea({ code }) {
  const [progress, setProgress] = useState(0);
  const fileInput = useRef(null);

  // 1. singolo upload
  const uploadOne = async (file) => {
    const path = `${code}/${Date.now()}-${file.name}`;

    // Storage
    const { error: upErr } = await supabase
      .storage
      .from("wedding-media")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (upErr) throw upErr;

    // DB
    const { error: dbErr } = await supabase
      .from("media")
      .insert({ code, path, mime: file.type });

    if (dbErr) throw dbErr;
  };

  // 2. tutti i file
  const handleFiles = async (fileList) => {
    const files = Array.from(fileList);
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
  };

  return (
    <div
      className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => fileInput.current.click()}
    >
      <p className="mb-2">
        Trascina oppure clicca per caricare foto/video{" "}
        {progress ? `(${progress} %)` : ""}
      </p>

      <input
        ref={fileInput}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
}













