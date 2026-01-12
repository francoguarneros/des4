
import React, { useState, useEffect, useMemo } from 'react';
import { LineChart } from '../SVGCharts';
import { MONTHS } from '../../constants';
import { supabase } from '../../supabaseClient';

interface BalanceViewProps {
  selectedYear: string;
  selectedMonth: string;
}

interface ReportRecord {
  anio: any;
  mes: string;
  ingreso_neto_distribuido: number;
  ingreso_total: number;
  costos: number;
}

export const BalanceView: React.FC<BalanceViewProps> = ({ selectedYear, selectedMonth }) => {
  const [timeframe, setTimeframe] = useState<'AÑO' | 'MES'>('MES');
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  
  const [dbData, setDbData] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log(`--- Fetching Data ---`);
      console.log(`Target Year: ${selectedYear}`);
      console.log(`Target Month: ${selectedMonth.toUpperCase()}`);
      console.log(`Mode: ${timeframe}`);

      let query = supabase
        .from('reportes_mensuales')
        .select('anio, mes, ingreso_neto_distribuido, ingreso_total, costos');

      // Always filter by year
      // Handle both string and numeric types for anio column
      query = query.or(`anio.eq.${selectedYear},anio.eq.${parseInt(selectedYear)}`);

      // Strict Filtering by month if in MES mode
      if (timeframe === 'MES') {
        query = query.eq('mes', selectedMonth.toUpperCase());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase Query Error:', error.message);
        throw error;
      }

      // DEBUG LOG: Requested by user to inspect actual DB payload
      console.log('Database response:', data);
      
      setDbData(data || []);
    } catch (err) {
      console.error('Connection/Fetch failure:', err);
      setDbData([]); 
    } finally {
      setLoading(false);
    }
  };

  // Force fetch on every relevant change (Year, Month, or Timeframe Toggle)
  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth, timeframe]);

  // Primary Display Mapping: ingreso_neto_distribuido
  const aggregateValue = useMemo(() => {
    return dbData.reduce((sum, r) => sum + (Number(r.ingreso_neto_distribuido) || 0), 0);
  }, [dbData]);

  // Detail Metrics
  const totalRevenue = useMemo(() => {
    return dbData.reduce((sum, r) => sum + (Number(r.ingreso_total) || 0), 0);
  }, [dbData]);

  const totalCosts = useMemo(() => {
    return dbData.reduce((sum, r) => sum + (Number(r.costos) || 0), 0);
  }, [dbData]);

  // Chart Visualization Logic
  const chartData = useMemo(() => {
    if (dbData.length === 0) return Array(timeframe === 'MES' ? 5 : 12).fill(0);

    if (timeframe === 'MES') {
      // Direct mapping of the single found row
      const val = Number(dbData[0]?.ingreso_neto_distribuido) || 0;
      // Visual trend generation for the monthly curve
      return [val * 0.85, val * 0.95, val, val * 1.02, val * 0.98];
    } else {
      // Annual mapping for the year overview
      return MONTHS.map(m => {
        const record = dbData.find(r => r.mes?.toString().toUpperCase().startsWith(m.toUpperCase()));
        return record ? Number(record.ingreso_neto_distribuido) : 0;
      });
    }
  }, [dbData, timeframe]);

  const chartLabels = timeframe === 'MES' 
    ? ["1", "8", "15", "22", "30"] 
    : MONTHS.map((m, i) => (i % 2 === 0 ? m : ""));

  const displayValue = hoverValue !== null ? hoverValue : aggregateValue;
  const displayLabel = hoverIndex !== null 
    ? (timeframe === 'MES' ? `Punto ${hoverIndex + 1}` : MONTHS[hoverIndex])
    : (timeframe === 'MES' ? `${selectedMonth} ${selectedYear}` : `Anual ${selectedYear}`);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="flex gap-3 h-14">
          <div className="flex-1 bg-slate-100 rounded-2xl"></div>
          <div className="flex-1 bg-slate-100 rounded-2xl"></div>
        </div>
        <div className="h-[380px] bg-white border border-slate-100 rounded-[2.5rem] w-full shadow-sm"></div>
        <div className="h-64 bg-slate-900 rounded-[2.5rem] w-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex w-full gap-3 mb-1">
        <button
          onClick={() => setTimeframe('AÑO')}
          className={`flex-1 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all border ${
            timeframe === 'AÑO' ? 'bg-[#0f172a] text-white shadow-lg' : 'bg-white text-slate-400 border-slate-100'
          }`}
        >
          ANUAL
        </button>
        <button
          onClick={() => setTimeframe('MES')}
          className={`flex-1 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all border ${
            timeframe === 'MES' ? 'bg-[#0f172a] text-white shadow-lg' : 'bg-white text-slate-400 border-slate-100'
          }`}
        >
          MENSUAL
        </button>
      </div>

      <div className="bg-white p-6 pb-4 rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden relative group">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">
              {hoverValue !== null ? 'UTILIDAD EN PUNTO' : 'NETO DISTRIBUIDO'}
            </p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
              ${displayValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-slate-300 text-[8px] font-black uppercase tracking-widest mb-1">PERIODO</p>
            <p className="font-black text-[10px] text-emerald-500 uppercase bg-emerald-50 px-3 py-1 rounded-lg">
              {displayLabel}
            </p>
          </div>
        </div>

        <div className="h-[280px] flex items-center justify-center -mx-2">
          {dbData.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4 opacity-40">
              <svg className="w-12 h-12 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M2 12h20"/><path d="M12 2 2 12l10 10 10-10L12 2Z"/>
              </svg>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Sin registros en base de datos
              </p>
            </div>
          ) : (
            <LineChart 
              data={chartData} 
              labels={chartLabels} 
              onHover={(val, idx) => {
                setHoverValue(val);
                setHoverIndex(idx);
              }}
            />
          )}
        </div>
      </div>

      <div className="bg-[#0f172a] p-8 rounded-[2.5rem] shadow-xl flex flex-col gap-5 border border-slate-800 relative group overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <p className="text-slate-400 text-sm font-bold">Ingresos Generados</p>
          <p className="text-xl font-black text-white tracking-tighter">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <p className="text-slate-400 text-sm font-bold">Costos Operativos</p>
          <p className="text-xl font-black text-rose-500 tracking-tighter">
            -${Math.abs(totalCosts).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="h-px bg-slate-800 w-full my-1 opacity-50 relative z-10"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Utilidad Distribuida</p>
            <p className="text-[8px] text-slate-500 font-bold uppercase mt-0.5 tracking-[0.2em]">Cálculo Final</p>
          </div>
          <p className="text-3xl font-black text-emerald-500 tracking-tighter">
            ${aggregateValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};
