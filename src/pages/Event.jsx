import UploadArea from '../components/UploadArea.jsx';
import Gallery    from '../components/Gallery.jsx';

const EVENT_CODE =
  import.meta.env.VITE_EVENT_CODE?.trim() || 'vitoedaniela';

export default function EventPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Matrimonio 3 Giugno a Molfetta
      </h1>

      {/* area di upload */}
      <UploadArea code={EVENT_CODE} />

      {/* separatore */}
      <div className="my-10 h-px bg-gray-200" />

      {/* galleria */}
      <Gallery code={EVENT_CODE} />
    </div>
  );
}






