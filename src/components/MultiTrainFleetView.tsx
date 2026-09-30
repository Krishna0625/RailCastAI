import React, { useState } from 'react';
import { SIMULATED_FLEET_TRAINS } from '../data/multiTrainFleet';
import { FleetTrain } from '../types/railway';
import { Train, Search, Filter, ShieldCheck, MapPin, Gauge, Info, Globe } from 'lucide-react';

interface MultiTrainFleetViewProps {
  train12723Eta: string;
  train12723Delay: number;
  train12723Confidence: number;
}

export const MultiTrainFleetView: React.FC<MultiTrainFleetViewProps> = ({
  train12723Eta,
  train12723Delay,
  train12723Confidence,
}) => {
  const [search, setSearch] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');

  // Synchronize Train 12723 with the real simulation engine!
  const fleet: FleetTrain[] = SIMULATED_FLEET_TRAINS.map((trn) => {
    if (trn.trainNumber === '12723') {
      return {
        ...trn,
        delayMinutes: train12723Delay,
        nextStationEta: train12723Eta,
        confidenceScore: train12723Confidence,
        currentState:
          train12723Delay > 20
            ? 'Critical Delay'
            : train12723Delay > 0
            ? 'Delayed'
            : 'On Time',
      };
    }
    return trn;
  });

  const availableZones = [
    { code: 'ALL', name: 'All Zones' },
    { code: 'SCR', name: 'South Central' },
    { code: 'CR', name: 'Central' },
    { code: 'NR', name: 'Northern' },
    { code: 'SR', name: 'Southern' },
    { code: 'ECoR', name: 'East Coast' },
  ];

  const filteredTrains = fleet.filter((trn) => {
    const matchesSearch =
      trn.trainNumber.toLowerCase().includes(search.toLowerCase()) ||
      trn.trainName.toLowerCase().includes(search.toLowerCase()) ||
      trn.route.toLowerCase().includes(search.toLowerCase()) ||
      trn.nextStation.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Zone filter
    if (selectedZone !== 'ALL') {
      if (selectedZone === 'SCR' && trn.zone !== 'SCR') return false;
      if (selectedZone === 'CR' && trn.zone !== 'CR') return false;
      if (selectedZone === 'NR' && trn.zone !== 'NR') return false;
      if (selectedZone === 'SR' && trn.zone !== 'SR') return false;
      if (selectedZone === 'ECoR' && trn.zone !== 'ECoR') return false;
    }

    // State filter
    if (stateFilter === 'ALL') return true;
    if (stateFilter === 'ON_TIME') return trn.delayMinutes === 0;
    if (stateFilter === 'DELAYED') return trn.delayMinutes > 0 && trn.delayMinutes <= 20;
    if (stateFilter === 'CRITICAL') return trn.delayMinutes > 20;
    return true;
  });

  const onTimeCount = fleet.filter((t) => t.delayMinutes === 0).length;
  const delayedCount = fleet.filter((t) => t.delayMinutes > 0 && t.delayMinutes <= 20).length;
  const criticalCount = fleet.filter((t) => t.delayMinutes > 20).length;

  return (
    <div className="space-y-6">
      {/* Fleet Header & Architecture Note */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <Train className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Simulated Multi-Train Fleet Intelligence
              </h2>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full">
                {fleet.length} Active Trains
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Scalable corridor fleet view demonstrating multi-train dynamic ETA forecasting across Indian Railways trunk arteries.
            </p>
          </div>
        </div>

        {/* Scalability Prototype Note */}
        <div className="bg-blue-50/80 border border-blue-200 text-blue-900 px-3 py-2 rounded-lg text-xs max-w-md">
          <strong>Scalability Prototype:</strong> Demonstrates how the RailCast AI concept scales beyond 1 train using independent train-state event streams. Does not claim real-time processing of thousands of live Indian Railways trains.
        </div>
      </div>

      {/* Conceptual Railway-Zone Filtering */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Conceptual Railway-Zone Filtering:</span>
            <span className="text-[11px] font-normal text-slate-500">
              Route, section, time, weather, and historical performance are used as model features across zones.
            </span>
          </div>
          <span className="text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            Conceptual filtering — No claim of real zone-specific trained models
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {availableZones.map((zone) => {
            const count =
              zone.code === 'ALL'
                ? fleet.length
                : fleet.filter((t) => t.zone === zone.code).length;

            return (
              <button
                key={zone.code}
                onClick={() => setSelectedZone(zone.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                  selectedZone === zone.code
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {zone.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Fleet Status Filter & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setStateFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              stateFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All States ({fleet.length})
          </button>
          <button
            onClick={() => setStateFilter('ON_TIME')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              stateFilter === 'ON_TIME'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-emerald-700 hover:bg-slate-50'
            }`}
          >
            On Time ({onTimeCount})
          </button>
          <button
            onClick={() => setStateFilter('DELAYED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              stateFilter === 'DELAYED'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-amber-700 hover:bg-slate-50'
            }`}
          >
            Delayed ({delayedCount})
          </button>
          <button
            onClick={() => setStateFilter('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              stateFilter === 'CRITICAL'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-rose-700 hover:bg-slate-50'
            }`}
          >
            Critical &gt; 20m ({criticalCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search train ID, name or route..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Fleet Table / Grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Train ID & Name</th>
                <th className="py-3 px-3">Route & Zone</th>
                <th className="py-3 px-3">Current Section State</th>
                <th className="py-3 px-3">Delay</th>
                <th className="py-3 px-3">Next Station</th>
                <th className="py-3 px-3 text-blue-700">Dynamic ETA</th>
                <th className="py-3 px-3">Expected Range</th>
                <th className="py-3 px-3 text-center">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredTrains.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No trains match the selected zone and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTrains.map((trn) => {
                  const isOnTime = trn.delayMinutes === 0;
                  const isCritical = trn.delayMinutes > 20;
                  const isTrain12723 = trn.trainNumber === '12723';

                  return (
                    <tr
                      key={trn.trainNumber}
                      className={`transition-colors ${
                        isTrain12723
                          ? 'bg-blue-50/50 hover:bg-blue-50 font-medium'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Train ID & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {isTrain12723 && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                          )}
                          <div>
                            <div className="font-bold text-slate-900 text-sm text-blue-700">
                              {trn.trainNumber}
                            </div>
                            <div className="font-sans font-semibold text-slate-800 text-[11px]">
                              {trn.trainName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Route & Zone */}
                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-medium">{trn.route}</div>
                        <div className="text-[10px] text-slate-500 font-sans">
                          Zone: <span className="font-semibold text-slate-700">{trn.zone}</span>
                        </div>
                      </td>

                      {/* Current State & Location */}
                      <td className="py-3 px-3">
                        <div className="text-slate-900 font-medium">{trn.currentLocation}</div>
                        {trn.delayReason && (
                          <div className="text-[10px] text-slate-500 font-sans line-clamp-1">
                            {trn.delayReason}
                          </div>
                        )}
                      </td>

                      {/* Delay */}
                      <td className="py-3 px-3 tabular-nums font-bold">
                        {isOnTime ? (
                          <span className="text-emerald-700">On Time</span>
                        ) : (
                          <span className={isCritical ? 'text-rose-700' : 'text-amber-700'}>
                            +{trn.delayMinutes}m
                          </span>
                        )}
                      </td>

                      {/* Next Station */}
                      <td className="py-3 px-3 text-slate-800 font-medium">
                        {trn.nextStation}
                      </td>

                      {/* Dynamic ETA */}
                      <td className="py-3 px-3 font-bold text-blue-700 tabular-nums text-sm">
                        {trn.nextStationEta}
                      </td>

                      {/* Expected Range */}
                      <td className="py-3 px-3 text-slate-600 tabular-nums">
                        {trn.expectedRange}
                      </td>

                      {/* Confidence */}
                      <td className="py-3 px-3 text-center tabular-nums">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${
                            trn.confidenceScore >= 90
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : trn.confidenceScore >= 80
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {trn.confidenceScore}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
