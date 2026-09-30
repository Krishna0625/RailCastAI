import React from 'react';
import { GpsStatus, WeatherState, DataQualityItem } from '../types/railway';
import { Radio, Database, Calendar, Activity, CloudSun, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

interface DataQualityMonitorProps {
  gpsStatus: GpsStatus;
  weatherState: WeatherState;
  operationalDisruptionsActive: boolean;
  onToggleGps: () => void;
}

export const DataQualityMonitor: React.FC<DataQualityMonitorProps> = ({
  gpsStatus,
  weatherState,
  operationalDisruptionsActive,
  onToggleGps,
}) => {
  const isGpsStale = gpsStatus === 'STALE';

  // Compute states for the 5 monitored data streams
  const dataStreams: DataQualityItem[] = [
    {
      source: 'GPS',
      status: isGpsStale ? 'STALE' : 'GOOD',
      detail: isGpsStale
        ? 'Loss of GNSS satellite lock. Dead reckoning fallback active.'
        : 'Active 3D Fix (NavIC / GPS Constellation, 12 Satellites).',
      latency: isGpsStale ? '> 180s (Stale)' : '420ms (Real-time)',
    },
    {
      source: 'Schedule',
      status: 'GOOD',
      detail: 'Crisp Indian Railways Master Timetable (SCR/CR/WCR/NCR/NR).',
      latency: 'Static Baseline',
    },
    {
      source: 'Historical Data',
      status: 'GOOD',
      detail: 'COA 180-day empirical sectional running times & dwell variance.',
      latency: 'Indexed (Local DB)',
    },
    {
      source: 'Operational Data',
      status: operationalDisruptionsActive ? 'PARTIAL' : 'GOOD',
      detail: operationalDisruptionsActive
        ? 'Active caution orders and junction interlocking constraints flagged.'
        : 'Automated block signaling feed nominal with zero active warnings.',
      latency: '1.2s Polling',
    },
    {
      source: 'Weather',
      status:
        weatherState === 'severe_weather'
          ? 'STALE'
          : weatherState === 'poor_visibility' || weatherState === 'rain'
          ? 'PARTIAL'
          : 'GOOD',
      detail:
        weatherState === 'severe_weather'
          ? 'High-wind / squall alerts active; speed ceilings enforced.'
          : weatherState === 'poor_visibility'
          ? 'Radiation fog alert; FOG Pass cab instrument mode active.'
          : weatherState === 'rain'
          ? 'Moderate rain telemetry reported.'
          : 'Fair meteorological conditions along Grand Trunk corridor.',
      latency: '5 min update',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Data Quality & Ingestion Stream Monitor
            </h3>
            <p className="text-xs text-slate-500">
              Health check across GNSS, Timetable Schedule, Historical Baseline, COA Operations, and Weather
            </p>
          </div>
        </div>

        {/* Fallback Mode Badge */}
        {isGpsStale ? (
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-3 py-1 rounded-lg text-xs font-mono font-bold text-amber-900 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>FALLBACK PREDICTION MODE ACTIVE</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-mono font-semibold text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>PRIMARY INGESTION NOMINAL</span>
          </div>
        )}
      </div>

      {/* Fallback Mode Architecture Explanation Box (When GPS is Stale) */}
      {isGpsStale && (
        <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/70 text-xs space-y-2">
          <div className="font-bold text-amber-950 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-700" />
            <span>Fallback Prediction Architecture Activated</span>
          </div>
          <p className="text-amber-900 text-xs leading-relaxed">
            Due to GNSS satellite loss, the forecasting engine automatically switched from live GPS positioning to dead reckoning heuristics:
          </p>
          <div className="p-2.5 rounded-lg bg-white border border-amber-200 font-mono text-xs text-slate-800 flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-900">Last Known Position</span>
            <span className="text-slate-400 font-bold">+</span>
            <span className="font-bold text-slate-900">Historical Section Performance</span>
            <span className="text-slate-400 font-bold">+</span>
            <span className="font-bold text-slate-900">Timetable Schedule</span>
            <span className="text-slate-400 font-bold">=</span>
            <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">Estimated Progress (-18% Conf)</span>
          </div>
        </div>
      )}

      {/* 5 Monitored Streams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
        {dataStreams.map((stream) => {
          const isGood = stream.status === 'GOOD';
          const isPartial = stream.status === 'PARTIAL';
          const isStale = stream.status === 'STALE';

          return (
            <div
              key={stream.source}
              className={`p-3.5 rounded-xl border transition-all ${
                isStale
                  ? 'bg-amber-50/60 border-amber-300 text-amber-950 shadow-xs'
                  : isPartial
                  ? 'bg-amber-50/30 border-amber-200 text-slate-800'
                  : 'bg-slate-50/70 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900">{stream.source}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                    isGood
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : isPartial
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {stream.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                {stream.detail}
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/70 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>Latency: {stream.latency}</span>
                {stream.source === 'GPS' && (
                  <button
                    onClick={onToggleGps}
                    className="text-blue-700 font-semibold hover:underline"
                  >
                    {isStale ? 'Restore' : 'Simulate Loss'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
