import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Gallery() {
  const [media, setMedia] = useState([])

  useEffect(() => {
    supabase
      .from('media')
      .select('id,path,mime')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error)
        else setMedia(data)
      })
  }, [])

  const publicUrl = path =>
    supabase.storage.from('wedding-media').getPublicUrl(path).data.publicUrl

  if (!media.length) {
    return <p className="text-center text-gray-500">Nessun ricordo caricato… ✨</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
      {media.map(({ id, path, mime }) =>
        mime.startsWith('image') ? (
          <img
            key={id}
            src={publicUrl(path)}
            className="rounded-lg object-cover w-full h-64"
          />
        ) : (
          <video
            key={id}
            controls
            src={publicUrl(path)}
            className="rounded-lg object-cover w-full h-64"
          />
        )
      )}
    </div>
  )
}



