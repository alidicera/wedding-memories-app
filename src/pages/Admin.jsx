import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { QRCodeSVG } from 'qrcode.react'
import Gallery from '../components/Gallery'
import UploadArea from '../components/UploadArea'

export default function Admin() {
  const [session, setSession] = useState(null)
  const [event, setEvent] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.getSession())
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess))
    return () => listener.subscription.unsubscribe()
  }, [])

  const newEvent = async () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    const { data, error } = await supabase.from('events').insert({ code }).select().single()
    if (error) alert(error.message)
    else setEvent(data)
  }

  if (!session) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Admin login</h1>
        <MagicLinkForm />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Wedding Memories – Admin</h1>
        <button onClick={() => supabase.auth.signOut()} className="border px-3 py-1 rounded">Logout</button>
      </header>

      {event ? (
        <>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 bg-white rounded-2xl shadow p-6">
              <h2 className="font-semibold mb-2">Event code</h2>
              <p className="text-4xl tracking-widest mb-4">{event.code}</p>
              <QRCodeSVG value={window.location.origin + '/e/' + event.code} size={192} />
            </div>
            <div className="md:flex-1 bg-white rounded-2xl shadow p-6">
              <h2 className="font-semibold mb-4">Upload direct</h2>
              <UploadArea code={event.code} />
            </div>
          </div>
          <h2 className="text-xl font-semibold mt-10 mb-4">Live gallery</h2>
          <Gallery code={event.code} admin />
        </>
      ) : (
        <button onClick={newEvent} className="bg-blue-600 text-white px-4 py-2 rounded">Create new event</button>
      )}
    </div>
  )
}

function MagicLinkForm() {
  const [email, setEmail] = useState('')
  const submit = async e => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + '/admin' } })
    alert(error ? error.message : 'Check your inbox!')
  }
  return (
    <form onSubmit={submit} className="flex flex-col gap-4 w-80">
      <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="you@example.com" className="border px-2 py-1 rounded" />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Send magic link</button>
    </form>
  )
}
