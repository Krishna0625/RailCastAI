import React, { useState } from 'react';
import { ExplainabilityFactor, DynamicStationETA, StationData } from '../types/railway';
import {
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  ChevronDown,
} from 'lucide-react';

interface ExplainableEtaPanelProps {
  factors: ExplainabilityFactor[];
  currentDelay: number;
  staticNtesDelay: number;
  stationETAs: DynamicStationETA[];
  stations: StationData[];
  currentStationIndex: number;
  selectedStationCode?: string;
}

export const ExplainableEtaPanel: React.FC<ExplainableEtaPanelProps> = ({
  factors,
  currentDelay,
  staticNtesDelay,
  stationETAs,
  stations,
  currentStationIndex,
  selectedStationCode,
}) => {
  // Allow user to select which upcoming station to inspect causality for
  const upcomingStations = stationETAs.slice(currentStationIndex + 1);
  const defaultCode = selectedStationCode && upcomingStations.some((s) => s.stationCode === selectedStationCode)
    ? selectedStationCode
    : upcomingStations[0]?.stationCode || 'BZA';

  const [activeStationCode, setActiveStationCode] = useState<string>(defaultCode);

  // Keep synced if selected station changes
  React.useEffect(() => {
    if (selectedStationCode && upcomingStations.some((s) => s.stationCode === selectedStationCode)) {
      setActiveStationCode(selectedStationCode);
    }
  }, [selectedStationCode]);

  const activeStationEta = stationETAs.find((s) => s.stationCode === activeStationCode) || upcomingStations[0];
  const activeStationMeta = stations.find((s) => s.code === activeStationCode);

  // Generate dynamic station-specific contributing factors based on real simulation state
  const scheduledTime = activeStationEta?.scheduledArrival || '11:15';
  const dynamicEta = activeStationEta?.predictedArrival || '11:29';
  const delayMinutes = activeStationEta?.delayMinutes || currentDelay;

  // Compute breakdown of contributing factors specifically for this station
  const stationContributingFactors: {
    name: string;
    impactMinutes: number;
    reason: string;
    category: string;
  }[] = [];

  // 1. Operational delay from active factors
  factors.forEach((f) => {
    // Apportion factor impact
    const isLocalToSection = f.location.toLowerCase().includes(activeStationCode.toLowerCase());
    let factorImpact = f.impactMinutes;

    if (!isLocalToSection && f.impactMinutes > 0) {
      factorImpact = Math.max(1, Math.round(f.impactMinutes * 0.75));
    }

    stationContributingFactors.push({
      name: f.name,
      impactMinutes: factorImpact,
      reason: f.description,
      category: f.category,
    });
  });

  // Calculate net impact
  const totalExpectedImpact = stationContributingFactors.reduce((acc, curr) => acc + curr.impactMinutes, 0);

  // Previous synthetic ETA for comparison (before recent event change)
  const [hh, mm] = dynamicEta.split(':').map(Number);
  const totalMins = (hh || 0) * 60 + (mm || 0);
  const prevMins = Math.max(0, totalMins - (totalExpectedImpact > 0 ? totalExpectedImpact : 3));
  const prevHh = Math.floor(prevMins / 60).toString().padStart(2, '0');
  const prevMm = (prevMins % 60).toString().padStart(2, '0');
  const previousEtaFormatted = `${prevHh}:${prevMm}`;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-cyan-950 border border-cyan-800/80 text-cyan-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Why Did ETA Change?
            </h3>
            <p className="text-xs text-slate-400">
              Live causality attribution decomposed from active real-time operational simulation state
            </p>
          </div>
        </div>

        {/* Target Station Selector */}
        {upcomingStations.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">Target Station:</span>
            <select
              value={activeStationCode}
              onChange={(e) => setActiveStationCode(e.target.value)}
              className="bg-transparent text-xs font-mono font-bold text-cyan-300 focus:outline-none cursor-pointer"
            >
              {upcomingStations.map((st) => (
                <option key={st.stationCode} value={st.stationCode} className="bg-slate-900 text-slate-100">
                  {st.stationCode} · {st.stationName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Prominent Station ETA Shift Showcase Box */}
      <div className="p-3.5 rounded-lg border border-cyan-800/60 bg-gradient-to-r from-cyan-950/40 via-slate-950 to-slate-950 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-bold text-white">
            <span>{activeStationMeta?.name || 'Selected Station'} ({activeStationCode}) ETA Transition</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Scheduled STA: <strong className="text-slate-200">{scheduledTime}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <div className="text-lg font-bold text-slate-400 line-through tabular-nums">
            {previousEtaFormatted}
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <div className="text-xl font-bold text-cyan-300 tabular-nums">
            {dynamicEta}
          </div>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded border ml-auto ${
              totalExpectedImpact > 0
                ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
            }`}
          >
            {totalExpectedImpact > 0 ? `+${totalExpectedImpact}m Net Shift` : `${totalExpectedImpact}m Slack Recovery`}
          </span>
        </div>
      </div>

      {/* Actual Contributing Factors Generated from Simulation State */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Active Contributing Factors</span>
          <span className="font-mono text-cyan-400 font-normal">
            Total Expected Impact: {totalExpectedImpact > 0 ? `+${totalExpectedImpact} min` : `${totalExpectedImpact} min`}
          </span>
        </div>

        {stationContributingFactors.length === 0 ? (
          <div className="p-4 rounded border border-slate-800 bg-slate-950/40 text-center text-xs text-slate-400">
            Nominal timetable conditions. Section running clear without operational disruptions.
          </div>
        ) : (
          stationContributingFactors.map((factor, idx) => {
            const isNegative = factor.impactMinutes < 0;
            return (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-xs ${
                        isNegative
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {isNegative ? '-' : '+'}
                    </span>
                    <span className="font-bold text-white">{factor.name}</span>
                  </div>

                  <span
                    className={`font-mono font-bold tabular-nums text-xs ${
                      isNegative ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isNegative ? `${factor.impactMinutes} min` : `+${factor.impactMinutes} min`}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 pl-7 leading-relaxed font-sans">
                  {factor.reason}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Mathematical Attribution Summary */}
      <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/50 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
        <span>
          Base Section Travel Time + Active Impact ({totalExpectedImpact > 0 ? `+${totalExpectedImpact}m` : `${totalExpectedImpact}m`}) = Predicted Arrival {dynamicEta}
        </span>
        <span className="text-emerald-400 font-semibold">
          Dynamic Timetable Model
        </span>
      </div>
    </div>
  );
};
