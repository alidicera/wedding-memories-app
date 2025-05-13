import UploadArea from './components/UploadArea'
import Gallery   from './components/Gallery'

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold mb-2">Wedding Memories</h1>
        <p>Scansiona il QR code e carica le tue foto/video!</p>
      </header>
      <main className="container mx-auto px-4">
        <UploadArea />
        <Gallery />
      </main>
    </div>
  )
}



