import { useState, useRef } from 'react'
import { supabase } from '../supabaseClient'

export default function UploadArea({ code }) {
  const [progress, setProgress] = useState(0)
  const fileInput = useRef(null)

  /** carica uno o più file */
  const handleFiles = async (files) => {
    for (const file of files) {
      // percorso:  ABC123/1717079467834-foto.jpg
      const path = `${code}/${Date.now()}-${file.name}`

      // 1️⃣ upload nello Storage
      const { error: storageErr } = await supabase.storage
        .from('wedding-media')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (e) =>
            setProgress(Math.round((e.loaded * 100) / e.total)),
        })

      if (storageErr) {
        console.error(storageErr)
        continue
      }

      // 2️⃣ salva metadati nella tabella `media`
      const { error: dbErr } = await supabase
        .from('media')
        .insert({ code, path, mime: file.type })

      if (dbErr) console.error(dbErr)
    }

    // reset barra di progresso
    setProgress(0)
  }

  /** collegato all’input file */
  const handleUpload = (e) => {
    if (e.target.files?.length) handleFiles(e.target.files)
  }

  return (
    <div
      className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        handleFiles(e.dataTransfer.files)
      }}
      onClick={() => fileInput.current.click()}
    >
      <p className="mb-2">
        Drag & drop or tap to select photos/videos{' '}
        {progress ? `(${progress} %)` : ''}
      </p>

      {/* nascosto finché non si clicca */}
      <input
        ref={fileInput}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  )
}

