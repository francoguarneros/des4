
import React, { useState } from 'react';

export const ProfileView: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES');
  const [currency, setCurrency] = useState<'MXN' | 'USD'>('MXN');

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      alert('Sesión cerrada');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Profile Card */}
      <div className="bg-white p-8 rounded-3xl shadow-sm flex flex-col items-center">
        <div className="relative">
          <img 
            src="https://picsum.photos/200" 
            alt="Avatar" 
            className="w-32 h-32 rounded-full border-4 border-slate-50 shadow-lg object-cover"
          />
          <div className="absolute bottom-1 right-1 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white shadow-md"></div>
        </div>
        <h2 className="mt-6 text-2xl font-black text-slate-900">Ricardo Pérez</h2>
        <span className="mt-2 bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
          Client ID: #8201
        </span>
      </div>

      {/* Info Stats */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Unidad Principal</p>
            <p className="text-xl font-black text-slate-900">PH-502 | Riviera Maya</p>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Status de Inversión</p>
            <p className="text-xl font-black text-emerald-500">Inversionista Activo</p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shadow-sm shadow-emerald-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm">
        <h4 className="text-slate-900 font-black mb-6 uppercase tracking-[0.2em] text-[11px] border-b border-slate-50 pb-4">Ajustes de Cuenta</h4>
        
        <div className="space-y-6">
          {/* Notifications Toggle */}
          <div className="flex justify-between items-center group">
            <div className="flex flex-col">
              <span className="text-slate-700 font-bold text-sm">Notificaciones Push</span>
              <span className="text-[10px] text-slate-400 font-medium">Alertas de ingresos y ocupación</span>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-all duration-300 relative ${notifications ? 'bg-emerald-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${notifications ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-slate-700 font-bold text-sm">Idioma</span>
              <span className="text-[10px] text-slate-400 font-medium">Preferencia de visualización</span>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setLanguage('ES')}
                className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${language === 'ES' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >
                ES
              </button>
              <button 
                onClick={() => setLanguage('EN')}
                className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${language === 'EN' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Currency Selector */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-slate-700 font-bold text-sm">Moneda</span>
              <span className="text-[10px] text-slate-400 font-medium">Divisa de reportes</span>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setCurrency('MXN')}
                className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${currency === 'MXN' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >
                MXN
              </button>
              <button 
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${currency === 'USD' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >
                USD
              </button>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full text-center py-4 text-rose-500 font-black uppercase tracking-[0.2em] text-[10px] mt-4 border-t border-slate-50 active:scale-95 transition-transform"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
