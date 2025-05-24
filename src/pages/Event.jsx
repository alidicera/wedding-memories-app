import UploadArea from '../components/UploadArea.jsx'
import Gallery    from '../components/Gallery.jsx'

export default function EventPage({ code }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Matrimonio 3 Giugno a Molfetta
      </h1>

      {/* Upload */}
      <UploadArea code={code} />

      {/* Spaziatore */}
      <div className="my-10 h-px bg-gray-200" />

      {/* Galleria (lazy) */}
      <Gallery code={code} />
    </div>
  )
}





