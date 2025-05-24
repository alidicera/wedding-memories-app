// src/pages/Event.jsx
import UploadArea from '../components/UploadArea';
import Gallery    from '../components/Gallery';

export default function EventPage({ code, title }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* HERO */}
      <header className="mb-8 text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-bold">
          {title}
        </h1>
        <p className="text-gray-500 mt-2">
          Condividi qui le tue foto e i tuoi video 💕
        </p>
      </header>

      {/* UPLOAD */}
      <section className="mb-10">
        <UploadArea code={code} />
      </section>

      {/* GALLERY */}
      <section>
        <h2 className="sr-only">Galleria</h2>
        <Gallery code={code} />
      </section>
    </div>
  );
}








