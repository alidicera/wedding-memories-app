import { useState, useRef } from 'react'
import { supabase } from '../supabaseClient'

export default function UploadArea({ code }) {
  const [progress, setProgress] = useState(0)
  const fileInput = useRef(null)

  const handleFiles = async files => {
    for (const file of files) {
      const path = `${code}/${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage.from('wedding-media').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        onUploadProgress: e => setProgress(Math.round((e.loaded * 100) / e.total))
      })
      if (error) console.error(error)
      else {
        await supabase.from('media').insert({ code, path, mime: file.type })
      }
    }
    setProgress(0)
  }

  return (
    <div
      className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50"
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
      onClick={() => fileInput.current.click()}
    >
      <p className="mb-2">Drag & drop or tap to select photos/videos {progress ? `(${progress}%)` : ''}</p>
      <input ref={fileInput} type="file" accept="image/*,video/*" multiple hidden onChange={e => handleFiles(e.target.files)} />
    </div>
  )
}
