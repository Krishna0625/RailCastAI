import React, { useState } from 'react';
import { LiveTimelineEvent } from '../types/railway';
import {
  Clock,
  Activity,
  AlertTriangle,
  Flame,
  CloudFog,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Radio,
  Train,
  Gauge,
  HelpCircle,
  Filter,
} from 'lucide-react';

interface OperationalTimelineProps {
  events: LiveTimelineEvent[];
}

export const OperationalTimeline: React.FC<OperationalTimelineProps> = ({ events }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredEvents = events.filter((e) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'operational') return e.category === 'operational' || e.category === 'congestion';
    if (filterCategory === 'eta') return e.category === 'recalculation' || e.category === 'confidence';
    if (filterCategory === 'train') return e.category === 'movement' || e.category === 'speed' || e.category === 'arrival';
    if (filterCategory === 'feedback') return e.category === 'feedback';
    return true;
  });

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
              Operational Event & Prediction Decision Timeline
            </h3>
            <p className="text-xs text-slate-500">
              Complete audit trail: Movement → Speed → Events → ETA Recalculation → Confidence → Feedback
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-[11px] font-mono">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterCategory === 'all' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({events.length})
          </button>
          <button
            onClick={() => setFilterCategory('operational')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterCategory === 'operational' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Operational
          </button>
          <button
            onClick={() => setFilterCategory('eta')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterCategory === 'eta' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ETA & Conf
          </button>
          <button
            onClick={() => setFilterCategory('train')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterCategory === 'train' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Train
          </button>
          <button
            onClick={() => setFilterCategory('feedback')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterCategory === 'feedback' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Feedback
          </button>
        </div>
      </div>

      {/* Live Chronological Feed */}
      <div className="max-h-[380px] overflow-y-auto pr-1 space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {filteredEvents.length === 0 ? (
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-center text-xs text-slate-500">
            No events match the selected category.
          </div>
        ) : (
          filteredEvents.map((item) => {
            const isAlert = item.severity === 'alert';
            const isCaution = item.severity === 'caution';

            return (
              <div key={item.id} className="relative group">
                {/* Node Pip */}
                <div
                  className={`absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white transition-colors ${
                    isAlert
                      ? 'bg-rose-500 shadow-xs'
                      : isCaution
                      ? 'bg-amber-500 shadow-xs'
                      : 'bg-blue-600 shadow-xs'
                  }`}
                />

                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    isAlert
                      ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                      : isCaution
                      ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-xs'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 uppercase font-semibold">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-500">
                        {item.timestamp}
                      </span>
                      {item.impact && (
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                            isAlert
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : isCaution
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {item.impact}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
