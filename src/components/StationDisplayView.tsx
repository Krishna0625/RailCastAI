import React, { useState } from 'react';
import { STATION_CONCOURSE_TRAINS } from '../data/multiTrainFleet';
import { StationBoardItem, DynamicStationETA } from '../types/railway';
import { Clock, MapPin, Search, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Monitor } from 'lucide-react';

interface StationDisplayViewProps {
  currentSimTimeFormatted: string;
  train12723Eta: string;
  train12723Delay: number;
}

export const StationDisplayView: React.FC<StationDisplayViewProps> = ({
  currentSimTimeFormatted,
  train12723Eta,
  train12723Delay,
}) => {
  const [stationName, setStationName] = useState<string>('Vijayawada Junction (BZA)');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamically synchronize Train 12723 with the real simulation engine!
  const boardItems: StationBoardItem[] = STATION_CONCOURSE_TRAINS.map((item) => {
    if (item.trainNumber === '12723') {
      return {
        ...item,
        eta: train12723Eta,
        delayMinutes: train12723Delay,
        status: train12723Delay > 0 ? 'Delayed' : 'On Time',
      };
    }
    return item;
  });

  const filteredItems = boardItems.filter(
    (item) =>
      item.trainNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.trainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Station Header & Digital Clock */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Station Electronic Display System (EDS)
              </h2>
              <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Integrated National Train Enquiry System (NTES) & RailCast AI Dynamic Feed
            </p>
          </div>
        </div>

        {/* Station Selector & Digital Clock */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Station:</span>
            <select
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Vijayawada Junction (BZA)">Vijayawada Junction (BZA)</option>
              <option value="Secunderabad Junction (SC)">Secunderabad Junction (SC)</option>
              <option value="Nagpur Junction (NGP)">Nagpur Junction (NGP)</option>
              <option value="Itarsi Junction (ET)">Itarsi Junction (ET)</option>
              <option value="Bhopal Junction (BPL)">Bhopal Junction (BPL)</option>
              <option value="New Delhi (NDLS)">New Delhi Railway Station (NDLS)</option>
            </select>
          </div>

          <div className="bg-slate-900 text-white px-4 py-2 rounded-lg font-mono text-center shadow-xs">
            <div className="text-[10px] uppercase text-cyan-300 tracking-wider">Station Time</div>
            <div className="text-base font-bold tabular-nums text-white">
              {currentSimTimeFormatted} IST
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search train name or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-mono">
          Showing <strong className="text-slate-900">{filteredItems.length}</strong> upcoming arrivals & departures
        </div>
      </div>

      {/* Modern High-Contrast Light Concourse Display Board */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Train Number</th>
                <th className="py-3 px-4">Train Name</th>
                <th className="py-3 px-3">Destination</th>
                <th className="py-3 px-3">Scheduled STA</th>
                <th className="py-3 px-3 text-blue-700">Dynamic ETA</th>
                <th className="py-3 px-3">Delay Variance</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredItems.map((item) => {
                const isDelayed = item.delayMinutes > 0;
                const isTrain12723 = item.trainNumber === '12723';

                return (
                  <tr
                    key={item.trainNumber}
                    className={`transition-colors ${
                      isTrain12723
                        ? 'bg-blue-50/50 hover:bg-blue-50'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Train Number */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      {isTrain12723 && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                      )}
                      <span className="text-sm font-bold text-blue-700">{item.trainNumber}</span>
                    </td>

                    {/* Train Name */}
                    <td className="py-3.5 px-4 font-sans font-semibold text-slate-900">
                      {item.trainName}
                    </td>

                    {/* Destination */}
                    <td className="py-3.5 px-3 font-medium text-slate-800">
                      {item.destination}
                    </td>

                    {/* Scheduled STA */}
                    <td className="py-3.5 px-3 text-slate-500 tabular-nums">
                      {item.scheduledTime}
                    </td>

                    {/* Dynamic ETA */}
                    <td className="py-3.5 px-3 font-bold text-blue-700 tabular-nums text-sm">
                      {item.eta}
                    </td>

                    {/* Delay */}
                    <td className="py-3.5 px-3 tabular-nums font-semibold">
                      {isDelayed ? (
                        <span className="text-amber-700 font-bold">
                          +{item.delayMinutes} min
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold">
                          On Time
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                          isDelayed
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Platform */}
                    <td className="py-3.5 px-3 text-center font-bold text-slate-900">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded">
                        {item.platform}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Board Footnote */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audible bilingual concourse announcements synchronized with RailCast AI forecast</span>
          </div>
          <span className="font-mono text-slate-600">Auto-Refreshed: Real-Time</span>
        </div>
      </div>
    </div>
  );
};
