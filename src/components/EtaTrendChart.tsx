import React, { useState } from 'react';
import { EtaTrendPoint } from '../types/railway';
import { TrendingUp, Clock, Info, ShieldCheck, Activity } from 'lucide-react';

interface EtaTrendChartProps {
  trendPoints: EtaTrendPoint[];
  currentStationIndex: number;
}

export const EtaTrendChart: React.FC<EtaTrendChartProps> = ({
  trendPoints,
  currentStationIndex,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 860;
  const height = 280;
  const padLeft = 55;
  const padRight = 35;
  const padTop = 35;
  const padBottom = 45;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const allMinutes = trendPoints.flatMap((p) => [
    p.scheduledMinutes,
    p.previousPredictionMinutes,
    p.currentPredictionMinutes,
  ]);
  const minMins = Math.min(...allMinutes);
  const maxMins = Math.max(...allMinutes);
  const rangeMins = Math.max(60, maxMins - minMins);

  const getX = (index: number) => {
    return padLeft + (index / (trendPoints.length - 1)) * chartW;
  };

  const getY = (minutes: number) => {
    return padTop + chartH - ((minutes - minMins) / rangeMins) * chartH;
  };

  const scheduledPath = trendPoints.map((p, i) => `${getX(i)},${getY(p.scheduledMinutes)}`).join(' ');
  const previousPath = trendPoints.map((p, i) => `${getX(i)},${getY(p.previousPredictionMinutes)}`).join(' ');
  const currentPath = trendPoints.map((p, i) => `${getX(i)},${getY(p.currentPredictionMinutes)}`).join(' ');

  const hoveredItem = hoveredIdx !== null ? trendPoints[hoveredIdx] : null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
      {/* Header with mandatory model labeling */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Dynamic ETA Trend Forecast · Scheduled vs Previous vs Current Prediction
            </h3>
            <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold">
              Explainable Hybrid ETA Forecasting Model
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic section-by-section convergence as operational speed, caution orders, and headway evolve
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-slate-400 stroke-dashed" />
            <span className="text-slate-600">Scheduled ETA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-amber-500" />
            <span className="text-amber-700 font-medium">Previous Prediction</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-blue-600" />
            <span className="text-blue-700 font-bold">Current Prediction</span>
          </div>
        </div>
      </div>

      {/* Required Prototype Architecture Note */}
      <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg text-[11px] text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>
            Prototype uses an explainable simulation/statistical model. Production implementation can use trained ML models such as XGBoost or LightGBM.
          </span>
        </div>
        <span className="font-mono text-blue-700 font-semibold hidden sm:inline">
          Formula: Predicted ETA = Current Time + Predicted Remaining Travel Time
        </span>
      </div>

      {/* SVG Trend Chart */}
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[680px] h-[250px] select-none"
        >
          {/* Time horizontal guidelines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
            const m = minMins + ratio * rangeMins;
            const y = getY(m);
            const hh = Math.floor((m % 1440) / 60)
              .toString()
              .padStart(2, '0');
            const mm = Math.floor(m % 60)
              .toString()
              .padStart(2, '0');
            return (
              <g key={`y-grid-${ratio}`}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#94a3b8"
                  className="text-[10px] font-mono"
                >
                  {hh}:{mm}
                </text>
              </g>
            );
          })}

          {/* 1. Scheduled ETA line */}
          <polyline
            points={scheduledPath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* 2. Previous Prediction line */}
          <polyline
            points={previousPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.8"
            strokeDasharray="3 2"
          />

          {/* 3. Current Prediction line */}
          <polyline
            points={currentPath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
          />

          {/* Station Markers */}
          {trendPoints.map((item, i) => {
            const x = getX(i);
            const ySched = getY(item.scheduledMinutes);
            const yPrev = getY(item.previousPredictionMinutes);
            const yCurr = getY(item.currentPredictionMinutes);
            const isHovered = hoveredIdx === i;
            const isCurrent = i === currentStationIndex;

            return (
              <g
                key={`point-${item.stationCode}`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Vertical guideline on hover */}
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={padTop + chartH}
                  stroke={isHovered ? '#3b82f6' : '#f1f5f9'}
                  strokeWidth={isHovered ? '1.5' : '1'}
                />

                {/* Scheduled Dot */}
                <circle cx={x} cy={ySched} r="3" fill="#94a3b8" />

                {/* Previous Prediction Dot */}
                <circle cx={x} cy={yPrev} r="3" fill="#f59e0b" />

                {/* Current Prediction Dot */}
                <circle
                  cx={x}
                  cy={yCurr}
                  r={isHovered || isCurrent ? '5.5' : '4'}
                  fill="#2563eb"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Station Code label */}
                <text
                  x={x}
                  y={height - padBottom + 16}
                  textAnchor="middle"
                  fill={isHovered ? '#1d4ed8' : isCurrent ? '#2563eb' : '#64748b'}
                  className="text-[11px] font-mono font-bold"
                >
                  {item.stationCode}
                </text>

                <text
                  x={x}
                  y={height - padBottom + 28}
                  textAnchor="middle"
                  fill="#94a3b8"
                  className="text-[9px] font-mono"
                >
                  {item.distanceKm}k
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Details */}
        {hoveredItem && (
          <div className="p-3 rounded-lg bg-slate-50 border border-blue-200 text-xs font-mono text-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-900">
                {hoveredItem.stationCode} · {hoveredItem.stationName} ({hoveredItem.distanceKm} km)
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-600">
                Scheduled: <strong className="text-slate-900">{hoveredItem.scheduledTime}</strong>
              </span>
              <span className="text-amber-700">
                Previous: <strong>{hoveredItem.previousPredictionTime}</strong>
              </span>
              <span className="text-blue-700 font-bold">
                Current: <strong>{hoveredItem.currentPredictionTime}</strong>
              </span>
              <span
                className={`font-bold ${
                  hoveredItem.varianceDeltaMinutes < 0
                    ? 'text-emerald-700'
                    : hoveredItem.varianceDeltaMinutes > 0
                    ? 'text-rose-700'
                    : 'text-slate-500'
                }`}
              >
                {hoveredItem.varianceDeltaMinutes === 0
                  ? 'Stable'
                  : hoveredItem.varianceDeltaMinutes < 0
                  ? `${hoveredItem.varianceDeltaMinutes}m (Recovered)`
                  : `+${hoveredItem.varianceDeltaMinutes}m (Shifted)`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
