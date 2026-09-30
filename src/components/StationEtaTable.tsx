import React from 'react';
import { DynamicStationETA, StationData } from '../types/railway';
import { Clock, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck, Shield } from 'lucide-react';

interface StationEtaTableProps {
  stationETAs: DynamicStationETA[];
  stations: StationData[];
  selectedStationId: string | null;
  onSelectStation: (stationId: string) => void;
  currentKilometer: number;
}

export const StationEtaTable: React.FC<StationEtaTableProps> = ({
  stationETAs,
  stations,
  selectedStationId,
  onSelectStation,
  currentKilometer,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Station-wise Dynamic ETA & Uncertainty Intervals
            </h3>
            <span className="text-[10px] font-mono text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
              Predicted ETA = Current Time + Remaining Travel Time
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic section-by-section computation accounting for speed restrictions, historical speed, dwell buffers, and slack recovery
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-emerald-700 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Dynamic Timetable Recovery Active
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600 font-mono text-[11px] bg-slate-100/80">
              <th className="py-2.5 px-3">Station</th>
              <th className="py-2.5 px-2">Dist</th>
              <th className="py-2.5 px-2">Scheduled (STA/STD)</th>
              <th className="py-2.5 px-3 text-blue-700 font-bold">Predicted Arrival</th>
              <th className="py-2.5 px-2 text-slate-700">Expected Time Range</th>
              <th className="py-2.5 px-2">Predicted Delay</th>
              <th className="py-2.5 px-2 text-slate-500">Static NTES</th>
              <th className="py-2.5 px-2 text-center">Confidence</th>
              <th className="py-2.5 px-2 text-center">Status</th>
              <th className="py-2.5 px-2">PF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {stationETAs.map((item, idx) => {
              const stationMeta = stations[idx];
              const isSelected = selectedStationId === item.stationId;
              const isDeparted = item.status === 'departed';
              const isCurrent = item.status === 'current';
              const isNext = item.status === 'next';

              const delayDiff = item.staticNtesDelayMinutes - item.delayMinutes;
              const hasRecovery = delayDiff > 0 && !isDeparted;

              return (
                <tr
                  key={item.stationId}
                  onClick={() => onSelectStation(item.stationId)}
                  className={`cursor-pointer transition-colors group ${
                    isSelected
                      ? 'bg-blue-50/70 text-blue-900'
                      : isCurrent
                      ? 'bg-blue-50/40'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Station Name & Code */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isDeparted
                            ? 'bg-slate-400'
                            : isCurrent
                            ? 'bg-blue-600 ring-2 ring-blue-200'
                            : isNext
                            ? 'bg-amber-500'
                            : 'bg-slate-300'
                        }`}
                      />
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors flex items-center gap-1.5">
                          <span>{item.stationCode}</span>
                          <span className="font-normal font-sans text-slate-600 text-[11px]">
                            {item.stationName}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">
                          {stationMeta.zone} · {stationMeta.division} Div
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Distance */}
                  <td className="py-2.5 px-2 text-slate-500 tabular-nums">
                    {item.distanceKm} km
                  </td>

                  {/* Scheduled STA/STD */}
                  <td className="py-2.5 px-2 tabular-nums">
                    <div className="text-slate-800 font-medium">
                      {item.scheduledArrival === 'Source' ? '06:00 (Dep)' : item.scheduledArrival}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Dep: {item.scheduledDeparture}
                    </div>
                  </td>

                  {/* Predicted Arrival (Dynamic ETA) */}
                  <td className="py-2.5 px-3 tabular-nums">
                    <div className="font-bold text-blue-700 text-sm">
                      {item.predictedArrival}
                    </div>
                    {!isDeparted && item.predictedRemainingTravelTimeMins > 0 && (
                      <div className="text-[10px] text-slate-500">
                        +{Math.floor(item.predictedRemainingTravelTimeMins / 60)}h {item.predictedRemainingTravelTimeMins % 60}m run
                      </div>
                    )}
                  </td>

                  {/* Expected Time Range */}
                  <td className="py-2.5 px-2 tabular-nums">
                    {isDeparted ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <span className="text-slate-800 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        {item.expectedTimeRange}
                      </span>
                    )}
                  </td>

                  {/* Predicted Delay */}
                  <td className="py-2.5 px-2 tabular-nums font-semibold">
                    {isDeparted ? (
                      <span className="text-slate-400 text-[11px]">Departed</span>
                    ) : item.delayMinutes === 0 ? (
                      <span className="text-emerald-700">On Time</span>
                    ) : (
                      <div>
                        <span className="text-amber-700 font-bold">
                          +{item.delayMinutes}m
                        </span>
                        {hasRecovery && (
                          <div className="text-[10px] text-emerald-700 font-medium">
                            saves {delayDiff}m vs NTES
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Static NTES ETA */}
                  <td className="py-2.5 px-2 tabular-nums text-slate-500">
                    {isDeparted ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <span>+{item.staticNtesDelayMinutes}m</span>
                    )}
                  </td>

                  {/* Confidence */}
                  <td className="py-2.5 px-2 text-center tabular-nums font-bold">
                    {isDeparted ? (
                      <span className="text-slate-400">100%</span>
                    ) : (
                      <span
                        className={
                          item.confidenceScore >= 90
                            ? 'text-emerald-700'
                            : item.confidenceScore >= 80
                            ? 'text-blue-700'
                            : 'text-amber-700'
                        }
                      >
                        {item.confidenceScore}%
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-2 text-center">
                    {item.status === 'departed' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500">
                        Departed
                      </span>
                    ) : item.status === 'current' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 border border-blue-200 font-bold">
                        Approaching
                      </span>
                    ) : item.status === 'next' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 border border-amber-200 font-bold">
                        Next Stop
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">
                        En Route
                      </span>
                    )}
                  </td>

                  {/* Platform */}
                  <td className="py-2.5 px-2 text-slate-800 font-medium">
                    {item.platform}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
