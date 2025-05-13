// src/components/UploadArea.jsx
import { useState, useRef } from 'react'
import { supabase } from '../supabaseClient'

export default function UploadArea({ code }) {
  const [progress, setProgress] = useState(0)
  const fileInput = useRef()

  const uploadOne = async file => {
    const path = `${code}/${Date.now()}-${file.name}`

    // upload su Storage
    const { error: upErr } = await supabase
      .storage
      .from('wedding-media')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (upErr) throw upErr

    // inserimento record in tabella media
    const { error: dbErr } = await supabase
      .from('media')
      .insert({ code, path, mime: file.type })
    if (dbErr) throw dbErr
  }

  const handleFiles = async fileList => {
    const files = Array.from(fileList)
    for (let i = 0; i < files.length; i++) {
      setProgress(Math.round(((i + 1) / files.length) * 100))
      try {
        await uploadOne(files[i])
      } catch (err) {
        console.error(err)
        alert(`Errore durante il caricamento di ${files[i].name}`)
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
        Trascina o clicca per caricare foto/video {progress ? `(${progress} %)` : ''}
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








