import React from 'react';
import { StationData, DynamicStationETA } from '../types/railway';
import { Train, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface RouteMapSchematicProps {
  stations: StationData[];
  stationETAs: DynamicStationETA[];
  currentKm: number;
  totalDistanceKm: number;
  selectedStationId: string | null;
  onSelectStation: (stationId: string) => void;
  currentSpeedKmH: number;
  isHalted: boolean;
  signalState?: 'green' | 'amber' | 'red';
}

export const RouteMapSchematic: React.FC<RouteMapSchematicProps> = ({
  stations,
  stationETAs,
  currentKm,
  totalDistanceKm,
  selectedStationId,
  onSelectStation,
  currentSpeedKmH,
  isHalted,
  signalState = 'green',
}) => {
  const svgWidth = 1320;
  const paddingX = 60;
  const trackY = 110;
  const usableWidth = svgWidth - paddingX * 2;

  // Station positions
  const stationCoords = stations.map((st, index) => {
    const fraction = st.distanceKm / totalDistanceKm;
    const cx = paddingX + fraction * usableWidth;
    return {
      ...st,
      index,
      cx,
      cy: trackY,
    };
  });

  // Calculate current train position along the track
  const currentFraction = Math.min(1, Math.max(0, currentKm / totalDistanceKm));
  const trainX = paddingX + currentFraction * usableWidth;
  const trainY = trackY;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
      {/* Schematic header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Schematic Line Diagram · South-Central to Northern Grand Trunk Route
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            Double Electrified 25kV AC · Kavach Equipped · Automatic Block Signaling
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Passed Section</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 ring-2 ring-cyan-200" />
            <span>Active Section</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>Scheduled Ahead</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Caution / Congestion</span>
          </div>
        </div>
      </div>

      {/* Track SVG Container with horizontal scroll for responsiveness */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <svg
          viewBox={`0 0 ${svgWidth} 200`}
          className="w-full min-w-[980px] h-[190px] select-none"
        >
          <defs>
            <linearGradient id="passedTrackLight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <filter id="trainShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* OHE Catenary Wire (Upper) */}
          <line
            x1={paddingX}
            y1={trackY - 24}
            x2={svgWidth - paddingX}
            y2={trackY - 24}
            stroke="#cbd5e1"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Catenary Mast Drop lines */}
          {Array.from({ length: 28 }).map((_, i) => {
            const mx = paddingX + (i / 27) * usableWidth;
            return (
              <g key={`mast-${i}`}>
                <line x1={mx} y1={trackY - 28} x2={mx} y2={trackY + 16} stroke="#e2e8f0" strokeWidth="1.5" />
                <circle cx={mx} cy={trackY - 24} r="1.5" fill="#94a3b8" />
              </g>
            );
          })}

          {/* Base Track Ballast Shadow */}
          <rect
            x={paddingX - 10}
            y={trackY - 14}
            width={usableWidth + 20}
            height="28"
            fill="#f8fafc"
            stroke="#e2e8f0"
            strokeWidth="1"
            rx="4"
          />

          {/* Track Sleepers (Cross-ties) */}
          {Array.from({ length: 80 }).map((_, i) => {
            const sx = paddingX + (i / 79) * usableWidth;
            const isPassed = sx <= trainX;
            return (
              <line
                key={`sleeper-${i}`}
                x1={sx}
                y1={trackY - 10}
                x2={sx}
                y2={trackY + 10}
                stroke={isPassed ? '#bfdbfe' : '#e2e8f0'}
                strokeWidth="2.5"
              />
            );
          })}

          {/* Unreached Track (Twin Rails) */}
          <line
            x1={paddingX}
            y1={trackY - 5}
            x2={svgWidth - paddingX}
            y2={trackY - 5}
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1={paddingX}
            y1={trackY + 5}
            x2={svgWidth - paddingX}
            y2={trackY + 5}
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Passed Track (Lit with Blue Gradient) */}
          <line
            x1={paddingX}
            y1={trackY - 5}
            x2={trainX}
            y2={trackY - 5}
            stroke="url(#passedTrackLight)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1={paddingX}
            y1={trackY + 5}
            x2={trainX}
            y2={trackY + 5}
            stroke="url(#passedTrackLight)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Dynamic Caution, Congestion & Maintenance Zones on Track */}
          {stationETAs.map((eta) => {
            const isCongested = eta.sectionClearance === 'congested';
            const isCaution = eta.sectionClearance === 'caution';
            const isMaint = eta.sectionClearance === 'maintenance';

            if (isCongested || isCaution || isMaint) {
              const matchedCoord = stationCoords.find((c) => c.code === eta.stationCode);
              if (!matchedCoord) return null;
              return (
                <g key={`zone-${eta.stationCode}`}>
                  <rect
                    x={matchedCoord.cx - 40}
                    y={trackY - 14}
                    width="80"
                    height="28"
                    fill={
                      isCongested
                        ? 'rgba(239, 68, 68, 0.15)'
                        : isMaint
                        ? 'rgba(245, 158, 11, 0.18)'
                        : 'rgba(245, 158, 11, 0.15)'
                    }
                    stroke={isCongested ? '#ef4444' : isMaint ? '#f59e0b' : '#eab308'}
                    strokeWidth={isCongested ? '1.5' : '1'}
                    strokeDasharray={isMaint ? '4 2' : '3 3'}
                    rx="4"
                  />
                  <text
                    x={matchedCoord.cx}
                    y={trackY - 18}
                    textAnchor="middle"
                    fill={isCongested ? '#dc2626' : '#d97706'}
                    className="text-[8.5px] font-mono font-bold uppercase tracking-wider"
                  >
                    {isCongested ? 'CONGESTION' : isMaint ? 'MAINT BLOCK' : 'CAUTION'}
                  </text>
                </g>
              );
            }
            return null;
          })}

          {/* Station Nodes */}
          {stationCoords.map((st, i) => {
            const eta = stationETAs[i];
            const isSelected = selectedStationId === st.id;
            const isPassed = currentKm >= st.distanceKm + 1;
            const isNext = eta?.status === 'next';
            const isCurrent = eta?.status === 'current';
            const hasCaution = eta?.sectionClearance === 'caution' || eta?.sectionClearance === 'maintenance';

            const isTopLabel = i % 2 === 0;
            const labelY = isTopLabel ? trackY - 38 : trackY + 44;
            const kmY = isTopLabel ? trackY - 54 : trackY + 62;

            let signalFill = '#10b981';
            if (hasCaution) signalFill = '#f59e0b';
            else if (eta?.sectionClearance === 'congested') signalFill = '#ef4444';

            return (
              <g
                key={st.id}
                onClick={() => onSelectStation(st.id)}
                className="cursor-pointer group"
              >
                {/* Station Pillar / Marker line */}
                <line
                  x1={st.cx}
                  y1={trackY - 18}
                  x2={st.cx}
                  y2={trackY + 18}
                  stroke={isSelected ? '#2563eb' : isPassed ? '#3b82f6' : '#cbd5e1'}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />

                {/* Junction circle */}
                <circle
                  cx={st.cx}
                  cy={trackY}
                  r={st.isJunction ? 9 : 6.5}
                  fill={
                    isSelected
                      ? '#2563eb'
                      : isPassed
                      ? '#60a5fa'
                      : isCurrent
                      ? '#0284c7'
                      : '#ffffff'
                  }
                  stroke={
                    isSelected
                      ? '#1e3a8a'
                      : hasCaution
                      ? '#f59e0b'
                      : isPassed
                      ? '#2563eb'
                      : isNext
                      ? '#0284c7'
                      : '#94a3b8'
                  }
                  strokeWidth={st.isJunction ? 2.5 : 2}
                  className="transition-all group-hover:scale-125"
                />

                {/* Signal Light at Junction Station */}
                {st.isJunction && (
                  <circle
                    cx={st.cx + 9}
                    cy={trackY - 12}
                    r={3.5}
                    fill={signalFill}
                    stroke="#ffffff"
                    strokeWidth={1}
                  >
                    <title>{`Automatic Signal: ${hasCaution ? 'Caution' : 'Clear'}`}</title>
                  </circle>
                )}

                {/* Station Code and Name */}
                <text
                  x={st.cx}
                  y={labelY}
                  textAnchor="middle"
                  fill={isSelected ? '#1d4ed8' : isPassed ? '#64748b' : isNext ? '#0284c7' : '#1e293b'}
                  className="text-[12px] font-bold tracking-wider font-mono transition-colors group-hover:fill-blue-600"
                >
                  {st.code}
                </text>

                <text
                  x={st.cx}
                  y={labelY + (isTopLabel ? 12 : -14)}
                  textAnchor="middle"
                  fill="#64748b"
                  className="text-[10px] font-medium"
                >
                  {st.name.replace(' Jn', '').replace(' Deccan', '').replace(' Cantt', '')}
                </text>

                {/* Distance marker */}
                <text
                  x={st.cx}
                  y={kmY}
                  textAnchor="middle"
                  fill="#94a3b8"
                  className="text-[9px] font-mono"
                >
                  {st.distanceKm} km
                </text>

                {/* Delay badge tag if late */}
                {eta && eta.delayMinutes > 0 && !isPassed && (
                  <g>
                    <rect
                      x={st.cx - 18}
                      y={isTopLabel ? trackY - 74 : trackY + 68}
                      width="36"
                      height="14"
                      rx="3"
                      fill="#fff1f2"
                      stroke="#f43f5e"
                      strokeWidth="0.8"
                    />
                    <text
                      x={st.cx}
                      y={isTopLabel ? trackY - 64 : trackY + 78}
                      textAnchor="middle"
                      fill="#e11d48"
                      className="text-[9px] font-mono font-bold"
                    >
                      +{eta.delayMinutes}m
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Animated Moving Train Icon along the track */}
          <g
            transform={`translate(${trainX}, ${trainY})`}
            className="transition-transform duration-300"
            filter="url(#trainShadow)"
          >
            {/* Outer radar pulse */}
            <circle cx="0" cy="0" r="18" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" opacity="0.6">
              <animate attributeName="r" values="12;24;12" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.5s" repeatCount="indefinite" />
            </circle>

            {/* Locomotive Casing */}
            <rect
              x="-18"
              y="-11"
              width="36"
              height="22"
              rx="4"
              fill="#1d4ed8"
              stroke="#ffffff"
              strokeWidth="2"
            />

            {/* Headlight beam */}
            <polygon
              points="18,-6 48,-14 48,14 18,6"
              fill="rgba(59, 130, 246, 0.2)"
            />

            {/* Locomotive Cab Windshield */}
            <rect x="7" y="-7" width="7" height="14" rx="1.5" fill="#93c5fd" />

            {/* Locomotive Number */}
            <text
              x="-2"
              y="3"
              textAnchor="middle"
              fill="#ffffff"
              className="text-[8px] font-mono font-bold"
            >
              12723
            </text>

            {/* Status indicator pip */}
            <circle
              cx="14"
              cy="-6"
              r="2.5"
              fill={signalState === 'red' ? '#ef4444' : signalState === 'amber' ? '#f59e0b' : '#10b981'}
            />

            {/* Cab signal indicator alert if halted or caution */}
            {signalState !== 'green' && (
              <g transform="translate(0, -22)">
                <rect
                  x="-26"
                  y="-8"
                  width="52"
                  height="13"
                  rx="2"
                  fill="#ffffff"
                  stroke={signalState === 'red' ? '#ef4444' : '#f59e0b'}
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="2"
                  textAnchor="middle"
                  fill={signalState === 'red' ? '#dc2626' : '#d97706'}
                  className="text-[7.5px] font-mono font-bold"
                >
                  {signalState === 'red' ? 'SIGNAL RED' : 'CAUTION'}
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Selected Station or Current Run Summary Footnote */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>
            {selectedStationId
              ? `Selected Station: ${stations.find((s) => s.id === selectedStationId)?.name} (${selectedStationId}) · Section headway nominal.`
              : `Click any station node along the route schematic to inspect section headway, platform, and buffer recovery.`}
          </span>
        </div>
        <div className="font-mono text-blue-700 font-semibold">
          Section MPS: 130 km/h · Grand Trunk Route #1
        </div>
      </div>
    </div>
  );
};
