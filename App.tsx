
import React, { useState, useRef, useEffect } from 'react';
import { ViewTab, BottomTab } from './types';
import { YEARS, MONTHS, QUARTERS, Icons, COLORS } from './constants';
import { BalanceView } from './components/Views/Balance';
import { OccupancyView } from './components/Views/Occupancy';
import { FiscalView } from './components/Views/Fiscal';
import { ProfileView } from './components/Views/Profile';
import { SearchView } from './components/Views/Search';

interface CustomDropdownProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  width?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, options, onChange, width = "w-24" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${width}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black text-slate-900 shadow-sm focus:outline-none hover:border-emerald-500 transition-all active:scale-95"
      >
        <span>{value}</span>
        <svg 
          className={`ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-48 overflow-y-auto no-scrollbar">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
                  value === option 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>(ViewTab.BALANCE);
  const [bottomTab, setBottomTab] = useState<BottomTab>(BottomTab.INICIO);
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('MAR');
  const [quarter, setQuarter] = useState('Q1');

  const handleSearchNavigation = (view: ViewTab, bottom: BottomTab) => {
    setActiveTab(view);
    setBottomTab(bottom);
  };

  const renderContent = () => {
    if (bottomTab === BottomTab.PERFIL) return <ProfileView />;
    if (bottomTab === BottomTab.BUSCAR) return <SearchView onNavigate={handleSearchNavigation} />;

    switch (activeTab) {
      case ViewTab.BALANCE: return <BalanceView selectedYear={year} selectedMonth={month} />;
      case ViewTab.OCUPACION: return <OccupancyView selectedYear={year} selectedMonth={month} />;
      case ViewTab.FISCAL: return <FiscalView selectedYear={year} selectedQuarter={quarter} />;
      default: return null;
    }
  };

  const isHome = bottomTab === BottomTab.INICIO;

  return (
    <div className="max-w-md mx-auto bg-[#f8fafc] min-h-screen pb-32 flex flex-col relative">
      <div className="px-6 pt-10 pb-6 flex justify-between items-start border-b border-slate-200 mb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">Panel de Socio</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
            {bottomTab.toLowerCase()}
          </p>
        </div>
        <img 
          src="https://picsum.photos/100" 
          alt="User Profile" 
          className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
        />
      </div>

      {isHome && (
        <div className="px-6 py-4">
          <div className="flex bg-slate-200 p-1.5 rounded-3xl shadow-inner mb-6">
            {Object.values(ViewTab).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 py-3.5 rounded-2xl text-[10px] font-black tracking-widest transition-all duration-300
                  ${activeTab === tab 
                    ? 'bg-[#0f172a] text-white shadow-xl scale-[1.02]' 
                    : 'text-slate-500 hover:text-slate-700'}
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mb-4 relative z-40">
            <h2 className="text-xl font-black text-slate-900 capitalize">
              {activeTab.toLowerCase()}
            </h2>
            <div className="flex gap-2">
              <CustomDropdown 
                value={year} 
                options={YEARS} 
                onChange={setYear} 
                width="w-[80px]"
              />
              {activeTab === ViewTab.FISCAL ? (
                <CustomDropdown 
                  value={quarter} 
                  options={QUARTERS} 
                  onChange={setQuarter} 
                  width="w-[80px]"
                />
              ) : (
                <CustomDropdown 
                  value={month} 
                  options={MONTHS} 
                  onChange={setMonth} 
                  width="w-[80px]"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <main className="px-6 flex-1">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-100 px-8 py-6 flex justify-between items-center z-50 rounded-t-[3rem] shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        <button 
          onClick={() => setBottomTab(BottomTab.INICIO)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`p-2 rounded-2xl transition-colors ${bottomTab === BottomTab.INICIO ? 'bg-emerald-50' : ''}`}>
            <Icons.Home active={bottomTab === BottomTab.INICIO} />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${bottomTab === BottomTab.INICIO ? 'text-emerald-500' : 'text-slate-400'}`}>INICIO</span>
        </button>
        
        <button 
          onClick={() => setBottomTab(BottomTab.BUSCAR)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`p-2 rounded-2xl transition-colors ${bottomTab === BottomTab.BUSCAR ? 'bg-emerald-50' : ''}`}>
            <Icons.Search active={bottomTab === BottomTab.BUSCAR} />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${bottomTab === BottomTab.BUSCAR ? 'text-emerald-500' : 'text-slate-400'}`}>BUSCAR</span>
        </button>

        <button 
          onClick={() => setBottomTab(BottomTab.PERFIL)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`p-2 rounded-2xl transition-colors ${bottomTab === BottomTab.PERFIL ? 'bg-emerald-50' : ''}`}>
            <Icons.User active={bottomTab === BottomTab.PERFIL} />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${bottomTab === BottomTab.PERFIL ? 'text-emerald-500' : 'text-slate-400'}`}>PERFIL</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
