import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Balance } from './Views/Balance';
import { FiscalView } from './Views/Fiscal';
import { Login } from './Login'; // Importamos la nueva puerta

// Componente temporal Buscar
const Buscar = () => (
  <div className="p-8 bg-white rounded shadow">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Buscador de Propiedades</h2>
    <p className="text-gray-600">Módulo para encontrar nuevas oportunidades de inversión.</p>
  </div>
);

function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('balance');
  const [loading, setLoading] = useState(true);

  // Al cargar, verificamos si ya existe una sesión guardada
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  // SI NO HAY SESIÓN, MOSTRAMOS EL LOGIN
  if (!session) {
    return <Login onLogin={() => {}} />;
  }

  // SI HAY SESIÓN, MOSTRAMOS EL DASHBOARD COMPLETO
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-slate-700">
          Inversionista<span className="text-blue-400">Pro</span>
        </div>
        
        <nav className="flex-1 mt-6">
          <button 
            onClick={() => setActiveTab('balance')}
            className={`w-full flex items-center px-6 py-4 transition-colors ${activeTab === 'balance' ? 'bg-blue-600 border-r-4 border-blue-300' : 'hover:bg-slate-800'}`}
          >
            <span className="mr-3">📊</span> Balance General
          </button>
          
          <button 
            onClick={() => setActiveTab('fiscal')}
            className={`w-full flex items-center px-6 py-4 transition-colors ${activeTab === 'fiscal' ? 'bg-blue-600 border-r-4 border-blue-300' : 'hover:bg-slate-800'}`}
          >
            <span className="mr-3">⚖️</span> Reporte Fiscal
          </button>
          
          <button 
            onClick={() => setActiveTab('buscar')}
            className={`w-full flex items-center px-6 py-4 transition-colors ${activeTab === 'buscar' ? 'bg-blue-600 border-r-4 border-blue-300' : 'hover:bg-slate-800'}`}
          >
            <span className="mr-3">🔍</span> Buscar
          </button>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full hover:bg-slate-800 p-2 rounded transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">S</div>
            <div className="text-left">
              <p className="text-sm font-medium">Cerrar Sesión</p>
            </div>
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">
            {activeTab === 'balance' ? 'Dashboard Financiero' : 
             activeTab === 'fiscal' ? 'Situación Fiscal' : 'Buscar Propiedades'}
          </h1>
          <button className="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50 text-sm">
            Descargar Reporte
          </button>
        </header>

        <div className="transition-opacity duration-300">
          {activeTab === 'balance' && <Balance />}
          {activeTab === 'fiscal' && <FiscalView selectedYear="2024" selectedQuarter="Q1" />}
          {activeTab === 'buscar' && <Buscar />}
        </div>
      </main>
    </div>
  );
}

export default App;
