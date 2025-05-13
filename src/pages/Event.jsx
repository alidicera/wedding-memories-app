import { useParams } from 'react-router-dom'
import UploadArea from '../components/UploadArea'
import Gallery    from '../components/Gallery'

export default function Event() {
  const { code } = useParams()

  return (
    <div className="min-h-screen bg-[url('/bg-floral.svg')] bg-cover p-6">
      <div className="max-w-xl mx-auto bg-white bg-opacity-80 p-6 rounded-lg shadow">
        <h1 className="text-3xl font-script text-center mb-4">
          Condividi i Nostri Ricordi
        </h1>
        <p className="text-center mb-6">
          Usa il codice <span className="font-mono">{code}</span> e carica foto o video!
        </p>

        <UploadArea code={code} />

        <h2 className="text-xl font-semibold mt-10 mb-4">Galleria Live</h2>
        <Gallery code={code} />
      </div>
    </div>
  )
}

