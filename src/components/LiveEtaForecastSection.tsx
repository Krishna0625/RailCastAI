import React, { useState } from 'react';
import { DynamicStationETA, StationData } from '../types/railway';
import { Clock, ShieldCheck, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface LiveEtaForecastSectionProps {
  stationETAs: DynamicStationETA[];
  stations: StationData[];
  selectedStationId: string | null;
  onSelectStation: (stationId: string) => void;
  currentKilometer: number;
}

export const LiveEtaForecastSection: React.FC<LiveEtaForecastSectionProps> = ({
  stationETAs,
  stations,
  selectedStationId,
  onSelectStation,
  currentKilometer,
}) => {
  const [showAllStations, setShowAllStations] = useState<boolean>(false);

  // Filter to upcoming stations first, or show full timetable if expanded
  const upcomingStations = stationETAs.filter(
    (item) => item.status !== 'departed'
  );

  // Take top 4-5 next upcoming stations for the simplified evaluator view
  const displayItems = showAllStations
    ? stationETAs
    : upcomingStations.length > 0
    ? upcomingStations.slice(0, 5)
    : stationETAs.slice(0, 5);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Top Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Live ETA Forecast</span>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active Dynamic Prediction
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Continuously recalculated arrival times based on live speed, section capacity, and operational events.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAllStations((prev) => !prev)}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{showAllStations ? 'Show Next 5 Stops' : 'Show All Route Stations'}</span>
            {showAllStations ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Primary Table: Station | Scheduled | Predicted | Change | Confidence */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200 text-slate-600 text-xs sm:text-sm uppercase tracking-wider bg-slate-50/70 font-semibold">
              <th className="py-3 px-4">Station</th>
              <th className="py-3 px-3 text-slate-600">Scheduled</th>
              <th className="py-3 px-4 text-blue-800 font-bold">Predicted</th>
              <th className="py-3 px-3 text-slate-700">Change</th>
              <th className="py-3 px-4 text-center">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayItems.map((item, idx) => {
              const stationMeta = stations.find((s) => s.id === item.stationId) || stations[idx];
              const isSelected = selectedStationId === item.stationId;
              const isDeparted = item.status === 'departed';
              const isCurrent = item.status === 'current';
              const isNext = item.status === 'next';
              const isDelayed = item.delayMinutes > 0;

              return (
                <tr
                  key={item.stationId}
                  onClick={() => onSelectStation(item.stationId)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/80 text-blue-950 font-medium'
                      : isCurrent
                      ? 'bg-blue-50/40'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Station Name & Code */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-3 h-3 rounded-full shrink-0 ${
                          isDeparted
                            ? 'bg-slate-300'
                            : isCurrent
                            ? 'bg-blue-600 ring-4 ring-blue-100'
                            : isNext
                            ? 'bg-amber-500 ring-4 ring-amber-100'
                            : 'bg-slate-400'
                        }`}
                      />
                      <div>
                        <div className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                          <span>{item.stationName.replace(' Jn', '')}</span>
                          <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                            {item.stationCode}
                          </span>
                          {isNext && (
                            <span className="text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded">
                              Next Stop
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          Distance: {item.distanceKm} km · Platform {item.platform}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Scheduled STA */}
                  <td className="py-3.5 px-3">
                    <div className="text-sm sm:text-base font-semibold text-slate-700 font-mono tabular-nums">
                      {item.scheduledArrival === 'Source' ? '06:00 (Dep)' : item.scheduledArrival}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Timetable
                    </div>
                  </td>

                  {/* Predicted Arrival (Dynamic ETA) */}
                  <td className="py-3.5 px-4">
                    <div className="text-base sm:text-xl font-extrabold text-blue-700 font-mono tabular-nums">
                      {item.predictedArrival}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Range: {item.expectedTimeRange}
                    </div>
                  </td>

                  {/* Change vs Timetable */}
                  <td className="py-3.5 px-3">
                    {isDeparted ? (
                      <span className="text-xs text-slate-400 font-medium">Departed</span>
                    ) : item.delayMinutes === 0 ? (
                      <span className="text-sm sm:text-base font-bold text-emerald-700 font-mono">
                        On Time (0 min)
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-sm sm:text-base font-extrabold font-mono tabular-nums ${
                            isDelayed ? 'text-amber-700' : 'text-emerald-700'
                          }`}
                        >
                          {isDelayed ? `+${item.delayMinutes} min` : `${item.delayMinutes} min`}
                        </span>
                        {item.staticNtesDelayMinutes > item.delayMinutes && (
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Slack recovered
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Confidence Score */}
                  <td className="py-3.5 px-4 text-center">
                    {isDeparted ? (
                      <span className="text-xs text-slate-400 font-mono">100%</span>
                    ) : (
                      <div className="inline-flex flex-col items-center">
                        <span
                          className={`text-base sm:text-lg font-extrabold font-mono tabular-nums ${
                            item.confidenceScore >= 90
                              ? 'text-emerald-700'
                              : item.confidenceScore >= 80
                              ? 'text-blue-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {item.confidenceScore}%
                        </span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full ${
                              item.confidenceScore >= 90
                                ? 'bg-emerald-600'
                                : item.confidenceScore >= 80
                                ? 'bg-blue-600'
                                : 'bg-amber-600'
                            }`}
                            style={{ width: `${item.confidenceScore}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Helpful Evaluator Footnote */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <div>
          <span>Static NTES projects a fixed delay carry-forward; </span>
          <strong className="text-slate-700">RailCast AI adapts ETA to speed changes and section recovery slack.</strong>
        </div>
        <div className="text-blue-700 font-medium">
          Click any station row to inspect causality factors below ↓
        </div>
      </div>
    </div>
  );
};
