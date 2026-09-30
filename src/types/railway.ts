/**
 * RailCast AI — Dynamic & Explainable ETA Intelligence for Indian Railways
 * Smart India Hackathon 2026 | Problem Statement 26028
 */

export type ConsumerTab =
  | 'live_operations'
  | 'passenger_view'
  | 'station_display'
  | 'control_room'
  | 'multi_train'
  | 'train_analysis'
  | 'network_analytics'
  | 'system_architecture'
  | 'api_docs'
  | 'demo_script';

export interface FleetTrain {
  trainNumber: string;
  trainName: string;
  route: string;
  origin: string;
  destination: string;
  currentState: 'On Time' | 'Delayed' | 'Critical Delay' | 'Approaching Station' | 'Halted at Signal' | 'Maintenance Slowdown';
  currentLocation: string;
  delayMinutes: number;
  nextStation: string;
  nextStationEta: string;
  scheduledArrival: string;
  expectedRange: string;
  confidenceScore: number;
  zone: string;
  speedKmH: number;
  delayReason?: string;
}

export interface StationBoardItem {
  trainNumber: string;
  trainName: string;
  destination: string;
  scheduledTime: string;
  eta: string;
  delayMinutes: number;
  status: 'On Time' | 'Delayed' | 'Arrived' | 'Departed' | 'Platform Changed';
  platform: string;
  expectedRange: string;
  confidenceScore: number;
}

export interface ControlRoomEventCard {
  id: string;
  type: 'CONGESTION' | 'SPEED_RESTRICTION' | 'PRECEDING_TRAIN_DELAY' | 'MAINTENANCE_BLOCK' | 'SIGNAL_HALT' | 'WEATHER';
  section: string;
  title: string;
  description: string;
  impactMinutes: number;
  affectedTrainsCount: number;
  affectedTrains: string[];
  severity: 'low' | 'medium' | 'high';
  timeAdded: string;
}

export interface ModelEvaluationMetrics {
  maeMinutes: number;
  rmseMinutes: number;
  within5MinPct: number;
  within10MinPct: number;
  averageConfidencePct: number;
  predictionLatencyMs: number;
}

export interface StationData {
  id: string;
  code: string;
  name: string;
  state: string;
  zone: string;
  division: string;
  distanceKm: number;
  scheduledArrival: string; // HH:MM or "Source"
  scheduledDeparture: string; // HH:MM or "Dest"
  scheduledDwellMins: number;
  platform: string;
  speedLimitKmH: number; // Sectional MPS approaching this station
  tracksCount: number;
  isJunction: boolean;
  elevationMeters: number;
}

export interface HistoricalSectionPerformance {
  sectionId: string;
  fromCode: string;
  toCode: string;
  sectionName: string;
  distanceKm: number;
  scheduledRunningTimeMins: number;
  historicalAvgTravelTimeMins: number;
  historicalAvgSpeedKmH: number;
  historicalDelayMins: number;
  avgStationDwellMins: number;
  levelCrossingCount: number;
  congestionFactor: number; // 1.0 = normal, 1.2 = 20% slow down
}

export interface SectionComparison {
  sectionName: string;
  fromCode: string;
  toCode: string;
  currentSpeedKmH: number;
  historicalAvgSpeedKmH: number;
  speedDifferenceKmH: number;
  currentEstTravelTimeMins: number;
  historicalTravelTimeMins: number;
  travelTimeDifferenceMins: number;
  status: 'faster' | 'slower' | 'nominal';
}

export interface DynamicStationETA {
  stationId: string;
  stationCode: string;
  stationName: string;
  distanceKm: number;
  scheduledArrival: string;
  scheduledDeparture: string;
  scheduledDwellMins: number;
  predictedArrival: string;
  predictedDeparture: string;
  predictedArrivalMinutes: number; // Raw minutes from Day 1 midnight for calculations
  predictedRemainingTravelTimeMins: number; // Predicted remaining travel time from current train position
  expectedTimeRange: string; // e.g. "13:22 – 13:28"
  delayMinutes: number; // Positive = late, Negative = early
  staticNtesDelayMinutes: number; // What traditional static NTES would predict (naive delay carry-forward)
  platform: string;
  status: 'departed' | 'current' | 'next' | 'enroute' | 'scheduled';
  dwellBufferRecoveryMins: number;
  confidenceScore: number; // 0-100
  sectionClearance: 'clear' | 'caution' | 'congested' | 'maintenance';
}

export interface EtaTrendPoint {
  stationCode: string;
  stationName: string;
  distanceKm: number;
  scheduledTime: string;
  scheduledMinutes: number;
  previousPredictionTime: string;
  previousPredictionMinutes: number;
  currentPredictionTime: string;
  currentPredictionMinutes: number;
  varianceDeltaMinutes: number;
}

