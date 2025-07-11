import StoryGenerator from './components/StoryGenerator'
import StoryLibrary from './components/StoryLibrary'

function App() {
  return (
    <div className="min-h-screen bg-pink-100 p-4 space-y-8">
      <h1 className="text-3xl text-center text-pink-600 font-bold">Cuentos Vivos de Sophie</h1>
      <StoryGenerator />
      <div>
        <h2 className="text-xl font-semibold mb-2">Biblioteca</h2>
        <StoryLibrary />
      </div>
    </div>
  )
}

export default App
