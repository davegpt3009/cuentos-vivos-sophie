import { useState } from 'react'
import { playBase64Audio } from '../services/audioService'

function StoryDemo() {
  const [story, setStory] = useState('')
  const [loading, setLoading] = useState(false)
  const [showImage, setShowImage] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    setShowImage(false)
    setStory('Generando historia...')
    try {
      const res = await fetch('/api/test-story')
      const data = await res.json()
      if (data.success) {
        setStory(data.testStory)
        setShowImage(true)
      } else {
        setStory(data.message || 'No se pudo generar la historia')
      }
    } catch {
      setStory('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-4">Cuentos Vivos de Sophie</h1>
      <div className="min-h-[120px] mb-4 text-lg">{story}</div>
      {showImage && (
        <img
          src="https://via.placeholder.com/256x256/FFB6C1/FFFFFF?text=Sophie"
          alt="Imagen del cuento"
          className="mx-auto mb-4 rounded shadow w-64 h-64 object-cover"
        />
      )}
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 w-full"
      >
        Generar Historia de Prueba
      </button>
    </div>
  )
}

export default StoryDemo
