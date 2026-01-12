
import React, { useState, useMemo } from 'react';
import { CFDI } from '../../types';
import { Icons, COLORS } from '../../constants';

interface FiscalViewProps {
  selectedYear: string;
  selectedQuarter: string;
}

interface CFDIWithMonth extends CFDI {
  monthName: string;
}

export const FiscalView: React.FC<FiscalViewProps> = ({ selectedYear, selectedQuarter }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewingXml, setViewingXml] = useState<string | null>(null);

  // Deterministic mock data for the selected quarter
  const cfdis: CFDIWithMonth[] = useMemo(() => {
    const qMap: Record<string, string[]> = {
      'Q1': ['ENERO', 'FEBRERO', 'MARZO'],
      'Q2': ['ABRIL', 'MAYO', 'JUNIO'],
      'Q3': ['JULIO', 'AGOSTO', 'SEPTIEMBRE'],
      'Q4': ['OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
    };
    
    const months = qMap[selectedQuarter] || qMap['Q1'];
    const quarterStartMonth = { 'Q1': 0, 'Q2': 3, 'Q3': 6, 'Q4': 9 }[selectedQuarter] || 0;
    
    return months.map((m, idx) => {
      const baseId = 29000 + (parseInt(selectedYear) % 100) * 100 + idx * 3;
      const baseAmount = 15000 + (idx * 5000) - (parseInt(selectedYear) % 5 * 1000);
      
      return {
        id: `F-${baseId}`,
        date: `${selectedYear}-${(idx + 1 + quarterStartMonth).toString().padStart(2, '0')}-05`,
        monthName: m,
        amount: baseAmount,
        status: 'VIGENTE'
      };
    });
  }, [selectedYear, selectedQuarter]);

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const generateRealisticXML = (cfdi: CFDIWithMonth) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante 
    xmlns:cfdi="http://www.sat.gob.mx/cfd/4" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"
    Version="4.0" 
    Serie="F" 
    Folio="${cfdi.id.split('-')[1]}" 
    Fecha="${cfdi.date}T10:45:22" 
    Sello="MTI0OTU4Njg5MA..."
    FormaPago="03" 
    NoCertificado="00001000000504465928"
    SubTotal="${cfdi.amount.toFixed(2)}" 
    Moneda="MXN" 
    Total="${(cfdi.amount * 1.16).toFixed(2)}" 
    TipoDeComprobante="I" 
    Exportacion="01" 
    MetodoPago="PUE" 
    LugarExpedicion="77710">
    <cfdi:Emisor Rfc="EKU9003173C9" Nombre="ESTRUCTURAS Y CONSTRUCCIONES RIVIERA S.A. DE C.V." RegimenFiscal="601"/>
    <cfdi:Receptor Rfc="GODE561231GR8" Nombre="RICARDO PEREZ" DomicilioFiscalReceptor="06700" RegimenFiscal="605" UsoCFDI="G03"/>
    <cfdi:Conceptos>
        <cfdi:Concepto 
            ClaveProdServ="80131500" 
            NoIdentificacion="RENTA-001" 
            Cantidad="1.00" 
            ClaveUnidad="E48" 
            Unidad="Servicio" 
            Descripcion="ARRENDAMIENTO DE UNIDAD PH-502 CORRESPONDIENTE AL MES DE ${cfdi.monthName} ${selectedYear}" 
            ValorUnitario="${cfdi.amount.toFixed(2)}" 
            Importe="${cfdi.amount.toFixed(2)}" 
            ObjetoImp="02">
            <cfdi:Impuestos>
                <cfdi:Traslados>
                    <cfdi:Traslado Base="${cfdi.amount.toFixed(2)}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="${(cfdi.amount * 0.16).toFixed(2)}"/>
                </cfdi:Traslados>
            </cfdi:Impuestos>
        </cfdi:Concepto>
    </cfdi:Conceptos>
    <cfdi:Complemento>
        <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" Version="1.1" UUID="550E8400-E29B-41D4-A716-446655440000" FechaTimbrado="${cfdi.date}T10:46:01" RfcProvCertif="SAT970701NN3"/>
    </cfdi:Complemento>
</cfdi:Comprobante>`;
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleDownload = () => {
    if (selectedIds.size === 0) return;
    const selectedCfdis = cfdis.filter(c => selectedIds.has(c.id));
    
    selectedCfdis.forEach((cfdi, index) => {
      // Simulate multiple downloads with slight delay to avoid browser blocking
      setTimeout(() => {
        const xmlContent = generateRealisticXML(cfdi);
        downloadFile(xmlContent, `CFDI_${cfdi.id}.xml`, 'text/xml');
        // Simulate a PDF download link (using a real sample PDF byte-stream simulation)
        downloadFile(`%PDF-1.4\n%... (Contenido PDF Simulado para ${cfdi.id})`, `FACTURA_${cfdi.id}.pdf`, 'application/pdf');
      }, index * 600);
    });
  };

  const handleVerPdf = () => {
    // Official SAT Sample PDF link for realistic viewing experience
    window.open('https://www.sat.gob.mx/cs/Satellite?blobcol=urldata&blobkey=id&blobtable=MungoBlobs&blobwhere=1461173514861&ssbinary=true', '_blank');
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500 pb-10 relative">
      {/* XML Modal Overlay */}
      {viewingXml && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl h-[80vh] rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Vista de Código XML</h4>
                <p className="text-[10px] text-slate-400 font-bold">ESTÁNDAR CFDI 4.0</p>
              </div>
              <button 
                onClick={() => setViewingXml(null)}
                className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-[#1e293b] font-mono text-[10px] leading-relaxed">
              <pre className="text-emerald-400 whitespace-pre-wrap">
                {viewingXml}
              </pre>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => {
                  downloadFile(viewingXml, 'cfdi_preview.xml', 'text/xml');
                  setViewingXml(null);
                }}
                className="bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-200"
              >
                DESCARGAR ARCHIVO XML
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-2 px-1">
        <div>
          <h3 className="text-lg font-black text-slate-900">Historial Fiscal</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {selectedYear} • {selectedQuarter}
          </p>
        </div>
        <button 
          onClick={handleDownload}
          disabled={selectedIds.size === 0}
          className={`text-[10px] font-black uppercase tracking-widest transition-all px-5 py-3 rounded-2xl ${
            selectedIds.size > 0 
              ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200 active:scale-95' 
              : 'bg-slate-100 text-slate-300 cursor-not-allowed'
          }`}
        >
          {selectedIds.size === 0 ? 'DESCARGAR' : `DESCARGAR (${selectedIds.size})`}
        </button>
      </div>
      
      {cfdis.map((cfdi) => {
        const isSelected = selectedIds.has(cfdi.id);
        return (
          <div 
            key={cfdi.id} 
            className={`
              bg-white p-5 rounded-[2.5rem] shadow-sm flex flex-col gap-4 transition-all border relative overflow-hidden
              ${isSelected ? 'border-emerald-500 shadow-lg ring-1 ring-emerald-500/10 scale-[1.01]' : 'border-slate-100'}
            `}
          >
            {isSelected && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 -z-0"></div>
            )}

            <div className="flex justify-between items-start relative z-10">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-50 text-emerald-500 shadow-inner' : 'bg-slate-50 text-slate-300'}`}>
                  <Icons.FileText />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-900 font-black text-base">{cfdi.id}</p>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded-lg">
                      {cfdi.monthName}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[10px] font-bold mt-0.5 uppercase tracking-widest">{cfdi.date}</p>
                </div>
              </div>
              
              <button 
                onClick={() => toggleSelection(cfdi.id)}
                className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${isSelected ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-200' : 'bg-white border-slate-200 hover:border-emerald-200'}
                `}
              >
                {isSelected && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="animate-in zoom-in duration-200">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            </div>
            
            <div className="flex justify-between items-end mt-2 relative z-10">
              <div>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Monto de Renta</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">
                  ${cfdi.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  <span className="text-[11px] text-slate-400 font-bold ml-1 uppercase">MXN</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleVerPdf}
                  className="px-5 py-3 rounded-2xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-200"
                >
                  VER PDF
                </button>
                <button 
                  onClick={() => setViewingXml(generateRealisticXML(cfdi))}
                  className="px-5 py-3 rounded-2xl border-2 border-slate-100 text-slate-900 text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:bg-slate-50 active:scale-95 bg-white"
                >
                  XML
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {cfdis.length === 0 && (
        <div className="py-24 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
             <Icons.FileText />
          </div>
          <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">Sin facturas emitidas</p>
        </div>
      )}

      <div className="mt-6 p-6 bg-emerald-50/30 rounded-[2.5rem] border border-dashed border-emerald-200/50">
        <div className="flex gap-4 items-start">
          <div className="text-emerald-500 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
          </div>
          <p className="text-[10px] font-bold text-emerald-800/70 leading-relaxed uppercase tracking-[0.05em]">
            Al hacer clic en <span className="text-emerald-900 font-black">Descargar</span>, se generará un archivo ZIP (o descarga múltiple) con los formatos oficiales XML y PDF requeridos para su declaración mensual ante el SAT.
          </p>
        </div>
      </div>
    </div>
  );
};
