import React from 'react';
import { Activity, HelpCircle, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';

export const WhyRailcastCard: React.FC = () => {
  const points = [
    {
      num: '1',
      title: 'DYNAMIC',
      tagline: 'Adapts to operational changes',
      description: 'ETA changes in sub-second time when railway conditions (speed restrictions, congestion, signal halts) occur.',
      icon: Activity,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      num: '2',
      title: 'EXPLAINABLE',
      tagline: 'Transparent causality attribution',
      description: 'The system shows WHY ETA changed in plain English, replacing black-box delays with verifiable factors.',
      icon: HelpCircle,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      num: '3',
      title: 'CONFIDENCE-AWARE',
      tagline: 'Honest uncertainty bounds',
      description: 'The system communicates dynamic prediction confidence [P10–P90] rather than giving false precision.',
      icon: ShieldCheck,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      num: '4',
      title: 'CLOSED-LOOP',
      tagline: 'Continuous online learning',
      description: 'Actual arrival times are compared with predictions to refine future section running-time estimates.',
      icon: RefreshCw,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Why RailCast AI?</span>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              4 Innovation Pillars
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key architectural differences between traditional static NTES and RailCast AI intelligence.
          </p>
        </div>

        <div className="text-[11px] font-mono text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
          Prototype using simulated railway data
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {points.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.num}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all shadow-2xs hover:border-blue-300 ${p.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-md bg-white border border-current/20 flex items-center justify-center font-mono font-bold text-xs">
                    {p.num}
                  </span>
                  <Icon className="w-4 h-4 text-current" />
                </div>
                <div className="text-sm font-extrabold text-slate-900 tracking-tight">
                  {p.title}
                </div>
                <div className="text-xs font-semibold text-blue-800 mt-0.5">
                  {p.tagline}
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-sans">
                  {p.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