export type DisruptionType =
  | 'caution_order'
  | 'signal_precedence'
  | 'platform_congestion'
  | 'weather_fog'
  | 'freight_crossing'
  | 'track_maintenance'
  | 'nominal_clear';

export interface OperationalDisruption {
  id: string;
  type: DisruptionType;
  title: string;
  stationCode: string;
  description: string;
  delayImpactMins: number;
  speedRestrictionKmH?: number;
  active: boolean;
  timeAdded: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ExplainabilityFactor {
  id: string;
  category: 'Caution Order' | 'Signal Precedence' | 'Dwell Overrun' | 'Weather Condition' | 'Speed Recovery' | 'Block Congestion';
  name: string;
  impactMinutes: number; // + or -
  location: string;
  confidence: number;
  description: string;
  modelAttributionPct: number;
}

export interface TrainTelemetry {
  trainNumber: string;
  trainName: string;
  type: string;
  locoClass: string;
  locoNumber: string;
  rakeComposition: string; // e.g., "24 LHB Coaches"
  zone: string;
  division: string;
  driverCrewBase: string;
  currentSpeedKmH: number;
  maxPermissibleSpeedKmH: number;
  pantoStatus: 'Raised (OHE 25kV)' | 'Lowered';
  currentKilometer: number;
  totalDistanceKm: number;
  totalJourneyHours: string;
  onTimePunctualityIndex: number;
}

export type WeatherState = 'normal' | 'rain' | 'poor_visibility' | 'severe_weather';
export type GpsStatus = 'GOOD' | 'STALE';

export interface PrecedingTrainInfo {
  active: boolean;
  trainNumber: string;
  trainName: string;
  currentDelayMinutes: number;
  affectedSection: string;
  affectedSectionCode: string;
  expectedImpactMinutes: number;
}

export interface RailwayOperationalConditions {
  downstreamCongestion: {
    active: boolean;
    sectionCode: string;
    delayImpactMinutes: number;
    congestionFactor: number;
  };
  precedingTrain: PrecedingTrainInfo;
  signalHalt: {
    active: boolean;
    locationName: string;
    signalType: string;
    delayImpactMinutes: number;
  };
  speedRestriction: {
    active: boolean;
    normalSpeedKmH: number;
    restrictedSpeedKmH: number;
    sectionCode: string;
    delayImpactMinutes: number;
  };
  unscheduledStop: {
    active: boolean;
    durationMinutes: number;
    reason: string;
    location: string;
  };
  maintenanceBlock: {
    active: boolean;
    sectionCode: string;
    sectionName: string;
    delayImpactMinutes: number;
    blockType: string;
  };
  levelCrossing: {
    active: boolean;
    gateNumber: string;
    sectionCode: string;
    delayImpactMinutes: number;
  };
  weather: WeatherState;
  gpsStatus: GpsStatus;
}

export interface DataQualityItem {
  source: 'GPS' | 'Schedule' | 'Historical Data' | 'Operational Data' | 'Weather';
  status: 'GOOD' | 'PARTIAL' | 'STALE';
  detail: string;
  latency: string;
}

export interface StationFeedbackRecord {
  id: string;
  stationCode: string;
  stationName: string;
  distanceKm: number;
  predictedTime: string;
  actualTime: string;
  errorMinutes: number; // positive = arrived later than predicted, negative = earlier
  historicalAdjustedMinutes: number; // slight incremental refinement to section historical time
  timestamp: string;
}

export interface LiveTimelineEvent {
  id: string;
  category: 'movement' | 'speed' | 'congestion' | 'operational' | 'recalculation' | 'confidence' | 'arrival' | 'feedback';
  title: string;
  description: string;
  impact?: string;
  timestamp: string;
  severity: 'nominal' | 'caution' | 'alert';
}

export interface StationEtaCausality {
  stationCode: string;
  stationName: string;
  previousEta: string;
  newEta: string;
  netDeltaMinutes: number;
  contributingFactors: {
    name: string;
    impactMinutes: number;
    reason: string;
  }[];
}

export interface PipelineNotification {
  id: string;
  eventTitle: string;
  trainStateChange: string;
  etaRecalculationNote: string;
  confidenceDelta: string;
  timestamp: string;
}

export interface SimulationState {
  isPlaying: boolean;
  simSpeedMultiplier: number; // 1x, 2x, 5x, 10x
  elapsedSimSeconds: number; // Elapsed simulation seconds from origin departure
  currentKilometer: number;
  currentSpeedKmH: number;
  currentStationIndex: number;
  progressPercentage: number;
  totalDelayMinutes: number;
  currentSectionStatus: 'nominal' | 'caution' | 'hold' | 'recovery';
  activeDisruptions: OperationalDisruption[];
  selectedStationId: string | null;
  activeTab: 'live_operations' | 'train_analysis' | 'network_analytics';
}
