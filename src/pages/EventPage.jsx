// src/pages/EventPage.jsx
import UploadArea from '../components/UploadArea'
import Gallery from '../components/Gallery'

export default function EventPage() {
  const code = 'MOLFETTA2025'  // il vostro codice univoco

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Carica i tuoi ricordi 📸🎥</h1>
      <UploadArea code={code} />
      <div className="mt-8">
        <Gallery code={code} />
      </div>
    </main>
  )
}
