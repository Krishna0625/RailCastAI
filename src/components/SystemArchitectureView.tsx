import React from 'react';
import {
  Layers,
  Cpu,
  Database,
  CloudLightning,
  GitBranch,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Server,
  Activity,
  Radio,
  FileText,
  Boxes,
  RefreshCw,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';

export const SystemArchitectureView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  System Architecture & End-to-End Prediction Pipeline
                </h1>
                <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold">
                  SIH PS 26028 SPECIFICATION
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Ingestion of 8 heterogeneous operational inputs, feature engineering, hybrid ML inference, multi-consumer dispatch, and closed-loop feedback refinement.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Streaming Latency: ~420ms</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: END-TO-END FLOW (The user requested explicit hierarchy) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-blue-600" />
              <span>End-to-End Conceptual Flow Pipeline</span>
            </h2>
            <p className="text-xs text-slate-500">
              Raw GPS, timetable, operational restrictions, and environmental telemetry flowing through inference to consumer distribution.
            </p>
          </div>
          <span className="text-[11px] font-mono text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            Full Ingestion → Learn Cycle
          </span>
        </div>

        {/* 1. INPUT SOURCES GRID */}
        <div>
          <div className="text-xs uppercase font-mono font-bold text-slate-500 tracking-wider mb-2 flex items-center gap-2">
            <span>Stage 1: 8 Primary Ingestion Data Feeds</span>
            <span className="h-px bg-slate-200 flex-1" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { title: 'GPS / RTIS Location', desc: 'Real-time train positioning', tag: 'ISRO RTIS' },
              { title: 'Working Timetable', desc: 'Scheduled STA/STD matrix', tag: 'NTES / COA' },
              { title: 'Historical Delay Data', desc: '10,000+ past runs', tag: 'Data Lake' },
              { title: 'Section Running Times', desc: 'Block clearance speed', tag: 'Block Sections' },
              { title: 'Signal & Operational', desc: 'Aspects & interlockings', tag: 'Signaling' },
              { title: 'Weather & Visibility', desc: 'Fog, rainfall, storms', tag: 'IMD API' },
              { title: 'Congestion & Utilization', desc: 'Line capacity (>100%)', tag: 'Section Control' },
              { title: 'Preceding Train Data', desc: 'Headway & sidings', tag: 'Axle Counters' },
            ].map((feed, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-blue-400 transition-colors shadow-2xs"
              >
                <div className="text-[10px] font-mono text-blue-700 font-bold mb-1">{feed.tag}</div>
                <div className="text-xs font-bold text-slate-900">{feed.title}</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-tight">{feed.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DOWN ARROW */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center text-blue-600 bg-blue-50 border border-blue-200 px-4 py-1 rounded-full text-xs font-mono font-bold">
            <ArrowDown className="w-4 h-4 animate-bounce" />
            <span>Ingestion Layer</span>
          </div>
        </div>

        {/* 2. PIPELINE STAGES (DATA INGESTION → FEATURE ENGINE → ETA FORECASTING → STATION-WISE ETA → CONFIDENCE & EXPLANATION → REAL-TIME API) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 shadow-2xs space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-blue-800 uppercase">Stage 2</div>
            <div className="text-sm font-bold text-blue-950 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-blue-700" />
              <span>DATA INGESTION</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Streaming ingest via Kafka topics, data validation, deduplication, GPS loss detection, and dead-reckoning fallback.
            </p>
          </div>

          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 shadow-2xs space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-indigo-800 uppercase">Stage 3</div>
            <div className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-700" />
              <span>FEATURE ENGINE</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Section velocity delta, headway margin, line density ratios, gradient/curvature resistance, and rolling delay drift.
            </p>
          </div>

          <div className="bg-cyan-50/70 border border-cyan-200 rounded-xl p-4 shadow-2xs space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-cyan-800 uppercase">Stage 4</div>
            <div className="text-sm font-bold text-cyan-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-700" />
              <span>ETA FORECASTING</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Hybrid Physics + Gradient Boosted Trees (LightGBM/XGBoost) predicting sectional transit and make-up slack.
            </p>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 shadow-2xs space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-emerald-800 uppercase">Stage 5</div>
            <div className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>STATION-WISE ETA</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Cumulative downstream station-by-station arrival timetable with scheduled vs predicted time variance.
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 shadow-2xs space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-amber-800 uppercase">Stage 6</div>
            <div className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>CONFIDENCE + EXPLAIN</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Confidence score (0–100%), uncertainty range [P10–P90], and SHAP-based factor attribution (+min per event).
            </p>
          </div>

          <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 shadow-2xs space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-purple-800 uppercase">Stage 7</div>
            <div className="text-sm font-bold text-purple-950 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-purple-700" />
              <span>REAL-TIME API</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Sub-second REST & WebSocket broadcast to passenger mobile apps, station display boards, and control rooms.
            </p>
          </div>
        </div>

        {/* DOWN ARROW */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center text-blue-600 bg-blue-50 border border-blue-200 px-4 py-1 rounded-full text-xs font-mono font-bold">
            <ArrowDown className="w-4 h-4" />
            <span>Consumer Ecosystem</span>
          </div>
        </div>

        {/* 3. CONSUMERS (PASSENGER APP, STATION DISPLAY, CONTROL ROOM) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Passenger App View</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Provides passengers with current location, next station ETA, expected time range, and natural-language causal explanations.
            </p>
            <div className="mt-2 text-[11px] font-mono text-blue-700 bg-white border border-slate-200 p-2 rounded">
              Example: &ldquo;Vijayawada · ETA: 15:34 · Delay: +14m · Range: 15:29–15:40 · Confidence: 84%&rdquo;
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Railway Station Display</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Station concourse and platform indicators showing real-time arriving/departing trains, delay flags, and platform assignments.
            </p>
            <div className="mt-2 text-[11px] font-mono text-emerald-800 bg-white border border-slate-200 p-2 rounded">
              Example: &ldquo;12723 | New Delhi | 15:34 | +14 min | Delayed&rdquo;
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span>Railway Control Room</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Network controllers monitor active fleets, congested sections, preceding train conflicts, and proactive dispatch suggestions.
            </p>
            <div className="mt-2 text-[11px] font-mono text-purple-800 bg-white border border-slate-200 p-2 rounded">
              Example: &ldquo;CONGESTION: Warangal → Vijayawada · Speed Restriction Active&rdquo;
            </div>
          </div>
        </div>

        {/* DOWN ARROW */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center text-blue-600 bg-blue-50 border border-blue-200 px-4 py-1 rounded-full text-xs font-mono font-bold">
            <ArrowDown className="w-4 h-4" />
            <span>Closed-Loop Verification</span>
          </div>
        </div>

        {/* 4. ACTUAL ARRIVAL → FEEDBACK / REFINEMENT */}
        <div className="bg-emerald-50/60 border border-emerald-300 rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="text-xs font-mono font-bold text-emerald-900 uppercase flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-emerald-700 animate-spin" />
              <span>Actual Arrival &rarr; Feedback / Refinement Loop</span>
            </div>
            <p className="text-xs text-slate-700">
              When the train physically arrives at each station, axle counter logs determine the Actual Outcome. The system computes the residual error:
              <span className="font-mono font-bold text-emerald-800"> Residual = |Predicted - Actual|</span>.
              This updates sectional priors, dynamically refining the historical running weights for future predictions.
            </p>
          </div>

          <div className="bg-white border border-emerald-200 rounded-lg p-3 text-xs font-mono text-slate-800 space-y-1">
            <div className="text-emerald-700 font-bold">Closed-Loop Model Calibrator</div>
            <div>Prior Section Time: 28.0 min</div>
            <div>Observed Real Time: 28.4 min</div>
            <div className="text-blue-700 font-semibold">&Delta; Feedback Update: +0.4 min calibrated</div>
          </div>
        </div>
      </div>

      {/* SECTION 4: PROPOSED PRODUCTION ARCHITECTURE */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                CLEAR DISTINCTION
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Proposed Production Architecture
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High-throughput, event-driven design proposed for national Indian Railways enterprise deployment.
            </p>
          </div>

          <div className="text-xs font-mono bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded">
            Target SLA: &lt;500ms End-to-End Latency
          </div>
        </div>

        {/* FLOW GRAPH */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 overflow-x-auto">
          <div className="min-w-[760px] flex items-center justify-between gap-2 text-xs">
            <div className="bg-white border border-slate-300 rounded-lg p-3 text-center w-36 shadow-2xs">
              <div className="font-bold text-slate-900">Railway GPS / RTIS</div>
              <div className="text-[10px] text-slate-500 mt-1">ISRO Satellite Locomotives</div>
            </div>

            <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />

            <div className="bg-white border border-slate-300 rounded-lg p-3 text-center w-36 shadow-2xs">
              <div className="font-bold text-slate-900">Streaming / Kafka</div>
              <div className="text-[10px] text-slate-500 mt-1">Partitioned by Train ID</div>
            </div>

            <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />

            <div className="bg-white border border-slate-300 rounded-lg p-3 text-center w-36 shadow-2xs">
              <div className="font-bold text-slate-900">Feature Processing</div>
              <div className="text-[10px] text-slate-500 mt-1">Flink / Pandas / NumPy</div>
            </div>

            <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />

            <div className="bg-white border border-blue-400 rounded-lg p-3 text-center w-36 shadow-2xs bg-blue-50/50">
              <div className="font-bold text-blue-900">ETA ML Service</div>
              <div className="text-[10px] text-blue-700 mt-1">XGBoost / LightGBM</div>
            </div>

            <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />

            <div className="bg-white border border-slate-300 rounded-lg p-3 text-center w-36 shadow-2xs">
              <div className="font-bold text-slate-900">Redis / PostgreSQL</div>
              <div className="text-[10px] text-slate-500 mt-1">Cache + Audit Trail</div>
            </div>

            <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />

            <div className="bg-white border border-slate-300 rounded-lg p-3 text-center w-36 shadow-2xs">
              <div className="font-bold text-slate-900">FastAPI / WebSocket</div>
              <div className="text-[10px] text-slate-500 mt-1">Pub/Sub Broadcasting</div>
            </div>

            <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />

            <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 text-center w-36 shadow-2xs">
              <div className="font-bold text-emerald-950">Passenger / Control</div>
              <div className="text-[10px] text-emerald-800 mt-1">React / Mobile Clients</div>
            </div>
          </div>
        </div>

        {/* TECH STACK CHIPS */}
        <div>
          <div className="text-xs uppercase font-mono font-bold text-slate-500 tracking-wider mb-2">
            Proposed Enterprise Technology Stack
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Python', role: 'Inference runtime & data processing' },
              { name: 'FastAPI', role: 'High-performance async API gateway' },
              { name: 'Pandas', role: 'Block section aggregations' },
              { name: 'NumPy', role: 'Vectorized trajectory kinematics' },
              { name: 'XGBoost / LightGBM', role: 'Gradient-boosted decision trees' },
              { name: 'PostgreSQL', role: 'Transactional train schedule & audit store' },
              { name: 'Redis', role: 'Sub-millisecond state cache & pub/sub' },
              { name: 'Kafka', role: 'Event-driven RTIS streaming message bus' },
              { name: 'React', role: 'Modern operations intelligence dashboard' },
              { name: 'Docker', role: 'Containerized microservice deployment' },
            ].map((tech) => (
              <div
                key={tech.name}
                className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-2xs"
              >
                <span className="text-xs font-bold text-slate-900 font-mono">{tech.name}</span>
                <span className="text-slate-400">·</span>
                <span className="text-[11px] text-slate-600">{tech.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COMPARISON TABLE: PROTOTYPE VS PRODUCTION */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] uppercase">
              <tr>
                <th className="p-3">Architectural Dimension</th>
                <th className="p-3 bg-amber-50 text-amber-900">Current AI Studio Prototype</th>
                <th className="p-3 bg-blue-50 text-blue-900">Proposed Production System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-3 font-semibold text-slate-900">Execution Runtime</td>
                <td className="p-3 text-slate-700 bg-amber-50/40">In-browser simulation engine (TypeScript / React)</td>
                <td className="p-3 text-slate-700 bg-blue-50/40">Containerized Python FastAPI microservices with GPU/CPU nodes</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Data Ingestion</td>
                <td className="p-3 text-slate-700 bg-amber-50/40">High-fidelity simulated telemetry (Grand Trunk 12723 Corridor)</td>
                <td className="p-3 text-slate-700 bg-blue-50/40">Real-time Kafka streams from CRIS, COA, RTIS, and NTES</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Inference Scaling</td>
                <td className="p-3 text-slate-700 bg-amber-50/40">1 primary detailed corridor + 15 multi-train simulated fleet</td>
                <td className="p-3 text-slate-700 bg-blue-50/40">Horizontal scale across 1,000+ simultaneous Indian Railways trains</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Persistence</td>
                <td className="p-3 text-slate-700 bg-amber-50/40">Session state and localStorage cache</td>
                <td className="p-3 text-slate-700 bg-blue-50/40">Distributed PostgreSQL cluster + Redis low-latency cache</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Online Learning</td>
                <td className="p-3 text-slate-700 bg-amber-50/40">Live feedback residual logging and prior adjustment demo</td>
                <td className="p-3 text-slate-700 bg-blue-50/40">Nightly automated model retraining on historical drift and residuals</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: SCALABILITY ARCHITECTURE (1 → 10 → 100 → 1,000+ TRAINS) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
        <div className="border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Scalability & Event-Driven Partitioning
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            How RailCast AI scales from 1 demonstration train to enterprise-grade national fleet monitoring.
          </p>
        </div>

        {/* 1 -> 10 -> 100 -> 1000 Visual */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="text-xs font-mono font-bold text-blue-700 mb-1">PROTOTYPE DEMO</div>
            <div className="text-2xl font-bold text-slate-900 font-mono">1 Train</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Deep Micro-Simulation</div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Full kinematic physics, continuous block-by-block progression, 9 operational conditions, and exact SHAP explainability.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="text-xs font-mono font-bold text-indigo-700 mb-1">FLEET SANDBOX</div>
            <div className="text-2xl font-bold text-slate-900 font-mono">15 Trains</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Multi-Train Corridor Monitoring</div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Demonstrates multi-consumer dispatch, station departure displays, and zone filtering across major Indian railway corridors.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="text-xs font-mono font-bold text-cyan-700 mb-1">DIVISIONAL PILOT</div>
            <div className="text-2xl font-bold text-slate-900 font-mono">100 Trains</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Zonal Division Deployment</div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Single-zone cluster handling Secunderabad or Delhi division. Independent train-state event streams prevent cascading contention.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 shadow-2xs">
            <div className="text-xs font-mono font-bold text-blue-800 mb-1">ENTERPRISE PRODUCTION</div>
            <div className="text-2xl font-bold text-blue-950 font-mono">1,000+ Trains</div>
            <div className="text-xs font-semibold text-blue-900 mt-1">National Network Scale</div>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              Event-driven microservices partitioned by Train ID topic partitions. Independent parallel workers guarantee sub-second update SLA.
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Clear Technical Boundary:</strong> The live hackathon prototype processes the active demonstration train and 15 simulated fleet trains in the browser client. Production deployment would leverage the proposed Kafka/FastAPI architecture with authorized integration with Indian Railways operational data sources.
          </div>
        </div>
      </div>
    </div>
  );
};
