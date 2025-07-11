import { useEffect, useState } from 'react'

function StoryLibrary() {
  const [stories, setStories] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('stories') || '[]')
    setStories(saved)
  }, [])

  if (stories.length === 0) {
    return <p className="text-center">No hay cuentos guardados</p>
  }

  return (
    <ul className="space-y-4">
      {stories.map((s, index) => (
        <li key={index} className="p-4 bg-white rounded shadow">
          <p className="mb-2 whitespace-pre-wrap">
            {s.history[s.history.length - 1].content}
          </p>
          {s.image && (
            <img src={s.image} alt="Imagen" className="w-40 h-40 object-cover rounded" />
          )}
        </li>
      ))}
    </ul>
  )
}

export default StoryLibrary
