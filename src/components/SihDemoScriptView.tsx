import React, { useState } from 'react';
import {
  Mic,
  Play,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MousePointer,
  Eye,
  Volume2,
  FileText,
  Clock,
  Zap,
  ListChecks,
} from 'lucide-react';

interface SihDemoScriptViewProps {
  onTriggerStep?: (stepIndex: number) => void;
  onNavigateTab?: (tab: string) => void;
}

export const SihDemoScriptView: React.FC<SihDemoScriptViewProps> = ({
  onTriggerStep,
  onNavigateTab,
}) => {
  const [activeScriptSection, setActiveScriptSection] = useState<number>(1);

  const scriptSections = [
    {
      id: 1,
      stepNum: 1,
      timeWindow: '00:00 – 00:20',
      title: 'INTRODUCTION',
      action: 'State the core problem and platform purpose',
      tagline: 'Opening problem statement hook (20 seconds)',
      whatToSay:
        '"Good morning, respected evaluators. We are presenting RailCast AI — a dynamic and explainable ETA forecasting system for Indian Railways coaching trains, built for Smart India Hackathon Problem Statement 26028."',
      whatToClick: 'Start on Overview dashboard with Train 12723 loaded.',
      whatEvaluatorSees: 'Clean operations dashboard showing Train 12723, current speed 110 km/h, on-time status, and 94% prediction confidence.',
      demoStepTarget: 0,
      tabTarget: 'live_operations',
    },
    {
      id: 2,
      stepNum: 2,
      timeWindow: '00:20 – 00:50',
      title: 'NORMAL TRAIN OPERATION',
      action: 'Show continuous real-time monitoring',
      tagline: 'Continuous real-time tracking (30 seconds)',
      whatToSay:
        '"First, the train is operating normally. RailCast continuously monitors train speed and track sensors to estimate when it will reach each upcoming station."',
      whatToClick: 'Point to the 5 Top KPI Cards and the clean horizontal Train Journey track.',
      whatEvaluatorSees: 'Train progressing smoothly along the BZA–KMT corridor at 110 km/h under clear green signals.',
      demoStepTarget: 0,
      tabTarget: 'live_operations',
    },
    {
      id: 3,
      stepNum: 3,
      timeWindow: '00:50 – 01:20',
      title: 'LIVE ETA FORECAST',
      action: 'Display dynamic station arrival table',
      tagline: 'Multi-station dynamic projection (30 seconds)',
      whatToSay:
        '"Instead of relying solely on an inflexible static timetable, RailCast projects arrival times across all upcoming stations in real time."',
      whatToClick: 'Show the Live ETA Forecast table with scheduled vs predicted columns.',
      whatEvaluatorSees: 'Station table showing Scheduled, Predicted, Change (0 min), and Confidence (94%) with clear typography.',
      demoStepTarget: 1,
      tabTarget: 'live_operations',
    },
    {
      id: 4,
      stepNum: 4,
      timeWindow: '01:20 – 01:50',
      title: 'TRIGGER CONGESTION',
      action: 'Simulate track congestion between BZA and KMT',
      tagline: 'Operational disruption injection (30 seconds)',
      whatToSay:
        '"Now suppose track congestion develops between Vijayawada and Khammam. We simulate this by clicking Section Congestion."',
      whatToClick: 'Click the "🚆 Congestion" button under Try a Railway Event (or S3 in Guided Demo).',
      whatEvaluatorSees: 'The Section Congestion event activates, train speed throttles from 110 to 65 km/h, and an amber caution alert appears.',
      demoStepTarget: 2,
      tabTarget: 'live_operations',
    },
    {
      id: 5,
      stepNum: 5,
      timeWindow: '01:50 – 02:20',
      title: 'EVENT DETECTION + ETA RECALCULATION',
      action: 'Demonstrate automated sub-second calculation',
      tagline: 'Event detection & recalculation (30 seconds)',
      whatToSay:
        '"The system immediately detects the speed reduction and recalculates downstream arrival times in under 420 milliseconds."',
      whatToClick: 'Point to the Cause & Effect pipeline banner: "EVENT DETECTED → ETA UPDATED".',
      whatEvaluatorSees: 'Pipeline notification flashes: "EVENT DETECTED: Downstream Congestion Activated", and Khammam ETA shifts to 18:44 (+4 min).',
      demoStepTarget: 4,
      tabTarget: 'live_operations',
    },
    {
      id: 6,
      stepNum: 6,
      timeWindow: '02:20 – 02:50',
      title: 'WHY DID ETA CHANGE?',
      action: 'Explain root causes in plain language',
      tagline: 'Transparent operational explainability (30 seconds)',
      whatToSay:
        '"Importantly, the system does not just change the number—it explains WHY. Evaluators can see that speed reduction from section congestion is the primary cause."',
      whatToClick: 'Point directly to the prominent "Why did ETA change?" card and the "WHAT CHANGED?" box.',
      whatEvaluatorSees: 'Main Reason: SECTION CONGESTION; clear breakdown of speed drop, higher occupancy, and downstream station impact.',
      demoStepTarget: 6,
      tabTarget: 'live_operations',
    },
    {
      id: 7,
      stepNum: 7,
      timeWindow: '02:50 – 03:10',
      title: 'CONFIDENCE / UNCERTAINTY',
      action: 'Communicate honest uncertainty interval',
      tagline: 'Prediction confidence bounds (20 seconds)',
      whatToSay:
        '"As operating conditions become uncertain, the system communicates an honest confidence score instead of presenting a false single-minute certainty."',
      whatToClick: 'Highlight the ETA Confidence score (84%) and the expected time range.',
      whatEvaluatorSees: 'Confidence dial shifts to 84% with dynamic P10–P90 uncertainty interval.',
      demoStepTarget: 7,
      tabTarget: 'live_operations',
    },
    {
      id: 8,
      stepNum: 8,
      timeWindow: '03:10 – 03:30',
      title: 'CONGESTION CLEARS + ETA RECOVERY',
      action: 'Show slack-time recovery',
      tagline: 'Timetable recovery absorption (20 seconds)',
      whatToSay:
        '"When the congestion clears, the train accelerates and scheduled slack absorbs part of the delay, allowing downstream arrival times to recover."',
      whatToClick: 'Click "Clear Events" or Step 9/10 in Guided Demo.',
      whatEvaluatorSees: 'Green signals return, train accelerates back to 105 km/h, and ETA recovers from +6m down to +4m.',
      demoStepTarget: 9,
      tabTarget: 'live_operations',
    },
    {
      id: 9,
      stepNum: 9,
      timeWindow: '03:30 – 03:50',
      title: 'PREDICTED VS ACTUAL',
      action: 'Compare station berthing timestamp with prediction',
      tagline: 'Station berthing residual verification (20 seconds)',
      whatToSay:
        '"When the train arrives at Khammam, the actual arrival timestamp is recorded and compared with the prediction, showing an error residual under 30 seconds."',
      whatToClick: 'Trigger Step 11/12 or point to Khammam station arrival.',
      whatEvaluatorSees: 'Actual berthing recorded on Platform 1; residual error of 0.2 minutes logged to model store.',
      demoStepTarget: 11,
      tabTarget: 'live_operations',
    },
    {
      id: 10,
      stepNum: 10,
      timeWindow: '03:50 – 04:10',
      title: 'FEEDBACK LOOP',
      action: 'Update historical section estimates',
      tagline: 'Closed-loop model refinement (20 seconds)',
      whatToSay:
        '"The prediction error is fed back to update future section running-time estimates so the system continuously learns from actual runs."',
      whatToClick: 'Point to the Feedback Updates table showing section calibrated delta (+0.2 min).',
      whatEvaluatorSees: 'Section baseline weight adjusted in online feature store; closed-loop banner shows complete cycle.',
      demoStepTarget: 12,
      tabTarget: 'live_operations',
    },
    {
      id: 11,
      stepNum: 11,
      timeWindow: '04:10 – 04:40',
      title: 'TECHNICAL ARCHITECTURE',
      action: 'Present scalable production architecture',
      tagline: 'Event-driven streaming stack (30 seconds)',
      whatToSay:
        '"In production, this runs on an event-driven architecture with RTIS GPS feeds, Kafka streaming, FastAPI ML services, and Redis caching supporting multi-consumer apps."',
      whatToClick: 'Click the "System" tab to show Proposed Production Architecture & API Demo.',
      whatEvaluatorSees: 'Clear architecture diagram distinguishing implemented prototype from proposed production Kafka/FastAPI stack, plus live JSON API endpoints.',
      demoStepTarget: 0,
      tabTarget: 'system_architecture',
    },
    {
      id: 12,
      stepNum: 12,
      timeWindow: '04:40 – 05:00',
      title: 'CONCLUSION',
      action: 'Deliver memorable closing statement',
      tagline: 'Closing value proposition (20 seconds)',
      whatToSay:
        '"In summary, RailCast AI transforms ETA into a continuously updated, explainable operational forecast: Observe → Detect → Predict → Explain → Update → Learn. Thank you."',
      whatToClick: 'Conclude presentation and open floor to questions.',
      whatEvaluatorSees: 'Full overview dashboard with all verification metrics and disclaimers clearly visible.',
      demoStepTarget: 0,
      tabTarget: 'live_operations',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Mic className="w-6 h-6 text-cyan-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                SIH Evaluator Demo Script (00:00 – 05:00)
              </h2>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full">
                READY-TO-PRESENT
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Exact timed walkthrough synchronized with the working RailCast AI simulation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-mono text-slate-700">
          <Clock className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Total Delivery Time: <strong>5 minutes maximum</strong></span>
        </div>
      </div>

      {/* "DO NOT MISS DURING DEMO" CHECKLIST (Prompt Section 11) */}
      <div className="bg-white border-2 border-amber-300 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
          <ListChecks className="w-5 h-5 text-amber-600" />
          <span className="uppercase tracking-wider">Presenter Checklist: &ldquo;Do Not Miss During Demo&rdquo;</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 space-y-2">
            <div className="font-extrabold text-amber-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <span>📋</span> BEFORE DEMO (Setup Verification):
            </div>
            <ul className="space-y-1.5 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>DEMO MODE</strong> enabled in top navigation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>Train 12723</strong> (Telangana Express) active</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Simulation reset to origin baseline</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Guided demo ready on Step 1</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Browser/projector in comfortable fullscreen</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Audio not required · Self-contained prototype</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200 space-y-2">
            <div className="font-extrabold text-blue-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <span>🎯</span> DURING DEMO (Core Sequence):
            </div>
            <ul className="space-y-1.5 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Show normal station-wise ETA</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Trigger section congestion</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Show instantaneous ETA recalculation (+4m)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Show plain-language explanation of causes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Show confidence & uncertainty range</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Clear congestion & show timetable slack recovery</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Show predicted vs actual arrival & feedback loop</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Script Flow Summary Tracker */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="text-xs font-mono font-bold uppercase text-cyan-300 flex items-center justify-between">
          <span>Timed Narrative Structure (00:00 – 05:00)</span>
          <span className="text-slate-400">Click any card to jump to that speaking cue</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {scriptSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveScriptSection(sec.id)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                activeScriptSection === sec.id
                  ? 'bg-cyan-400 text-slate-950 shadow-2xs font-extrabold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              [{sec.timeWindow.split(' ')[0]}] #{sec.stepNum} {sec.title}
            </button>
          ))}
        </div>
      </div>

      {/* Script Sections Cards */}
      <div className="space-y-4">
        {scriptSections.map((sec) => {
          const isActive = activeScriptSection === sec.id;

          return (
            <div
              key={sec.id}
              className={`bg-white border rounded-xl p-5 transition-all shadow-xs space-y-3 ${
                isActive
                  ? 'border-2 border-blue-600 ring-2 ring-blue-100 bg-blue-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-extrabold text-xs ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {sec.stepNum}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                        {sec.timeWindow}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        {sec.title}
                      </h3>
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{sec.action}</div>
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex items-center gap-2">
                  {onTriggerStep && (
                    <button
                      onClick={() => {
                        setActiveScriptSection(sec.id);
                        onTriggerStep(sec.demoStepTarget);
                        if (sec.tabTarget && onNavigateTab) {
                          onNavigateTab(sec.tabTarget);
                        }
                      }}
                      className="px-3 py-1.5 text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Trigger This Stage in Prototype</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Speaking Voice (WHAT TO SAY) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-900 uppercase tracking-wider">
                  <Volume2 className="w-4 h-4 text-blue-700" />
                  <span>WHAT TO SAY (1–3 sentences to read aloud):</span>
                </div>
                <p className="text-sm text-slate-900 font-medium leading-relaxed font-sans italic">
                  {sec.whatToSay}
                </p>
              </div>

              {/* Presenter Visual Notes: WHAT TO CLICK & WHAT EVALUATOR SEES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    <MousePointer className="w-3.5 h-3.5 text-amber-600" />
                    <span>WHAT TO CLICK / POINT AT:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-sans">{sec.whatToClick}</p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WHAT THE EVALUATOR SEES:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-sans">{sec.whatEvaluatorSees}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
