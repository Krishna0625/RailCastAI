import React from 'react';
import {
  TrainTelemetry,
  DynamicStationETA,
  SectionComparison,
  HistoricalSectionPerformance,
} from '../types/railway';
import {
  Zap,
  Gauge,
  Activity,
  TrendingDown,
  Layers,
  ShieldCheck,
  Cpu,
  BarChart2,
  Database,
} from 'lucide-react';
import { CurrentVsHistoricalCard } from './CurrentVsHistoricalCard';
import { HistoricalSectionTable } from './HistoricalSectionTable';

interface TrainAnalysisViewProps {
  telemetry: TrainTelemetry;
  stationETAs: DynamicStationETA[];
  currentSpeedKmH: number;
  currentKilometer: number;
  currentVsHistorical: SectionComparison;
  historicalSections: HistoricalSectionPerformance[];
  activeSectionIndex: number;
}

export const TrainAnalysisView: React.FC<TrainAnalysisViewProps> = ({
  telemetry,
  stationETAs,
  currentSpeedKmH,
  currentKilometer,
  currentVsHistorical,
  historicalSections,
  activeSectionIndex,
}) => {
  return (
    <div className="space-y-6">
      {/* Current vs Historical Section Comparison */}
      <CurrentVsHistoricalCard
        comparison={currentVsHistorical}
        historicalSection={historicalSections[activeSectionIndex]}
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Locomotive Telemetry */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              Locomotive Traction Telemetry
            </span>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
              OHE Nominal (25.4 kV)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500">Traction Motor Current</div>
              <div className="text-sm font-mono font-bold text-slate-900 tabular-nums">
                840 Amps
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <div className="text-[11px] text-emerald-800">Regenerative Braking</div>
              <div className="text-sm font-mono font-bold text-emerald-700 tabular-nums">
                +1,420 kWh
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500">Transformer Oil Temp</div>
              <div className="text-sm font-mono font-bold text-slate-800 tabular-nums">
                68.2 °C (Nominal)
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
              <div className="text-[11px] text-blue-800">Cab Signaling / Kavach</div>
              <div className="text-sm font-mono font-bold text-blue-900">
                Armed (0.9km MA)
              </div>
            </div>
          </div>
        </div>

        {/* Punctuality & Recovery Analytics */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              30-Day Corridor Punctuality
            </span>
            <span className="text-[10px] font-mono text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold">
              SCR / NCR Line 1
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <div className="text-[11px] text-emerald-800">Right-Time Arrival</div>
              <div className="text-sm font-mono font-bold text-emerald-700 tabular-nums">
                91.8%
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500">Average Section Delay</div>
              <div className="text-sm font-mono font-bold text-slate-900 tabular-nums">
                +8.4 mins
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
              <div className="text-[11px] text-blue-800">Dynamic Slack Recovery</div>
              <div className="text-sm font-mono font-bold text-blue-900 tabular-nums">
                12.6 mins avg
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <div className="text-[11px] text-emerald-800">NTES Error Reduction</div>
              <div className="text-sm font-mono font-bold text-emerald-700 tabular-nums">
                -74.2% MAE
              </div>
            </div>
          </div>
        </div>

        {/* Delay Attribution Decomposition */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Root-Cause Delay Attribution
            </span>
            <span className="text-[10px] font-mono text-slate-500">COA Root Factors</span>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-600 font-medium">Speed Restrictions / Track Work:</span>
                <span className="font-mono text-slate-900 font-bold">42%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-600 font-medium">Signal Precedence & Overtakes:</span>
                <span className="font-mono text-slate-900 font-bold">28%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-600 font-medium">Weather & Seasonal Fog:</span>
                <span className="font-mono text-slate-900 font-bold">18%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-600 font-medium">Platform Dwell Overruns:</span>
                <span className="font-mono text-slate-900 font-bold">12%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Section Performance Baseline Table */}
      <HistoricalSectionTable
        sections={historicalSections}
        activeSectionIndex={activeSectionIndex}
      />
    </div>
  );
};
