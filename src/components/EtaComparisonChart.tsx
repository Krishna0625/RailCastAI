import React, { useState } from 'react';
import { DynamicStationETA, StationData } from '../types/railway';
import { TrendingDown, Info, ShieldCheck } from 'lucide-react';

interface EtaComparisonChartProps {
  stationETAs: DynamicStationETA[];
  stations: StationData[];
  currentStationIndex: number;
}

export const EtaComparisonChart: React.FC<EtaComparisonChartProps> = ({
  stationETAs,
  stations,
  currentStationIndex,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Chart Dimensions
  const width = 860;
  const height = 260;
  const padLeft = 45;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 45;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Max delay to scale Y axis (e.g. 0 to 45 mins)
  const maxDelay = Math.max(
    30,
    ...stationETAs.map((s) => Math.max(s.delayMinutes, s.staticNtesDelayMinutes))
  );

  const getX = (index: number) => {
    return padLeft + (index / (stationETAs.length - 1)) * chartW;
  };

  const getY = (delayMinutes: number) => {
    const clamped = Math.max(0, Math.min(delayMinutes, maxDelay));
    return padTop + chartH - (clamped / maxDelay) * chartH;
  };

  // Build path strings for:
  // 1) Scheduled timetable baseline (Y = 0)
  // 2) Traditional Static NTES line
  // 3) RailCast Dynamic Forecast line
  const timetablePoints = stationETAs.map((_, i) => `${getX(i)},${getY(0)}`).join(' ');
  const staticNtesPoints = stationETAs.map((s, i) => `${getX(i)},${getY(s.staticNtesDelayMinutes)}`).join(' ');
  const dynamicEtaPoints = stationETAs.map((s, i) => `${getX(i)},${getY(s.delayMinutes)}`).join(' ');

  // Dynamic recovery area fill (between static and dynamic)
  const recoveryAreaPath = `
    M ${getX(currentStationIndex)},${getY(stationETAs[currentStationIndex]?.staticNtesDelayMinutes || 0)}
    ${stationETAs
      .slice(currentStationIndex)
      .map((s, idx) => `L ${getX(currentStationIndex + idx)},${getY(s.staticNtesDelayMinutes)}`)
      .join(' ')}
    ${stationETAs
      .slice(currentStationIndex)
      .reverse()
      .map((s, idx) => {
        const trueIdx = stationETAs.length - 1 - idx;
        return `L ${getX(trueIdx)},${getY(s.delayMinutes)}`;
      })
      .join(' ')}
    Z
  `;

  const hoveredStation = hoveredIndex !== null ? stationETAs[hoveredIndex] : null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Corridor Delay Propagation & Dynamic Recovery Curve
          </h3>
          <p className="text-xs text-slate-500">
            Comparing Static Naive NTES (perpetual delay) vs RailCast AI Dynamic Timetable Recovery
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-400" />
            <span className="text-slate-600">Timetable STA (0m)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500 stroke-dashed" />
            <span className="text-rose-700 font-medium">Static NTES (+Delay)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-blue-600 rounded" />
            <span className="text-blue-700 font-bold">RailCast AI (Dynamic)</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[680px] h-[240px] select-none"
        >
          <defs>
            <linearGradient id="recoveryGradientLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal for minutes) */}
          {[0, 10, 20, 30].map((mins) => {
            const y = getY(mins);
            return (
              <g key={`grid-${mins}`}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={mins === 0 ? 'none' : '3 3'}
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  className="text-[10px] font-mono font-medium"
                >
                  +{mins}m
                </text>
              </g>
            );
          })}

          {/* Dynamic Recovery Shaded Area */}
          {recoveryAreaPath && (
            <path
              d={recoveryAreaPath}
              fill="url(#recoveryGradientLight)"
            />
          )}

          {/* Timetable Baseline (0 mins delay) */}
          <polyline
            points={timetablePoints}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Static NTES line (dashed rose) */}
          <polyline
            points={staticNtesPoints}
            fill="none"
            stroke="#e11d48"
            strokeWidth="2"
            strokeDasharray="5 4"
            opacity="0.85"
          />

          {/* RailCast Dynamic ETA line (solid blue) */}
          <polyline
            points={dynamicEtaPoints}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
          />

          {/* Station Markers */}
          {stationETAs.map((st, i) => {
            const x = getX(i);
            const yDynamic = getY(st.delayMinutes);
            const yStatic = getY(st.staticNtesDelayMinutes);
            const isCurrent = i === currentStationIndex;
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={`dot-${st.stationCode}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Vertical guideline */}
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={padTop + chartH}
                  stroke={isHovered ? '#3b82f6' : '#f1f5f9'}
                  strokeWidth={isHovered ? '1.5' : '1'}
                />

                {/* Static NTES dot */}
                <circle
                  cx={x}
                  cy={yStatic}
                  r="3"
                  fill="#e11d48"
                />

                {/* RailCast Dynamic dot */}
                <circle
                  cx={x}
                  cy={yDynamic}
                  r={isCurrent || isHovered ? '5' : '3.5'}
                  fill="#2563eb"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Station Code label */}
                <text
                  x={x}
                  y={height - padBottom + 16}
                  textAnchor="middle"
                  fill={isHovered ? '#1d4ed8' : isCurrent ? '#2563eb' : '#475569'}
                  className="text-[11px] font-mono font-bold"
                >
                  {st.stationCode}
                </text>

                <text
                  x={x}
                  y={height - padBottom + 28}
                  textAnchor="middle"
                  fill="#94a3b8"
                  className="text-[9px] font-mono"
                >
                  {st.distanceKm}k
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Details */}
        {hoveredStation && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">
                {hoveredStation.stationCode} · {hoveredStation.stationName} ({hoveredStation.distanceKm} km)
              </span>
              <span className="text-slate-500">
                Scheduled: {hoveredStation.scheduledArrival}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-rose-700 font-semibold">
                Static NTES: +{hoveredStation.staticNtesDelayMinutes}m
              </span>
              <span className="text-blue-700 font-bold">
                RailCast AI Dynamic: +{hoveredStation.delayMinutes}m (Predicted {hoveredStation.predictedArrival})
              </span>
              <span className="text-emerald-700 font-semibold">
                Recovery: -{hoveredStation.staticNtesDelayMinutes - hoveredStation.delayMinutes}m saved
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
