import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="h-screen flex flex-col items-center justify-center text-center gap-4">
      <h1 className="text-5xl font-bold">404</h1>
      <p>Pagina non trovata</p>
      <Link to="/viteodaniela" className="text-blue-600 underline">
        Torna all’evento
      </Link>
    </main>
  )
}
