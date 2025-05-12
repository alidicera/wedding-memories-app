import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Gallery({ code }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('media').select('*').eq('code', code).order('created_at', { ascending: false })
      if (!error) setItems(data)
    }
    load()

    const { data: sub } = supabase.channel('media-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'media', filter: `code=eq.${code}` }, payload => {
        setItems(prev => [payload.new, ...prev])
      })
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [code])

  if (!items.length) return <p className="text-gray-500">No memories yet. Be the first! ✨</p>

  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map(item => <MediaCard key={item.id} item={item} />)}
    </div>
  )
}

function MediaCard({ item }) {
  const url = supabase.storage.from('wedding-media').getPublicUrl(item.path).data.publicUrl
  return (
    <div className="relative overflow-hidden rounded-xl shadow-sm">
      {item.mime.startsWith('video') ? (
        <video src={url} controls muted className="w-full h-full object-cover" />
      ) : (
        <img src={url} alt="memory" className="w-full h-full object-cover" />
      )}
    </div>
  )
}
