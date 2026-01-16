import { useState, useEffect } from 'react';
import { supabase } from './client'; // 
import Login from './components/Login';

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Login onLogin={() => {}} />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>
      <p>Has iniciado sesión correctamente.</p>
      {/* Aquí irá tu componente Dashboard real */}
      <button 
        onClick={() => supabase.auth.signOut()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

export default App;
