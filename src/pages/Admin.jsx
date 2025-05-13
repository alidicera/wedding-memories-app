import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Admin() {
  const [text, setText] = useState('')
  const navigate = useNavigate()

  const createEvent = async () => {
    // genera un codice univoco (qui a titolo d’esempio usiamo l’input dell’admin)
    const code = text.trim()
    if (!code) return alert('Inserisci un codice evento')

    const { error } = await supabase
      .from('events')
      .insert({ code, text })
    if (error) return alert('Errore nella creazione evento: ' + error.message)

    // reindirizza subito alla pagina evento
    navigate(`/${code}`)
  }

  return (
    <div className="p-6">
      <h1>Dashboard Matrimonio</h1>
      <input
        type="text"
        placeholder="Codice univoco (es. 362025)"
        value={text}
        onChange={e => setText(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={createEvent} className="btn">
        Crea nuovo evento
      </button>
    </div>
  )
}
