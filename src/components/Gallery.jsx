import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Gallery({ code }) {
  const [media, setMedia] = useState([])

  useEffect(() => {
    supabase
      .from('media')
      .select('id,path,mime')
      .eq('code', code)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error)
        else setMedia(data)
      })
  }, [code])

  if (!media.length) {
    return <p className="text-gray-500 text-center">Ancora nessun ricordo… ✨</p>
  }

  const publicUrl = path =>
    supabase.storage.from('wedding-media').getPublicUrl(path).data.publicUrl

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
      {media.map(item =>
        item.mime.startsWith('image') ? (
          <img
            key={item.id}
            src={publicUrl(item.path)}
            alt=""
            className="w-full h-48 object-cover rounded"
          />
        ) : (
          <video
            key={item.id}
            controls
            src={publicUrl(item.path)}
            className="w-full h-48 object-cover rounded"
          />
        )
      )}
    </div>
  )
}




