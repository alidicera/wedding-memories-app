// src/components/Gallery.jsx
import React from 'react'
import { supabase } from '../supabaseClient'

export default function Gallery({ media }) {
  const publicUrl = path =>
    supabase.storage.from('wedding-media').getPublicUrl(path).data.publicUrl

  if (!media.length) {
    return <p className="text-gray-500 text-center">Nessun ricordo ancora… ✨</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {media.map(item =>
        item.mime.startsWith('image') ? (
          <img
            key={item.id}
            src={publicUrl(item.path)}
            alt=""
            loading="lazy"                  // carica l’immagine solo quando entra in viewport
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <video
            key={item.id}
            controls
            preload="metadata"              // carica solo i metadata iniziali
            src={publicUrl(item.path)}
            className="w-full h-48 object-cover rounded-lg"
          />
        )
      )}
    </div>
  )
}






