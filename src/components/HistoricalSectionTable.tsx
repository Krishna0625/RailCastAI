import React from 'react';
import { HistoricalSectionPerformance } from '../types/railway';
import { History, Activity, Database, CheckCircle2 } from 'lucide-react';

interface HistoricalSectionTableProps {
  sections: HistoricalSectionPerformance[];
  activeSectionIndex: number;
}

export const HistoricalSectionTable: React.FC<HistoricalSectionTableProps> = ({
  sections,
  activeSectionIndex,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Historical Section Performance · Baseline Repository
            </h3>
            <p className="text-xs text-slate-500">
              COA 180-day empirical telemetry used by the dynamic calculateETA() engine for section-by-section forecasting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Active In Forecasting Loop</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 border-collapse font-mono">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50">
              <th className="py-2.5 px-3">Route Block Section</th>
              <th className="py-2.5 px-2">Dist</th>
              <th className="py-2.5 px-2">Scheduled Run</th>
              <th className="py-2.5 px-2 text-blue-700 font-bold">Historical Avg Time</th>
              <th className="py-2.5 px-2 text-blue-700 font-bold">Historical Avg Speed</th>
              <th className="py-2.5 px-2 text-rose-700 font-bold">Historical Delay</th>
              <th className="py-2.5 px-2">Avg Station Dwell</th>
              <th className="py-2.5 px-2 text-center">LC Gates</th>
              <th className="py-2.5 px-2 text-center">Congestion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sections.map((sec, idx) => {
              const isActive = idx === activeSectionIndex;
              return (
                <tr
                  key={sec.sectionId}
                  className={`transition-colors ${
                    isActive ? 'bg-blue-50/70 text-slate-900 font-semibold' : 'hover:bg-slate-50/70'
                  }`}
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isActive ? 'bg-blue-600 ring-2 ring-blue-200' : 'bg-slate-300'
                      }`}
                    />
                    <span className="font-sans text-xs">{sec.sectionName}</span>
                  </td>
                  <td className="py-2.5 px-2 text-slate-500 tabular-nums">
                    {sec.distanceKm} km
                  </td>
                  <td className="py-2.5 px-2 text-slate-700 tabular-nums">
                    {sec.scheduledRunningTimeMins} mins
                  </td>
                  <td className="py-2.5 px-2 text-blue-700 font-bold tabular-nums">
                    {sec.historicalAvgTravelTimeMins} mins
                  </td>
                  <td className="py-2.5 px-2 text-blue-700 font-bold tabular-nums">
                    {sec.historicalAvgSpeedKmH} km/h
                  </td>
                  <td className="py-2.5 px-2 tabular-nums">
                    <span
                      className={
                        sec.historicalDelayMins < 0 ? 'text-emerald-700 font-bold' : 'text-rose-700'
                      }
                    >
                      {sec.historicalDelayMins < 0
                        ? `${sec.historicalDelayMins}m (Slack)`
                        : `+${sec.historicalDelayMins}m`}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-slate-700 tabular-nums">
                    {sec.avgStationDwellMins > 0 ? `${sec.avgStationDwellMins}m` : 'Pass'}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600">
                    {sec.levelCrossingCount}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        sec.congestionFactor > 1.15
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : sec.congestionFactor <= 1.0
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {sec.congestionFactor}x
                    </span>
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
