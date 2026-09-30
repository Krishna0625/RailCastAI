import React from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import { DynamicStationETA } from '../types/railway';

interface PredictionConfidencePanelProps {
  confidenceScore: number;
  totalDelay: number;
  nextStationCode: string;
  stationETAs?: DynamicStationETA[];
  currentStationIndex?: number;
}

export const PredictionConfidencePanel: React.FC<PredictionConfidencePanelProps> = ({
  confidenceScore,
  totalDelay,
  nextStationCode,
  stationETAs = [],
  currentStationIndex = 0,
}) => {
  const confidenceBandMinutes = (100 - confidenceScore) * 0.15 + 1.8;

  // Upcoming stations slice
  const upcoming = stationETAs.slice(currentStationIndex + 1);

  const uncertaintyFactors = [
    {
      name: 'Block Headway & Section Capacity',
      status: 'High Certainty',
      risk: 'low',
      detail: 'SCR automatic double line block occupancy < 68%. Clean headway clear ahead.',
      score: 96,
    },
    {
      name: 'Junction Platform Interlocking',
      status: 'Moderate Variance',
      risk: 'medium',
      detail: 'Nagpur & Itarsi chord crossover routes experience freight convergence during afternoon dispatch.',
      score: 84,
    },
    {
      name: 'Locomotive Dynamic Performance',
      status: 'Nominal Condition',
      risk: 'low',
      detail: 'WAP-7 30215 regenerative traction system operating at 98.4% efficiency without thermal derating.',
      score: 98,
    },
    {
      name: 'Weather & Environmental Telemetry',
      status: 'Low Risk',
      risk: 'low',
      detail: 'Sensors monitor winter radiation inversion fog and rain adhesion along Northern trunk.',
      score: 92,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Prediction Confidence & Dynamic Uncertainty Bounds
            </h3>
            <p className="text-xs text-slate-500">
              Confidence decays with distance, stale GPS, and congestion; recovers when corridor normalizes
            </p>
          </div>
        </div>

        <div className="text-right">
          <div
            className={`text-sm font-bold font-mono tabular-nums ${
              confidenceScore >= 88
                ? 'text-emerald-700'
                : confidenceScore >= 75
                ? 'text-amber-700'
                : 'text-rose-700'
            }`}
          >
            {confidenceScore}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono font-medium">
            {confidenceScore >= 88 ? 'High Reliability' : confidenceScore >= 75 ? 'Moderate Uncertainty' : 'Degraded Confidence'}
          </div>
        </div>
      </div>

      {/* Primary Next Station Range Callout */}
      <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[11px] text-blue-900 font-medium">
            Dynamic Arrival Window at Next Station ({nextStationCode})
          </div>
          <div className="text-xs font-semibold text-slate-900 mt-0.5 font-mono">
            Estimated Window: <strong className="text-blue-700 font-bold">±{confidenceBandMinutes.toFixed(1)} mins</strong> (95% Confidence Band)
          </div>
        </div>
        <div
          className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${
            confidenceScore >= 88
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          {confidenceScore}% Confidence
        </div>
      </div>

      {/* Station-by-Station Confidence & Range Breakdown */}
      {upcoming.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Upcoming Station ETA, Range & Confidence</span>
            <span className="text-[10px] font-mono text-slate-400 font-normal">
              Showing next {Math.min(5, upcoming.length)} stops
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] text-slate-500 bg-slate-50">
                  <th className="py-2 px-2.5">Station</th>
                  <th className="py-2 px-2 text-blue-700 font-bold">Predicted ETA</th>
                  <th className="py-2 px-2 text-slate-700">Expected Range</th>
                  <th className="py-2 px-2 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {upcoming.slice(0, 5).map((st) => (
                  <tr key={st.stationCode} className="hover:bg-slate-50/80">
                    <td className="py-2 px-2.5 font-bold text-slate-900">
                      {st.stationCode} · <span className="font-normal font-sans text-slate-600">{st.stationName}</span>
                    </td>
                    <td className="py-2 px-2 font-bold text-blue-700">
                      {st.predictedArrival}
                    </td>
                    <td className="py-2 px-2 text-slate-700">
                      {st.expectedTimeRange}
                    </td>
                    <td className="py-2 px-2 text-right">
                      <span
                        className={`font-bold ${
                          st.confidenceScore >= 88
                            ? 'text-emerald-700'
                            : st.confidenceScore >= 75
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {st.confidenceScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Uncertainty Breakdown Drivers */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Ensemble Uncertainty Drivers
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {uncertaintyFactors.map((uf, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{uf.name}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold border ${
                    uf.risk === 'low'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {uf.score}%
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                {uf.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
