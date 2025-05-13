// src/pages/Admin.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { QRCodeSVG } from 'qrcode.react'   // ← import nominato

export default function Admin() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setEvents(data)
    })()
  }, [])

  const createEvent = async () => {
    const { data, error } = await supabase
      .from('events')
      .insert({})
      .single()
    if (!error) setEvents(ev => [data, ...ev])
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Matrimonio</h1>
      <button
        onClick={createEvent}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Crea nuovo evento
      </button>

      {events.map(ev => (
        <div key={ev.id} className="mb-8 p-4 border rounded-lg shadow-sm">
          <p className="font-mono mb-2">Codice evento: {ev.code}</p>
          <QRCodeSVG
            value={`${window.location.origin}/e/${ev.code}`}
            size={128}
          />
        </div>
      ))}
    </div>
  )
}
