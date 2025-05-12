import { useParams } from 'react-router-dom'
import UploadArea   from '../components/UploadArea'
import Gallery      from '../components/Gallery'
import HeroHeader   from '../components/HeroHeader'

export default function Event() {
  const { code } = useParams()

  return (
    <div className="min-h-screen bg-[url('/bg-floral.svg')] bg-cover bg-fixed backdrop-blur-sm">
      <div className="container mx-auto p-4">
        <HeroHeader code={code} />

        <UploadArea code={code} />

        <h2 className="text-xl font-semibold mt-10 mb-4">Gallery</h2>
        <Gallery code={code} />
      </div>
    </div>
  )
}
