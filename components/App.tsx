import { Fiscal } from './Views/Fiscal';
import React, { useState } from 'react';
// IMPORTANTE: Si App.tsx está dentro de la carpeta 'components', esta ruta funciona:
import { Balance } from './Views/Balance'; 

// --- Componentes Temporales (Para que el menú funcione YA) ---
const Fiscal = () => (
  <div className="p-8 bg-white rounded shadow">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Reporte Fiscal</h2>
    <p className="text-gray-600">Aquí verás las retenciones de impuestos y facturas.</p>
  </div>
);

const Buscar = () => (
  <div className="p-8 bg-white rounded shadow">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Buscador de Propiedades</h2>
    <p className="text-gray-600">Módulo para encontrar nuevas oportunidades de inversión.</p>
  </div>
);

// --- La Aplicación Principal ---
function App() {
  // Estado para controlar qué pestaña se ve (Por defecto: balance)
  const [activeTab, setActiveTab] = useState('balance');

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* 1. SIDEBAR (Menú Izquierdo) */}
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">S</div>
            <div>
              <p className="text-sm font-medium">Socio Inversionista</p>
              <p className="text-xs text-gray-400">Ver Perfil</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. AREA PRINCIPAL (Donde cambia la información) */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">
            {activeTab === 'balance' ? 'Dashboard Financiero' : activeTab}
          </h1>
          <button className="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50 text-sm">
            Descargar Reporte
          </button>
        </header>

        {/* Aquí es donde ocurre la magia del cambio de vista */}
        <div className="transition-opacity duration-300">
          {activeTab === 'balance' && <Balance />}
          {activeTab === 'fiscal' && <Fiscal />}
          {activeTab === 'buscar' && <Buscar />}
        </div>
      </main>
    </div>
  );
}

export default App;
