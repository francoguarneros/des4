import { useState } from 'react'
import { supabase } from '../client' // EL SECRETO: Los dos puntos '..' suben un nivel

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else onLogin()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-md rounded">
        <h2 className="mb-4 text-xl font-bold">Inversionista Pro</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input type="email" placeholder="Email" className="block w-full mb-2 p-2 border" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="block w-full mb-4 p-2 border" onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2">ENTRAR</button>
      </form>
    </div>
  )
}
