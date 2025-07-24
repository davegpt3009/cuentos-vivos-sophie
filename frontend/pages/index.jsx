import Head from 'next/head';
import StoryDemo from '../components/StoryDemo';

export default function Home() {
  return (
    <>
      <Head>
        <title>Cuentos Vivos de Sophie</title>
        <meta name="description" content="Cuentacuentos interactivo para Sophie" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 p-8">
        <h1 className="text-4xl font-bold text-purple-700 drop-shadow-sm">
          Cuentos Vivos de Sophie 📚✨
        </h1>

        <p className="text-center max-w-xl">
          ¡Bienvenida, Sophie! Elige un cuento o pulsa “Generar cuento” para que cobre vida.
        </p>

        <StoryDemo />
      </main>
    </>
  );
}
