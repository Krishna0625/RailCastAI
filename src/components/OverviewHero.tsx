import React from 'react';
import { Train, Gauge, Clock, ArrowRightCircle, ShieldCheck } from 'lucide-react';
import { TrainTelemetry, StationData } from '../types/railway';

interface OverviewHeroProps {
  telemetry: TrainTelemetry;
  currentSpeedKmH: number;
  totalDelayMinutes: number;
  nextStation: StationData;
  confidenceScore: number;
}

export const OverviewHero: React.FC<OverviewHeroProps> = ({
  telemetry,
  currentSpeedKmH,
  totalDelayMinutes,
  nextStation,
  confidenceScore,
}) => {
  const isDelayed = totalDelayMinutes > 0;

  return (
    <div className="space-y-5">
      {/* Brand Title Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              SIH26028 · Ministry of Railways
            </span>
            <span className="text-xs text-slate-500 font-medium">Smart Automation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            RAILCAST AI
          </h1>
          <p className="text-base font-semibold text-blue-800">
            Dynamic & Explainable ETA Intelligence
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Real-time ETA prediction that adapts to operational events.
          </p>
        </div>

        {/* Train Identification Strip */}
        <div className="text-left md:text-right text-xs font-mono text-slate-600 bg-slate-100/80 px-3 py-2 rounded-lg border border-slate-200">
          <div>
            Route: <strong className="text-slate-900 font-bold">HYB → NDLS</strong> (1,677 km)
          </div>
          <div className="text-slate-500">
            Loco: <strong className="text-slate-700">WAP-7 #30245</strong> · South Central Railway
          </div>
        </div>
      </div>

      {/* 5 Simple KPI Cards with Large Readable Typography */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* KPI 1: TRAIN */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">TRAIN</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Train className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 tracking-tight">
              {telemetry.trainNumber}
            </div>
            <div className="text-xs font-medium text-slate-600 truncate mt-0.5">
              {telemetry.trainName}
            </div>
          </div>
        </div>

        {/* KPI 2: CURRENT SPEED */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">CURRENT SPEED</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
              {Math.round(currentSpeedKmH)}{' '}
              <span className="text-xs font-semibold text-slate-500">km/h</span>
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5 font-mono">
              MPS: {telemetry.maxPermissibleSpeedKmH} km/h
            </div>
          </div>
        </div>

        {/* KPI 3: CURRENT DELAY */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">CURRENT DELAY</span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isDelayed ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div
              className={`text-xl sm:text-2xl font-extrabold font-mono tabular-nums ${
                isDelayed ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              {isDelayed ? `+${totalDelayMinutes} min` : 'On Time'}
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              {isDelayed ? 'Delayed vs timetable' : 'Normal scheduled run'}
            </div>
          </div>
        </div>

        {/* KPI 4: NEXT STATION */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">NEXT STATION</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <ArrowRightCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
              {nextStation.name.replace(' Jn', '')}
            </div>
            <div className="text-xs font-mono text-slate-600 mt-0.5">
              Code: <strong className="text-blue-700">{nextStation.code}</strong> · {nextStation.distanceKm} km
            </div>
          </div>
        </div>

        {/* KPI 5: ETA CONFIDENCE */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">ETA CONFIDENCE</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-700 tabular-nums">
              {confidenceScore}%
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              {confidenceScore >= 90 ? 'High certainty' : confidenceScore >= 80 ? 'Moderate certainty' : 'Dynamic caution band'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
