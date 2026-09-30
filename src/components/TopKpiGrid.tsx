import React from 'react';
import {
  Train,
  MapPin,
  Gauge,
  Clock,
  ArrowRightCircle,
  CalendarCheck,
  ShieldCheck,
  AlertOctagon,
} from 'lucide-react';
import { TrainTelemetry, StationData } from '../types/railway';

interface TopKpiGridProps {
  telemetry: TrainTelemetry;
  currentLocationName: string;
  currentSpeedKmH: number;
  totalDelayMinutes: number;
  nextStation: StationData;
  nextStationETA: string;
  nextStationSTA: string;
  confidenceScore: number;
  activeEventsCount: number;
  onJumpToEvents?: () => void;
}

export const TopKpiGrid: React.FC<TopKpiGridProps> = ({
  telemetry,
  currentLocationName,
  currentSpeedKmH,
  totalDelayMinutes,
  nextStation,
  nextStationETA,
  nextStationSTA,
  confidenceScore,
  activeEventsCount,
  onJumpToEvents,
}) => {
  const isDelayed = totalDelayMinutes > 0;

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {/* 1. Current Train */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-medium tracking-wide">Current Train</span>
          <Train className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 tracking-tight truncate">
            {telemetry.trainNumber}
          </div>
          <div className="text-xs text-slate-500 truncate">{telemetry.trainName}</div>
        </div>
      </div>

      {/* 2. Current Location */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors col-span-2 sm:col-span-1 lg:col-span-1">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-medium tracking-wide">Current Location</span>
          <MapPin className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
            {currentLocationName}
          </div>
        </div>
      </div>

      {/* 3. Current Speed */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-medium tracking-wide">Current Speed</span>
          <Gauge className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="text-sm font-bold font-mono text-slate-900 tabular-nums">
            {Math.round(currentSpeedKmH)} <span className="text-xs font-normal text-slate-500">km/h</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            MPS {telemetry.maxPermissibleSpeedKmH} km/h
          </div>
        </div>
      </div>

      {/* 4. Current Delay */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-medium tracking-wide">Current Delay</span>
          <Clock
            className={`w-4 h-4 ${isDelayed ? 'text-amber-600' : 'text-emerald-600'}`}
          />
        </div>
        <div>
          <div
            className={`text-sm font-bold font-mono tabular-nums ${
              isDelayed ? 'text-amber-700' : 'text-emerald-700'
            }`}
          >
            {isDelayed ? `+${totalDelayMinutes} min` : 'On Time'}
          </div>
          <div className="text-[11px] text-slate-500">
            {isDelayed ? 'Behind Schedule' : 'Nominal Status'}
          </div>
        </div>
      </div>

      {/* 5. Next Station */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-medium tracking-wide">Next Station</span>
          <ArrowRightCircle className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>{nextStation.code}</span>
            <span className="text-[11px] font-normal text-slate-500 font-sans truncate">
              {nextStation.name.replace(' Jn', '')}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Distance: {nextStation.distanceKm} km
          </div>
        </div>
      </div>

      {/* 6. Next Station ETA */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-medium tracking-wide">Next Station ETA</span>
          <CalendarCheck className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="text-sm font-bold font-mono text-blue-700 tabular-nums">
            {nextStationETA}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            STA: {nextStationSTA}
          </div>
        </div>
      </div>

      {/* 7. Prediction Confidence */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-medium tracking-wide">Confidence</span>
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <div className="text-sm font-bold font-mono text-emerald-700 tabular-nums">
            {confidenceScore}%
          </div>
          <div className="text-[11px] text-slate-500">
            ±{((100 - confidenceScore) * 0.15 + 1.8).toFixed(1)}m Band
          </div>
        </div>
      </div>

      {/* 8. Active Events */}
      <div
        onClick={onJumpToEvents}
        className={`border rounded-xl p-3.5 flex flex-col justify-between cursor-pointer transition-all shadow-xs ${
          activeEventsCount > 0
            ? 'bg-amber-50 border-amber-200 text-amber-900 hover:border-amber-400'
            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-medium tracking-wide">Active Events</span>
          <AlertOctagon
            className={`w-4 h-4 ${
              activeEventsCount > 0 ? 'text-amber-600' : 'text-slate-400'
            }`}
          />
        </div>
        <div>
          <div
            className={`text-sm font-bold font-mono tabular-nums ${
              activeEventsCount > 0 ? 'text-amber-800' : 'text-slate-700'
            }`}
          >
            {activeEventsCount} Active
          </div>
          <div className="text-[11px] text-blue-600 hover:underline">
            Inspect Impact →
          </div>
        </div>
      </div>
    </section>
  );
};
