// src/pages/Event.jsx
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../supabaseClient'
import UploadArea from '../components/UploadArea'
import Gallery    from '../components/Gallery'

const EVENT_CODE = '362025'

export default function Event() {
  const [media, setMedia] = useState([])
  const [progress, setProgress] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const fileInput = useRef()

  // Carica SOLO l’upload area all’avvio
  useEffect(() => {
    // non carichiamo la gallery finché showGallery = false
  }, [])

  // Funzione per caricare i file e poi far ripopolare media
  const handleFiles = async files => {
    const arr = Array.from(files)
    for (let i = 0; i < arr.length; i++) {
      setProgress(Math.round(((i + 1) / arr.length) * 100))
      const file = arr[i]
      const path = `${EVENT_CODE}/${Date.now()}-${file.name}`

      const { error: upErr } = await supabase
        .storage
        .from('wedding-media')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (upErr) { alert(upErr.message); continue }

      const { error: dbErr } = await supabase
        .from('media')
        .insert({ code: EVENT_CODE, path, mime: file.type })
      if (dbErr) alert(dbErr.message)
    }
    setProgress(0)
    if (fileInput.current) fileInput.current.value = ''

    // Se la gallery è già visibile, aggiorniamo subito i dati
    if (showGallery) await loadGallery()
  }

  // Carica i media da Supabase
  const loadGallery = async () => {
    const { data, error } = await supabase
      .from('media')
      .select('id, path, mime')
      .eq('code', EVENT_CODE)
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setMedia(data)
    setShowGallery(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Matrimonio 3 Giugno a Molfetta
      </h1>

      {/* UploadArea */}
      <div
        className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-100"
        onClick={() => fileInput.current.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
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

      {/* Pulsante per caricare la gallery */}
      {!showGallery && (
        <div className="text-center mt-8">
          <button
            onClick={loadGallery}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Mostra Galleria
          </button>
        </div>
      )}

      {/* Gallery solo se showGallery = true */}
      {showGallery && (
        <div className="mt-8">
          <Gallery media={media} />
        </div>
      )}
    </div>
  )
}


