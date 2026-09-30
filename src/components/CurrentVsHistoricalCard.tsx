import React from 'react';
import { SectionComparison, HistoricalSectionPerformance } from '../types/railway';
import { Gauge, Clock, History, TrendingUp, TrendingDown, ArrowRight, ShieldCheck } from 'lucide-react';

interface CurrentVsHistoricalCardProps {
  comparison: SectionComparison;
  historicalSection?: HistoricalSectionPerformance;
}

export const CurrentVsHistoricalCard: React.FC<CurrentVsHistoricalCardProps> = ({
  comparison,
  historicalSection,
}) => {
  const isFaster = comparison.speedDifferenceKmH > 0;
  const timeSaved = comparison.travelTimeDifferenceMins < 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Current vs Historical Section Performance
            </h3>
            <p className="text-xs text-slate-500">
              Active block: <strong className="text-blue-700">{comparison.sectionName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md border ${
              comparison.status === 'faster'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : comparison.status === 'slower'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {comparison.status === 'faster'
              ? 'ABOVE HISTORICAL SPEED'
              : comparison.status === 'slower'
              ? 'BELOW HISTORICAL SPEED'
              : 'NOMINAL SECTION RUN'}
          </span>
        </div>
      </div>

      {/* Grid comparing Speed and Travel Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Speed Comparison */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <Gauge className="w-4 h-4 text-blue-600" />
              Section Speed Comparison
            </span>
            <span className="font-mono text-[11px] text-slate-500">km/h</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Current</div>
              <div className="text-base font-bold font-mono text-blue-700 tabular-nums">
                {comparison.currentSpeedKmH}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Historical</div>
              <div className="text-base font-bold font-mono text-slate-700 tabular-nums">
                {comparison.historicalAvgSpeedKmH}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Difference</div>
              <div
                className={`text-base font-bold font-mono tabular-nums ${
                  isFaster ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {isFaster ? `+${comparison.speedDifferenceKmH}` : `${comparison.speedDifferenceKmH}`}
              </div>
            </div>
          </div>
        </div>

        {/* Sectional Travel Time Comparison */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <Clock className="w-4 h-4 text-blue-600" />
              Sectional Travel Time
            </span>
            <span className="font-mono text-[11px] text-slate-500">Minutes</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Estimated</div>
              <div className="text-base font-bold font-mono text-blue-700 tabular-nums">
                {comparison.currentEstTravelTimeMins}m
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Historical</div>
              <div className="text-base font-bold font-mono text-slate-700 tabular-nums">
                {comparison.historicalTravelTimeMins}m
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Difference</div>
              <div
                className={`text-base font-bold font-mono tabular-nums ${
                  timeSaved ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {comparison.travelTimeDifferenceMins > 0
                  ? `+${comparison.travelTimeDifferenceMins}m`
                  : `${comparison.travelTimeDifferenceMins}m`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {historicalSection && (
        <div className="text-[11px] font-mono text-slate-600 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <span>
            Scheduled Section Run: <strong className="text-slate-900">{historicalSection.scheduledRunningTimeMins}m</strong> · Historical Avg Delay: <strong className="text-amber-700">+{historicalSection.historicalDelayMins}m</strong>
          </span>
          <span>
            Congestion Multiplier: <strong className="text-blue-700">{historicalSection.congestionFactor}x</strong> · Level Crossings: <strong className="text-slate-800">{historicalSection.levelCrossingCount}</strong>
          </span>
        </div>
      )}
    </div>
  );
};
