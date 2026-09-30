import React from 'react';
import { Train, Zap, Shield, Navigation, Users, Cpu } from 'lucide-react';
import { TrainTelemetry } from '../types/railway';

interface TrainStatusCardProps {
  telemetry: TrainTelemetry;
  currentKilometer: number;
  progressPercentage: number;
  totalDelay: number;
}

export const TrainStatusCard: React.FC<TrainStatusCardProps> = ({
  telemetry,
  currentKilometer,
  progressPercentage,
  totalDelay,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {telemetry.trainNumber} · {telemetry.trainName}
              </h2>
              <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                {telemetry.type}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              <span>{telemetry.zone}</span>
              <span className="mx-1.5 text-slate-300">·</span>
              <span>Division: {telemetry.division}</span>
              <span className="mx-1.5 text-slate-300">·</span>
              <span>Base: {telemetry.driverCrewBase}</span>
            </div>
          </div>
        </div>

        {/* Dispatch indicator */}
        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Punctuality Score</div>
            <div className="font-mono font-bold text-emerald-700 tabular-nums">
              {telemetry.onTimePunctualityIndex}% (30-day Avg)
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Scheduled Run</div>
            <div className="font-mono font-semibold text-slate-800">
              {telemetry.totalJourneyHours}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of technical details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-1 text-xs border-b border-slate-100">
        <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
          <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] text-slate-500">Loco & Shed</div>
            <div className="font-bold text-slate-900">{telemetry.locoClass}</div>
            <div className="text-[11px] font-mono text-slate-500">{telemetry.locoNumber}</div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
          <Users className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] text-slate-500">Rake Composition</div>
            <div className="font-bold text-slate-900">{telemetry.rakeComposition}</div>
            <div className="text-[11px] font-mono text-slate-500">CBC Couplers / EOG</div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
          <Navigation className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] text-slate-500">Traction & OHE</div>
            <div className="font-bold text-emerald-700">{telemetry.pantoStatus}</div>
            <div className="text-[11px] font-mono text-slate-500">Kavach TPWS Fitted</div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
          <Cpu className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] text-slate-500">Dispatch Priority</div>
            <div className="font-bold text-blue-900">Class 1 Coaching</div>
            <div className="text-[11px] font-mono text-slate-500">COA Block Section Priority</div>
          </div>
        </div>
      </div>

      {/* Corridor Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
          <span className="text-slate-700">
            Corridor Progress: <strong className="text-blue-700">{Math.round(currentKilometer)} km</strong> / {telemetry.totalDistanceKm} km
          </span>
          <span className="text-slate-500">
            {progressPercentage.toFixed(1)}% Completed
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
