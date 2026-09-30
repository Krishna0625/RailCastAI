import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Zap,
  Volume2,
  Eye,
  Info,
  CheckCircle2,
} from 'lucide-react';

export interface DemoStepDefinition {
  step: number;
  title: string;
  tagline: string;
  description: string;
  oneSentence: string;
  actionSummary: string;
  stateImpact: string;
  beforeTime: string;
  afterTime: string;
  changeText: string;
  primaryReason: string;
  whatYouSee: string;
  whatHappened: string;
  whatToSay: string;
  activeConditions: {
    congestion?: boolean;
    precedingDelay?: boolean;
    signalHalt?: boolean;
    speedRestriction?: boolean;
  };
  kmPosition: number;
  expectedDelay: number;
  confidence: number;
  coreStoryStage: 'Observe' | 'Predict' | 'Detect Event' | 'Recalculate' | 'Explain' | 'Update' | 'Compare' | 'Learn';
}

export const GUIDED_DEMO_STEPS: DemoStepDefinition[] = [
  {
    step: 1,
    title: 'Train Operating Normally',
    tagline: 'Nominal block-sectional running at scheduled MPS',
    description:
      'Train 12723 (Telangana Express) is traversing the South Central Railway corridor at 110 km/h under nominal green signals. Historical section running times match scheduled time within ±0.5 min.',
    oneSentence: 'The train is running normally at 110 km/h under clear signals with zero delay.',
    actionSummary: 'All operational conditions nominal. Standard speed profile.',
    stateImpact: 'Delay: 0 min · Confidence: 94% · Signal: Green Aspect',
    beforeTime: '18:40',
    afterTime: '18:40',
    changeText: '0 min (On Time)',
    primaryReason: 'Normal Scheduled Running',
    whatYouSee: 'Train 12723 moving at 110 km/h with green signal aspects and 0 min delay.',
    whatHappened: 'Telemetry indicates clear tracks and optimal sectional run times.',
    whatToSay: '"We begin with Train 12723 operating under normal conditions. The train is on time, speed is steady at 110 km/h, and the line is completely clear."',
    activeConditions: {},
    kmPosition: 395,
    expectedDelay: 0,
    confidence: 94,
    coreStoryStage: 'Observe',
  },
  {
    step: 2,
    title: 'Station-Wise ETA is Displayed',
    tagline: 'Upstream feature ingestion forecasts all downstream arrival windows',
    description:
      'The Hybrid ETA Forecasting Engine projects station-wise arrival times, static NTES comparisons, and probabilistic uncertainty bounds [P10–P90] for Khammam, Warangal, Ramagundam, and New Delhi.',
    oneSentence: 'Station-wise arrival times are projected dynamically across every upcoming stop.',
    actionSummary: 'Multi-station ETA matrix published to Passenger, Station & Control systems.',
    stateImpact: 'Downstream arrivals steady: Khammam at 18:40 (0m delay)',
    beforeTime: '18:40',
    afterTime: '18:40',
    changeText: '0 min (On Time)',
    primaryReason: 'Timetable Alignment',
    whatYouSee: 'Live ETA Forecast table populated for Khammam, Warangal, Ramagundam, and Secunderabad.',
    whatHappened: 'Model projects arrival times by combining track distances and permissible sectional speeds.',
    whatToSay: '"Here the system displays station-wise ETAs. Instead of a single static number, RailCast calculates the arrival for every upcoming station with 94% confidence."',
    activeConditions: {},
    kmPosition: 405,
    expectedDelay: 0,
    confidence: 94,
    coreStoryStage: 'Predict',
  },
  {
    step: 3,
    title: 'Train Enters a Congested Section',
    tagline: 'High sectional occupancy detected ahead in BZA → KMT block',
    description:
      'Track occupancy telemetry and section headway sensors detect increasing block congestion between Vijayawada (BZA) and Khammam (KMT). Line utilization reaches 138% capacity.',
    oneSentence: 'The train enters a congested track section, causing locomotive speed to throttle down.',
    actionSummary: 'Approaching section enters caution state. Driver decelerates to 65 km/h.',
    stateImpact: 'Speed drop: 110 km/h → 65 km/h · Headway reduced to 4.2 km',
    beforeTime: '18:40',
    afterTime: '18:44',
    changeText: '+4 min',
    primaryReason: 'Section Congestion (Speed Throttling)',
    whatYouSee: 'Current speed drops from 110 to 65 km/h on the KPI grid and track schematic.',
    whatHappened: 'Locomotive throttled due to high sectional traffic density in the block section.',
    whatToSay: '"Now the train enters a congested corridor between Vijayawada and Khammam. Track sensors detect high occupancy, reducing operating speed to 65 km/h."',
    activeConditions: { congestion: true },
    kmPosition: 418,
    expectedDelay: 4,
    confidence: 88,
    coreStoryStage: 'Detect Event',
  },
  {
    step: 4,
    title: 'Congestion Event is Detected',
    tagline: 'Automated COA / Sectional anomaly detection fires event alert',
    description:
      'The RailCast pipeline identifies Sectional Congestion Event #SEC-402 with preceding freight movement. Signal aspect drops to Double-Yellow caution.',
    oneSentence: 'The RailCast pipeline automatically detects the operational congestion anomaly.',
    actionSummary: 'Pipeline creates event card: "CONGESTION: Warangal → Vijayawada corridor".',
    stateImpact: 'Disruption Event active · Alert broadcast to all control desks',
    beforeTime: '18:40',
    afterTime: '18:44',
    changeText: '+4 min',
    primaryReason: 'Block Congestion Detected',
    whatYouSee: 'Event card appears: "CONGESTION DETECTED" and the pipeline notification alerts controllers.',
    whatHappened: 'Anomaly detection threshold breached; streaming event sent to ETA forecasting service.',
    whatToSay: '"The system immediately flags the congestion event. Notice how it does not wait for a station delay report; it catches the event as soon as speed drops."',
    activeConditions: { congestion: true, speedRestriction: true },
    kmPosition: 422,
    expectedDelay: 6,
    confidence: 83,
    coreStoryStage: 'Detect Event',
  },
  {
    step: 5,
    title: 'ETA Engine Recalculates',
    tagline: 'Physics-informed Gradient Boosted ML model updates live ETA',
    description:
      'Unlike static linear interpolation, RailCast AI recalculates downstream deceleration, cumulative dwell penalties, and single-line conflict risks across remaining stations.',
    oneSentence: 'The ETA engine runs in 420 ms to compute updated downstream arrival times.',
    actionSummary: 'Recalculation executed in 420 ms via streaming pipeline.',
    stateImpact: 'Predicted total delay updated from +0m → +6m',
    beforeTime: '18:40',
    afterTime: '18:46',
    changeText: '+6 min',
    primaryReason: 'Dynamic Kinematic Recalculation',
    whatYouSee: 'ETA numbers update smoothly across all stations without page refresh or lag.',
    whatHappened: 'Model adjusts remaining running times using kinematic curve and track occupancy factors.',
    whatToSay: '"Within 420 milliseconds, the ETA engine recalculates downstream arrival forecasts using physical section running times and ML adjustment factors."',
    activeConditions: { congestion: true, speedRestriction: true },
    kmPosition: 426,
    expectedDelay: 6,
    confidence: 79,
    coreStoryStage: 'Recalculate',
  },
  {
    step: 6,
    title: 'Downstream Station ETAs Change',
    tagline: 'Station boards and passenger feeds dynamically adjust',
    description:
      'Dynamic station-wise ETA updates: Khammam shifted 18:40 → 18:46 (+6m), Warangal shifted 20:05 → 20:11 (+6m), Secunderabad shifted 22:30 → 22:36 (+6m).',
    oneSentence: 'Every upcoming station on the route receives the new expected arrival time.',
    actionSummary: 'Station display and Passenger App reflect +6m delay and expected ranges.',
    stateImpact: 'Khammam ETA: 18:46 · Range: 18:43–18:49 · Platform 1',
    beforeTime: '18:40',
    afterTime: '18:46',
    changeText: '+6 min',
    primaryReason: 'Downstream Propagation',
    whatYouSee: 'Khammam arrival shifts to 18:46, Warangal shifts to 20:11, and Secunderabad shifts to 22:36.',
    whatHappened: 'The delay propagates realistically downstream, moderated by schedule recovery allowances.',
    whatToSay: '"Observe how the arrival times adjust across all downstream stations. Passengers and station masters immediately see the realistic updated schedule."',
    activeConditions: { congestion: true, speedRestriction: true },
    kmPosition: 430,
    expectedDelay: 6,
    confidence: 78,
    coreStoryStage: 'Update',
  },
  {
    step: 7,
    title: '"Why Did ETA Change?" Explains the Factors',
    tagline: 'Explainable AI attribution shows exact contributing minutes',
    description:
      'SHAP-inspired causality panel breaks down the +6 min delay: +3.8m Downstream Section Congestion, +1.8m Preceding Train Headway, +0.4m Caution Aspect.',
    oneSentence: 'The system explains the exact operational reasons behind the delay in plain English.',
    actionSummary: 'Transparent explainability replaces "black-box" predictions for controllers.',
    stateImpact: 'Top Driver: Section Congestion (+3.8m, 63% contribution)',
    beforeTime: '18:40',
    afterTime: '18:46',
    changeText: '+6 min',
    primaryReason: 'Section Congestion & Preceding Train',
    whatYouSee: 'The "Why Did ETA Change?" card highlights Section Congestion and Preceding Train Headway.',
    whatHappened: 'Feature attribution decomposes the net delay into human-understandable causes.',
    whatToSay: '"This is the core differentiator: RailCast does not just change the number—it explains WHY. Evaluators can see that congestion accounts for 63% of the change."',
    activeConditions: { congestion: true, speedRestriction: true },
    kmPosition: 434,
    expectedDelay: 6,
    confidence: 82,
    coreStoryStage: 'Explain',
  },
  {
    step: 8,
    title: 'Confidence Changes',
    tagline: 'Epistemic uncertainty expands variance bounds [P10–P90]',
    description:
      'Confidence score adjusts to 84% due to dynamic variance. The expected arrival range broadens to [18:43 – 18:49] reflecting sectional clearance uncertainty.',
    oneSentence: 'Prediction confidence reflects track uncertainty instead of presenting a false precision.',
    actionSummary: 'Confidence meter updates: 84% (Moderate/High Operational Certainty).',
    stateImpact: 'Range broadened: ±3 min buffer around central ETA',
    beforeTime: '18:46',
    afterTime: '18:46',
    changeText: 'Range: 18:43–18:49',
    primaryReason: 'Uncertainty Adjustment',
    whatYouSee: 'Confidence updates to 84% and the arrival interval widens to [18:43 – 18:49].',
    whatHappened: 'Dynamic variance model accounts for possible block clearance delays.',
    whatToSay: '"Rather than giving a falsely confident single minute, the engine widens the prediction interval to reflect operational uncertainty."',
    activeConditions: { congestion: true },
    kmPosition: 437,
    expectedDelay: 6,
    confidence: 84,
    coreStoryStage: 'Explain',
  },
  {
    step: 9,
    title: 'Congestion Clears',
    tagline: 'Section controller clears headway; signal aspect turns Green',
    description:
      'Preceding rake loops into siding at Madhira. Block section clearance verified by axle counters. Sectional caution restriction removed.',
    oneSentence: 'Preceding traffic clears the block and the signal aspect upgrades back to green.',
    actionSummary: 'Signal upgrades to Green Aspect. Train accelerates back towards 110 km/h.',
    stateImpact: 'Congestion cleared · Effective speed recovers to 105 km/h',
    beforeTime: '18:46',
    afterTime: '18:44',
    changeText: 'Recovering (-2 min)',
    primaryReason: 'Block Clearance & Green Aspect',
    whatYouSee: 'Signal aspect switches to Green and speed increases back to 105 km/h.',
    whatHappened: 'Axle counters confirm block section clearance; line capacity restored.',
    whatToSay: '"The congestion clears. The preceding train moves into a loop line, the signal turns green, and our locomotive accelerates back to operational speed."',
    activeConditions: {},
    kmPosition: 442,
    expectedDelay: 4,
    confidence: 89,
    coreStoryStage: 'Detect Event',
  },
  {
    step: 10,
    title: 'ETA Begins Recovering',
    tagline: 'Slack-time absorption model recovers schedule margin',
    description:
      'RailCast AI dynamically applies engineering make-up allowance (slack recovery). As train maintains 105 km/h, the downstream delay reduces from +6m down to +4m.',
    oneSentence: 'Timetable slack and dwell buffers are absorbed to recover lost minutes.',
    actionSummary: 'Recovery curve updates downstream station arrival forecasts.',
    stateImpact: 'Predicted arrival tightened: Khammam ETA recovers to 18:44 (+4m)',
    beforeTime: '18:46',
    afterTime: '18:44',
    changeText: '+4 min (recovering)',
    primaryReason: 'Schedule Slack Absorption',
    whatYouSee: 'ETA tightens from 18:46 back to 18:44; delay reduces from +6m to +4m.',
    whatHappened: 'Physics-informed slack recovery model absorbs 2 minutes of the initial delay.',
    whatToSay: '"Static NTES would continue assuming a permanent +6 minute delay. RailCast recognizes that scheduled slack allows the train to recover 2 minutes."',
    activeConditions: {},
    kmPosition: 448,
    expectedDelay: 4,
    confidence: 91,
    coreStoryStage: 'Recalculate',
  },
  {
    step: 11,
    title: 'Train Reaches a Station',
    tagline: 'Physical arrival timestamp recorded by station data logger',
    description:
      'Train 12723 enters Khammam (KMT) Platform 1 at 18:44 IST (actual +4 min delay against scheduled 18:40). Axle counter confirms platform occupation.',
    oneSentence: 'The train berths at Khammam station, and the exact arrival timestamp is logged.',
    actionSummary: 'Arrival recorded: Actual arrival time 18:44 IST (+4 min delay).',
    stateImpact: 'Station: Khammam Jn · Status: Arrived Platform 1',
    beforeTime: '18:44 (Pred)',
    afterTime: '18:44 (Act)',
    changeText: '0 min Residual',
    primaryReason: 'Platform Berthing Logged',
    whatYouSee: 'Train berths at Khammam Platform 1 at 18:44 IST.',
    whatHappened: 'Track circuit records wheel contact on platform line; event sent to verification store.',
    whatToSay: '"The train berths at Khammam at 18:44 IST. The physical arrival is captured by the station data logger."',
    activeConditions: {},
    kmPosition: 456,
    expectedDelay: 4,
    confidence: 96,
    coreStoryStage: 'Compare',
  },
  {
    step: 12,
    title: 'Predicted vs Actual Arrival is Calculated',
    tagline: 'Closed-loop residual comparison generates real-time evaluation',
    description:
      'The engine computes the prediction residual: Predicted ETA was 18:44, Actual Arrival was 18:44. Absolute Error = 0.2 min (within ±5 min tolerance window).',
    oneSentence: 'The residual error between predicted ETA and actual arrival is computed.',
    actionSummary: 'Station verification logged: Error = 0.2 min (99% accuracy).',
    stateImpact: 'MAE on this section: 0.2 min · Residual logged to model store',
    beforeTime: '18:44 (Pred)',
    afterTime: '18:44 (Act)',
    changeText: 'Error: 0.2 min',
    primaryReason: 'Residual Evaluation',
    whatYouSee: 'Residual comparison logged: Predicted 18:44 vs Actual 18:44 = 0.2 min error.',
    whatHappened: 'Closed-loop residual verification module assesses prediction accuracy.',
    whatToSay: '"The system immediately compares the prediction against reality. The prediction was 18:44, the actual was 18:44—a residual error of under 30 seconds."',
    activeConditions: {},
    kmPosition: 456,
    expectedDelay: 4,
    confidence: 96,
    coreStoryStage: 'Compare',
  },
  {
    step: 13,
    title: 'Feedback Updates the Sectional Estimate',
    tagline: 'Online learning feedback loop refines historical sectional weights',
    description:
      'The closed-loop feedback pipeline automatically adjusts the sectional running coefficient for BZA–KMT by +0.2m. Future predictions across this corridor inherit improved precision.',
    oneSentence: 'The error residual updates historical section weights so the system learns from today’s run.',
    actionSummary: 'Sectional prior updated: BZA → KMT calibrated weight updated in feature store.',
    stateImpact: 'Feedback loop complete: Model learns from today’s operational conditions',
    beforeTime: '18:44',
    afterTime: '18:44',
    changeText: 'Model Refined',
    primaryReason: 'Closed-Loop Online Feedback',
    whatYouSee: 'Section historical running time calibrated by +0.2 min in the Feedback Loop table.',
    whatHappened: 'Residual feedback adjusts section prior weights for future forecasting runs.',
    whatToSay: '"Finally, the loop closes: the residual feeds back into the section baseline weights. Tomorrow’s forecast across this corridor will be even more accurate. Observe → Detect → Predict → Explain → Update → Learn."',
    activeConditions: {},
    kmPosition: 456,
    expectedDelay: 4,
    confidence: 95,
    coreStoryStage: 'Learn',
  },
];

