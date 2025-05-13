import { useState } from 'react'
import UploadArea from './components/UploadArea'
import Gallery   from './components/Gallery'

export default function App() {
  const [code, setCode] = useState('UNICO-CODE')

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Carica i tuoi ricordi 📸🎥</h1>
      <div className="max-w-xl mx-auto space-y-8">
        <UploadArea code={code} />
        <Gallery   code={code} />
      </div>
    </div>
  )
}




