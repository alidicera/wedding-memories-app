import { useEffect, useState, useRef } from 'react'
import { supabase } from '../supabaseClient'

// Unico event code: deve esistere in supabase.events
const EVENT_CODE = '362025'

export default function Event() {
  const [media, setMedia] = useState([])
  const [progress, setProgress] = useState(0)
  const fileInput = useRef()

  useEffect(() => {
    supabase
      .from('media')
      .select('id,path,mime')
      .eq('code', EVENT_CODE)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error)
        else setMedia(data)
      })
  }, [])

  const handleFiles = async files => {
    const arr = Array.from(files)
    for (let i = 0; i < arr.length; i++) {
      setProgress(Math.round(((i + 1) / arr.length) * 100))
      const file = arr[i]
      const path = `${EVENT_CODE}/${Date.now()}-${file.name}`
      // upload
      const { error: upErr } = await supabase.storage
        .from('wedding-media')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (upErr) {
        console.error(upErr)
        alert(upErr.message)
        continue
      }
      // insert media record
      const { error: dbErr } = await supabase
        .from('media')
        .insert({ code: EVENT_CODE, path, mime: file.type })
      if (dbErr) {
        console.error(dbErr)
        alert(dbErr.message)
      }
    }
    setProgress(0)
    if (fileInput.current) fileInput.current.value = ''
    // refresh galleria
    const { data } = await supabase
      .from('media')
      .select('id,path,mime')
      .eq('code', EVENT_CODE)
      .order('created_at', { ascending: false })
    setMedia(data)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Matrimonio 3 Giugno a Molfetta
      </h1>

      <div
        className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-100"
        onClick={() => fileInput.current.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          handleFiles(e.dataTransfer.files)
        }}
      >
        <p>
          Trascina o clicca per caricare foto/video{' '}
          {progress ? `(${progress}%)` : ''}
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {media.map(item =>
          item.mime.startsWith('image') ? (
            <img
              key={item.id}
              src={supabase.storage
                .from('wedding-media')
                .getPublicUrl(item.path).data.publicUrl}
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <video
              key={item.id}
              controls
              src={supabase.storage
                .from('wedding-media')
                .getPublicUrl(item.path).data.publicUrl}
              className="w-full h-48 object-cover rounded-lg"
            />
          )
        )}
      </div>
    </div>
  )
}

