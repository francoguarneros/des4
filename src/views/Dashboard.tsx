import { supabase } from '../client'

export default function Dashboard() {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error al cerrar sesión:', error.message)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-blue-600">Inversionista Pro</h1>
            <button
              onClick={handleSignOut}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg border">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-gray-900">Bienvenido al Panel</h2>
            <p className="mt-2 text-gray-600">
              Tu sistema de gestión de inversiones está listo y conectado.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
