/**
 * RailCast AI — Explainable Hybrid ETA Forecasting Model for Indian Railways
 * Smart India Hackathon 2026 | Problem Statement ID: 26028
 * Organization: Ministry of Railways | Category: Software | Theme: Smart Automation
 *
 * Core Value Cycle:
 * OBSERVE → DETECT → PREDICT → EXPLAIN → UPDATE → LEARN
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { OverviewHero } from './components/OverviewHero';
import { SimpleJourneyTrack } from './components/SimpleJourneyTrack';
import { LiveEtaForecastSection } from './components/LiveEtaForecastSection';
import { SimpleWhyEtaChangedCard } from './components/SimpleWhyEtaChangedCard';
import { CoreIntelligenceFlow } from './components/CoreIntelligenceFlow';
import { SimpleEventControls } from './components/SimpleEventControls';
import { WhyRailcastCard } from './components/WhyRailcastCard';
import { SixtySecondExplainerModal } from './components/SixtySecondExplainerModal';
import { SihDemoScriptView } from './components/SihDemoScriptView';

// Existing technical components preserved 100%
import { TopKpiGrid } from './components/TopKpiGrid';
import { TrainStatusCard } from './components/TrainStatusCard';
import { RouteMapSchematic } from './components/RouteMapSchematic';
import { SimulationControls } from './components/SimulationControls';
import { StationEtaTable } from './components/StationEtaTable';
import { CurrentVsHistoricalCard } from './components/CurrentVsHistoricalCard';
import { ExplainableEtaPanel } from './components/ExplainableEtaPanel';
import { PredictionConfidencePanel } from './components/PredictionConfidencePanel';
import { DataQualityMonitor } from './components/DataQualityMonitor';
import { PredictionFeedbackLoop } from './components/PredictionFeedbackLoop';
import { OperationalTimeline } from './components/OperationalTimeline';
import { EtaComparisonChart } from './components/EtaComparisonChart';
import { EtaTrendChart } from './components/EtaTrendChart';
import { TrainAnalysisView } from './components/TrainAnalysisView';
import { NetworkAnalyticsView } from './components/NetworkAnalyticsView';
import { PassengerView } from './components/PassengerView';
import { StationDisplayView } from './components/StationDisplayView';
import { ControlRoomView } from './components/ControlRoomView';
import { MultiTrainFleetView } from './components/MultiTrainFleetView';
import { GuidedDemoBar, GUIDED_DEMO_STEPS } from './components/GuidedDemoBar';
import { SystemArchitectureView } from './components/SystemArchitectureView';
import { ApiDemonstrationView } from './components/ApiDemonstrationView';

import {
  ROUTE_STATIONS,
  TELANGANA_EXPRESS_TELEMETRY,
  INITIAL_DISRUPTIONS,
  HISTORICAL_SECTION_PERFORMANCE,
  DEFAULT_OPERATIONAL_CONDITIONS,
} from './data/telanganaExpress';
import {
  calculateETA,
  buildEtaTrendPoints,
  minutesToTimeString,
} from './engine/simulationEngine';
import {
  OperationalDisruption,
  DynamicStationETA,
  RailwayOperationalConditions,
  PipelineNotification,
  WeatherState,
  GpsStatus,
  StationFeedbackRecord,
  LiveTimelineEvent,
  ConsumerTab,
} from './types/railway';
import { Sliders, Eye } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ConsumerTab>('live_operations');
  const [isTechnicalMode, setIsTechnicalMode] = useState<boolean>(false);
  const [isExplainerOpen, setIsExplainerOpen] = useState<boolean>(false);
  const [showDetailedSchematic, setShowDetailedSchematic] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeedMultiplier, setSimSpeedMultiplier] = useState<number>(2);
  const [currentKilometer, setCurrentKilometer] = useState<number>(418); // Started in BZA - KMT section
  const [selectedStationId, setSelectedStationId] = useState<string | null>('KMT');

  // Baseline disruptions
  const [disruptions, setDisruptions] = useState<OperationalDisruption[]>(INITIAL_DISRUPTIONS);

  // The 9 SIH Railway Operational Conditions State
  const [conditions, setConditions] = useState<RailwayOperationalConditions>(DEFAULT_OPERATIONAL_CONDITIONS);

  // Real-time Pipeline Notification Event for visual demonstration
  const [latestPipelineEvent, setLatestPipelineEvent] = useState<PipelineNotification | null>({
    id: 'init-pipe',
    eventTitle: 'System Initialized in Live Operations Mode',
    trainStateChange: 'Train 12723 En Route BZA → KMT',
    etaRecalculationNote: 'Dynamic calculateETA() active',
    confidenceDelta: 'Confidence 94% Nominal',
    timestamp: '13:00 IST',
  });

  // Track previous ETAs for the 3-curve trend chart (Scheduled vs Previous vs Current)
  const [previousETAs, setPreviousETAs] = useState<DynamicStationETA[] | null>(null);

  // Prediction Feedback Records (Prototype Feedback Loop)
  const [feedbackRecords, setFeedbackRecords] = useState<StationFeedbackRecord[]>([
    {
      id: 'fb-1',
      stationCode: 'SC',
      stationName: 'Secunderabad Jn',
      distanceKm: 10,
      predictedTime: '06:20',
      actualTime: '06:22',
      errorMinutes: 2,
      historicalAdjustedMinutes: 0.4,
      timestamp: '06:22 IST',
    },
    {
      id: 'fb-2',
      stationCode: 'KZJ',
      stationName: 'Kazipet Jn',
      distanceKm: 142,
      predictedTime: '08:00',
      actualTime: '08:01',
      errorMinutes: 1,
      historicalAdjustedMinutes: 0.2,
      timestamp: '08:01 IST',
    },
    {
      id: 'fb-3',
      stationCode: 'WL',
      stationName: 'Warangal',
      distanceKm: 152,
      predictedTime: '08:18',
      actualTime: '08:18',
      errorMinutes: 0,
      historicalAdjustedMinutes: 0,
      timestamp: '08:18 IST',
    },
    {
      id: 'fb-4',
      stationCode: 'BZA',
      stationName: 'Vijayawada Jn',
      distanceKm: 360,
      predictedTime: '11:20',
      actualTime: '11:24',
      errorMinutes: 4,
      historicalAdjustedMinutes: 0.8,
      timestamp: '11:24 IST',
    },
  ]);

  // Comprehensive Live Timeline Events (Audit Trail for Evaluator)
  const [timelineEvents, setTimelineEvents] = useState<LiveTimelineEvent[]>([
    {
      id: 'tl-1',
      category: 'movement',
      title: 'Train Traversed Section WL → BZA',
      description: 'Locomotive WAP-7 completed 208 km automatic block run at average 108 km/h.',
      impact: 'Section Complete',
      timestamp: '11:15 IST',
      severity: 'nominal',
    },
    {
      id: 'tl-2',
      category: 'arrival',
      title: 'Arrival at Vijayawada Jn (PF 7)',
      description: 'Platform 7 berthing completed. Dwell buffer compressed to 11 mins.',
      impact: 'Dwell Active',
      timestamp: '11:24 IST',
      severity: 'nominal',
    },
    {
      id: 'tl-3',
      category: 'feedback',
      title: 'Prediction Error Recorded: BZA',
      description: 'Predicted: 11:20 | Actual: 11:24 | Residual: +4 min. Section baseline updated by +0.8m.',
      impact: '+4m Error Feedback',
      timestamp: '11:25 IST',
      severity: 'caution',
    },
    {
      id: 'tl-4',
      category: 'movement',
      title: 'Departed Vijayawada Jn onto BZA → KMT Section',
      description: 'Accelerated through diamond junction crossover onto Up Main Line.',
      impact: 'Speed 94 km/h',
      timestamp: '11:35 IST',
      severity: 'nominal',
    },
    {
      id: 'tl-5',
      category: 'operational',
      title: 'Engineering Caution Order Imposed (30 km/h)',
      description: 'P-Way ballast tamping between Km 435-442. Speed ceiling enforced in loco cab.',
      impact: '+14m Section Delay',
      timestamp: '12:15 IST',
      severity: 'caution',
    },
    {
      id: 'tl-6',
      category: 'recalculation',
      title: 'Downstream ETAs Recalculated',
      description: 'Predicted arrival at Khammam shifted from 13:05 to 13:28. Confidence: 94%.',
      impact: 'ETA Updated',
      timestamp: '12:16 IST',
      severity: 'caution',
    },
  ]);

  const totalDistanceKm = ROUTE_STATIONS[ROUTE_STATIONS.length - 1].distanceKm;
  const eventsSectionRef = useRef<HTMLDivElement | null>(null);

  // Compute simulated clock time
  const journeyDurationMinutes = 28.5 * 60;
  const currentSimMinutes = 360 + (currentKilometer / totalDistanceKm) * journeyDurationMinutes;
  const simTimeFormatted = minutesToTimeString(currentSimMinutes);

  // Compute current instantaneous train speed
  let currentSpeed = 108;
  let isHaltedAtStation = false;

  for (let i = 0; i < ROUTE_STATIONS.length; i++) {
    const st = ROUTE_STATIONS[i];
    const dist = Math.abs(currentKilometer - st.distanceKm);
    if (dist <= 1.8 && i > 0 && i < ROUTE_STATIONS.length - 1) {
      isHaltedAtStation = true;
      currentSpeed = 0;
      break;
    }
  }

  if (!isHaltedAtStation) {
    const variation = ((Math.round(currentKilometer) * 5) % 11) - 5;
    currentSpeed = Math.max(25, currentSpeed + variation);
  }

  // CORE ENGINE INVOCATION: calculateETA()
  const etaForecast = calculateETA({
    currentKm: currentKilometer,
    currentSimTimeMinutes: currentSimMinutes,
    currentSpeedKmH: currentSpeed,
    disruptions,
    conditions,
    stations: ROUTE_STATIONS,
    historicalSections: HISTORICAL_SECTION_PERFORMANCE,
  });

  // Train progression simulation timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentKilometer((prevKm) => {
        if (prevKm >= totalDistanceKm) {
          return 0; // Loop back
        }
        const activeSpeed = etaForecast.effectiveSpeedKmH;
        if (activeSpeed === 0) {
          return prevKm; // Train is stopped at signal or ACP halt!
        }
        const advanceKm = (activeSpeed / 3600) * 1.5 * simSpeedMultiplier * 16;
        return Math.min(totalDistanceKm, prevKm + advanceKm);
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeedMultiplier, totalDistanceKm, etaForecast.effectiveSpeedKmH]);

  // Snapshot previous ETAs periodically
  const prevKmRef = useRef<number>(currentKilometer);
  useEffect(() => {
    if (Math.abs(currentKilometer - prevKmRef.current) > 35 || previousETAs === null) {
      setPreviousETAs(etaForecast.stationETAs);
      prevKmRef.current = currentKilometer;
    }
  }, [currentKilometer, conditions, disruptions]);

  // Derived metrics
  const progressPercentage = (currentKilometer / totalDistanceKm) * 100;
  const currentStation = ROUTE_STATIONS[etaForecast.currentStationIndex];
  const nextStationIndex = Math.min(etaForecast.currentStationIndex + 1, ROUTE_STATIONS.length - 1);
  const nextStation = ROUTE_STATIONS[nextStationIndex];

  // Location string
  let currentLocationName = '';
  if (conditions.signalHalt.active) {
    currentLocationName = `HALTED @ Automatic Signal #414 (Danger Aspect)`;
  } else if (conditions.unscheduledStop.active) {
    currentLocationName = `UNSCHEDULED STOP @ Km ${Math.round(currentKilometer)} (ACP Alarm Chain)`;
  } else if (isHaltedAtStation) {
    currentLocationName = `Platform ${currentStation.platform.replace('PF ', '')} @ ${currentStation.name} (${currentStation.code})`;
  } else if (etaForecast.currentStationIndex === ROUTE_STATIONS.length - 1) {
    currentLocationName = `Terminal Arrival: ${currentStation.name} (${currentStation.code})`;
  } else {
    currentLocationName = `Section: ${currentStation.code} → ${nextStation.code} (Km ${Math.round(currentKilometer)})`;
  }

  // Next station ETA
  const nextEta = etaForecast.stationETAs.find((s) => s.stationId === nextStation.id);
  const nextStationETA = nextEta ? nextEta.predictedArrival : nextStation.scheduledArrival;
  const nextStationSTA = nextStation.scheduledArrival;

  // Build ETA trend points (Scheduled vs Previous vs Current)
  const etaTrendPoints = buildEtaTrendPoints(
    etaForecast.stationETAs,
    previousETAs,
    ROUTE_STATIONS
  );

  // Check if train newly reached upcoming station to log into Prototype Feedback Loop
  const recordedStationIdsRef = useRef<Set<string>>(new Set(['SC', 'KZJ', 'WL', 'BZA']));
  useEffect(() => {
    const reachedStation = ROUTE_STATIONS.find(
      (st) => Math.abs(currentKilometer - st.distanceKm) <= 1.5 && !recordedStationIdsRef.current.has(st.code)
    );

    if (reachedStation) {
      recordedStationIdsRef.current.add(reachedStation.code);
      const etaEntry = etaForecast.stationETAs.find((s) => s.stationCode === reachedStation.code);
      const predictedTime = etaEntry?.predictedArrival || reachedStation.scheduledArrival;
      const actualTime = simTimeFormatted;

      const [pH, pM] = predictedTime.split(':').map(Number);
      const [aH, aM] = actualTime.split(':').map(Number);
      const errorMins = Math.round(((aH || 0) * 60 + (aM || 0)) - ((pH || 0) * 60 + (pM || 0)));
      const adjustedMins = Number((errorMins * 0.2).toFixed(1));

      const newRecord: StationFeedbackRecord = {
        id: `fb-${Date.now()}`,
        stationCode: reachedStation.code,
        stationName: reachedStation.name,
        distanceKm: reachedStation.distanceKm,
        predictedTime,
        actualTime,
        errorMinutes: errorMins,
        historicalAdjustedMinutes: adjustedMins,
        timestamp: simTimeFormatted,
      };

      setFeedbackRecords((prev) => [newRecord, ...prev]);

      // Automatically append to live event timeline
      const newTimelineItem: LiveTimelineEvent = {
        id: `tl-${Date.now()}`,
        category: 'feedback',
        title: `Station Arrival & Feedback Logged: ${reachedStation.code}`,
        description: `Predicted: ${predictedTime} | Actual: ${actualTime} | Error: ${errorMins >= 0 ? `+${errorMins}` : errorMins} min. Section baseline adjusted by ${adjustedMins >= 0 ? `+${adjustedMins}` : adjustedMins}m.`,
        impact: `${errorMins >= 0 ? `+${errorMins}m` : `${errorMins}m`} Error`,
        timestamp: simTimeFormatted,
        severity: Math.abs(errorMins) <= 2 ? 'nominal' : 'caution',
      };

      setTimelineEvents((prev) => [newTimelineItem, ...prev]);
    }
  }, [currentKilometer, simTimeFormatted]);

  // Playback handlers
  const handlePlayToggle = () => setIsPlaying((prev) => !prev);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentKilometer(0);
    setDisruptions(INITIAL_DISRUPTIONS);
    setConditions(DEFAULT_OPERATIONAL_CONDITIONS);
    setSelectedStationId(ROUTE_STATIONS[0].id);
    setPreviousETAs(null);
    setLatestPipelineEvent({
      id: `pipe-${Date.now()}`,
      eventTitle: 'Simulation Reset',
      trainStateChange: 'Train reset to origin HYB (0 km)',
      etaRecalculationNote: 'Timetable restored to baseline',
      confidenceDelta: 'Confidence 98%',
      timestamp: '06:00 IST',
    });
  };

  const handleScrubKm = (km: number) => {
    setPreviousETAs(etaForecast.stationETAs);
    setCurrentKilometer(km);
  };

  // Operational Condition Event Handlers (Triggering full pipeline)
  const handleToggleCondition = (key: keyof RailwayOperationalConditions) => {
    setPreviousETAs(etaForecast.stationETAs);

    setConditions((prev) => {
      const updated = { ...prev };

      if (key === 'downstreamCongestion') {
        const nextState = !prev.downstreamCongestion.active;
        updated.downstreamCongestion = { ...prev.downstreamCongestion, active: nextState };
        setLatestPipelineEvent({
          id: `pipe-${Date.now()}`,
          eventTitle: nextState ? 'EVENT: Downstream Congestion Activated' : 'EVENT: Downstream Congestion Cleared',
          trainStateChange: nextState ? 'Throughput throttled 35% on BZA-KMT' : 'Section clear',
          etaRecalculationNote: nextState ? '+12m delay propagated downstream' : 'Slack recovery restored',
          confidenceDelta: nextState ? '-8% confidence' : '+8% confidence',
          timestamp: simTimeFormatted,
        });
        setTimelineEvents((tl) => [
          {
            id: `tl-${Date.now()}`,
            category: 'congestion',
            title: nextState ? 'Downstream Section Congestion Injected' : 'Downstream Congestion Cleared',
            description: nextState ? 'Throughput on BZA-KMT throttled by 35% due to platform track occupancy.' : 'Throughput restored to nominal 100%.',
            impact: nextState ? '+12m Delay' : 'Clear',
            timestamp: simTimeFormatted,
            severity: nextState ? 'alert' : 'nominal',
          },
          ...tl,
        ]);
      } else if (key === 'precedingTrain') {
        const nextState = !prev.precedingTrain.active;
        updated.precedingTrain = { ...prev.precedingTrain, active: nextState };
        setLatestPipelineEvent({
          id: `pipe-${Date.now()}`,
          eventTitle: nextState ? 'EVENT: Preceding Train Delay Detected' : 'EVENT: Headway Cleared',
          trainStateChange: nextState ? 'Preceding Train 12626 running +26m late' : 'Normal headway restored',
          etaRecalculationNote: nextState ? '+10m delay propagated downstream' : 'Nominal block clearance',
          confidenceDelta: nextState ? '-6% confidence' : '+6% confidence',
          timestamp: simTimeFormatted,
        });
        setTimelineEvents((tl) => [
          {
            id: `tl-${Date.now()}`,
            category: 'operational',
            title: nextState ? 'Preceding Train #12626 Delay Detected' : 'Preceding Train Headway Restored',
            description: nextState ? 'Train 12626 Kerala Express running +26m late ahead in the block. Safe braking distance narrowed.' : 'Safe block headway clearance restored.',
            impact: nextState ? '+10m Impact' : 'Nominal',
            timestamp: simTimeFormatted,
            severity: nextState ? 'caution' : 'nominal',
          },
          ...tl,
        ]);
      } else if (key === 'signalHalt') {
        const nextState = !prev.signalHalt.active;
        updated.signalHalt = { ...prev.signalHalt, active: nextState };
        setLatestPipelineEvent({
          id: `pipe-${Date.now()}`,
          eventTitle: nextState ? 'EVENT: Signal Halt at Red Aspect' : 'EVENT: Signal Aspect Cleared to Green',
          trainStateChange: nextState ? 'Train Speed: 0 km/h (Loco Halted)' : 'Locomotive accelerated to 110 km/h',
          etaRecalculationNote: nextState ? '+6m delay propagated downstream' : 'Signal delay cleared',
          confidenceDelta: nextState ? '-4% confidence' : 'Nominal confidence',
          timestamp: simTimeFormatted,
        });
        setTimelineEvents((tl) => [
          {
            id: `tl-${Date.now()}`,
            category: 'speed',
            title: nextState ? 'Train Halted at Red Automatic Signal #414' : 'Signal Aspect Cleared: Green',
            description: nextState ? 'Locomotive emergency brake applied at automatic signal red aspect awaiting block clearance.' : 'Line clear received. WAP-7 locomotive accelerating.',
            impact: nextState ? 'Speed: 0 km/h (+6m)' : 'Nominal Speed',
            timestamp: simTimeFormatted,
            severity: nextState ? 'alert' : 'nominal',
          },
          ...tl,
        ]);
      } else if (key === 'speedRestriction') {
        const nextState = !prev.speedRestriction.active;
        updated.speedRestriction = { ...prev.speedRestriction, active: nextState };
        setLatestPipelineEvent({
          id: `pipe-${Date.now()}`,
          eventTitle: nextState ? 'EVENT: Caution Order 70 km/h Enforced' : 'EVENT: Caution Order Cancelled',
          trainStateChange: nextState ? 'Train speed capped at 70 km/h' : 'Restored to 130 km/h MPS',
          etaRecalculationNote: nextState ? '+11m delay propagated downstream' : 'Full speed recovered',
          confidenceDelta: nextState ? '-3% confidence' : 'Confidence restored',
          timestamp: simTimeFormatted,
        });
        setTimelineEvents((tl) => [
          {
            id: `tl-${Date.now()}`,
            category: 'speed',
            title: nextState ? 'Temporary Speed Restriction (70 km/h)' : 'Speed Restriction Lifted',
            description: nextState ? 'P-Way engineering caution order enforced between Km 435-442.' : 'Track geometry certified for 130 km/h MPS.',
            impact: nextState ? 'Speed: 70 km/h (+11m)' : 'Speed: 130 km/h',
            timestamp: simTimeFormatted,
            severity: nextState ? 'caution' : 'nominal',
          },
          ...tl,
        ]);
      } else if (key === 'unscheduledStop') {
        const nextState = !prev.unscheduledStop.active;
        updated.unscheduledStop = { ...prev.unscheduledStop, active: nextState };
        setLatestPipelineEvent({
          id: `pipe-${Date.now()}`,
          eventTitle: nextState ? 'EVENT: Unscheduled Stoppage (5 mins)' : 'EVENT: Train Resumed Departure',
          trainStateChange: nextState ? 'Train Speed: 0 km/h (ACP Test)' : 'Locomotive accelerated on mainline',
          etaRecalculationNote: nextState ? '+5m delay propagated downstream' : 'Timetable updated',
          confidenceDelta: nextState ? '-4% confidence' : 'Confidence restored',
          timestamp: simTimeFormatted,
        });
        setTimelineEvents((tl) => [
          {
            id: `tl-${Date.now()}`,
            category: 'operational',
            title: nextState ? 'Unscheduled Stop: Alarm Chain Pulling (ACP)' : 'Unscheduled Stop Resolved',
            description: nextState ? 'Guard and Loco Pilot conducting brake pipe pressure continuity check.' : 'Air pressure restored. Proceeding with caution.',
            impact: nextState ? '5m Pause (+5m)' : 'Departed',
            timestamp: simTimeFormatted,
            severity: nextState ? 'alert' : 'nominal',
          },
          ...tl,
        ]);
      } else if (key === 'maintenanceBlock') {
        const nextState = !prev.maintenanceBlock.active;
        updated.maintenanceBlock = { ...prev.maintenanceBlock, active: nextState };
        setLatestPipelineEvent({
          id: `pipe-${Date.now()}`,
          eventTitle: nextState ? 'EVENT: Maintenance Block Enforced' : 'EVENT: Maintenance Block Lifted',
          trainStateChange: nextState ? 'OHE Power block on ET-BPL section' : 'Normal track voltage',
          etaRecalculationNote: nextState ? '+18m delay propagated downstream' : 'Section speed restored',
          confidenceDelta: nextState ? '-8% confidence' : '+8% confidence',
          timestamp: simTimeFormatted,
        });
        setTimelineEvents((tl) => [
          {
            id: `tl-${Date.now()}`,
            category: 'operational',
            title: nextState ? 'OHE Maintenance Traffic Block Active' : 'Maintenance Block Lifted',
            description: nextState ? 'Traction electrical team replacement work on Itarsi-Bhopal section.' : 'Power isolation block cleared.',
            impact: nextState ? '+18m Delay' : 'Cleared',
            timestamp: simTimeFormatted,
            severity: nextState ? 'caution' : 'nominal',
          },
          ...tl,
        ]);
      } else if (key === 'levelCrossing') {
        const nextState = !prev.levelCrossing.active;
        updated.levelCrossing = { ...prev.levelCrossing, active: nextState };
        setLatestPipelineEvent({
          id: `pipe-${Date.now()}`,
          eventTitle: nextState ? 'EVENT: Level Crossing Gate Detention' : 'EVENT: LC Gate Interlocked Clear',
          trainStateChange: nextState ? 'LC-74 road traffic delay' : 'Gate closed and interlocked',
          etaRecalculationNote: nextState ? '+7m delay propagated downstream' : 'Cleared for run-through',
          confidenceDelta: nextState ? '-3% confidence' : 'Confidence restored',
          timestamp: simTimeFormatted,
        });
        setTimelineEvents((tl) => [
          {
            id: `tl-${Date.now()}`,
            category: 'operational',
            title: nextState ? 'Level Crossing Gate Detention (LC-74)' : 'Level Crossing Gate Cleared',
            description: nextState ? 'Emergency road vehicle clearance hold on manned gate LC-74 before signal interlocking.' : 'Interlock clear signal received.',
            impact: nextState ? '+7m Delay' : 'Cleared',
            timestamp: simTimeFormatted,
            severity: nextState ? 'caution' : 'nominal',
          },
          ...tl,
        ]);
      }

      return updated;
    });
  };

  const handleCycleWeather = () => {
    setPreviousETAs(etaForecast.stationETAs);
    const weatherCycle: WeatherState[] = ['normal', 'rain', 'poor_visibility', 'severe_weather'];
    const nextIdx = (weatherCycle.indexOf(conditions.weather) + 1) % weatherCycle.length;
    const nextWeather = weatherCycle[nextIdx];

    setConditions((prev) => ({ ...prev, weather: nextWeather }));

    setLatestPipelineEvent({
      id: `pipe-${Date.now()}`,
      eventTitle: `EVENT: Weather Updated to ${nextWeather.replace('_', ' ').toUpperCase()}`,
      trainStateChange:
        nextWeather === 'severe_weather'
          ? 'Speed capped at 50 km/h'
          : nextWeather === 'poor_visibility'
          ? 'FOG Pass device active (75 km/h)'
          : nextWeather === 'rain'
          ? 'Speed capped at 100 km/h'
          : 'Clear weather conditions (130 km/h MPS)',
      etaRecalculationNote:
        nextWeather === 'severe_weather'
          ? '+25m corridor delay propagated'
          : nextWeather === 'poor_visibility'
          ? '+14m corridor delay propagated'
          : nextWeather === 'rain'
          ? '+4m corridor delay propagated'
          : 'Nominal travel times',
      confidenceDelta:
        nextWeather === 'severe_weather'
          ? '-20% confidence'
          : nextWeather === 'poor_visibility'
          ? '-12% confidence'
          : nextWeather === 'rain'
          ? '-5% confidence'
          : 'High confidence restored',
      timestamp: simTimeFormatted,
    });

    setTimelineEvents((tl) => [
      {
        id: `tl-${Date.now()}`,
        category: 'confidence',
        title: `Weather Inversion Alert: ${nextWeather.toUpperCase()}`,
        description: `Atmospheric visibility conditions updated. Permissible locomotive safety speed ceilings applied.`,
        impact: nextWeather === 'normal' ? 'Nominal' : 'Weather Caution',
        timestamp: simTimeFormatted,
        severity: nextWeather === 'severe_weather' ? 'alert' : nextWeather !== 'normal' ? 'caution' : 'nominal',
      },
      ...tl,
    ]);
  };

  const handleToggleGps = () => {
    setPreviousETAs(etaForecast.stationETAs);
    const nextGps: GpsStatus = conditions.gpsStatus === 'GOOD' ? 'STALE' : 'GOOD';

    setConditions((prev) => ({ ...prev, gpsStatus: nextGps }));

    setLatestPipelineEvent({
      id: `pipe-${Date.now()}`,
      eventTitle: `EVENT: GPS Telemetry Switched to ${nextGps}`,
      trainStateChange: nextGps === 'STALE' ? 'Dead reckoning fallback active' : 'GNSS satellite lock restored',
      etaRecalculationNote:
        nextGps === 'STALE'
          ? 'Estimated via historical section run times'
          : 'High-precision GNSS positioning',
      confidenceDelta: nextGps === 'STALE' ? '-18% confidence penalty' : 'Confidence restored to nominal',
      timestamp: simTimeFormatted,
    });

    setTimelineEvents((tl) => [
      {
        id: `tl-${Date.now()}`,
        category: 'confidence',
        title: nextGps === 'STALE' ? 'GNSS Telemetry Loss · Fallback Mode Active' : 'GNSS Telemetry Restored',
        description: nextGps === 'STALE' ? 'GPS transponder lock lost. Switched to Fallback Prediction Mode using historical section times and scheduled offsets.' : '3D satellite fix restored.',
        impact: nextGps === 'STALE' ? '-18% Confidence' : 'Nominal Confidence',
        timestamp: simTimeFormatted,
        severity: nextGps === 'STALE' ? 'caution' : 'nominal',
      },
      ...tl,
    ]);
  };

  const handleClearAllConditions = () => {
    setPreviousETAs(etaForecast.stationETAs);
    setConditions(DEFAULT_OPERATIONAL_CONDITIONS);
    setLatestPipelineEvent({
      id: `pipe-${Date.now()}`,
      eventTitle: 'EVENT: All Operational Disruptions Cleared',
      trainStateChange: 'Train running under clear automatic signals',
      etaRecalculationNote: 'Dynamic slack recovery active on clear trunk',
      confidenceDelta: 'Ensemble confidence restored to 96%',
      timestamp: simTimeFormatted,
    });
    setTimelineEvents((tl) => [
      {
        id: `tl-${Date.now()}`,
        category: 'recalculation',
        title: 'All Operational Disruptions Cleared',
        description: 'Line cleared on Grand Trunk route. Locomotive running with full automatic signal aspects.',
        impact: 'Slack Recovery Active',
        timestamp: simTimeFormatted,
        severity: 'nominal',
      },
      ...tl,
    ]);
  };

  // Guided Demonstration Engine State (13 steps)
  const [demoStepIndex, setDemoStepIndex] = useState<number>(0);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [isDemoAutoAdvance, setIsDemoAutoAdvance] = useState<boolean>(false);

  // Apply a specific guided demo step state to the simulation
  const applyDemoStep = (stepIdx: number) => {
    const stepDef = GUIDED_DEMO_STEPS[stepIdx];
    if (!stepDef) return;

    setDemoStepIndex(stepIdx);
    setPreviousETAs(etaForecast.stationETAs);

    // Apply Km position
    setCurrentKilometer(stepDef.kmPosition);

    // Construct operational conditions according to step
    const newConditions: RailwayOperationalConditions = {
      ...DEFAULT_OPERATIONAL_CONDITIONS,
      downstreamCongestion: {
        ...DEFAULT_OPERATIONAL_CONDITIONS.downstreamCongestion,
        active: !!stepDef.activeConditions.congestion,
        delayImpactMinutes: stepDef.activeConditions.congestion ? 7 : 0,
        congestionFactor: stepDef.activeConditions.congestion ? 1.35 : 1.0,
      },
      precedingTrain: {
        ...DEFAULT_OPERATIONAL_CONDITIONS.precedingTrain,
        active: !!stepDef.activeConditions.precedingDelay,
      },
      signalHalt: {
        ...DEFAULT_OPERATIONAL_CONDITIONS.signalHalt,
        active: !!stepDef.activeConditions.signalHalt,
      },
      speedRestriction: {
        ...DEFAULT_OPERATIONAL_CONDITIONS.speedRestriction,
        active: !!stepDef.activeConditions.speedRestriction,
        restrictedSpeedKmH: stepDef.activeConditions.speedRestriction ? 70 : 130,
        delayImpactMinutes: stepDef.activeConditions.speedRestriction ? 5 : 0,
      },
    };
    setConditions(newConditions);

    // Create pipeline notification for this step
    setLatestPipelineEvent({
      id: `demo-pipe-${stepDef.step}`,
      eventTitle: `DEMO STEP ${stepDef.step}: ${stepDef.title}`,
      trainStateChange: stepDef.actionSummary,
      etaRecalculationNote: stepDef.tagline,
      confidenceDelta: `Confidence: ${stepDef.confidence}% · ${stepDef.stateImpact}`,
      timestamp: simTimeFormatted,
    });

    // Append to live operational timeline
    setTimelineEvents((prev) => [
      {
        id: `tl-demo-${Date.now()}`,
        category:
          stepDef.coreStoryStage === 'Detect Event'
            ? 'congestion'
            : stepDef.coreStoryStage === 'Recalculate'
            ? 'recalculation'
            : stepDef.coreStoryStage === 'Compare' || stepDef.coreStoryStage === 'Learn'
            ? 'feedback'
            : 'movement',
        title: `[Demo S${stepDef.step}] ${stepDef.title}`,
        description: stepDef.description,
        impact: stepDef.stateImpact,
        timestamp: simTimeFormatted,
        severity:
          stepDef.expectedDelay > 10 ? 'alert' : stepDef.expectedDelay > 0 ? 'caution' : 'nominal',
      },
      ...prev,
    ]);
  };

  const handleStartDemo = () => {
    setIsDemoActive(true);
    setIsDemoAutoAdvance(true);
    setActiveTab('live_operations');
    applyDemoStep(0);
  };

  const handleNextDemoStep = () => {
    if (demoStepIndex < GUIDED_DEMO_STEPS.length - 1) {
      applyDemoStep(demoStepIndex + 1);
    }
  };

  const handlePrevDemoStep = () => {
    if (demoStepIndex > 0) {
      applyDemoStep(demoStepIndex - 1);
    }
  };

  const handlePauseResumeDemo = () => {
    setIsDemoAutoAdvance((prev) => !prev);
  };

  const handleResetDemo = () => {
    setIsDemoActive(false);
    setIsDemoAutoAdvance(false);
    setDemoStepIndex(0);
    handleReset();
  };

  // Listen to step jump events from demo bar
  useEffect(() => {
    const handleJumpEvent = (e: any) => {
      const idx = e.detail?.stepIndex;
      if (typeof idx === 'number' && idx >= 0 && idx < GUIDED_DEMO_STEPS.length) {
        setIsDemoActive(true);
        applyDemoStep(idx);
      }
    };
    window.addEventListener('jump_demo_step', handleJumpEvent);
    return () => window.removeEventListener('jump_demo_step', handleJumpEvent);
  }, [conditions, etaForecast]);

  // Optional auto advance timer when in active auto demo
  useEffect(() => {
    if (!isDemoActive || !isDemoAutoAdvance) return;

    const timer = setTimeout(() => {
      if (demoStepIndex < GUIDED_DEMO_STEPS.length - 1) {
        applyDemoStep(demoStepIndex + 1);
      } else {
        setIsDemoAutoAdvance(false); // Finished loop
      }
    }, 7000); // 7 seconds per demonstration step

    return () => clearTimeout(timer);
  }, [isDemoActive, isDemoAutoAdvance, demoStepIndex]);

  const handleJumpToEvents = () => {
    if (activeTab !== 'live_operations') {
      setActiveTab('live_operations');
    }
    setTimeout(() => {
      eventsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Modern Simplified Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isTechnicalMode={isTechnicalMode}
        onToggleTechnicalMode={() => setIsTechnicalMode((prev) => !prev)}
        onOpenSixtySecondExplainer={() => setIsExplainerOpen(true)}
        isPlaying={isPlaying}
        totalDelay={etaForecast.totalDelayMinutes}
        simTimeFormatted={simTimeFormatted}
      />

      {/* 60-Second Explainer Pitch Modal */}
      <SixtySecondExplainerModal
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1520px] w-full mx-auto p-4 lg:p-6 space-y-6">
        {/* Guided Demonstration Bar (Always accessible for SIH Hackathon evaluation) */}
        <GuidedDemoBar
          currentStepIndex={demoStepIndex}
          isDemoActive={isDemoActive}
          onStartDemo={handleStartDemo}
          onNextStep={handleNextDemoStep}
          onPrevStep={handlePrevDemoStep}
          onPauseResumeDemo={handlePauseResumeDemo}
          onResetDemo={handleResetDemo}
        />

        {/* Tab 1: Live Operations / Main Dashboard */}
        {activeTab === 'live_operations' && (
          <div className="space-y-6">
            {!isTechnicalMode ? (
              /* ================= DEMO MODE (Evaluator Simplified View) ================= */
              <div className="space-y-6">
                {/* 1. Overview Hero: Brand + 5 Clean KPI Cards */}
                <OverviewHero
                  telemetry={{
                    ...TELANGANA_EXPRESS_TELEMETRY,
                    currentKilometer,
                    currentSpeedKmH: etaForecast.effectiveSpeedKmH,
                  }}
                  currentSpeedKmH={etaForecast.effectiveSpeedKmH}
                  totalDelayMinutes={etaForecast.totalDelayMinutes}
                  nextStation={nextStation}
                  confidenceScore={etaForecast.overallConfidence}
                />

                {/* 2. Simple Train Journey Track (Clean Railway Nodes) */}
                <SimpleJourneyTrack
                  stations={ROUTE_STATIONS}
                  stationETAs={etaForecast.stationETAs}
                  currentKm={currentKilometer}
                  totalDistanceKm={totalDistanceKm}
                  selectedStationId={selectedStationId}
                  onSelectStation={setSelectedStationId}
                  currentSpeedKmH={etaForecast.effectiveSpeedKmH}
                  isHalted={isHaltedAtStation || etaForecast.effectiveSpeedKmH === 0}
                  onToggleDetailedView={() => setShowDetailedSchematic((prev) => !prev)}
                  showDetailedView={showDetailedSchematic}
                />

                {/* Optional Detailed Schematic Line Diagram (If expanded) */}
                {showDetailedSchematic && (
                  <RouteMapSchematic
                    stations={ROUTE_STATIONS}
                    stationETAs={etaForecast.stationETAs}
                    currentKm={currentKilometer}
                    totalDistanceKm={totalDistanceKm}
                    selectedStationId={selectedStationId}
                    onSelectStation={setSelectedStationId}
                    currentSpeedKmH={etaForecast.effectiveSpeedKmH}
                    isHalted={isHaltedAtStation || etaForecast.effectiveSpeedKmH === 0}
                    signalState={etaForecast.signalState}
                  />
                )}

                {/* 3. Live ETA Forecast: Clear Station Table */}
                <LiveEtaForecastSection
                  stationETAs={etaForecast.stationETAs}
                  stations={ROUTE_STATIONS}
                  selectedStationId={selectedStationId}
                  onSelectStation={setSelectedStationId}
                  currentKilometer={currentKilometer}
                />

                {/* 4. Why Did ETA Change? Prominent Plain-English Attribution Card */}
                <SimpleWhyEtaChangedCard
                  factors={etaForecast.explainabilityFactors}
                  currentDelay={etaForecast.totalDelayMinutes}
                  staticNtesDelay={
                    etaForecast.stationETAs[etaForecast.stationETAs.length - 1]?.staticNtesDelayMinutes ||
                    etaForecast.totalDelayMinutes
                  }
                  stationETAs={etaForecast.stationETAs}
                  stations={ROUTE_STATIONS}
                  currentStationIndex={etaForecast.currentStationIndex}
                  selectedStationCode={selectedStationId || undefined}
                  onToggleTechnicalMode={() => setIsTechnicalMode(true)}
                />

                {/* 5. Core Intelligence Flow: Visual Process */}
                <CoreIntelligenceFlow
                  latestPipelineEvent={latestPipelineEvent}
                  totalDelayMinutes={etaForecast.totalDelayMinutes}
                />

                {/* 6. Try a Railway Event: Evaluator Simulation Controls */}
                <div ref={eventsSectionRef}>
                  <SimpleEventControls
                    isPlaying={isPlaying}
                    onPlayToggle={handlePlayToggle}
                    onReset={handleReset}
                    simSpeedMultiplier={simSpeedMultiplier}
                    onSpeedChange={setSimSpeedMultiplier}
                    currentKilometer={currentKilometer}
                    totalDistanceKm={totalDistanceKm}
                    onScrubKm={handleScrubKm}
                    conditions={conditions}
                    onToggleCondition={handleToggleCondition}
                    onCycleWeather={handleCycleWeather}
                    onToggleGps={handleToggleGps}
                    onClearAllConditions={handleClearAllConditions}
                    latestPipelineEvent={latestPipelineEvent}
                    totalDelayMinutes={etaForecast.totalDelayMinutes}
                  />
                </div>

                {/* 7. Why RailCast AI: 4 Innovation Pillars */}
                <WhyRailcastCard />

                {/* Technical Mode Callout Banner */}
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>
                      Need deep engineering inspection? <strong>Technical Mode</strong> provides full telemetry, sensor quality monitors, and SHAP attribution vectors.
                    </span>
                  </div>
                  <button
                    onClick={() => setIsTechnicalMode(true)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Switch to Technical Mode
                  </button>
                </div>
              </div>
            ) : (
              /* ================= TECHNICAL MODE (Full Engineering Dashboard) ================= */
              <div className="space-y-6">
                <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs font-mono">
                  <span>TECHNICAL MODE ACTIVE · Showing full sensor monitors, kinematics & residual feedback</span>
                  <button
                    onClick={() => setIsTechnicalMode(false)}
                    className="px-2.5 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded cursor-pointer transition-colors"
                  >
                    Back to Evaluator Demo Mode
                  </button>
                </div>

                {/* Top KPI Cards (8 items) */}
                <TopKpiGrid
                  telemetry={{
                    ...TELANGANA_EXPRESS_TELEMETRY,
                    currentKilometer,
                    currentSpeedKmH: etaForecast.effectiveSpeedKmH,
                  }}
                  currentLocationName={currentLocationName}
                  currentSpeedKmH={etaForecast.effectiveSpeedKmH}
                  totalDelayMinutes={etaForecast.totalDelayMinutes}
                  nextStation={nextStation}
                  nextStationETA={nextStationETA}
                  nextStationSTA={nextStationSTA}
                  confidenceScore={etaForecast.overallConfidence}
                  activeEventsCount={etaForecast.timelineDisruptions.filter((d) => d.active).length}
                  onJumpToEvents={handleJumpToEvents}
                />

                {/* Data Quality Monitor (GPS, Schedule, Historical, Operational, Weather) */}
                <DataQualityMonitor
                  gpsStatus={conditions.gpsStatus}
                  weatherState={conditions.weather}
                  operationalDisruptionsActive={
                    conditions.downstreamCongestion.active ||
                    conditions.precedingTrain.active ||
                    conditions.signalHalt.active ||
                    conditions.speedRestriction.active ||
                    conditions.unscheduledStop.active ||
                    conditions.maintenanceBlock.active ||
                    conditions.levelCrossing.active
                  }
                  onToggleGps={handleToggleGps}
                />

                {/* Current vs Historical Section Performance Card */}
                <CurrentVsHistoricalCard
                  comparison={etaForecast.currentVsHistorical}
                  historicalSection={HISTORICAL_SECTION_PERFORMANCE[etaForecast.currentSectionIndex]}
                />

                {/* Train Status Card & Simulation Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6">
                    <TrainStatusCard
                      telemetry={{
                        ...TELANGANA_EXPRESS_TELEMETRY,
                        currentKilometer,
                        currentSpeedKmH: etaForecast.effectiveSpeedKmH,
                      }}
                      currentKilometer={currentKilometer}
                      progressPercentage={progressPercentage}
                      totalDelay={etaForecast.totalDelayMinutes}
                    />
                  </div>

                  <div className="lg:col-span-6">
                    <SimulationControls
                      isPlaying={isPlaying}
                      onPlayToggle={handlePlayToggle}
                      onReset={handleReset}
                      simSpeedMultiplier={simSpeedMultiplier}
                      onSpeedChange={setSimSpeedMultiplier}
                      currentKilometer={currentKilometer}
                      totalDistanceKm={totalDistanceKm}
                      onScrubKm={handleScrubKm}
                      conditions={conditions}
                      onToggleCondition={handleToggleCondition}
                      onCycleWeather={handleCycleWeather}
                      onToggleGps={handleToggleGps}
                      onClearAllConditions={handleClearAllConditions}
                      latestPipelineEvent={latestPipelineEvent}
                    />
                  </div>
                </div>

                {/* Schematic Railway Route Map (SVG/CSS) with Real-Time Signal Aspects & Congested Sections */}
                <RouteMapSchematic
                  stations={ROUTE_STATIONS}
                  stationETAs={etaForecast.stationETAs}
                  currentKm={currentKilometer}
                  totalDistanceKm={totalDistanceKm}
                  selectedStationId={selectedStationId}
                  onSelectStation={setSelectedStationId}
                  currentSpeedKmH={etaForecast.effectiveSpeedKmH}
                  isHalted={isHaltedAtStation || etaForecast.effectiveSpeedKmH === 0}
                  signalState={etaForecast.signalState}
                />

                {/* Station-wise Dynamic ETA Table */}
                <StationEtaTable
                  stationETAs={etaForecast.stationETAs}
                  stations={ROUTE_STATIONS}
                  selectedStationId={selectedStationId}
                  onSelectStation={setSelectedStationId}
                  currentKilometer={currentKilometer}
                />

                {/* Dynamic ETA Trend Chart: Scheduled vs Previous vs Current Prediction */}
                <EtaTrendChart
                  trendPoints={etaTrendPoints}
                  currentStationIndex={etaForecast.currentStationIndex}
                />

                {/* Dynamic Delay Propagation & NTES Comparison Chart */}
                <EtaComparisonChart
                  stationETAs={etaForecast.stationETAs}
                  stations={ROUTE_STATIONS}
                  currentStationIndex={etaForecast.currentStationIndex}
                />

                {/* Why Did ETA Change? & Prediction Confidence & Data Quality */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6 space-y-6">
                    <ExplainableEtaPanel
                      factors={etaForecast.explainabilityFactors}
                      currentDelay={etaForecast.totalDelayMinutes}
                      staticNtesDelay={
                        etaForecast.stationETAs[etaForecast.stationETAs.length - 1]?.staticNtesDelayMinutes ||
                        etaForecast.totalDelayMinutes
                      }
                      stationETAs={etaForecast.stationETAs}
                      stations={ROUTE_STATIONS}
                      currentStationIndex={etaForecast.currentStationIndex}
                      selectedStationCode={selectedStationId || undefined}
                    />

                    <PredictionConfidencePanel
                      confidenceScore={etaForecast.overallConfidence}
                      totalDelay={etaForecast.totalDelayMinutes}
                      nextStationCode={nextStation.code}
                      stationETAs={etaForecast.stationETAs}
                      currentStationIndex={etaForecast.currentStationIndex}
                    />
                  </div>

                  <div className="lg:col-span-6 space-y-6" ref={eventsSectionRef}>
                    <PredictionFeedbackLoop
                      records={feedbackRecords}
                      activeSectionName={etaForecast.currentVsHistorical.sectionName}
                    />

                    <OperationalTimeline events={timelineEvents} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: SIH Demo Script (Dedicated Evaluator Walkthrough) */}
        {activeTab === 'demo_script' && (
          <SihDemoScriptView
            onTriggerStep={(stepIndex) => applyDemoStep(stepIndex)}
            onNavigateTab={(tab) => setActiveTab(tab as ConsumerTab)}
          />
        )}

        {/* Tab 3: Passenger View */}
        {activeTab === 'passenger_view' && (
          <PassengerView
            telemetry={{
              ...TELANGANA_EXPRESS_TELEMETRY,
              currentKilometer,
              currentSpeedKmH: etaForecast.effectiveSpeedKmH,
            }}
            currentLocationName={currentLocationName}
            nextStation={nextStation}
            nextStationETA={nextStationETA}
            nextStationSTA={nextStationSTA}
            totalDelayMinutes={etaForecast.totalDelayMinutes}
            confidenceScore={etaForecast.overallConfidence}
            stationETAs={etaForecast.stationETAs}
            explainabilityFactors={etaForecast.explainabilityFactors}
            currentKilometer={currentKilometer}
          />
        )}

        {/* Tab 4: Station Display */}
        {activeTab === 'station_display' && (
          <StationDisplayView
            currentSimTimeFormatted={simTimeFormatted}
            train12723Eta={nextStationETA}
            train12723Delay={etaForecast.totalDelayMinutes}
          />
        )}

        {/* Tab 5: Railway Control Room */}
        {activeTab === 'control_room' && (
          <ControlRoomView
            currentSimTimeFormatted={simTimeFormatted}
            totalActiveTrains={18}
            totalDelayedTrains={etaForecast.totalDelayMinutes > 0 ? 7 : 6}
            overallConfidence={etaForecast.overallConfidence}
          />
        )}

        {/* Tab 6: Multi-Train Fleet */}
        {activeTab === 'multi_train' && (
          <MultiTrainFleetView
            train12723Eta={nextStationETA}
            train12723Delay={etaForecast.totalDelayMinutes}
            train12723Confidence={etaForecast.overallConfidence}
          />
        )}

        {/* Tab 7: Train Analysis */}
        {activeTab === 'train_analysis' && (
          <TrainAnalysisView
            telemetry={{
              ...TELANGANA_EXPRESS_TELEMETRY,
              currentKilometer,
              currentSpeedKmH: etaForecast.effectiveSpeedKmH,
            }}
            stationETAs={etaForecast.stationETAs}
            currentSpeedKmH={etaForecast.effectiveSpeedKmH}
            currentKilometer={currentKilometer}
            currentVsHistorical={etaForecast.currentVsHistorical}
            historicalSections={HISTORICAL_SECTION_PERFORMANCE}
            activeSectionIndex={etaForecast.currentSectionIndex}
          />
        )}

        {/* Tab 8: Network Analytics */}
        {activeTab === 'network_analytics' && (
          <NetworkAnalyticsView totalDelayMinutes={etaForecast.totalDelayMinutes} />
        )}

        {/* Tab 9: System Architecture & Proposed Production Architecture */}
        {activeTab === 'system_architecture' && <SystemArchitectureView />}

        {/* Tab 10: API Demonstration & Conceptual Endpoints */}
        {activeTab === 'api_docs' && <ApiDemonstrationView />}
      </main>

      {/* Footer with Mandatory Model Prototype Classification */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div>
            <strong className="text-slate-900 font-bold">RailCast AI</strong> · Smart India Hackathon 2026 (Problem Statement 26028)
            · Ministry of Railways · Smart Automation ·{' '}
            <span className="text-blue-700 font-semibold">
              Explainable Hybrid ETA Forecasting Model
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            &ldquo;Prototype demonstration using simulated railway data. Production deployment would require authorized integration with railway operational data sources.&rdquo;
          </div>
        </div>
        <div className="text-[11px] font-mono text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-md font-semibold max-w-md text-right">
          <div>DEMO / SIMULATED RAILWAY DATA</div>
          <div className="text-[10px] text-amber-800 font-normal">
            &ldquo;Prototype prediction engine is for demonstration and is not a production railway control system.&rdquo;
          </div>
        </div>
      </footer>
    </div>
  );
}
