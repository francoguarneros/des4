
import React, { useState, useMemo } from 'react';
import { LineChart } from '../SVGCharts';
import { YEARS, MONTHS, COLORS } from '../../constants';

interface BalanceViewProps {
  selectedYear: string;
  selectedMonth: string;
}

export const BalanceView: React.FC<BalanceViewProps> = ({ selectedYear, selectedMonth }) => {
  const [timeframe, setTimeframe] = useState<'AÑO' | 'MES'>('MES');
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Month configurations based on selectedMonth
  const monthConfig = useMemo(() => {
    const days31 = ['ENE', 'MAR', 'MAY', 'JUL', 'AGO', 'OCT', 'DIC'];
    const days30 = ['ABR', 'JUN', 'SEP', 'NOV'];
    
    let days = 31;
    let axisLabels: string[] = [];

    if (days30.includes(selectedMonth)) {
      days = 30;
      axisLabels = Array(30).fill("");
      [0, 4, 9, 14, 19, 24, 29].forEach((idx, i) => {
        axisLabels[idx] = [1, 5, 10, 15, 20, 25, 30][i].toString();
      });
    } else if (selectedMonth === 'FEB') {
      days = 28;
      axisLabels = Array(28).fill("");
      [0, 4, 9, 14, 19, 23, 27].forEach((idx, i) => {
        axisLabels[idx] = [1, 5, 10, 15, 20, 24, 28][i].toString();
      });
    } else {
      days = 31;
      axisLabels = Array(31).fill("");
      [0, 5, 10, 15, 20, 25, 30].forEach((idx, i) => {
        axisLabels[idx] = [1, 6, 11, 16, 21, 26, 31][i].toString();
      });
    }

    return { days, axisLabels };
  }, [selectedMonth]);

  // Data for variable days (Monthly View)
  const monthData = useMemo(() => {
    return Array.from({ length: monthConfig.days }, (_, i) => {
      // Generate some slightly varied mock data
      const base = 2500;
      const vari = Math.sin(i / 5) * 500;
      return base + vari + Math.random() * 200;
    });
  }, [monthConfig.days]);

  // Data for 12 months (Yearly View)
  const yearData = useMemo(() => [
    420000, 450000, 480000, 510000, 500000, 530000, 
    560000, 540000, 590000, 620000, 650000, 680000
  ], []);

  // Calculate Aggregates
  const monthTotal = useMemo(() => monthData.reduce((acc, v) => acc + v, 0), [monthData]);
  const yearTotal = useMemo(() => yearData.reduce((acc, v) => acc + v, 0), [yearData]);

  // Full labels for hovering display context
  const fullMonthlyLabels = useMemo(() => Array.from({ length: monthConfig.days }, (_, i) => `Día ${i + 1}`), [monthConfig.days]);
  const fullYearlyLabels = useMemo(() => [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ], []);

  // Axis display labels (Yearly)
  const yearlyAxisLabels = ['ENE', 'MAR', 'MAY', 'JUL', 'SEP', 'NOV', 'DIC'];
  // Re-map yearly labels to a 12-slot array for precise positioning
  const fullYearlyAxisLabels = useMemo(() => {
    const arr = Array(12).fill("");
    [0, 2, 4, 6, 8, 10, 11].forEach((idx, i) => {
      arr[idx] = yearlyAxisLabels[i];
    });
    return arr;
  }, []);

  const labels = timeframe === 'MES' ? monthConfig.axisLabels : fullYearlyAxisLabels;
  const currentData = timeframe === 'MES' ? monthData : yearData;

  // Aggregate totals logic
  const aggregateValue = timeframe === 'MES' ? monthTotal : yearTotal;
  
  // Financial Summary Values (Aggregated for the selected timeframe)
  const totalRevenue = aggregateValue * 1.45;
  const operationalCosts = aggregateValue * 0.45;
  const netUtility = totalRevenue - operationalCosts;

  // Detail display value (Header) - Dynamic on hover
  const displayValue = hoverValue !== null ? hoverValue : aggregateValue;

  // Detail label (Header) - Dynamic on hover
  const displayLabel = hoverIndex !== null 
    ? (timeframe === 'MES' ? fullMonthlyLabels[hoverIndex] : fullYearlyLabels[hoverIndex])
    : (timeframe === 'MES' ? `Total ${selectedMonth}` : `Anual ${selectedYear}`);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      {/* Timeframe Split Buttons */}
      <div className="flex w-full gap-3 mb-1">
        <button
          onClick={() => {
            setTimeframe('AÑO');
            setHoverValue(null);
            setHoverIndex(null);
          }}
          className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black tracking-[0.1em] transition-all duration-300 shadow-sm border ${
            timeframe === 'AÑO' 
              ? 'bg-[#0f172a] text-white border-[#0f172a]' 
              : 'bg-white text-slate-400 border-slate-100'
          }`}
        >
          AÑO
        </button>
        <button
          onClick={() => {
            setTimeframe('MES');
            setHoverValue(null);
            setHoverIndex(null);
          }}
          className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black tracking-[0.1em] transition-all duration-300 shadow-sm border ${
            timeframe === 'MES' 
              ? 'bg-[#0f172a] text-white border-[#0f172a]' 
              : 'bg-white text-slate-400 border-slate-100'
          }`}
        >
          MES
        </button>
      </div>

      {/* Main Graph Box */}
      <div className="bg-white p-4 pb-2 rounded-3xl shadow-sm overflow-hidden border border-slate-50">
        <div className="flex justify-between items-start mb-1 px-2">
          <div className="min-w-0 flex-1">
            <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
              {hoverValue !== null ? 'Detalle del Periodo' : 'Utilidad Bruta'}
            </p>
            <h2 className={`text-3xl font-black tracking-tighter transition-colors duration-200 ${hoverValue !== null ? 'text-emerald-500' : 'text-slate-900'}`}>
              ${displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="text-right ml-4 shrink-0">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Contexto</p>
            <p className={`font-black text-sm uppercase transition-colors duration-200 ${hoverValue !== null ? 'text-emerald-600' : 'text-slate-900'}`}>
              {displayLabel}
            </p>
          </div>
        </div>

        {/* Chart Area */}
        <div className="h-[280px] flex items-center justify-center -mx-2">
          <LineChart 
            data={currentData} 
            labels={labels} 
            onHover={(val, idx) => {
              setHoverValue(val);
              setHoverIndex(idx);
            }}
          />
        </div>
      </div>

      {/* Financial Summary Square */}
      <div className="bg-[#0f172a] p-6 rounded-3xl shadow-xl flex flex-col gap-4 border border-slate-800">
        <div>
           <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] mb-4">Resumen Financiero</p>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-slate-400 text-sm font-bold">Ingresos Totales</p>
          <p className="text-xl font-black text-white tracking-tighter">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-slate-400 text-sm font-bold">Costos Operativos</p>
          <p className="text-xl font-black text-rose-500 tracking-tighter">
            ${operationalCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Gray Separator Line */}
        <div className="h-px bg-slate-700/50 w-full my-1"></div>

        <div className="flex justify-between items-center">
          <p className="text-emerald-500 text-sm font-black uppercase tracking-wider">Utilidad Neta</p>
          <p className="text-2xl font-black text-emerald-500 tracking-tighter">
            ${netUtility.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};
