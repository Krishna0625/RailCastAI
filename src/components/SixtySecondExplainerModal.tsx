import React from 'react';
import { X, Clock, Sparkles, CheckCircle2, ShieldCheck, Volume2 } from 'lucide-react';

interface SixtySecondExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SixtySecondExplainerModal: React.FC<SixtySecondExplainerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border-2 border-blue-600 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-cyan-200" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700">
              SIH Presenter Quick Reference
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Explain RailCast AI in 60 Seconds
            </h3>
          </div>
        </div>

        {/* The Exact 60-Second Pitch */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-slate-900 text-sm leading-relaxed font-sans space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-blue-900 uppercase tracking-wider">
            <Volume2 className="w-4 h-4 text-blue-700" />
            <span>Verbatim 60-Second Pitch (Read Aloud):</span>
          </div>
          <p className="text-slate-800 font-medium italic">
            &ldquo;RailCast AI dynamically predicts train arrival times by combining the current operating state with historical and operational conditions.
          </p>
          <p className="text-slate-800 font-medium italic">
            When something changes — such as congestion, a signal halt, speed restriction, weather, or an unscheduled stop — the system detects the event and recalculates downstream ETAs.
          </p>
          <p className="text-slate-800 font-medium italic">
            Instead of simply changing the ETA, RailCast explains why the prediction changed and communicates its confidence.
          </p>
          <p className="text-slate-800 font-medium italic">
            After arrival, predicted and actual times are compared, creating a feedback signal for improving future estimates.
          </p>
          <p className="text-blue-950 font-bold not-italic font-mono text-xs pt-1 border-t border-blue-200">
            In short: Observe → Detect → Predict → Explain → Update → Learn.&rdquo;
          </p>
        </div>

        {/* 6 Bullet Value Points */}
        <div className="space-y-1.5 text-xs text-slate-700">
          <div className="font-bold uppercase tracking-wider text-slate-500 text-[11px] font-mono">
            Core Story Sequence:
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono">
            <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>1. Observe (GPS & Telemetry)</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>2. Detect Event (Track Sensor)</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>3. Recalculate (Sub-second ML)</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>4. Explain (Root Causes)</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>5. Update (All Consumers)</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>6. Learn (Residual Feedback)</span>
            </div>
          </div>
        </div>

        {/* Mandatory Hackathon Disclaimer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Prototype using simulated railway data</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