interface GuidedDemoBarProps {
  currentStepIndex: number;
  isDemoActive: boolean;
  onStartDemo: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onPauseResumeDemo: () => void;
  onResetDemo: () => void;
}

export const GuidedDemoBar: React.FC<GuidedDemoBarProps> = ({
  currentStepIndex,
  isDemoActive,
  onStartDemo,
  onNextStep,
  onPrevStep,
  onPauseResumeDemo,
  onResetDemo,
}) => {
  const currentStep = GUIDED_DEMO_STEPS[currentStepIndex] || GUIDED_DEMO_STEPS[0];
  const progressPercent = Math.round(((currentStepIndex + 1) / GUIDED_DEMO_STEPS.length) * 100);
  const [showPresenterCues, setShowPresenterCues] = useState<boolean>(true);

  return (
    <div className="bg-white border-2 border-blue-600 rounded-xl shadow-md overflow-hidden">
      {/* Top Banner / Progress Indicator */}
      <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-600 text-white">
            <Sparkles className="w-4 h-4 text-cyan-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-300">
                SIH Evaluator Guided Demonstration
              </span>
              <span className="text-[11px] bg-blue-900 text-cyan-200 font-mono px-2 py-0.5 rounded font-bold">
                13-STEP CORE STORY
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-200">
              Observe → Detect → Predict → Explain → Update → Learn
            </div>
          </div>
        </div>

        {/* Step Progress & Controls */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block mr-2 font-mono">
            <div className="text-[10px] text-slate-400 uppercase">Demonstration Progress</div>
            <div className="text-xs font-bold text-white">
              Step {currentStep.step} of {GUIDED_DEMO_STEPS.length} ({progressPercent}%)
            </div>
          </div>

          {!isDemoActive ? (
            <button
              onClick={onStartDemo}
              className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold rounded-lg text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Guided Demo</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onPauseResumeDemo}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1 cursor-pointer border border-slate-700"
                title="Pause / Resume Automatic Demo Advance"
              >
                <Pause className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pause</span>
              </button>

              <button
                onClick={onPrevStep}
                disabled={currentStepIndex === 0}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-xs flex items-center gap-1 cursor-pointer border border-slate-700"
                title="Previous Step"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                onClick={onNextStep}
                disabled={currentStepIndex === GUIDED_DEMO_STEPS.length - 1}
                className="px-4 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold rounded-lg text-xs sm:text-sm flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Next Step"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onResetDemo}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs flex items-center gap-1 cursor-pointer border border-slate-700"
                title="Reset Demo to Step 1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-slate-200 h-1.5">
        <div
          className="bg-cyan-500 h-1.5 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Presentation Step Showcase */}
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 space-y-4">
        {/* Step Badge, Headline & Core Sentence */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-extrabold bg-blue-600 text-white">
                DEMO STEP {currentStep.step} OF 13
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                {currentStep.coreStoryStage}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              {currentStep.title}
            </h3>
            <p className="text-sm font-semibold text-blue-800 mt-0.5">
              &ldquo;{currentStep.oneSentence}&rdquo;
            </p>
          </div>

          {/* Quick Presenter Cues Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPresenterCues((prev) => !prev)}
              className="text-xs font-semibold text-slate-700 hover:text-blue-700 bg-white border border-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>{showPresenterCues ? 'Hide Presenter Notes' : 'Show Presenter Notes (What to Say)'}</span>
            </button>
          </div>
        </div>

        {/* Before / After / Change / Reason Showcase Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              Before
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-slate-700 tabular-nums">
              {currentStep.beforeTime}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              After (Recalculated)
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-blue-700 tabular-nums">
              {currentStep.afterTime}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              Change
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-amber-700 tabular-nums">
              {currentStep.changeText}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              Primary Reason
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {currentStep.primaryReason}
            </div>
          </div>
        </div>

        {/* Presenter Assistance Panel (What You See, What Happened, What to Say) */}
        {showPresenterCues && (
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2.5 text-xs text-slate-800">
            <div className="flex items-center gap-1.5 text-blue-900 font-extrabold text-[11px] uppercase tracking-wider">
              <Volume2 className="w-4 h-4 text-blue-700" />
              <span>SIH Presentation Assistance (Evaluator Walkthrough Notes)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                  <span>👁️</span> WHAT YOU SEE:
                </span>
                <p className="text-slate-600 leading-relaxed font-sans">{currentStep.whatYouSee}</p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                  <span>⚙️</span> WHAT HAPPENED:
                </span>
                <p className="text-slate-600 leading-relaxed font-sans">{currentStep.whatHappened}</p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-1">
                <span className="font-bold text-blue-900 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                  <span>🗣️</span> WHAT TO SAY TO EVALUATOR:
                </span>
                <p className="text-blue-950 font-medium italic leading-relaxed font-sans">
                  {currentStep.whatToSay}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step Quick-Jump Buttons */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
            Jump to Step:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {GUIDED_DEMO_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => {
                  const event = new CustomEvent('jump_demo_step', { detail: { stepIndex: idx } });
                  window.dispatchEvent(event);
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                  idx === currentStepIndex
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-300'
                }`}
                title={`Step ${s.step}: ${s.title}`}
              >
                S{s.step}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
