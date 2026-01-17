import { useState, useEffect } from 'react'
import { supabase } from '../client' // LOS DOS PUNTOS SON CLAVE
import Login from './Login' // Aquí es un solo punto porque son vecinos

export default function App() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (!session) return <Login onLogin={() => {}} />

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">¡Bienvenido al Dashboard!</h1>
      <button onClick={() => supabase.auth.signOut()} className="mt-4 bg-red-500 text-white px-4 py-2">Salir</button>
    </div>
  )
}
