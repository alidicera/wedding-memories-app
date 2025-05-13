// src/pages/Home.jsx
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Benvenuti!</h1>
      <p>
        Vai alla tua <Link to="/362025" className="underline">pagina evento</Link>.
      </p>
    </div>
  )
}

