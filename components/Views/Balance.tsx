import React, { useState, useEffect, useMemo } from 'react';
import { LineChart } from '../SVGCharts';
import { MONTHS } from '../../constants';
import { supabase } from '../../supabaseClient';

interface BalanceViewProps {
  selectedYear: string;
  selectedMonth: string;
}

interface ReportRecord {
  id: string;
  anio: string;
  mes: string;
  ingreso_neto_distribuido: number; // Updated column name
  ingreso_total?: number;
  costos?: number;
  fecha: string;
}

export const BalanceView: React.FC<BalanceViewProps> = ({ selectedYear, selectedMonth }) => {
  const [timeframe, setTimeframe] = useState<'AÑO' | 'MES'>('MES');
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  
  const [records, setRecords] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('reportes_mensuales')
        .select('*')
        .eq('anio', selectedYear);

      if (timeframe === 'MES') {
        query = query.eq('mes', selectedMonth);
      }

      const { data, error: dbError } = await query.order('fecha', { ascending: true });

      if (dbError) throw dbError;
      setRecords(data || []);
    } catch (err: any) {
      console.error('Supabase Error:', err.message || err);
      setError('Error al conectar con la base de datos');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedYear, selectedMonth, timeframe]);

  // Use ingreso_neto_distribuido as the primary value for the dashboard
  const aggregateValue = useMemo(() => {
    return records.reduce((sum, rec) => sum + (rec.ingreso_neto_distribuido || 0), 0);
  }, [records]);

  const chartData = useMemo(() => {
    if (records.length === 0) return Array(timeframe === 'MES' ? 30 : 12).fill(0);

    if (timeframe === 'MES') {
      return records.map(r => r.ingreso_neto_distribuido);
    } else {
      return MONTHS.map(m => {
        const monthRecords = records.filter(r => r.mes === m);
        return monthRecords.reduce((sum, r) => sum + (r.ingreso_neto_distribuido || 0), 0);
      });
    }
  }, [records, timeframe]);

  const chartLabels = useMemo(() => {
    if (timeframe === 'MES') {
      return chartData.map((_, i) => (i % 5 === 0 ? (i + 1).toString() : ""));
    }
    return MONTHS.map((m, i) => (i % 2 === 0 ? m : ""));
  }, [timeframe, chartData]);

  // Financial Summary derived from DB
  const totalRevenue = records.reduce((sum, rec) => sum + (rec.ingreso_total || (rec.ingreso_neto_distribuido * 1.4)), 0);
  const operationalCosts = records.reduce((sum, rec) => sum + (rec.costos || (totalRevenue - rec.ingreso_neto_distribuido)), 0);
  const netDistributed = aggregateValue;

  const displayValue = hoverValue !== null ? hoverValue : aggregateValue;
  const displayLabel = hoverIndex !== null 
    ? (timeframe === 'MES' ? `Registro ${hoverIndex + 1}` : MONTHS[hoverIndex])
    : (timeframe === 'MES' ? `${selectedMonth} ${selectedYear}` : `Acumulado ${selectedYear}`);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="flex gap-3 mb-1">
          <div className="flex-1 h-14 bg-slate-200 rounded-2xl"></div>
          <div className="flex-1 h-14 bg-slate-200 rounded-2xl"></div>
        </div>
        <div className="h-[380px] bg-white border border-slate-100 rounded-[2.5rem] w-full shadow-sm"></div>
        <div className="h-64 bg-[#0f172a] rounded-[2.5rem] w-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex w-full gap-3 mb-1">
        <button
          onClick={() => { setTimeframe('AÑO'); setHoverValue(null); }}
          className={`flex-1 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all duration-300 shadow-sm border ${
            timeframe === 'AÑO' ? 'bg-[#0f172a] text-white border-[#0f172a]' : 'bg-white text-slate-400 border-slate-100'
          }`}
        >
          ANUAL
        </button>
        <button
          onClick={() => { setTimeframe('MES'); setHoverValue(null); }}
          className={`flex-1 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all duration-300 shadow-sm border ${
            timeframe === 'MES' ? 'bg-[#0f172a] text-white border-[#0f172a]' : 'bg-white text-slate-400 border-slate-100'
          }`}
        >
          MENSUAL
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-center">
          <p className="text-rose-500 text-[9px] font-black uppercase tracking-widest">{error}</p>
        </div>
      )}

      <div className="bg-white p-6 pb-4 rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-50">
        <div className="flex justify-between items-start mb-4">
          <div className="min-w-0 flex-1">
            <p className="text-slate-400 text-[9px] font-black tracking-[0.2em] uppercase mb-1">
              {hoverValue !== null ? 'REPARTICIÓN EN PUNTO' : 'UTILIDAD DISTRIBUIDA'}
            </p>
            <h2 className={`text-3xl font-black tracking-tighter transition-all duration-300 ${hoverValue !== null ? 'text-emerald-500 scale-[1.02] origin-left' : 'text-slate-900'}`}>
              ${displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          
          <div className="text-right ml-10 shrink-0 max-w-[80px]">
            <p className="text-slate-300 text-[8px] font-black uppercase tracking-[0.2em] mb-1">PERIODO</p>
            <p className={`font-black text-[10px] leading-[1.2] uppercase transition-colors duration-200 ${hoverValue !== null ? 'text-emerald-500' : 'text-slate-400'}`}>
              {displayLabel.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {word}
                  {i === 0 && <br />}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>

        <div className="h-[280px] flex items-center justify-center -mx-2">
          {records.length === 0 ? (
            <div className="text-center">
              <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">Sin registros</p>
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

      <div className="bg-[#0f172a] p-8 rounded-[2.5rem] shadow-2xl flex flex-col gap-5 border border-slate-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-125"></div>
        
        <div className="relative z-10">
           <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
             <span className={`w-1.5 h-1.5 rounded-full ${records.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
             Detalle de Distribución
           </p>
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <p className="text-slate-400 text-sm font-bold">Ingresos Generados</p>
          <p className="text-xl font-black text-white tracking-tighter">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex justify-between items-center relative z-10">
          <p className="text-slate-400 text-sm font-bold">Gastos de Operación</p>
          <p className="text-xl font-black text-rose-500 tracking-tighter">
            -${Math.abs(operationalCosts).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="h-px bg-slate-800 w-full my-1 relative z-10"></div>

        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">Neto Distribuido</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">TRANSFERENCIA A SOCIO</p>
          </div>
          <p className="text-3xl font-black text-emerald-500 tracking-tighter">
            ${netDistributed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};
