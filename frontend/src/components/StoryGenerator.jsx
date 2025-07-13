import { useState } from 'react'
import { generateStoryPart } from '../services/storyService'
import { playBase64Audio } from '../services/audioService'

function StoryGenerator() {
  const [history, setHistory] = useState([])
  const [story, setStory] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)

  const saveToLibrary = (newHistory, imageUrl) => {
    const stored = JSON.parse(localStorage.getItem('stories') || '[]')
    stored.push({ history: newHistory, image: imageUrl, date: new Date().toISOString() })
    localStorage.setItem('stories', JSON.stringify(stored))
  }

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await generateStoryPart(history, {}, true)
      if (res.success) {
        const newHistory = [...history, { role: 'assistant', content: res.storyPart }]
        setHistory(newHistory)
        setStory(res.storyPart)
        setImage(res.imageUrl)
        if (res.audioBase64) {
          playBase64Audio(res.audioBase64)
        }
        saveToLibrary(newHistory, res.imageUrl)
      } else {
        setStory(res.error || 'No se pudo generar la historia')
      }
    } catch {
      setStory('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full max-w-xl mx-auto">
      <div className="min-h-[120px] mb-4 text-lg whitespace-pre-wrap">{story}</div>
      {image && (
        <img src={image} alt="Imagen generada" className="mx-auto mb-4 rounded w-64 h-64 object-cover" />
      )}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 w-full"
      >
        {loading ? 'Generando...' : 'Generar Nueva Parte'}
      </button>
    </div>
  )
}

export default StoryGenerator
