// src/components/Gallery.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Gallery({ code }) {
  const [media, setMedia] = useState([])

  // carica media all’inizio e si iscrive ai nuovi insert
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('media')
        .select('id, path, mime')
        .eq('code', code)
        .order('created_at', { ascending: false })
      if (!error) setMedia(data)
    }
    load()

    const sub = supabase
      .channel('realtime media')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'media', filter: `code=eq.${code}` },
        payload => setMedia(m => [payload.new, ...m])
      )
      .subscribe()

    return () => supabase.removeChannel(sub)
  }, [code])

  const publicUrl = path =>
    supabase.storage.from('wedding-media').getPublicUrl(path).data.publicUrl

  if (!media.length) {
    return <p className="text-gray-500">Ancora nessun ricordo… ✨</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {media.map(item =>
        item.mime.startsWith('video') ? (
          <video
            key={item.id}
            src={publicUrl(item.path)}
            controls
            className="rounded-lg w-full h-64 object-cover"
          />
        ) : (
          <img
            key={item.id}
            src={publicUrl(item.path)}
            alt=""
            className="rounded-lg object-cover w-full h-64"
          />
        )
      )}
    </div>
  )
}
