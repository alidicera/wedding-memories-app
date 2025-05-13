import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { nanoid } from 'nanoid'
import { QRCodeSVG } from 'qrcode.react'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const createEvent = async () => {
    setLoading(true)
    // genera un codice univoco di 6 caratteri
    const code = nanoid(6).toUpperCase()

    // inserisci nel DB (tabella "events" con colonna "code")
    const { error } = await supabase
      .from('events')
      .insert({ code })

    if (error) {
      alert('Errore nella creazione evento: ' + error.message)
      setLoading(false)
      return
    }

    // poi reindirizza alla pagina evento
    navigate(`/event/${code}`)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard Matrimonio</h1>
      <button
        onClick={createEvent}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Creo…' : 'Crea nuovo evento'}
      </button>
      {/** mostra il QR + link diretto solo dopo che loading è false e code esiste */}
    </div>
  )
}

