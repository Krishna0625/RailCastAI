import React, { useState } from 'react';
import {
  BarChart2,
  TrendingDown,
  TrendingUp,
  Activity,
  ShieldCheck,
  Clock,
  Layers,
  Info,
  CheckCircle2,
  Gauge,
  ScatterChart,
} from 'lucide-react';
import { ModelEvaluationMetrics } from '../types/railway';
import { HISTORICAL_SECTION_PERFORMANCE } from '../data/telanganaExpress';

interface NetworkAnalyticsViewProps {
  totalDelayMinutes: number;
}

export const NetworkAnalyticsView: React.FC<NetworkAnalyticsViewProps> = ({
  totalDelayMinutes,
}) => {
  const metrics: ModelEvaluationMetrics = {
    maeMinutes: 3.2,
    rmseMinutes: 4.6,
    within5MinPct: 91.4,
    within10MinPct: 98.2,
    averageConfidencePct: 88.5,
    predictionLatencyMs: 420,
  };

  // Section error dataset
  const sectionErrors = [
    { section: 'HYB-SC', error: 0.8 },
    { section: 'SC-KZJ', error: 1.4 },
    { section: 'KZJ-WL', error: 0.6 },
    { section: 'WL-BZA', error: 3.8 },
    { section: 'BZA-KMT', error: 2.9 },
    { section: 'KMT-NGP', error: 4.1 },
    { section: 'NGP-ET', error: 5.2 },
    { section: 'ET-BPL', error: 1.8 },
    { section: 'BPL-VGLJ', error: 3.4 },
    { section: 'VGLJ-AGC', error: 2.1 },
    { section: 'AGC-NDLS', error: 4.7 },
  ];

  // Chart 4: ETA changes over journey timeline (t = 0 to 24h)
  const etaConvergence = [
    { hour: '0h', predictedArrival: 10.8, staticArrival: 11.6, actualArrival: 10.5 },
    { hour: '4h', predictedArrival: 10.7, staticArrival: 11.5, actualArrival: 10.5 },
    { hour: '8h', predictedArrival: 10.9, staticArrival: 11.9, actualArrival: 10.5 },
    { hour: '12h', predictedArrival: 10.6, staticArrival: 11.7, actualArrival: 10.5 },
    { hour: '16h', predictedArrival: 10.5, staticArrival: 11.8, actualArrival: 10.5 },
    { hour: '20h', predictedArrival: 10.5, staticArrival: 11.8, actualArrival: 10.5 },
    { hour: '24h', predictedArrival: 10.5, staticArrival: 11.8, actualArrival: 10.5 },
  ];

  // Chart 5: Confidence vs Prediction Error points (Confidence 70-98 vs Error 0-6m)
  const confidenceErrorPoints = [
    { confidence: 98, error: 0.4, station: 'SC' },
    { confidence: 96, error: 0.8, station: 'KZJ' },
    { confidence: 95, error: 1.1, station: 'WL' },
    { confidence: 91, error: 2.2, station: 'BZA' },
    { confidence: 88, error: 2.8, station: 'KMT' },
    { confidence: 85, error: 3.5, station: 'NGP' },
    { confidence: 82, error: 4.2, station: 'ET' },
    { confidence: 86, error: 2.6, station: 'BPL' },
    { confidence: 84, error: 3.1, station: 'VGLJ' },
    { confidence: 88, error: 2.4, station: 'AGC' },
    { confidence: 80, error: 4.6, station: 'NDLS' },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Header & Prominent Prototype Disclaimer */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                RailCast AI Model Evaluation & Network Analytics
              </h2>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full">
                SIMULATED PROTOTYPE METRICS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical validation across Grand Trunk corridor: Error residuals, convergence trajectories, and sectional running times
            </p>
          </div>
        </div>

        {/* Required Mandatory Labeling */}
        <div className="p-3 bg-amber-50/80 border border-amber-200 text-amber-900 rounded-xl text-xs max-w-md">
          <div className="font-bold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>SIMULATED PROTOTYPE METRICS</span>
          </div>
          <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
            The figures below represent simulated evaluation metrics for the hackathon prototype. Do not claim these are official Indian Railways live operational statistics.
          </p>
        </div>
      </div>

      {/* The 6 Core Model Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* MAE */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            MAE (Mean Abs Error)
          </div>
          <div className="text-2xl font-bold font-mono text-blue-700 mt-1">
            {metrics.maeMinutes} min
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
            vs 18.6m Static NTES
          </div>
        </div>

        {/* RMSE */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            RMSE (Root Mean Sq)
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {metrics.rmseMinutes} min
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Penalizes outlier shocks
          </div>
        </div>

        {/* Within ±5 min */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Within ±5 min
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {metrics.within5MinPct}%
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
            High Precision Band
          </div>
        </div>

        {/* Within ±10 min */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Within ±10 min
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {metrics.within10MinPct}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Commercial tolerance
          </div>
        </div>

        {/* Average Confidence */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Average Confidence
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {metrics.averageConfidencePct}%
          </div>
          <div className="text-[10px] text-blue-700 mt-0.5">
            Ensemble certainty
          </div>
        </div>

        {/* Prediction Latency */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Update Latency
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-1">
            {metrics.predictionLatencyMs} ms
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Sub-second reactive cycle
          </div>
        </div>
      </div>

      {/* 5 Requested SVG Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Predicted vs Actual Arrival */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                1. Predicted vs Actual Arrival Times
              </h3>
              <p className="text-[11px] text-slate-500">
                Near 1:1 diagonal alignment showcasing minimal residual deviation
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-2.5 h-0.5 bg-slate-300 stroke-dashed" /> Ideal Line
              </span>
              <span className="flex items-center gap-1 text-blue-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Predictions
              </span>
            </div>
          </div>

          <svg viewBox="0 0 450 200" className="w-full h-[180px]">
            {/* Diagonal 45-deg line */}
            <line x1="40" y1="160" x2="420" y2="20" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Station scatter dots */}
            {[
              { pred: 50, act: 52, name: 'HYB' },
              { pred: 75, act: 76, name: 'SC' },
              { pred: 110, act: 111, name: 'KZJ' },
              { pred: 140, act: 140, name: 'WL' },
              { pred: 190, act: 194, name: 'BZA' },
              { pred: 240, act: 243, name: 'KMT' },
              { pred: 290, act: 295, name: 'NGP' },
              { pred: 340, act: 342, name: 'ET' },
              { pred: 380, act: 383, name: 'BPL' },
              { pred: 410, act: 412, name: 'NDLS' },
            ].map((p, idx) => {
              const x = 40 + (p.pred / 450) * 380;
              const y = 160 - (p.act / 450) * 140;
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                  <text x={x} y={y - 8} textAnchor="middle" fill="#64748b" className="text-[9px] font-mono">
                    {p.name}
                  </text>
                </g>
              );
            })}

            <text x="40" y="180" fill="#94a3b8" className="text-[10px] font-mono">Scheduled 06:00</text>
            <text x="400" y="180" textAnchor="end" fill="#94a3b8" className="text-[10px] font-mono">Terminal 10:30</text>
          </svg>
        </div>

        {/* CHART 2: Prediction Error by Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                2. Prediction Error (MAE) by Section
              </h3>
              <p className="text-[11px] text-slate-500">
                Average absolute minute error across all 11 corridor route sections
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700">
              Avg MAE: 3.2m
            </span>
          </div>

          <svg viewBox="0 0 450 200" className="w-full h-[180px]">
            {/* Guide line */}
            <line x1="30" y1="150" x2="430" y2="150" stroke="#e2e8f0" strokeWidth="1" />
            <line x1="30" y1="80" x2="430" y2="80" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
            <text x="25" y="84" textAnchor="end" fill="#94a3b8" className="text-[9px] font-mono">3m</text>
            <text x="25" y="153" textAnchor="end" fill="#94a3b8" className="text-[9px] font-mono">0m</text>

            {sectionErrors.map((sec, idx) => {
              const x = 40 + idx * 35;
              const barH = (sec.error / 6) * 120;
              const y = 150 - barH;
              const isHigh = sec.error > 4;

              return (
                <g key={sec.section}>
                  <rect
                    x={x}
                    y={y}
                    width="22"
                    height={barH}
                    rx="3"
                    fill={isHigh ? '#f59e0b' : '#3b82f6'}
                  />
                  <text x={x + 11} y={y - 4} textAnchor="middle" fill="#475569" className="text-[8.5px] font-mono font-bold">
                    {sec.error}m
                  </text>
                  <text x={x + 11} y="168" textAnchor="middle" fill="#64748b" className="text-[8px] font-mono">
                    {sec.section.split('-')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* CHART 3: Historical vs Current Sectional Running Time */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                3. Historical vs Current Section Running Times
              </h3>
              <p className="text-[11px] text-slate-500">
                Comparing scheduled, 180-day empirical historical baseline, and current live run
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded bg-slate-300" /> Historical
              </span>
              <span className="flex items-center gap-1 text-blue-700 font-bold">
                <span className="w-2.5 h-2.5 rounded bg-blue-600" /> Current Run
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {HISTORICAL_SECTION_PERFORMANCE.slice(0, 5).map((sec) => {
              const hist = sec.historicalAvgTravelTimeMins;
              const curr = Math.round(hist * (sec.congestionFactor || 1.0));
              const diff = curr - hist;

              return (
                <div key={sec.sectionId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 font-mono">
                      {sec.fromCode} → {sec.toCode} ({sec.distanceKm} km)
                    </span>
                    <span className="font-mono text-slate-600 text-[11px]">
                      Hist: <strong>{hist}m</strong> | Current: <strong className="text-blue-700">{curr}m</strong> ({diff >= 0 ? `+${diff}m` : `${diff}m`})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded overflow-hidden flex">
                    <div className="bg-slate-300 h-full" style={{ width: `${Math.min(100, (hist / 250) * 100)}%` }} />
                    <div className="bg-blue-600 h-full ml-0.5" style={{ width: `${Math.min(100, (curr / 250) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 4: ETA Changes Over Time (Convergence) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                4. ETA Changes Over Journey Time
              </h3>
              <p className="text-[11px] text-slate-500">
                Dynamic ETA trajectory converging to actual arrival time as distance narrows
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700">
              Converged: 10:30
            </span>
          </div>

          <svg viewBox="0 0 450 200" className="w-full h-[180px]">
            {/* Guide line */}
            <line x1="40" y1="150" x2="420" y2="150" stroke="#e2e8f0" strokeWidth="1" />
            <line x1="40" y1="90" x2="420" y2="90" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />

            {/* Static NTES line (dashed rose line staying late) */}
            <polyline
              points="60,65 120,70 180,60 240,65 300,60 360,60 410,60"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* RailCast Dynamic ETA line (solid blue converging to 10:30 at bottom) */}
            <polyline
              points="60,80 120,85 180,95 240,110 300,128 360,140 410,145"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
            />

            {/* Actual arrival baseline */}
            <line x1="40" y1="145" x2="420" y2="145" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />

            <text x="50" y="55" fill="#f43f5e" className="text-[9px] font-mono font-bold">Static NTES (Perpetual Delay)</text>
            <text x="260" y="115" fill="#2563eb" className="text-[9px] font-mono font-bold">RailCast Dynamic (Slack Recovery)</text>
            <text x="320" y="162" fill="#10b981" className="text-[9px] font-mono font-bold">Actual Arrival 10:30</text>
          </svg>
        </div>

        {/* CHART 5: Confidence vs Prediction Error */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                5. Prediction Confidence vs Observed Error
              </h3>
              <p className="text-[11px] text-slate-500">
                Inverse correlation validating that higher confidence scores reliably predict lower arrival error
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700">
              Pearson r: -0.88 (Strong Inverse Correlation)
            </span>
          </div>

          <div className="relative overflow-x-auto">
            <svg viewBox="0 0 850 180" className="w-full min-w-[650px] h-[160px]">
              {/* Axes */}
              <line x1="60" y1="140" x2="810" y2="140" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="60" y1="20" x2="60" y2="140" stroke="#cbd5e1" strokeWidth="1" />

              <text x="50" y="25" textAnchor="end" fill="#94a3b8" className="text-[9px] font-mono">6m Err</text>
              <text x="50" y="80" textAnchor="end" fill="#94a3b8" className="text-[9px] font-mono">3m Err</text>
              <text x="50" y="138" textAnchor="end" fill="#94a3b8" className="text-[9px] font-mono">0m Err</text>

              <text x="70" y="158" fill="#94a3b8" className="text-[9px] font-mono">75% Confidence</text>
              <text x="440" y="158" fill="#94a3b8" className="text-[9px] font-mono">88% Confidence</text>
              <text x="800" y="158" textAnchor="end" fill="#94a3b8" className="text-[9px] font-mono">99% Confidence</text>

              {/* Inverse trend curve */}
              <path
                d="M 120,40 Q 350,70 780,135"
                fill="none"
                stroke="#93c5fd"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {confidenceErrorPoints.map((pt) => {
                const x = 60 + ((pt.confidence - 70) / 30) * 720;
                const y = 140 - (pt.error / 6) * 115;

                return (
                  <g key={pt.station}>
                    <circle cx={x} cy={y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={x} y={y - 8} textAnchor="middle" fill="#334155" className="text-[9px] font-mono font-bold">
                      {pt.station} ({pt.error}m)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
