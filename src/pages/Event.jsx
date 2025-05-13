// src/pages/Event.jsx
import { useParams } from 'react-router-dom'
import UploadArea from '../components/UploadArea'
import Gallery from '../components/Gallery'

export default function EventPage() {
  const { code } = useParams()    // ecco “362025” o qualunque tu abbia messo

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Carica i tuoi ricordi 📸🎥
      </h1>
      <UploadArea code={code} />
      <Gallery code={code} />
    </div>
  )
}
