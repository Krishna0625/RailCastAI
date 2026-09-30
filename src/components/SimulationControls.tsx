import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  AlertTriangle,
  Flame,
  CloudFog,
  ShieldCheck,
  Zap,
  Radio,
  Train,
  Octagon,
  Gauge,
  Clock,
  Wrench,
  ShieldAlert,
  CloudLightning,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import {
  RailwayOperationalConditions,
  WeatherState,
  GpsStatus,
  PipelineNotification,
} from '../types/railway';

interface SimulationControlsProps {
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
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
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
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Playback & Speed row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {/* [Start Simulation] / [Pause] */}
          <button
            onClick={onPlayToggle}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
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

          {/* [Reset] */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>

          {/* Speed Multiplier Segmented Control */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 ml-1">
            <span className="text-[10px] text-slate-500 font-mono px-1.5 flex items-center gap-1">
              <FastForward className="w-3 h-3 text-blue-600" />
              Speed:
            </span>
            {[1, 2, 5, 10].map((spd) => (
              <button
                key={spd}
                onClick={() => onSpeedChange(spd)}
                className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                  simSpeedMultiplier === spd
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Position text & Active count */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-500">
            Position: <strong className="text-blue-700">{Math.round(currentKilometer)}</strong> / {totalDistanceKm} km
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
              activeEventsCount > 0
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {activeEventsCount} Active Events
          </span>
        </div>
      </div>

      {/* Scrub Bar for Route Progression */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-mono">
          <span>HYB (0 km)</span>
          <span className="text-blue-700 font-semibold">
            Scrub Track Location (Click or Drag to Advance Position)
          </span>
          <span>NDLS ({totalDistanceKm} km)</span>
        </div>
        <input
          type="range"
          min="0"
          max={totalDistanceKm}
          step="5"
          value={currentKilometer}
          onChange={(e) => onScrubKm(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Real-time SIH Pipeline Notification Ribbon */}
      {latestPipelineEvent && (
        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 text-xs font-mono space-y-1">
          <div className="flex items-center justify-between text-blue-900 font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              EVENT → RECALCULATION PIPELINE TRIGGERED
            </span>
            <span className="text-[10px] text-slate-500">{latestPipelineEvent.timestamp}</span>
          </div>
          <div className="text-[11px] text-slate-700 flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-amber-800 font-bold">{latestPipelineEvent.eventTitle}</span>
            <ArrowRight className="w-3 h-3 text-blue-600 shrink-0" />
            <span className="text-slate-900 font-medium">{latestPipelineEvent.trainStateChange}</span>
            <ArrowRight className="w-3 h-3 text-blue-600 shrink-0" />
            <span className="text-blue-700 font-semibold">{latestPipelineEvent.etaRecalculationNote}</span>
            <ArrowRight className="w-3 h-3 text-blue-600 shrink-0" />
            <span className="text-emerald-700 font-bold">{latestPipelineEvent.confidenceDelta}</span>
          </div>
        </div>
      )}

      {/* Problem Statement 26028 Explicit Event Control Buttons */}
      <div className="space-y-2.5 pt-1 border-t border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Zap className="w-4 h-4 text-blue-600" />
            <span>SIH 26028 Operational Event Injection Suite</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearAllConditions}
              className="text-xs font-mono text-slate-600 hover:text-blue-700 transition-colors flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Clear Events
            </button>
            <button
              onClick={onReset}
              className="text-xs font-mono text-slate-600 hover:text-rose-700 transition-colors flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              Reset All
            </button>
          </div>
        </div>

        {/* The 9 Specific Condition Buttons + Weather + GPS Loss */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {/* 1. [Congestion] */}
          <button
            onClick={() => onToggleCondition('downstreamCongestion')}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              conditions.downstreamCongestion.active
                ? 'bg-rose-50 border-rose-400 text-rose-950 ring-1 ring-rose-400'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
              <span>Congestion</span>
              <span className={conditions.downstreamCongestion.active ? 'text-rose-700 font-bold' : 'text-slate-400'}>
                {conditions.downstreamCongestion.active ? '+12m' : 'OFF'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 line-clamp-1">
              Section BZA-KMT 1.35x
            </div>
          </button>

          {/* 2. [Preceding Train Delay] */}
          <button
            onClick={() => onToggleCondition('precedingTrain')}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              conditions.precedingTrain.active
                ? 'bg-amber-50 border-amber-400 text-amber-950 ring-1 ring-amber-400'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
              <span>Preceding Delay</span>
              <span className={conditions.precedingTrain.active ? 'text-amber-800 font-bold' : 'text-slate-400'}>
                {conditions.precedingTrain.active ? '+10m' : 'OFF'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 line-clamp-1">
              Train 12626 (+26m)
            </div>
          </button>

          {/* 3. [Signal Halt] */}
          <button
            onClick={() => onToggleCondition('signalHalt')}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              conditions.signalHalt.active
                ? 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-400'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
              <span className="flex items-center gap-1">
                <Octagon className="w-3 h-3 text-rose-600 fill-rose-600" />
                Signal Halt
              </span>
              <span className={conditions.signalHalt.active ? 'text-rose-700 font-bold' : 'text-slate-400'}>
                {conditions.signalHalt.active ? 'RED (0 km/h)' : 'OFF'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 line-clamp-1">
              Signal #414 (+6m delay)
            </div>
          </button>

          {/* 4. [Speed Restriction] */}
          <button
            onClick={() => onToggleCondition('speedRestriction')}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              conditions.speedRestriction.active
                ? 'bg-amber-50 border-amber-400 text-amber-950 ring-1 ring-amber-400'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
              <span>Speed Restrict</span>
              <span className={conditions.speedRestriction.active ? 'text-amber-800 font-bold' : 'text-slate-400'}>
                {conditions.speedRestriction.active ? '70 km/h' : 'OFF'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 line-clamp-1">
              P-Way Caution (+11m)
            </div>
          </button>

          {/* 5. [Unscheduled Stop] */}
          <button
            onClick={() => onToggleCondition('unscheduledStop')}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              conditions.unscheduledStop.active
                ? 'bg-rose-50 border-rose-400 text-rose-950 ring-1 ring-rose-400'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
              <span>Unscheduled Stop</span>
              <span className={conditions.unscheduledStop.active ? 'text-rose-700 font-bold' : 'text-slate-400'}>
                {conditions.unscheduledStop.active ? '5m PAUSE' : 'OFF'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 line-clamp-1">
              ACP Alarm Chain
            </div>
          </button>

          {/* 6. [Maintenance Block] */}
          <button
            onClick={() => onToggleCondition('maintenanceBlock')}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              conditions.maintenanceBlock.active
                ? 'bg-amber-50 border-amber-400 text-amber-950 ring-1 ring-amber-400'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
              <span>Maintenance Block</span>
              <span className={conditions.maintenanceBlock.active ? 'text-amber-800 font-bold' : 'text-slate-400'}>
                {conditions.maintenanceBlock.active ? '+18m' : 'OFF'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 line-clamp-1">
              ET-BPL OHE Block
            </div>
          </button>

          {/* 7. [Level Crossing] */}
          <button
            onClick={() => onToggleCondition('levelCrossing')}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              conditions.levelCrossing.active
                ? 'bg-amber-50 border-amber-400 text-amber-950 ring-1 ring-amber-400'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
              <span>Level Crossing</span>
              <span className={conditions.levelCrossing.active ? 'text-amber-800 font-bold' : 'text-slate-400'}>
                {conditions.levelCrossing.active ? '+7m' : 'OFF'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 line-clamp-1">
              LC-74 Road Detention
            </div>
          </button>

          {/* 8. [Weather Impact] */}
          <button
            onClick={onCycleWeather}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              conditions.weather !== 'normal'
                ? 'bg-blue-50 border-blue-400 text-blue-950 ring-1 ring-blue-400'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
              <span>Weather</span>
              <span className="text-blue-700 font-bold uppercase text-[10px]">
                {conditions.weather.replace('_', ' ')}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 line-clamp-1">
              Click to cycle state
            </div>
          </button>

          {/* 9. [GPS Loss] */}
          <button
            onClick={onToggleGps}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              conditions.gpsStatus === 'STALE'
                ? 'bg-amber-50 border-amber-500 text-amber-950 ring-1 ring-amber-500'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
              <span>GPS Status</span>
              <span
                className={`font-mono font-bold ${
                  conditions.gpsStatus === 'STALE' ? 'text-amber-800' : 'text-emerald-700'
                }`}
              >
                {conditions.gpsStatus}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 line-clamp-1">
              {conditions.gpsStatus === 'STALE' ? 'Dead Reckoning Mode' : 'GNSS Active'}
            </div>
          </button>
        </div>

        {/* Preceding Train Telemetry Callout (Shows when active) */}
        {conditions.precedingTrain.active && (
          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Train className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Preceding Train:</strong> {conditions.precedingTrain.trainNumber} · {conditions.precedingTrain.trainName}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span>
                Current Delay: <strong className="text-rose-700">+{conditions.precedingTrain.currentDelayMinutes}m</strong>
              </span>
              <span>
                Affected Section: <strong className="text-slate-900">{conditions.precedingTrain.affectedSection}</strong>
              </span>
              <span>
                Impact On Train 12723: <strong className="text-amber-800">+{conditions.precedingTrain.expectedImpactMinutes}m</strong>
              </span>
            </div>
          </div>
        )}

        {/* GPS Stale Warning Callout (Shows when active) */}
        {conditions.gpsStatus === 'STALE' && (
          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-700 animate-pulse" />
              <span>
                <strong>GPS DATA LOSS DETECTED:</strong> Status switched to STALE. Prediction engine using last known kilometer post + historical section running times as dead reckoning fallback (-18% confidence).
              </span>
            </div>
            <button
              onClick={onToggleGps}
              className="px-2.5 py-1 text-[11px] font-mono bg-amber-700 hover:bg-amber-800 text-white rounded-md shrink-0 ml-2 shadow-xs font-semibold"
            >
              Restore GPS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
