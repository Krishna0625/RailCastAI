import React from 'react';
import { StationFeedbackRecord } from '../types/railway';
import { RefreshCw, CheckCircle2, TrendingUp, TrendingDown, ArrowRight, Activity, Database } from 'lucide-react';

interface PredictionFeedbackLoopProps {
  records: StationFeedbackRecord[];
  activeSectionName: string;
}

export const PredictionFeedbackLoop: React.FC<PredictionFeedbackLoopProps> = ({
  records,
  activeSectionName,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Prediction Feedback Loop · Closed-Loop Learning Prototype
            </h3>
            <p className="text-xs text-slate-500">
              Demonstrating: Prediction → Actual Outcome → Error → Feedback → Refined Sectional Baseline
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 font-semibold">
          PROTOTYPE FEEDBACK LOOP
        </span>
      </div>

      {/* Conceptual Diagram Banner */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-blue-900 font-bold">
          <span>Predicted ETA</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span>Actual Arrival</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span>Error Residual</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-emerald-700">Refined Baseline</span>
        </div>
        <span className="text-[11px] text-slate-500 font-sans font-medium">
          Self-tuning Kalman / Exponential Smoothing
        </span>
      </div>

      {/* List of Station Recorded Errors */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Recorded Station Outcomes & Prediction Residuals
        </div>

        {records.length === 0 ? (
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-center text-xs text-slate-500">
            No station arrival outcomes recorded yet. As the train progresses along the corridor, station arrival timestamps and errors will be logged here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
            {records.map((rec) => {
              const isLate = rec.errorMinutes > 0;
              const isEarly = rec.errorMinutes < 0;

              return (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {rec.stationCode} · {rec.stationName}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                        Math.abs(rec.errorMinutes) <= 1
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isLate
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      Error: {rec.errorMinutes >= 0 ? `+${rec.errorMinutes}m` : `${rec.errorMinutes}m`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                      <div className="text-[10px] text-blue-800">Predicted</div>
                      <div className="font-bold text-blue-900">{rec.predictedTime}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-100/70 border border-slate-200">
                      <div className="text-[10px] text-slate-500">Actual</div>
                      <div className="font-bold text-slate-900">{rec.actualTime}</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>Feedback applied:</span>
                    <span className="text-emerald-700 font-mono font-bold">
                      {rec.historicalAdjustedMinutes >= 0 ? `+${rec.historicalAdjustedMinutes}m` : `${rec.historicalAdjustedMinutes}m`} section baseline
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2">
        <Database className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          <strong className="text-slate-800">Prototype Note:</strong> Demonstrates closed-loop feedback mechanics. Does not claim production machine learning training. Production deployments integrate online gradient-boosted retraining.
        </span>
      </div>
    </div>
  );
};
