// src/components/UploadArea.jsx
import { useState, useRef } from 'react'
import { supabase } from '../supabaseClient'

export default function UploadArea({ code }) {
  const [progress, setProgress] = useState(0)
  const fileInput = useRef()

  // carica un singolo file su Storage e poi salva in tabella "media"
  const uploadOne = async file => {
    const path = `${code}/${Date.now()}-${file.name}`

    // 1) Storage upload
    const { error: upErr } = await supabase
      .storage
      .from('wedding-media')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (upErr) throw upErr

    // 2) Insert in table "media"
    const { error: dbErr } = await supabase
      .from('media')
      .insert({ code, path, mime: file.type })
    if (dbErr) throw dbErr
  }

  // gestisce una lista di file
  const handleFiles = async fileList => {
    const files = Array.from(fileList)
    for (let i = 0; i < files.length; i++) {
      setProgress(Math.round(((i + 1) / files.length) * 100))
      try {
        await uploadOne(files[i])
      } catch (err) {
        console.error('Upload error:', err)
        alert(`Errore in upload di ${files[i].name}`)
      }
    }
    setProgress(0)
    fileInput.current.value = ''
  }

  return (
    <div
      className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50"
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
      onClick={() => fileInput.current.click()}
    >
      <p className="mb-2">
        Trascina o clicca per caricare foto/video {progress ? `(${progress}%)` : ''}
      </p>
      <input
        ref={fileInput}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={e => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  )
}



