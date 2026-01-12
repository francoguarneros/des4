
import React, { useState, useRef, useEffect } from 'react';
import { COLORS } from '../constants';

interface LineChartProps {
  data: number[];
  labels: string[]; // These are the display labels for the X-axis, potentially with empty strings
  onHover?: (value: number | null, index: number | null) => void;
}

export const LineChart: React.FC<LineChartProps> = ({ data, labels, onHover }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 1000; 
  const height = 600; 
  const padding = 35; 
  const bottomPadding = 100; 
  const max = Math.max(...data) * 1.05; 
  
  const chartWidth = width - 2 * padding;
  const chartHeight = height - bottomPadding - padding;

  // Calculate all points
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * chartWidth + padding;
    const y = (height - bottomPadding) - ((val / max) * chartHeight + padding);
    return { x, y, val };
  });

  // Smooth path generation
  const pathD = points.reduce((acc, p, i, a) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = a[i - 1];
    const cp1x = prev.x + (p.x - prev.x) * 0.35;
    const cp2x = p.x - (p.x - prev.x) * 0.35;
    return `${acc} C ${cp1x} ${prev.y}, ${cp2x} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - bottomPadding} L ${points[0].x} ${height - bottomPadding} Z`;

  const handleInteraction = (clientX: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const xRel = (clientX - rect.left) * (width / rect.width);
    
    // Find nearest index
    const step = chartWidth / (data.length - 1);
    const index = Math.round((xRel - padding) / step);
    
    if (index >= 0 && index < data.length) {
      if (index !== activeIndex) {
        setActiveIndex(index);
        onHover?.(data[index], index);
      }
    }
  };

  const onMouseMove = (e: React.MouseEvent) => handleInteraction(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    handleInteraction(e.touches[0].clientX);
  };
  
  const clearActive = () => {
    setActiveIndex(null);
    onHover?.(null, null);
  };

  const activePoint = activeIndex !== null ? points[activeIndex] : null;

  return (
    <div className="w-full h-full overflow-hidden flex items-center touch-none">
      <svg 
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-auto cursor-crosshair" 
        preserveAspectRatio="none"
        onMouseMove={onMouseMove}
        onMouseLeave={clearActive}
        onTouchMove={onTouchMove}
        onTouchEnd={clearActive}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.emerald} stopOpacity="0.4" />
            <stop offset="100%" stopColor={COLORS.emerald} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1={padding}
            y1={padding + p * chartHeight}
            x2={width - padding}
            y2={padding + p * chartHeight}
            stroke="#f1f5f9"
            strokeWidth="2"
          />
        ))}

        <path d={areaD} fill="url(#areaGradient)" />
        <path d={pathD} fill="none" stroke={COLORS.emerald} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Crosshair / Target */}
        {activePoint && (
          <g>
            <line 
              x1={activePoint.x} y1={padding} 
              x2={activePoint.x} y2={height - bottomPadding} 
              stroke={COLORS.navy} strokeWidth="2" strokeDasharray="8,8" opacity="0.3" 
            />
            <line 
              x1={padding} y1={activePoint.y} 
              x2={width - padding} y2={activePoint.y} 
              stroke={COLORS.navy} strokeWidth="2" strokeDasharray="8,8" opacity="0.3" 
            />
            <circle 
              cx={activePoint.x} cy={activePoint.y} r="14" 
              fill="white" stroke={COLORS.emerald} strokeWidth="6" 
            />
          </g>
        )}

        {/* Labels */}
        {labels.map((label, i) => {
          if (!label) return null;
          const x = (i / (labels.length - 1)) * (width - 2 * padding) + padding;
          return (
            <text 
              key={i} 
              x={x} 
              y={height - 20} 
              textAnchor="middle" 
              fill="#94a3b8" 
              fontSize="38" 
              className="font-black tracking-tighter"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

interface DonutChartProps {
  percentage: number;
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ percentage, size = 200 }) => {
  const strokeWidth = size * 0.12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-slate-100"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-emerald-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute text-center">
        <span className="block text-3xl font-bold text-slate-900 leading-none">{percentage}%</span>
        <span className="text-[8px] uppercase font-black tracking-widest text-slate-400 mt-1 block">OCUPACIÓN</span>
      </div>
    </div>
  );
};
