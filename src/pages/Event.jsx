import UploadArea from '../components/UploadArea';
import Gallery from '../components/Gallery';

export default function EventPage() {
  const code = 'vitoedaniela';

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Matrimonio 3 Giugno a Molfetta</h1>
      <UploadArea code={code} />
      <hr className="my-8" />
      <button
        onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guarda le foto qui 📸
      </button>
      <div id="gallery" className="mt-6">
        <Gallery code={code} />
      </div>
    </div>
  );
}




