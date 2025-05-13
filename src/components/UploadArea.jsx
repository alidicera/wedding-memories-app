import { useState, useRef } from 'react'
import { supabase } from '../supabaseClient'

export default function UploadArea({ code }) {
  const [progress, setProgress] = useState(0)
  const fileInput = useRef()

  const uploadOne = async file => {
    const path = `${code}/${Date.now()}-${file.name}`
    const { error: upErr } = await supabase
      .storage
      .from('wedding-media')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (upErr) throw upErr
    const { error: dbErr } = await supabase
      .from('media')
      .insert({ code, path, mime: file.type })
    if (dbErr) throw dbErr
  }

  const handleFiles = async files => {
    const arr = Array.from(files)
    for (let i = 0; i < arr.length; i++) {
      setProgress(Math.round(((i + 1) / arr.length) * 100))
      try { await uploadOne(arr[i]) }
      catch (e) { console.error(e); alert('Errore: '+e.message) }
    }
    setProgress(0)
    fileInput.current.value = ''
  }

  return (
    <div
      className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-gray-100 cursor-pointer"
      onClick={() => fileInput.current.click()}
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
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







