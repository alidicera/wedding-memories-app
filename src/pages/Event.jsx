import { useParams } from 'react-router-dom';
import Gallery      from '../components/Gallery';
import UploadArea   from '../components/UploadArea';

export default function Event() {
  const { code } = useParams();   // es. 362025

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Matrimonio 3 Giugno a Molfetta
      </h1>

      {/* area di upload */}
      <UploadArea code={code} onDone={() => {/* refresh via Gallery */}} />

      {/* mini-gallery sotto */}
      <Gallery code={code} />
    </div>
  );
}



