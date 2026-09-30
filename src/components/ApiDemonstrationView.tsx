import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Radio,
  Terminal,
  ExternalLink,
  ShieldAlert,
  Server,
  Database,
  ArrowRight,
} from 'lucide-react';

interface EndpointDoc {
  method: 'GET' | 'POST';
  path: string;
  title: string;
  description: string;
  curlExample: string;
  responseSample: object;
}

export const ApiDemonstrationView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeEndpointIndex, setActiveEndpointIndex] = useState<number>(0);

  const endpoints: EndpointDoc[] = [
    {
      method: 'GET',
      path: '/api/trains/12723/eta',
      title: 'Get Train Dynamic ETA & Station Forecasts',
      description:
        'Returns current real-time kinematics, total delay variance, confidence interval, and station-by-station forecasted arrival times with uncertainty bounds.',
      curlExample: 'curl -X GET "https://railcast.railnet.gov.in/api/v1/trains/12723/eta" \\\n  -H "Authorization: Bearer sih2026_demo_token"',
      responseSample: {
        train_number: '12723',
        train_name: 'Telangana Express',
        origin: 'HYB',
        destination: 'NDLS',
        current_status: {
          current_km: 418.5,
          section: 'BZA-KMT',
          effective_speed_kmh: 70.0,
          total_delay_minutes: 14,
          confidence_score: 84.0,
          uncertainty_range: '13:24 – 13:32',
          data_quality: 'GOOD',
        },
        station_etas: [
          {
            station_code: 'KMT',
            station_name: 'Khammam',
            scheduled_arrival: '13:14',
            predicted_arrival: '13:28',
            delay_minutes: 14,
            confidence: 84,
            expected_range: '13:24 – 13:32',
            static_ntes_delay_minutes: 14,
          },
          {
            station_code: 'WL',
            station_name: 'Warangal',
            scheduled_arrival: '14:48',
            predicted_arrival: '15:02',
            delay_minutes: 14,
            confidence: 81,
            expected_range: '14:56 – 15:08',
            static_ntes_delay_minutes: 14,
          },
          {
            station_code: 'NDLS',
            station_name: 'New Delhi',
            scheduled_arrival: '07:40',
            predicted_arrival: '07:51',
            delay_minutes: 11,
            confidence: 76,
            expected_range: '07:44 – 07:58',
            static_ntes_delay_minutes: 14,
            slack_recovery_minutes: 3,
          },
        ],
        generated_at: '2026-09-29T13:20:00+05:30',
        model_version: 'railcast-hybrid-lgbm-v2.4',
      },
    },
    {
      method: 'GET',
      path: '/api/trains/12723/status',
      title: 'Get Train Telemetry & Explainability Factors',
      description:
        'Returns current operational conditions, active caution orders, GPS lock status, and SHAP-based causal factor attribution for why ETA changed.',
      curlExample: 'curl -X GET "https://railcast.railnet.gov.in/api/v1/trains/12723/status" \\\n  -H "Authorization: Bearer sih2026_demo_token"',
      responseSample: {
        train_number: '12723',
        gps_status: 'NOMINAL_LOCKED',
        weather: 'CLEAR',
        active_conditions: {
          downstream_congestion: {
            active: true,
            severity: 'MODERATE',
            section: 'BZA-KMT',
            line_capacity_utilization: 138,
          },
          speed_restriction: {
            active: true,
            caution_order_kmh: 70,
            reason: 'Track maintenance pack tampering',
          },
          signal_halt: { active: false },
          unscheduled_stop: { active: false },
        },
        why_did_eta_change: [
          {
            factor: 'Downstream Section Congestion',
            contributing_minutes: 7.2,
            percentage_contribution: 51.4,
            description: 'Heavy freight train movement ahead in section BZA-KMT',
          },
          {
            factor: 'Caution Speed Restriction (P-Way)',
            contributing_minutes: 4.8,
            percentage_contribution: 34.3,
            description: 'Engineering speed restriction 70 km/h',
          },
          {
            factor: 'Preceding Train Headway',
            contributing_minutes: 2.0,
            percentage_contribution: 14.3,
            description: 'Axle-counter spacing penalty',
          },
        ],
        total_delay_minutes: 14,
      },
    },
    {
      method: 'GET',
      path: '/api/network/events',
      title: 'Get Real-Time Network Congestion & Operational Events',
      description:
        'Returns high-priority operational cards across railway sections, affected trains, and dispatch recommendations for control rooms.',
      curlExample: 'curl -X GET "https://railcast.railnet.gov.in/api/v1/network/events?zone=SCR" \\\n  -H "Authorization: Bearer sih2026_demo_token"',
      responseSample: {
        total_active_events: 3,
        network_zone: 'SCR',
        events: [
          {
            event_id: 'EVT-SCR-402',
            type: 'CONGESTION',
            section: 'Warangal (WL) → Vijayawada (BZA)',
            severity: 'HIGH',
            affected_trains: ['12723', '12621', '12724'],
            estimated_delay_impact: '+12 to +18 min',
            confidence: 84,
            timestamp: '13:15 IST',
          },
          {
            event_id: 'EVT-SCR-311',
            type: 'SPEED_RESTRICTION',
            section: 'Vijayawada (BZA) → Khammam (KMT)',
            severity: 'MEDIUM',
            affected_trains: ['12723', '12803'],
            caution_speed_kmh: 70,
            confidence: 89,
            timestamp: '12:45 IST',
          },
          {
            event_id: 'EVT-CR-508',
            type: 'PRECEDING_TRAIN_DELAY',
            section: 'Khammam (KMT) → Nagpur (NGP)',
            severity: 'MEDIUM',
            affected_trains: ['12723', '12721'],
            headway_gap_km: 3.8,
            confidence: 81,
            timestamp: '13:08 IST',
          },
        ],
        timestamp: '2026-09-29T13:20:00+05:30',
      },
    },
  ];

  const activeEndpoint = endpoints[activeEndpointIndex];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <Code className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              API Demonstration & Conceptual Endpoints
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Simulated REST API responses serving passenger applications, station master consoles, and railway control rooms.
          </p>
        </div>

        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Simulated responses for SIH demonstration. Not publicly deployed Indian Railways APIs.</span>
        </div>
      </div>

      {/* Main Grid: Endpoint Selector & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Endpoints List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
            Available Endpoints
          </div>
          {endpoints.map((ep, idx) => (
            <button
              key={ep.path}
              onClick={() => setActiveEndpointIndex(idx)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                activeEndpointIndex === idx
                  ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-600 text-white">
                  {ep.method}
                </span>
                <span className="text-xs font-mono font-bold text-slate-900 truncate">
                  {ep.path}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-800 mt-1.5">
                {ep.title}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                {ep.description}
              </p>
            </button>
          ))}

          {/* Integration Notes Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2 text-slate-700">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-blue-600" />
              <span>Production Protocol Standards</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
              <li>OpenAPI 3.1 & JSON-Schema compliant</li>
              <li>WebSocket channel: <code className="bg-white px-1 py-0.5 rounded text-blue-800 font-mono">wss://api.railcast.in/stream/12723</code></li>
              <li>Sub-second Redis pub/sub push updates</li>
              <li>JSON payloads gzip-compressed (&lt;1.8 KB payload)</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Code & Response */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Endpoint Info Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-600 text-white">
                  {activeEndpoint.method}
                </span>
                <span className="text-sm font-mono font-bold text-slate-900">
                  {activeEndpoint.path}
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                200 OK · 420ms
              </span>
            </div>

            <p className="text-xs text-slate-700">
              {activeEndpoint.description}
            </p>

            {/* cURL snippet */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                <span>cURL Request Example</span>
                <button
                  onClick={() => handleCopy(activeEndpoint.curlExample, 'curl')}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  {copiedKey === 'curl' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy cURL</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-cyan-300 font-mono text-[11px] rounded-lg overflow-x-auto leading-relaxed border border-slate-800">
                {activeEndpoint.curlExample}
              </pre>
            </div>

            {/* JSON Response Sample */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                <span>Sample JSON Response</span>
                <button
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(activeEndpoint.responseSample, null, 2),
                      'json'
                    )
                  }
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  {copiedKey === 'json' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-lg overflow-x-auto max-h-[460px] leading-relaxed border border-slate-800">
                {JSON.stringify(activeEndpoint.responseSample, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
