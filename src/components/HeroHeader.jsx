export default function HeroHeader({ code }) {
    return (
      <div className="text-center mb-10 space-y-4">
        <h1 className="text-5xl md:text-6xl font-script text-rose-600 drop-shadow">
          Mint to be
        </h1>
        <p className="max-w-md mx-auto text-lg font-sans text-gray-700">
          Scatta una foto o scegli dal rullino, poi tocca <strong>Carica</strong>.
          Comparirà sul grande schermo in pochi secondi!
        </p>
        <p className="mt-2 inline-block bg-gray-200 px-4 py-1 rounded-full font-mono tracking-widest">
          Codice:&nbsp;{code}
        </p>
      </div>
    )
  }
  