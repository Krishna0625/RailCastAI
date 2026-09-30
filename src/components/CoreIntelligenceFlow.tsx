import React from 'react';
import { Radio, AlertTriangle, Calculator, HelpCircle, Users, ArrowRight } from 'lucide-react';
import { PipelineNotification } from '../types/railway';

interface CoreIntelligenceFlowProps {
  latestPipelineEvent: PipelineNotification | null;
  totalDelayMinutes: number;
}

export const CoreIntelligenceFlow: React.FC<CoreIntelligenceFlowProps> = ({
  latestPipelineEvent,
  totalDelayMinutes,
}) => {
  const isDelayed = totalDelayMinutes > 0;

  const steps = [
    {
      step: 1,
      title: 'LIVE DATA',
      subtitle: 'GPS & Track Sensors',
      description: 'Continuous speed, position & schedule monitoring',
      icon: Radio,
      activeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      step: 2,
      title: 'EVENT DETECTED',
      subtitle: isDelayed ? 'Operational Disruption' : 'Nominal Clear Route',
      description: latestPipelineEvent?.eventTitle.replace('EVENT: ', '') || 'Speed profile normal',
      icon: AlertTriangle,
      activeColor: isDelayed
        ? 'text-amber-800 bg-amber-50 border-amber-300'
        : 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      step: 3,
      title: 'ETA RECALCULATED',
      subtitle: 'Sub-second ML Update',
      description: isDelayed ? `Delay recalculated: +${totalDelayMinutes}m` : 'On-time timetable confirmed',
      icon: Calculator,
      activeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      step: 4,
      title: 'EXPLANATION',
      subtitle: 'Plain-Language Reason',
      description: isDelayed ? 'Root causes isolated & attributed' : 'Clear signals & standard headway',
      icon: HelpCircle,
      activeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      step: 5,
      title: 'UPDATED ETA',
      subtitle: 'Broadcasting to All',
      description: 'Passenger app, station boards & control room',
      icon: Users,
      activeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>How RailCast AI Works: The Core Intelligence Loop</span>
            <span className="text-[10px] font-mono font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
              Observe → Detect → Predict → Explain → Update → Learn
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            End-to-end event-driven loop that automatically updates and explains arrivals within milliseconds of track events.
          </p>
        </div>
      </div>

      {/* Horizontal Flow Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all shadow-xs ${item.activeColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                  STEP {item.step}
                </span>
                <div className="w-6 h-6 rounded-md bg-white/80 border border-current/20 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {item.title}
                </div>
                <div className="text-[11px] font-semibold text-blue-800 mt-0.5">
                  {item.subtitle}
                </div>
                <div className="text-[11px] text-slate-600 mt-1 leading-snug line-clamp-2">
                  {item.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
