import UploadArea from '../components/UploadArea';

export default function Home() {
  const code = '362025'; // Codice evento univoco

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Matrimonio 3 Giugno a Molfetta</h1>
      <UploadArea code={code} />
      <p className="mt-8 text-gray-500">Nessun ricordo ancora… ✨</p>
    </div>
  );
}


