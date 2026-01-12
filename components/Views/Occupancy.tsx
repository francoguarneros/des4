
import React, { useState, useMemo } from 'react';
import { DonutChart } from '../SVGCharts';
import { DayDetail } from '../../types';

interface OccupancyViewProps {
  selectedYear: string;
  selectedMonth: string;
}

export const OccupancyView: React.FC<OccupancyViewProps> = ({ selectedYear, selectedMonth }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Deterministic Mock Data Generator based on Month/Year
  const data = useMemo(() => {
    // Simple hash to create a "seed"
    const seed = selectedMonth + selectedYear;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    
    // Deterministic random numbers between 0 and 1
    const rand = (offset: number) => {
      const x = Math.sin(hash + offset) * 10000;
      return x - Math.floor(x);
    };

    const occupancy = Math.floor(65 + rand(1) * 30); // 65% to 95%
    const revenue = 80000 + rand(2) * 70000;      // 80k to 150k
    const costRatio = 0.3 + rand(3) * 0.1;        // 30% to 40% cost
    const monthlyCosts = revenue * costRatio;
    const netUtility = revenue - monthlyCosts;

    // Generate active days (booked) for the calendar
    // Higher occupancy = more active days
    const daysInMonth = 30; // Approximation
    const activeDaysCount = Math.floor((occupancy / 100) * daysInMonth);
    const activeDays: number[] = [];
    for (let i = 0; i < activeDaysCount; i++) {
      const day = Math.floor(rand(i + 10) * daysInMonth) + 1;
      if (!activeDays.includes(day)) activeDays.push(day);
    }

    return {
      occupancy,
      monthlyRevenue: revenue,
      monthlyCosts,
      netUtility,
      activeDays: activeDays.sort((a, b) => a - b)
    };
  }, [selectedYear, selectedMonth]);

  const getDayDetail = (day: number): DayDetail => {
    // Use the same logic for daily detail
    const seed = selectedMonth + selectedYear + day;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const x = Math.sin(hash) * 10000;
    const randVal = x - Math.floor(x);

    return {
      date: day,
      revenue: 3000 + randVal * 2000,
      cost: 800 + randVal * 500,
      occupancy: 100 // If it's active, it's occupied
    };
  };

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Expanded container for the donut chart */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50 flex items-center justify-center min-h-[240px]">
        <DonutChart percentage={data.occupancy} size={180} />
      </div>

      {/* Navy Blue Financial Summary Square */}
      <div className="bg-[#0f172a] p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col gap-5">
        <div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
            Finanzas Mensuales {selectedMonth} {selectedYear}
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-white text-sm font-bold">Ingresos Totales</p>
          <p className="text-xl font-black text-emerald-500 tracking-tighter">
            ${data.monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-slate-400 text-sm font-bold">Costos Operativos</p>
          <p className="text-xl font-black text-rose-500 tracking-tighter">
            ${data.monthlyCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="h-px bg-slate-700/50 w-full"></div>

        <div className="flex justify-between items-center">
          <p className="text-emerald-500 text-xs font-black uppercase tracking-wider">Utilidad Neta</p>
          <p className="text-2xl font-black text-emerald-500 tracking-tighter">
            ${data.netUtility.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm">
        <h3 className="text-slate-900 font-black text-lg mb-6">Calendario de Ocupación</h3>
        <div className="grid grid-cols-7 gap-2">
          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-slate-400 mb-2">{d}</div>
          ))}
          {Array.from({ length: 30 }, (_, i) => {
            const day = i + 1;
            const isActive = data.activeDays.includes(day);
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`
                  aspect-square rounded-xl text-sm font-bold flex items-center justify-center transition-all
                  ${isSelected ? 'bg-emerald-500 text-white shadow-lg scale-110 z-10' : 
                    isActive ? 'bg-[#0f172a] text-white' : 'text-slate-300 hover:text-slate-500'}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-black">Detalle del {selectedDay} {selectedMonth}</h4>
            <span className="bg-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">Confirmado</span>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Ingresos</span>
              <span className="text-xl font-black text-emerald-400">${getDayDetail(selectedDay).revenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Costo Operativo</span>
              <span className="text-xl font-black text-rose-400">${getDayDetail(selectedDay).cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Tarifa Diaria Promedio</span>
              <span className="text-xl font-black">
                ${(getDayDetail(selectedDay).revenue * 0.9).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
