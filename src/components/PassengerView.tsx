import React, { useState } from 'react';
import { DynamicStationETA, StationData, TrainTelemetry, ExplainabilityFactor } from '../types/railway';
import {
  Train,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  Navigation,
  ArrowRight,
  Info,
  Smartphone,
  Bell,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface PassengerViewProps {
  telemetry: TrainTelemetry;
  currentLocationName: string;
  nextStation: StationData;
  nextStationETA: string;
  nextStationSTA: string;
  totalDelayMinutes: number;
  confidenceScore: number;
  stationETAs: DynamicStationETA[];
  explainabilityFactors: ExplainabilityFactor[];
  currentKilometer: number;
}

export const PassengerView: React.FC<PassengerViewProps> = ({
  telemetry,
  currentLocationName,
  nextStation,
  nextStationETA,
  nextStationSTA,
  totalDelayMinutes,
  confidenceScore,
  stationETAs,
  explainabilityFactors,
  currentKilometer,
}) => {
  // Let passenger choose their destination or stop to view
  const upcomingStops = stationETAs.filter((s) => s.status !== 'departed');
  const [selectedStationCode, setSelectedStationCode] = useState<string>(
    upcomingStops[0]?.stationCode || nextStation.code
  );

  const activeEta = stationETAs.find((s) => s.stationCode === selectedStationCode) || upcomingStops[0];

  // Derive plain-language delay reason from active simulation explainability factors
  let delayReason = 'Normal timetable running along clear automatic block section.';
  if (totalDelayMinutes > 0 && explainabilityFactors.length > 0) {
    const topReasons = explainabilityFactors
      .filter((f) => f.impactMinutes > 0)
      .slice(0, 2)
      .map((f) => f.name.toLowerCase());
    if (topReasons.length > 0) {
      delayReason = topReasons.join(' + ');
      // Capitalize first letter
      delayReason = delayReason.charAt(0).toUpperCase() + delayReason.slice(1);
    }
  }

  const isDelayed = activeEta?.delayMinutes > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mobile/Passenger Card Wrapper with Clean Light Theme */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Top Passenger Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-cyan-700 to-teal-700 text-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur rounded-xl border border-white/20">
                <Train className="w-8 h-8 text-cyan-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                    {telemetry.trainNumber} · {telemetry.trainName}
                  </h1>
                  <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">
                    Live Status
                  </span>
                </div>
                <p className="text-cyan-100 text-xs md:text-sm mt-0.5">
                  Hyderabad Deccan (HYB) → New Delhi (NDLS) · Superfast Coaching
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase text-cyan-200 font-mono tracking-wider block">
                Journey Progress
              </span>
              <span className="text-lg font-bold font-mono">
                {Math.round(currentKilometer)} / {telemetry.totalDistanceKm} km
              </span>
            </div>
          </div>

          {/* Current Location Pill */}
          <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-300 shrink-0" />
              <span>
                <strong>Current Location:</strong> {currentLocationName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-cyan-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-Time Ingestion</span>
            </div>
          </div>
        </div>

        {/* Passenger Primary Query Card */}
        <div className="p-6 space-y-6">
          {/* Station Selector Bar */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
              Select Your Station / Destination:
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {upcomingStops.map((st) => (
                <button
                  key={st.stationCode}
                  onClick={() => setSelectedStationCode(st.stationCode)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium shrink-0 transition-all ${
                    selectedStationCode === st.stationCode
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <div className="font-bold">{st.stationCode}</div>
                  <div className="text-[10px] opacity-80">{st.stationName.replace(' Jn', '')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Prominent ETA Showcase Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 md:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Next Destination
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  {activeEta?.stationName || nextStation.name} ({activeEta?.stationCode || nextStation.code})
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-slate-500 block">
                  Platform
                </span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {activeEta?.platform || nextStation.platform}
                </span>
              </div>
            </div>

            {/* 4 Core Passenger Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Predicted ETA */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block mb-0.5">
                  Predicted ETA
                </span>
                <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums">
                  {activeEta?.predictedArrival || nextStationETA}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Scheduled: {activeEta?.scheduledArrival || nextStationSTA}
                </div>
              </div>

              {/* Delay */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block mb-0.5">
                  Current Delay
                </span>
                <div
                  className={`text-2xl font-bold font-mono tabular-nums ${
                    isDelayed ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {isDelayed ? `+${activeEta?.delayMinutes} min` : 'On Time'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {isDelayed ? 'Running Late' : 'Right-Time Schedule'}
                </div>
              </div>

              {/* Expected Range */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block mb-0.5">
                  Expected Range
                </span>
                <div className="text-lg font-bold font-mono text-slate-800 tabular-nums pt-1">
                  {activeEta?.expectedTimeRange || '15:29 – 15:40'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  95% Confidence Interval
                </div>
              </div>

              {/* Confidence */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block mb-0.5">
                  Prediction Confidence
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
                  {activeEta?.confidenceScore || confidenceScore}%
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  High Reliability Mode
                </div>
              </div>
            </div>

            {/* Plain-Language Delay Reason Box */}
            <div className="p-3.5 rounded-lg border border-blue-200 bg-blue-50/70 text-xs text-blue-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-950">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Reason for Delay:</span>
              </div>
              <p className="text-blue-900 text-xs pl-5 font-sans leading-relaxed">
                {delayReason}
              </p>
            </div>
          </div>

          {/* Passenger Route Journey Stepper */}
          <div>
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Journey Milestones & Upcoming Stops
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {stationETAs.map((st) => {
                const isPassed = st.status === 'departed';
                const isCurrent = st.status === 'current';
                const isNext = st.status === 'next';

                return (
                  <div
                    key={st.stationCode}
                    className={`p-3.5 flex items-center justify-between text-xs transition-colors ${
                      isCurrent
                        ? 'bg-blue-50/60 font-semibold'
                        : isNext
                        ? 'bg-amber-50/40'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full shrink-0 ${
                          isPassed
                            ? 'bg-slate-400'
                            : isCurrent
                            ? 'bg-blue-600 ring-4 ring-blue-100'
                            : isNext
                            ? 'bg-amber-500'
                            : 'bg-slate-300'
                        }`}
                      />
                      <div>
                        <div className="font-bold text-slate-900">
                          {st.stationName} ({st.stationCode})
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {st.distanceKm} km · {st.platform}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="font-bold text-slate-900">
                        {st.predictedArrival}
                      </div>
                      <div className="text-[11px]">
                        {isPassed ? (
                          <span className="text-slate-400">Departed</span>
                        ) : st.delayMinutes > 0 ? (
                          <span className="text-amber-600 font-semibold">+{st.delayMinutes}m delay</span>
                        ) : (
                          <span className="text-emerald-600 font-semibold">On Time</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <span>
            RailCast AI · Passenger Information System (PIS) · Live Synchronized Stream
          </span>
          <span className="font-mono text-slate-600">
            SMS / WhatsApp Dispatch Lead: +45 mins
          </span>
        </div>
      </div>
    </div>
  );
};
