// src/components/Gallery.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Gallery({ code }) {
  const [media, setMedia] = useState([])

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('media')
        .select('id, path, mime')
        .eq('code', code)
        .order('created_at', { ascending: false })
      if (error) console.error(error)
      else setMedia(data)
    }
    load()
  }, [code])

  const publicUrl = path =>
    supabase.storage.from('wedding-media').getPublicUrl(path).data.publicUrl

  if (!media.length) {
    return <p className="text-gray-500 mt-4">Ancora nessun ricordo… ✨</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
      {media.map(item =>
        item.mime.startsWith('image') ? (
          <img
            key={item.id}
            src={publicUrl(item.path)}
            alt=""
            className="rounded-lg object-cover w-full h-64"
          />
        ) : (
          <video
            key={item.id}
            controls
            src={publicUrl(item.path)}
            className="rounded-lg object-cover w-full h-64"
          />
        )
      )}
    </div>
  )
}





