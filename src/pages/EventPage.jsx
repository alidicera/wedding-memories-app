import { useParams } from 'react-router-dom'
import UploadArea from '../components/UploadArea'
import Gallery     from '../components/Gallery'

export default function EventPage() {
  const { code } = useParams()

  return (
    <div className="p-6">
      <h1>Carica i tuoi ricordi 📸🎥</h1>
      <UploadArea code={code} />
      <Gallery     code={code} />
    </div>
  )
}

