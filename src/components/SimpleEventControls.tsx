import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Octagon,
  Train,
  Wrench,
  CloudLightning,
  ShieldAlert,
  Radio,
  Clock,
  Gauge,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  RailwayOperationalConditions,
  PipelineNotification,
} from '../types/railway';

interface SimpleEventControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  onReset: () => void;
  simSpeedMultiplier: number;
  onSpeedChange: (speed: number) => void;
  currentKilometer: number;
  totalDistanceKm: number;
  onScrubKm: (km: number) => void;
  conditions: RailwayOperationalConditions;
  onToggleCondition: (conditionKey: keyof RailwayOperationalConditions) => void;
  onCycleWeather: () => void;
  onToggleGps: () => void;
  onClearAllConditions: () => void;
  latestPipelineEvent: PipelineNotification | null;
  totalDelayMinutes: number;
}

export const SimpleEventControls: React.FC<SimpleEventControlsProps> = ({
  isPlaying,
  onPlayToggle,
  onReset,
  simSpeedMultiplier,
  onSpeedChange,
  currentKilometer,
  totalDistanceKm,
  onScrubKm,
  conditions,
  onToggleCondition,
  onCycleWeather,
  onToggleGps,
  onClearAllConditions,
  latestPipelineEvent,
  totalDelayMinutes,
}) => {
  const activeEventsCount = [
    conditions.downstreamCongestion.active,
    conditions.precedingTrain.active,
    conditions.signalHalt.active,
    conditions.speedRestriction.active,
    conditions.unscheduledStop.active,
    conditions.maintenanceBlock.active,
    conditions.levelCrossing.active,
    conditions.weather !== 'normal',
    conditions.gpsStatus === 'STALE',
  ].filter(Boolean).length;

  return (
    <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-sm space-y-5">
      {/* Header & Simulation Playback Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Try a Railway Event
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Click any operational event below to simulate real-world track conditions and test live ETA recalculation.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Start / Pause */}
          <button
            onClick={onPlayToggle}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all shadow-xs cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Simulation</span>
              </>
            )}
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500 font-mono px-1.5 flex items-center gap-1 font-semibold">
              <FastForward className="w-3 h-3 text-blue-600" />
              Speed:
            </span>
            {[1, 2, 5, 10].map((spd) => (
              <button
                key={spd}
                onClick={() => onSpeedChange(spd)}
                className={`px-2 py-0.5 text-xs font-mono font-bold rounded transition-colors cursor-pointer ${
                  simSpeedMultiplier === spd
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Clear All */}
          <button
            onClick={onClearAllConditions}
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Clear Events</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Cause & Effect Live Banner (When Event Detected) */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs shadow-xs">
        <div className="flex items-center justify-between text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            LIVE CAUSE & EFFECT PIPELINE
          </span>
          <span className="text-slate-400">
            {activeEventsCount} Active Disruption{activeEventsCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Evaluator Priority: BEFORE / AFTER / WHY Sequence */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 font-sans text-xs">
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">1. BEFORE</span>
            <span className="font-bold text-slate-200">Scheduled: 18:40</span>
            <span className="text-[11px] text-emerald-400 block font-mono">Status: On time</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-rose-900/60">
            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase block">2. EVENT DETECTED</span>
            <span className="font-bold text-white truncate block">
              {latestPipelineEvent?.eventTitle.replace('EVENT: ', '') || 'Nominal Track Clear'}
            </span>
            <span className="text-[11px] text-slate-400 block truncate font-mono">
              {latestPipelineEvent?.trainStateChange || 'Speed nominal'}
            </span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-blue-900/60">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block">3. AFTER (RECALCULATED)</span>
            <span className="font-bold text-cyan-300 font-mono text-sm">
              ETA: {totalDelayMinutes > 0 ? `18:${40 + totalDelayMinutes}` : '18:40'}
            </span>
            <span className={`text-[11px] font-mono font-bold block ${totalDelayMinutes > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              Change: {totalDelayMinutes > 0 ? `+${totalDelayMinutes} min` : '0 min (On Time)'}
            </span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-emerald-900/60">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">4. WHY IT CHANGED</span>
            <span className="font-bold text-slate-200 truncate block">
              {totalDelayMinutes > 0 ? 'Reduced speed / track disruption' : 'Clear signals & standard speed'}
            </span>
            <span className="text-[11px] text-slate-400 block font-mono">
              {totalDelayMinutes > 0 ? 'Downstream updated' : 'Timetable confirmed'}
            </span>
          </div>
        </div>
      </div>

      {/* Large Simple Event Cards (Grid of Events) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* 1. 🚦 Signal Halt */}
        <button
          onClick={() => onToggleCondition('signalHalt')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            conditions.signalHalt.active
              ? 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-2 text-sm font-extrabold">
              <span className="text-lg">🚦</span> Signal Halt
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                conditions.signalHalt.active
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {conditions.signalHalt.active ? 'ACTIVE (+6m)' : 'OFF'}
            </span>
          </div>
          <div className="text-xs text-slate-600">
            &ldquo;Train temporarily stopped at red signal aspect&rdquo;
          </div>
          <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 font-mono">
            Speed: 0 km/h · Signal #414 Red
          </div>
        </button>

        {/* 2. 🚆 Congestion */}
        <button
          onClick={() => onToggleCondition('downstreamCongestion')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            conditions.downstreamCongestion.active
              ? 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-2 text-sm font-extrabold">
              <span className="text-lg">🚆</span> Section Congestion
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                conditions.downstreamCongestion.active
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {conditions.downstreamCongestion.active ? 'ACTIVE (+12m)' : 'OFF'}
            </span>
          </div>
          <div className="text-xs text-slate-600">
            &ldquo;Section speed reduced due to high traffic density&rdquo;
          </div>
          <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 font-mono">
            Throughput throttled · BZA-KMT 1.35x
          </div>
        </button>

        {/* 3. 🛠 Maintenance Block */}
        <button
          onClick={() => onToggleCondition('maintenanceBlock')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            conditions.maintenanceBlock.active
              ? 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-2 text-sm font-extrabold">
              <span className="text-lg">🛠</span> Maintenance Block
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                conditions.maintenanceBlock.active
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {conditions.maintenanceBlock.active ? 'ACTIVE (+18m)' : 'OFF'}
            </span>
          </div>
          <div className="text-xs text-slate-600">
            &ldquo;Track capacity restricted for OHE power maintenance&rdquo;
          </div>
          <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 font-mono">
            Traffic block on ET-BPL corridor
          </div>
        </button>

        {/* 4. 🌧 Weather */}
        <button
          onClick={onCycleWeather}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            conditions.weather !== 'normal'
              ? 'bg-blue-50 border-blue-400 text-blue-950 ring-2 ring-blue-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-2 text-sm font-extrabold">
              <span className="text-lg">🌧</span> Weather Impact
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded uppercase ${
                conditions.weather !== 'normal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {conditions.weather.replace('_', ' ')}
            </span>
          </div>
          <div className="text-xs text-slate-600">
            &ldquo;Reduced operating conditions & atmospheric visibility&rdquo;
          </div>
          <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 font-mono">
            Click to cycle: Normal → Rain → Fog → Severe
          </div>
        </button>

        {/* 5. 🚧 Level Crossing */}
        <button
          onClick={() => onToggleCondition('levelCrossing')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            conditions.levelCrossing.active
              ? 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-2 text-sm font-extrabold">
              <span className="text-lg">🚧</span> Level Crossing Gate
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                conditions.levelCrossing.active
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {conditions.levelCrossing.active ? 'ACTIVE (+7m)' : 'OFF'}
            </span>
          </div>
          <div className="text-xs text-slate-600">
            &ldquo;Level crossing caused a short delay&rdquo;
          </div>
          <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 font-mono">
            Manned gate LC-74 clearance hold
          </div>
        </button>

        {/* 6. 📡 GPS Loss */}
        <button
          onClick={onToggleGps}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            conditions.gpsStatus === 'STALE'
              ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-2 text-sm font-extrabold">
              <span className="text-lg">📡</span> GNSS / GPS Loss
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                conditions.gpsStatus === 'STALE'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-emerald-700'
              }`}
            >
              {conditions.gpsStatus === 'STALE' ? 'STALE' : 'GOOD'}
            </span>
          </div>
          <div className="text-xs text-slate-600">
            &ldquo;GPS unavailable — fallback estimation active&rdquo;
          </div>
          <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 font-mono">
            {conditions.gpsStatus === 'STALE' ? 'Historical Section Baseline Active' : 'Real-time Satellite Lock'}
          </div>
        </button>

        {/* 7. 🛑 Preceding Train Delay */}
        <button
          onClick={() => onToggleCondition('precedingTrain')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            conditions.precedingTrain.active
              ? 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-2 text-sm font-extrabold">
              <span className="text-lg">🛑</span> Preceding Train Delay
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                conditions.precedingTrain.active
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {conditions.precedingTrain.active ? 'ACTIVE (+10m)' : 'OFF'}
            </span>
          </div>
          <div className="text-xs text-slate-600">
            &ldquo;Headway clearance delayed by leading rake&rdquo;
          </div>
          <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 font-mono">
            Train #12626 Kerala Exp running late ahead
          </div>
        </button>

        {/* 8. ⚠️ Speed Restriction */}
        <button
          onClick={() => onToggleCondition('speedRestriction')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            conditions.speedRestriction.active
              ? 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-2 text-sm font-extrabold">
              <span className="text-lg">⚠️</span> Caution Speed Restriction
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                conditions.speedRestriction.active
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {conditions.speedRestriction.active ? '70 km/h (+11m)' : 'OFF'}
            </span>
          </div>
          <div className="text-xs text-slate-600">
            &ldquo;Temporary speed restriction&rdquo;
          </div>
          <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 font-mono">
            Speed capped at 70 km/h between Km 435-442
          </div>
        </button>

        {/* 9. 🚨 Unscheduled Stop */}
        <button
          onClick={() => onToggleCondition('unscheduledStop')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            conditions.unscheduledStop.active
              ? 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-2 text-sm font-extrabold">
              <span className="text-lg">🚨</span> Unscheduled Stop (ACP)
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                conditions.unscheduledStop.active
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {conditions.unscheduledStop.active ? '5m PAUSE' : 'OFF'}
            </span>
          </div>
          <div className="text-xs text-slate-600">
            &ldquo;Alarm chain pulling or emergency brake test pause&rdquo;
          </div>
          <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 font-mono">
            5-minute dwell overrun before departure
          </div>
        </button>
      </div>

      {/* Scrub Track Position Slider */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-mono">
          <span className="font-bold">Origin: HYB (0 km)</span>
          <span className="text-blue-700 font-semibold font-sans">
            Advance or Rewind Train Position: <strong className="font-mono">{Math.round(currentKilometer)} km</strong>
          </span>
          <span className="font-bold">Terminal: NDLS ({totalDistanceKm} km)</span>
        </div>
        <input
          type="range"
          min="0"
          max={totalDistanceKm}
          step="5"
          value={currentKilometer}
          onChange={(e) => onScrubKm(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>
    </div>
  );
};
