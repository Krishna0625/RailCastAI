import React, { useState } from 'react';
import { CONTROL_ROOM_EVENTS, SIMULATED_FLEET_TRAINS } from '../data/multiTrainFleet';
import { ControlRoomEventCard } from '../types/railway';
import {
  Radio,
  AlertTriangle,
  Flame,
  Gauge,
  Clock,
  ShieldCheck,
  Train,
  Octagon,
  ArrowRight,
  TrendingDown,
  Layers,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface ControlRoomViewProps {
  currentSimTimeFormatted: string;
  totalActiveTrains: number;
  totalDelayedTrains: number;
  overallConfidence: number;
}

export const ControlRoomView: React.FC<ControlRoomViewProps> = ({
  currentSimTimeFormatted,
  totalActiveTrains,
  totalDelayedTrains,
  overallConfidence,
}) => {
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');

  const filteredEvents = CONTROL_ROOM_EVENTS.filter((ev) => {
    if (selectedEventType === 'ALL') return true;
    return ev.type === selectedEventType;
  });

  return (
    <div className="space-y-6">
      {/* Control Room Dispatch Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Section Controller Command Desk · Grand Trunk Corridor
              </h2>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
                COA ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Control Office Application (COA) Real-Time Line Clearance, Precedence & Dispatcher Console
            </p>
          </div>
        </div>

        {/* Dispatch Desk Timestamp */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-500">Live Clock:</span>
          <span className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-sm">
            {currentSimTimeFormatted} IST
          </span>
        </div>
      </div>

      {/* 4 Core Control Room Status KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Active Trains */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Monitored Trains
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {totalActiveTrains}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Fleet tracking across 5 zonal divisions
          </div>
        </div>

        {/* Delayed Trains */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Delayed Trains (&gt; 5m)
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {totalDelayedTrains}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {Math.round((totalDelayedTrains / totalActiveTrains) * 100)}% of corridor traffic impacted
          </div>
        </div>

        {/* Congested Sections */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Congested Track Sections
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-1">
            {CONTROL_ROOM_EVENTS.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Speed restrictions & OHE blocks active
          </div>
        </div>

        {/* Average Prediction Confidence */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Prediction Confidence
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {overallConfidence}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Corridor-wide ensemble certainty
          </div>
        </div>
      </div>

      {/* Operational Event Cards requested in prompt:
          CONGESTION: Warangal → Vijayawada
          SPEED RESTRICTION: Vijayawada → Khammam
          PRECEDING TRAIN DELAY: Khammam → Nagpur
      */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Corridor Bottlenecks & Operational Event Cards
            </h3>
            <p className="text-xs text-slate-500">
              Live sectional disruption cards with downstream delay impact and affected trains
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 text-xs font-mono">
            <button
              onClick={() => setSelectedEventType('ALL')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedEventType === 'ALL'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Events ({CONTROL_ROOM_EVENTS.length})
            </button>
            <button
              onClick={() => setSelectedEventType('CONGESTION')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedEventType === 'CONGESTION'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Congestion
            </button>
            <button
              onClick={() => setSelectedEventType('SPEED_RESTRICTION')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedEventType === 'SPEED_RESTRICTION'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Speed Restriction
            </button>
            <button
              onClick={() => setSelectedEventType('PRECEDING_TRAIN_DELAY')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedEventType === 'PRECEDING_TRAIN_DELAY'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Preceding Delay
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((event) => {
            const isCongestion = event.type === 'CONGESTION';
            const isSpeedRestrict = event.type === 'SPEED_RESTRICTION';
            const isPreceding = event.type === 'PRECEDING_TRAIN_DELAY';
            const isMaint = event.type === 'MAINTENANCE_BLOCK';

            return (
              <div
                key={event.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                {/* Event Top Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider border ${
                        isCongestion
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : isSpeedRestrict
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : isPreceding
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-orange-50 text-orange-700 border-orange-200'
                      }`}
                    >
                      {event.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {event.section}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    +{event.impactMinutes} min Delay
                  </span>
                </div>

                {/* Event Description */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{event.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Affected Trains List */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Affected Downstream Trains ({event.affectedTrainsCount}):</span>
                    <span className="text-slate-400 font-mono">{event.timeAdded}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {event.affectedTrains.map((trn, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-mono font-medium border border-slate-200"
                      >
                        {trn}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
