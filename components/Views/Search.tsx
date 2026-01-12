
import React, { useState, useMemo } from 'react';
import { Icons, COLORS } from '../../constants';

interface SearchResult {
  id: string;
  category: 'Vistas' | 'Métricas' | 'Documentos' | 'Ajustes';
  title: string;
  description: string;
  target: string;
  icon: React.ReactNode;
}

const SEARCH_DATA: SearchResult[] = [
  {
    id: '1',
    category: 'Vistas',
    title: 'Balance General',
    description: 'Ver resumen de utilidad bruta y neta.',
    target: 'BALANCE',
    icon: <Icons.Home active={true} />
  },
  {
    id: '2',
    category: 'Vistas',
    title: 'Calendario de Ocupación',
    description: 'Revisar disponibilidad y reservas confirmadas.',
    target: 'OCUPACION',
    icon: <Icons.Calendar />
  },
  {
    id: '3',
    category: 'Vistas',
    title: 'Documentación Fiscal',
    description: 'Descargar archivos CFDI, PDF y XML.',
    target: 'FISCAL',
    icon: <Icons.FileText />
  },
  {
    id: '4',
    category: 'Métricas',
    title: 'Ingresos Totales',
    description: 'Análisis detallado de entradas de capital.',
    target: 'BALANCE',
    icon: <div className="text-emerald-500 font-black text-xs">$</div>
  },
  {
    id: '5',
    category: 'Métricas',
    title: 'Costos Operativos',
    description: 'Gastos de mantenimiento y administración.',
    target: 'BALANCE',
    icon: <div className="text-rose-500 font-black text-xs">-$</div>
  },
  {
    id: '6',
    category: 'Ajustes',
    title: 'Notificaciones',
    description: 'Configurar alertas push y correos.',
    target: 'PERFIL',
    icon: <Icons.User active={true} />
  },
  {
    id: '7',
    category: 'Ajustes',
    title: 'Idioma y Moneda',
    description: 'Cambiar preferencias de visualización.',
    target: 'PERFIL',
    icon: <Icons.User active={false} />
  },
  {
    id: '8',
    category: 'Documentos',
    title: 'Facturas Q1',
    description: 'Documentos del primer trimestre 2024.',
    target: 'FISCAL',
    icon: <Icons.FileText />
  }
];

interface SearchViewProps {
  onNavigate: (view: any, bottom: any) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return SEARCH_DATA.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.description.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const categories = Array.from(new Set(filteredResults.map(r => r.category)));

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Icons.Search active={query.length > 0} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar métricas, facturas o ajustes..."
          className="w-full bg-white border border-slate-200 pl-14 pr-12 py-5 rounded-[2rem] text-sm font-bold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-300 placeholder:font-medium"
          autoFocus
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-5 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}
      </div>

      {/* Results */}
      <div className="flex flex-col gap-8 pb-10">
        {!query ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
              <Icons.Search active={false} />
            </div>
            <h3 className="text-slate-900 font-black text-lg mb-2 uppercase tracking-tight">¿Qué estás buscando?</h3>
            <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-[200px]">
              Encuentra rápidamente cualquier dato de tu inversión.
            </p>
          </div>
        ) : filteredResults.length > 0 ? (
          categories.map(category => (
            <div key={category} className="flex flex-col gap-4">
              <h4 className="px-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{category}</h4>
              <div className="flex flex-col gap-3">
                {filteredResults.filter(r => r.category === category).map(result => (
                  <button
                    key={result.id}
                    onClick={() => {
                      // Navigate logic - simplified mapping
                      const viewMap: any = {
                        'BALANCE': 'BALANCE',
                        'OCUPACION': 'OCUPACIÓN',
                        'FISCAL': 'FISCAL'
                      };
                      const bottomMap: any = {
                        'PERFIL': 'PERFIL',
                        'BALANCE': 'INICIO',
                        'OCUPACION': 'INICIO',
                        'FISCAL': 'INICIO'
                      };
                      onNavigate(viewMap[result.target] || 'BALANCE', bottomMap[result.target] || 'INICIO');
                    }}
                    className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-50 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all text-left group active:scale-[0.98]"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                      {result.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{result.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{result.description}</p>
                    </div>
                    <div className="text-slate-200 group-hover:text-emerald-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Sin resultados para "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
