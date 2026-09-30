import React from 'react';
import { StationData, DynamicStationETA } from '../types/railway';
import { Train, Check, AlertTriangle, ArrowRight, Eye } from 'lucide-react';

interface SimpleJourneyTrackProps {
  stations: StationData[];
  stationETAs: DynamicStationETA[];
  currentKm: number;
  totalDistanceKm: number;
  selectedStationId: string | null;
  onSelectStation: (stationId: string) => void;
  currentSpeedKmH: number;
  isHalted: boolean;
  onToggleDetailedView?: () => void;
  showDetailedView?: boolean;
}

export const SimpleJourneyTrack: React.FC<SimpleJourneyTrackProps> = ({
  stations,
  stationETAs,
  currentKm,
  totalDistanceKm,
  selectedStationId,
  onSelectStation,
  currentSpeedKmH,
  isHalted,
  onToggleDetailedView,
  showDetailedView = false,
}) => {
  // Primary key stations for the simplified journey visualization
  // (Focus on major corridor junctions so it's super clean and readable on any screen)
  const majorCodes = ['HYB', 'SC', 'KZJ', 'WL', 'BZA', 'KMT', 'NGP', 'BPL', 'NDLS'];
  const displayStations = stations.filter((s) => majorCodes.includes(s.code) || s.code === 'KMT');

  // Find current station and next station
  const currentStationIndex = stations.findIndex((s, idx) => {
    const nextS = stations[idx + 1];
    return currentKm >= s.distanceKm && (!nextS || currentKm < nextS.distanceKm);
  });
  const currentStation = stations[Math.max(0, currentStationIndex)] || stations[0];
  const nextStation = stations[Math.min(stations.length - 1, currentStationIndex + 1)] || stations[1];

  // Check if current section has active congestion or disruption
  const activeEta = stationETAs.find((e) => e.stationId === nextStation.id);
  const isSectionCongested = activeEta?.sectionClearance === 'congested';
  const isSectionCaution = activeEta?.sectionClearance === 'caution' || activeEta?.sectionClearance === 'maintenance';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Train Journey</span>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Live Corridor Track
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time train progression along the Grand Trunk route. Click any station node to inspect ETA details.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 ring-2 ring-cyan-200 animate-pulse" />
            <span>Current Train</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Next Station</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>Upcoming</span>
          </div>
          {onToggleDetailedView && (
            <button
              onClick={onToggleDetailedView}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 ml-2 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showDetailedView ? 'Hide Schematic' : 'View Full Schematic'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Railway Track Node Diagram */}
      <div className="overflow-x-auto py-4 scrollbar-thin">
        <div className="min-w-[760px] px-4">
          <div className="relative flex items-center justify-between">
            {/* Background Railway Track Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-slate-200 rounded-full -z-0">
              {/* Progress Line */}
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(0, (currentKm / totalDistanceKm) * 100))}%`,
                }}
              />
            </div>

            {/* Render Station Nodes */}
            {displayStations.map((station, idx) => {
              const eta = stationETAs.find((e) => e.stationCode === station.code);
              const isPassed = currentKm >= station.distanceKm + 2;
              const isTargetNext = nextStation.code === station.code;
              const isSelected = selectedStationId === station.id;
              const hasDelay = eta && eta.delayMinutes > 0 && !isPassed;

              return (
                <div
                  key={station.id}
                  onClick={() => onSelectStation(station.id)}
                  className="relative z-10 flex flex-col items-center cursor-pointer group select-none"
                  style={{ minWidth: '70px' }}
                >
                  {/* Top Station Code & Tag */}
                  <div className="mb-2 text-center">
                    <div
                      className={`text-xs font-bold font-mono tracking-tight transition-colors ${
                        isSelected
                          ? 'text-blue-700'
                          : isTargetNext
                          ? 'text-amber-800'
                          : isPassed
                          ? 'text-slate-600'
                          : 'text-slate-800'
                      }`}
                    >
                      {station.code}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 truncate max-w-[85px]">
                      {station.name.replace(' Jn', '').replace(' Deccan', '')}
                    </div>
                  </div>

                  {/* Circular Node Symbol */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                      isSelected
                        ? 'bg-blue-600 text-white ring-4 ring-blue-200 scale-110'
                        : isTargetNext
                        ? 'bg-amber-500 text-white ring-4 ring-amber-200 scale-110'
                        : isPassed
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border-2 border-slate-300 text-slate-500 group-hover:border-blue-500'
                    }`}
                  >
                    {isPassed ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : isTargetNext ? (
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    ) : (
                      <span className="text-[10px] font-mono">{idx + 1}</span>
                    )}
                  </div>

                  {/* Bottom ETA & Distance Information */}
                  <div className="mt-2 text-center">
                    <div className="text-[11px] font-mono font-bold text-slate-700">
                      {isPassed ? (
                        <span className="text-slate-400 font-normal">Passed</span>
                      ) : (
                        <span className="text-blue-700">
                          {eta?.predictedArrival || station.scheduledArrival}
                        </span>
                      )}
                    </div>

                    {hasDelay && (
                      <div className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1 rounded mt-0.5">
                        +{eta?.delayMinutes}m
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Train Current Location Highlight Card */}
      <div
        className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
          isSectionCongested
            ? 'bg-rose-50/70 border-rose-300 text-rose-950'
            : isSectionCaution
            ? 'bg-amber-50/70 border-amber-300 text-amber-950'
            : 'bg-blue-50/60 border-blue-200 text-blue-950'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 ${
              isSectionCongested ? 'bg-rose-600' : isSectionCaution ? 'bg-amber-600' : 'bg-blue-600'
            }`}
          >
            <Train className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold flex items-center gap-1.5">
              <span>Current Position:</span>
              <span className="font-mono text-sm">
                Km {Math.round(currentKm)} of {totalDistanceKm} km
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-semibold">
                Section: {currentStation.code} → {nextStation.code}
              </span>
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {isHalted
                ? 'Train temporarily halted at signal aspect / platform.'
                : isSectionCongested
                ? 'CAUTION: Section congestion detected. Operational speed reduced.'
                : 'Nominal block clearance. Approaching next scheduled station.'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold">
          <div>
            Speed: <span className="text-slate-900">{Math.round(currentSpeedKmH)} km/h</span>
          </div>
          <div>
            Next: <span className="text-blue-700">{nextStation.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
