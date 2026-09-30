/**
 * RailCast AI — Explainable Hybrid ETA Forecasting Model
 * Smart India Hackathon 2026 | Problem Statement 26028
 *
 * NOTE: Prototype uses an explainable simulation/statistical model.
 * Production implementation can use trained ML models such as XGBoost or LightGBM.
 *
 * Core Concept:
 * Predicted ETA = Current Time + Predicted Remaining Travel Time
 * (Calculated section-by-section without naive static delay carry-forward)
 */

import {
  DynamicStationETA,
  ExplainabilityFactor,
  OperationalDisruption,
  StationData,
  HistoricalSectionPerformance,
  SectionComparison,
  EtaTrendPoint,
  RailwayOperationalConditions,
} from '../types/railway';
import {
  ROUTE_STATIONS,
  HISTORICAL_SECTION_PERFORMANCE,
  DEFAULT_OPERATIONAL_CONDITIONS,
} from '../data/telanganaExpress';

/**
 * Parses "HH:MM" into minutes from midnight. Handles overnight wrap-around.
 */
export function timeStringToMinutes(timeStr: string, dayOffset = 0): number {
  if (timeStr === 'Source' || timeStr === 'Dest') return 0;
  const [hh, mm] = timeStr.split(':').map(Number);
  return dayOffset * 1440 + (hh || 0) * 60 + (mm || 0);
}

/**
 * Formats minutes from midnight back into "HH:MM (Day X)" or "HH:MM"
 */
export function minutesToTimeString(totalMinutes: number): string {
  const normalized = Math.max(0, Math.floor(totalMinutes));
  const day = Math.floor(normalized / 1440) + 1;
  const minsInDay = normalized % 1440;
  const hh = Math.floor(minsInDay / 60)
    .toString()
    .padStart(2, '0');
  const mm = (minsInDay % 60).toString().padStart(2, '0');
  return day > 1 ? `${hh}:${mm} (+Day ${day})` : `${hh}:${mm}`;
}

export function formatTimeOnly(totalMinutes: number): string {
  const normalized = Math.max(0, Math.floor(totalMinutes));
  const minsInDay = normalized % 1440;
  const hh = Math.floor(minsInDay / 60)
    .toString()
    .padStart(2, '0');
  const mm = (minsInDay % 60).toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Core dynamic ETA calculation function.
 * Implements: Predicted ETA = Current Time + Predicted Remaining Travel Time
 * Evaluated section-by-section.
 *
 * Integrates all 9 SIH Railway Operational Conditions:
 * 1. Downstream Congestion
 * 2. Preceding Train Delay
 * 3. Signal Halt
 * 4. Temporary Speed Restriction
 * 5. Unscheduled Stoppage
 * 6. Maintenance Block
 * 7. Level Crossing Delay
 * 8. Weather Impact (Normal, Rain, Poor Visibility, Severe Weather)
 * 9. GPS Data Loss (GOOD vs STALE fallback)
 */
export function calculateETA({
  currentKm,
  currentSimTimeMinutes,
  currentSpeedKmH,
  disruptions,
  conditions = DEFAULT_OPERATIONAL_CONDITIONS,
  stations = ROUTE_STATIONS,
  historicalSections = HISTORICAL_SECTION_PERFORMANCE,
}: {
  currentKm: number;
  currentSimTimeMinutes: number;
  currentSpeedKmH: number;
  disruptions: OperationalDisruption[];
  conditions?: RailwayOperationalConditions;
  stations?: StationData[];
  historicalSections?: HistoricalSectionPerformance[];
}): {
  stationETAs: DynamicStationETA[];
  currentSectionIndex: number;
  currentStationIndex: number;
  totalDelayMinutes: number;
  overallConfidence: number;
  explainabilityFactors: ExplainabilityFactor[];
  currentVsHistorical: SectionComparison;
  effectiveSpeedKmH: number;
  timelineDisruptions: OperationalDisruption[];
  signalState: 'green' | 'amber' | 'red';
  isGpsStale: boolean;
} {
  const totalDistance = stations[stations.length - 1].distanceKm;
  const clampedKm = Math.min(Math.max(0, currentKm), totalDistance);

  // 1. Identify which station index we have reached or passed
  let currentStationIndex = 0;
  for (let i = 0; i < stations.length; i++) {
    if (clampedKm >= stations[i].distanceKm) {
      currentStationIndex = i;
    } else {
      break;
    }
  }

  // Current section index (0 to stations.length - 2)
  const currentSectionIndex = Math.min(currentStationIndex, stations.length - 2);

  // 2. Compute Effective Train Speed based on conditions (Signal Halt, Unscheduled Stop, Speed Restriction, Weather)
  let effectiveSpeed = currentSpeedKmH;
  let signalState: 'green' | 'amber' | 'red' = 'green';

  if (conditions.signalHalt.active) {
    effectiveSpeed = 0;
    signalState = 'red';
  } else if (conditions.unscheduledStop.active) {
    effectiveSpeed = 0;
    signalState = 'amber';
  } else {
    // Check speed restriction
    if (conditions.speedRestriction.active) {
      effectiveSpeed = Math.min(effectiveSpeed, conditions.speedRestriction.restrictedSpeedKmH);
      signalState = 'amber';
    }

    // Check weather speed constraints
    if (conditions.weather === 'severe_weather') {
      effectiveSpeed = Math.min(effectiveSpeed, 50);
      signalState = 'amber';
    } else if (conditions.weather === 'poor_visibility') {
      effectiveSpeed = Math.min(effectiveSpeed, 75);
      signalState = 'amber';
    } else if (conditions.weather === 'rain') {
      effectiveSpeed = Math.min(effectiveSpeed, 100);
    }
  }

  // GPS Fallback mode
  const isGpsStale = conditions.gpsStatus === 'STALE';

  // 3. Compute baseline delay from origin departure (06:00 = 360 mins)
  const originDepartMins = timeStringToMinutes(stations[0].scheduledDeparture, 0);
  const distFraction = clampedKm / totalDistance;
  const destScheduledArrivalMins = timeStringToMinutes(stations[stations.length - 1].scheduledArrival, 1);
  const totalScheduledDurationMins = destScheduledArrivalMins - originDepartMins;
  const scheduledTimeAtCurrentKm = originDepartMins + distFraction * totalScheduledDurationMins;

  // Active baseline disruptions
  const activeDisruptions = disruptions.filter((d) => d.active);
  const activePriorDisruptions = activeDisruptions.filter((d) => {
    const station = stations.find((s) => s.code === d.stationCode);
    return station ? station.distanceKm <= clampedKm + 25 : true;
  });
  let currentAccumulatedDelay = Math.max(
    0,
    Math.round(currentSimTimeMinutes - scheduledTimeAtCurrentKm)
  );

  // Add immediate shocks from current conditions
  if (conditions.signalHalt.active) {
    currentAccumulatedDelay += conditions.signalHalt.delayImpactMinutes;
  }
  if (conditions.unscheduledStop.active) {
    currentAccumulatedDelay += conditions.unscheduledStop.durationMinutes;
  }

  const disruptionImpact = activePriorDisruptions.reduce((acc, d) => acc + d.delayImpactMins, 0);
  currentAccumulatedDelay = Math.max(currentAccumulatedDelay, disruptionImpact);

  // 4. Section-by-section dynamic prediction loop
  // Central principle: Predicted ETA = Current Time + Predicted Remaining Travel Time
  let cumulativeTravelTimeFromCurrent = 0;
  let runningDynamicDelay = currentAccumulatedDelay;

  // Track explainability attribution
  let dwellSavingsMinutes = 0;
  let slackRecoveryMinutes = 0;
  const explainabilityFactors: ExplainabilityFactor[] = [];

  const stationETAs: DynamicStationETA[] = [];

  // Section comparison tracker for the active section
  let currentVsHistorical: SectionComparison = {
    sectionName: historicalSections[currentSectionIndex]?.sectionName || 'Initial Section',
    fromCode: stations[currentSectionIndex].code,
    toCode: stations[currentSectionIndex + 1].code,
    currentSpeedKmH: Math.round(effectiveSpeed),
    historicalAvgSpeedKmH: historicalSections[currentSectionIndex]?.historicalAvgSpeedKmH || 90,
    speedDifferenceKmH: Math.round(effectiveSpeed - (historicalSections[currentSectionIndex]?.historicalAvgSpeedKmH || 90)),
    currentEstTravelTimeMins: 0,
    historicalTravelTimeMins: historicalSections[currentSectionIndex]?.historicalAvgTravelTimeMins || 20,
    travelTimeDifferenceMins: 0,
    status: 'nominal',
  };

  // Iterate through all stations
  for (let i = 0; i < stations.length; i++) {
    const st = stations[i];
    const isDeparted = i < currentStationIndex;
    const isCurrent = i === currentStationIndex;
    const isNext = i === currentStationIndex + 1;

    // Day offset handling (Bhopal onwards is next day)
    const isDay2 = i >= 8;
    const dayOffset = isDay2 ? 1 : 0;

    let staMins = 0;
    if (st.scheduledArrival !== 'Source') {
      staMins = timeStringToMinutes(st.scheduledArrival, dayOffset);
      if (staMins < originDepartMins && !isDay2) staMins += 1440;
    } else {
      staMins = originDepartMins;
    }

    let stdMins = 0;
    if (st.scheduledDeparture !== 'Dest') {
      stdMins = timeStringToMinutes(st.scheduledDeparture, dayOffset);
      if (stdMins < originDepartMins && !isDay2) stdMins += 1440;
    } else {
      stdMins = staMins;
    }

    if (isDeparted) {
      stationETAs.push({
        stationId: st.id,
        stationCode: st.code,
        stationName: st.name,
        distanceKm: st.distanceKm,
        scheduledArrival: st.scheduledArrival,
        scheduledDeparture: st.scheduledDeparture,
        scheduledDwellMins: st.scheduledDwellMins,
        predictedArrival: `${st.scheduledArrival} (Departed)`,
        predictedDeparture: `${st.scheduledDeparture} (Passed)`,
        predictedArrivalMinutes: staMins,
        predictedRemainingTravelTimeMins: 0,
        expectedTimeRange: `${st.scheduledArrival} – ${st.scheduledArrival}`,
        delayMinutes: 0,
        staticNtesDelayMinutes: 0,
        platform: st.platform,
        status: 'departed',
        dwellBufferRecoveryMins: 0,
        confidenceScore: 100,
        sectionClearance: 'clear',
      });
      continue;
    }

    if (isCurrent) {
      const distToStation = Math.abs(st.distanceKm - clampedKm);
      const isAtPlatform = distToStation <= 2.0;

      const currentPredArrivalMins = isAtPlatform ? currentSimTimeMinutes : currentSimTimeMinutes + 2;
      const currentPredDepartMins = currentPredArrivalMins + Math.max(1, st.scheduledDwellMins);
      const delayAtCurrent = Math.max(0, Math.round(currentPredArrivalMins - staMins));

      stationETAs.push({
        stationId: st.id,
        stationCode: st.code,
        stationName: st.name,
        distanceKm: st.distanceKm,
        scheduledArrival: st.scheduledArrival,
        scheduledDeparture: st.scheduledDeparture,
        scheduledDwellMins: st.scheduledDwellMins,
        predictedArrival: formatTimeOnly(currentPredArrivalMins),
        predictedDeparture: formatTimeOnly(currentPredDepartMins),
        predictedArrivalMinutes: currentPredArrivalMins,
        predictedRemainingTravelTimeMins: 0,
        expectedTimeRange: `${formatTimeOnly(currentPredArrivalMins - 1)} – ${formatTimeOnly(currentPredArrivalMins + 2)}`,
        delayMinutes: delayAtCurrent,
        staticNtesDelayMinutes: currentAccumulatedDelay,
        platform: st.platform,
        status: 'current',
        dwellBufferRecoveryMins: 0,
        confidenceScore: isGpsStale ? 80 : 98,
        sectionClearance: 'clear',
      });
      continue;
    }

    // --- UPCOMING STATIONS (i > currentStationIndex) ---
    const prevStation = stations[i - 1];
    const sectionIndex = i - 1;
    const histSection = historicalSections[sectionIndex] || {
      scheduledRunningTimeMins: Math.round(((st.distanceKm - prevStation.distanceKm) / 100) * 60),
      historicalAvgTravelTimeMins: Math.round(((st.distanceKm - prevStation.distanceKm) / 90) * 60),
      historicalAvgSpeedKmH: 90,
      historicalDelayMins: 5,
      avgStationDwellMins: 5,
      levelCrossingCount: 3,
      congestionFactor: 1.05,
    };

    let sectionRemainingKm: number;
    let isCurrentPartialSection = false;

    if (i === currentStationIndex + 1) {
      sectionRemainingKm = Math.max(1, st.distanceKm - clampedKm);
      isCurrentPartialSection = true;
    } else {
      sectionRemainingKm = st.distanceKm - prevStation.distanceKm;
      isCurrentPartialSection = false;
    }

    // Base effective speed calculation
    let baseSectionSpeed = isCurrentPartialSection
      ? Math.max(30, effectiveSpeed > 0 ? 0.6 * effectiveSpeed + 0.4 * histSection.historicalAvgSpeedKmH : histSection.historicalAvgSpeedKmH)
      : histSection.historicalAvgSpeedKmH;

    let sectionClearance: 'clear' | 'caution' | 'congested' | 'maintenance' = 'clear';
    let operationalDelayAddMins = 0;
    let sectionCongestionMultiplier = histSection.congestionFactor;

    // 1. Condition: Downstream Congestion check
    if (conditions.downstreamCongestion.active && (st.code === conditions.downstreamCongestion.sectionCode || prevStation.code === conditions.downstreamCongestion.sectionCode)) {
      sectionClearance = 'congested';
      sectionCongestionMultiplier *= conditions.downstreamCongestion.congestionFactor;
      operationalDelayAddMins += conditions.downstreamCongestion.delayImpactMinutes;
    }

    // 2. Condition: Preceding Train Delay check
    if (conditions.precedingTrain.active && (st.code === conditions.precedingTrain.affectedSectionCode || prevStation.code === conditions.precedingTrain.affectedSectionCode)) {
      sectionClearance = 'congested';
      operationalDelayAddMins += conditions.precedingTrain.expectedImpactMinutes;
    }

    // 3. Condition: Speed Restriction check
    if (conditions.speedRestriction.active && (st.code === conditions.speedRestriction.sectionCode || prevStation.code === conditions.speedRestriction.sectionCode)) {
      sectionClearance = 'caution';
      baseSectionSpeed = Math.min(baseSectionSpeed, conditions.speedRestriction.restrictedSpeedKmH);
      operationalDelayAddMins += conditions.speedRestriction.delayImpactMinutes;
    }

    // 4. Condition: Maintenance Block check
    if (conditions.maintenanceBlock.active && (st.code === conditions.maintenanceBlock.sectionCode || prevStation.code === conditions.maintenanceBlock.sectionCode)) {
      sectionClearance = 'maintenance';
      operationalDelayAddMins += conditions.maintenanceBlock.delayImpactMinutes;
    }

    // 5. Condition: Level Crossing check
    if (conditions.levelCrossing.active && (st.code === conditions.levelCrossing.sectionCode || prevStation.code === conditions.levelCrossing.sectionCode)) {
      operationalDelayAddMins += conditions.levelCrossing.delayImpactMinutes;
    }

    // 6. Condition: Weather impact across upcoming sections
    if (conditions.weather === 'severe_weather') {
      baseSectionSpeed = Math.min(baseSectionSpeed, 50);
      operationalDelayAddMins += 2;
    } else if (conditions.weather === 'poor_visibility') {
      baseSectionSpeed = Math.min(baseSectionSpeed, 75);
      operationalDelayAddMins += 1;
    } else if (conditions.weather === 'rain') {
      baseSectionSpeed = Math.min(baseSectionSpeed, 100);
      operationalDelayAddMins += 0.5;
    }

    // Active custom injected disruptions
    const sectionDisruptions = activeDisruptions.filter(
      (d) => d.stationCode === st.code || d.stationCode === prevStation.code
    );
    for (const dis of sectionDisruptions) {
      if (dis.type === 'caution_order') {
        sectionClearance = 'caution';
        if (dis.speedRestrictionKmH) baseSectionSpeed = Math.min(baseSectionSpeed, dis.speedRestrictionKmH);
        operationalDelayAddMins += dis.delayImpactMins;
      } else if (dis.type === 'track_maintenance') {
        sectionClearance = 'maintenance';
        operationalDelayAddMins += dis.delayImpactMins;
      } else if (dis.type === 'signal_precedence' || dis.type === 'freight_crossing') {
        sectionClearance = 'congested';
        operationalDelayAddMins += dis.delayImpactMins;
      }
    }

    // Raw Section Running Time
    const rawRunningTimeMins = (sectionRemainingKm / Math.max(30, baseSectionSpeed)) * 60 * sectionCongestionMultiplier;
    let sectionTravelTimeMins = Math.round(rawRunningTimeMins + operationalDelayAddMins);

    // Dynamic Timetable Slack Recovery (when running late and section is clear)
    let sectionSlackRecoveryMins = 0;
    if (
      runningDynamicDelay > 6 &&
      sectionClearance === 'clear' &&
      st.speedLimitKmH >= 120 &&
      sectionCongestionMultiplier <= 1.05 &&
      conditions.weather === 'normal'
    ) {
      sectionSlackRecoveryMins = Math.min(5, Math.floor((sectionRemainingKm / 100) * 1.5));
      sectionTravelTimeMins = Math.max(
        Math.round((sectionRemainingKm / 130) * 60),
        sectionTravelTimeMins - sectionSlackRecoveryMins
      );
      slackRecoveryMinutes += sectionSlackRecoveryMins;
    }

    // Dynamic Dwell Buffer Recovery
    let dwellBufferSavings = 0;
    let effectiveDwellMins = st.scheduledDwellMins;
    if (st.scheduledDwellMins >= 10 && runningDynamicDelay > 8) {
      dwellBufferSavings = Math.min(6, st.scheduledDwellMins - 4);
      effectiveDwellMins = st.scheduledDwellMins - dwellBufferSavings;
      dwellSavingsMinutes += dwellBufferSavings;
    }

    // Update active section comparison
    if (isCurrentPartialSection) {
      const fullSectionEstMins = Math.round((histSection.distanceKm / Math.max(30, baseSectionSpeed)) * 60);
      currentVsHistorical = {
        sectionName: histSection.sectionName,
        fromCode: prevStation.code,
        toCode: st.code,
        currentSpeedKmH: Math.round(effectiveSpeed),
        historicalAvgSpeedKmH: histSection.historicalAvgSpeedKmH,
        speedDifferenceKmH: Math.round(effectiveSpeed - histSection.historicalAvgSpeedKmH),
        currentEstTravelTimeMins: fullSectionEstMins,
        historicalTravelTimeMins: histSection.historicalAvgTravelTimeMins,
        travelTimeDifferenceMins: fullSectionEstMins - histSection.historicalAvgTravelTimeMins,
        status:
          effectiveSpeed > histSection.historicalAvgSpeedKmH + 4
            ? 'faster'
            : effectiveSpeed < histSection.historicalAvgSpeedKmH - 4
            ? 'slower'
            : 'nominal',
      };
    }

    // Accumulate total remaining travel time from current position to station i
    cumulativeTravelTimeFromCurrent += sectionTravelTimeMins;

    // Predicted Arrival Time = Current Time + Cumulative Travel Time
    const predictedArrivalMins = currentSimTimeMinutes + cumulativeTravelTimeFromCurrent;
    const predictedDepartureMins = predictedArrivalMins + effectiveDwellMins;

    // Dynamic delay = Predicted Arrival - Scheduled Arrival
    const dynamicDelayMinutes = Math.max(0, Math.round(predictedArrivalMins - staMins));
    runningDynamicDelay = dynamicDelayMinutes;

    // Expected Time Range calculation (Uncertainty window)
    const distFromCurrent = st.distanceKm - clampedKm;
    let uncertaintyHalfWidthMins = Math.max(
      2,
      Math.round(2 + (distFromCurrent / totalDistance) * 6 + activeDisruptions.length * 1.5)
    );
    if (isGpsStale) uncertaintyHalfWidthMins += 4;
    if (conditions.weather !== 'normal') uncertaintyHalfWidthMins += 3;

    const rangeStart = formatTimeOnly(predictedArrivalMins - uncertaintyHalfWidthMins);
    const rangeEnd = formatTimeOnly(predictedArrivalMins + uncertaintyHalfWidthMins);
    const expectedTimeRange = `${rangeStart} – ${rangeEnd}`;

    // Confidence metric
    let stationConfidence = Math.max(
      70,
      Math.min(99, Math.round(98 - (distFromCurrent / totalDistance) * 18 - activeDisruptions.length * 2))
    );

    // Confidence penalties from active conditions
    if (isGpsStale) stationConfidence -= 18;
    if (conditions.downstreamCongestion.active) stationConfidence -= 8;
    if (conditions.precedingTrain.active) stationConfidence -= 6;
    if (conditions.weather === 'poor_visibility') stationConfidence -= 12;
    if (conditions.weather === 'severe_weather') stationConfidence -= 20;

    stationConfidence = Math.max(50, Math.min(99, stationConfidence));

    // Static traditional NTES carry-forward delay
    const staticNtesDelay = currentAccumulatedDelay;

    stationETAs.push({
      stationId: st.id,
      stationCode: st.code,
      stationName: st.name,
      distanceKm: st.distanceKm,
      scheduledArrival: st.scheduledArrival,
      scheduledDeparture: st.scheduledDeparture,
      scheduledDwellMins: st.scheduledDwellMins,
      predictedArrival: formatTimeOnly(predictedArrivalMins),
      predictedDeparture: formatTimeOnly(predictedDepartureMins),
      predictedArrivalMinutes: predictedArrivalMins,
      predictedRemainingTravelTimeMins: cumulativeTravelTimeFromCurrent,
      expectedTimeRange,
      delayMinutes: dynamicDelayMinutes,
      staticNtesDelayMinutes: staticNtesDelay,
      platform: st.platform,
      status: isNext ? 'next' : 'enroute',
      dwellBufferRecoveryMins: dwellBufferSavings,
      confidenceScore: stationConfidence,
      sectionClearance,
    });

    cumulativeTravelTimeFromCurrent += effectiveDwellMins;
  }

  // 5. Generate Explainability Factors for the XAI Waterfall
  // Condition 1: Downstream Congestion
  if (conditions.downstreamCongestion.active) {
    explainabilityFactors.push({
      id: 'exp-congestion',
      category: 'Block Congestion',
      name: 'Downstream Section Congestion (1.35x Slowdown)',
      impactMinutes: +conditions.downstreamCongestion.delayImpactMinutes,
      location: `${conditions.downstreamCongestion.sectionCode} Junction Approach`,
      confidence: 94,
      description: `Terminal diamond crossing and yard convergence at ${conditions.downstreamCongestion.sectionCode} has throttled section throughput by 35%.`,
      modelAttributionPct: 36,
    });
  }

  // Condition 2: Preceding Train Delay
  if (conditions.precedingTrain.active) {
    explainabilityFactors.push({
      id: 'exp-preceding',
      category: 'Signal Precedence',
      name: `Preceding Train #${conditions.precedingTrain.trainNumber} Headway Delay`,
      impactMinutes: +conditions.precedingTrain.expectedImpactMinutes,
      location: conditions.precedingTrain.affectedSection,
      confidence: 95,
      description: `${conditions.precedingTrain.trainName} running +${conditions.precedingTrain.currentDelayMinutes}m late ahead in the block, compressing safe braking headway.`,
      modelAttributionPct: 30,
    });
  }

  // Condition 3: Signal Halt
  if (conditions.signalHalt.active) {
    explainabilityFactors.push({
      id: 'exp-signal-halt',
      category: 'Signal Precedence',
      name: 'Train Halted at Red Signal',
      impactMinutes: +conditions.signalHalt.delayImpactMinutes,
      location: conditions.signalHalt.locationName,
      confidence: 98,
      description: `Locomotive halted at red automatic signal due to ${conditions.signalHalt.signalType}. Delay propagating downstream.`,
      modelAttributionPct: 40,
    });
  }

  // Condition 4: Speed Restriction
  if (conditions.speedRestriction.active) {
    explainabilityFactors.push({
      id: 'exp-speed-restrict',
      category: 'Caution Order',
      name: `Caution Order Speed Cap (${conditions.speedRestriction.restrictedSpeedKmH} km/h)`,
      impactMinutes: +conditions.speedRestriction.delayImpactMinutes,
      location: `Section near ${conditions.speedRestriction.sectionCode}`,
      confidence: 97,
      description: `Speed restricted from ${conditions.speedRestriction.normalSpeedKmH} to ${conditions.speedRestriction.restrictedSpeedKmH} km/h due to P-Way track geometry rectification.`,
      modelAttributionPct: 34,
    });
  }

  // Condition 5: Unscheduled Stop
  if (conditions.unscheduledStop.active) {
    explainabilityFactors.push({
      id: 'exp-unscheduled-stop',
      category: 'Dwell Overrun',
      name: 'Unscheduled Section Stoppage',
      impactMinutes: +conditions.unscheduledStop.durationMinutes,
      location: conditions.unscheduledStop.location,
      confidence: 99,
      description: conditions.unscheduledStop.reason,
      modelAttributionPct: 28,
    });
  }

  // Condition 6: Maintenance Block
  if (conditions.maintenanceBlock.active) {
    explainabilityFactors.push({
      id: 'exp-maint-block',
      category: 'Block Congestion',
      name: 'Maintenance Traffic & Power Block',
      impactMinutes: +conditions.maintenanceBlock.delayImpactMinutes,
      location: conditions.maintenanceBlock.sectionName,
      confidence: 93,
      description: conditions.maintenanceBlock.blockType,
      modelAttributionPct: 42,
    });
  }

  // Condition 7: Level Crossing Delay
  if (conditions.levelCrossing.active) {
    explainabilityFactors.push({
      id: 'exp-level-crossing',
      category: 'Caution Order',
      name: `Level Crossing Gate Detention (${conditions.levelCrossing.gateNumber})`,
      impactMinutes: +conditions.levelCrossing.delayImpactMinutes,
      location: `Section near ${conditions.levelCrossing.sectionCode}`,
      confidence: 91,
      description: 'Manned level crossing gate held open for heavy emergency road traffic before interlock clearance.',
      modelAttributionPct: 22,
    });
  }

  // Condition 8: Weather Impact
  if (conditions.weather !== 'normal') {
    const weatherImpact =
      conditions.weather === 'severe_weather' ? 25 : conditions.weather === 'poor_visibility' ? 14 : 4;
    explainabilityFactors.push({
      id: 'exp-weather',
      category: 'Weather Condition',
      name: `Adverse Weather (${conditions.weather.replace('_', ' ').toUpperCase()})`,
      impactMinutes: +weatherImpact,
      location: 'Northern Plains Corridor',
      confidence: 89,
      description:
        conditions.weather === 'poor_visibility'
          ? 'Winter radiation fog; FOG Pass device active in locomotive cab, enforcing 75 km/h safety ceiling.'
          : conditions.weather === 'severe_weather'
          ? 'Severe monsoon squall & high wind warning; loco restricted to 50 km/h with traction slip protection.'
          : 'Moderate continuous rain causing reduced adhesion; speed moderated to 100 km/h.',
      modelAttributionPct: 35,
    });
  }

  // Condition 9: GPS Data Stale
  if (isGpsStale) {
    explainabilityFactors.push({
      id: 'exp-gps-stale',
      category: 'Block Congestion',
      name: 'GPS Telemetry Loss · Dead Reckoning Mode',
      impactMinutes: 0,
      location: 'Locomotive GNSS Transponder',
      confidence: 76,
      description: 'Satellite fix degraded. Forecasting engine fell back to last known block post and historical sectional speed profile (-18% confidence penalty).',
      modelAttributionPct: 15,
    });
  }

  // Dwell recovery
  if (dwellSavingsMinutes > 0) {
    explainabilityFactors.push({
      id: 'exp-dwell-rec',
      category: 'Dwell Overrun',
      name: 'Dynamic Dwell Buffer Compression',
      impactMinutes: -dwellSavingsMinutes,
      location: 'Major Hub Halts (BZA, NGP, ET, VGLJ)',
      confidence: 93,
      description: `Station controllers optimized platform halt times to recover ${dwellSavingsMinutes} mins towards minimum turnaround.`,
      modelAttributionPct: 20,
    });
  }

  // Slack recovery
  if (slackRecoveryMinutes > 0) {
    explainabilityFactors.push({
      id: 'exp-slack-rec',
      category: 'Speed Recovery',
      name: 'Sectional Timetable Slack Recovery',
      impactMinutes: -slackRecoveryMinutes,
      location: 'Automatic Signaling 130 km/h Sections',
      confidence: 95,
      description: `WAP-7 electric locomotive dynamic acceleration recovering ${slackRecoveryMinutes} mins on straight grade lines.`,
      modelAttributionPct: 24,
    });
  }

  // Active custom disruptions
  for (const d of activeDisruptions) {
    if (!explainabilityFactors.some((f) => f.name.includes(d.title))) {
      explainabilityFactors.push({
        id: `exp-${d.id}`,
        category: 'Caution Order',
        name: d.title,
        impactMinutes: +d.delayImpactMins,
        location: `Station: ${d.stationCode}`,
        confidence: 92,
        description: d.description,
        modelAttributionPct: 25,
      });
    }
  }

  // Build unified operational timeline
  const timelineDisruptions: OperationalDisruption[] = [...disruptions];

  if (conditions.downstreamCongestion.active) {
    timelineDisruptions.unshift({
      id: 'cond-congestion',
      type: 'platform_congestion',
      title: 'Downstream Section Congestion',
      stationCode: conditions.downstreamCongestion.sectionCode,
      description: `High corridor track occupancy at ${conditions.downstreamCongestion.sectionCode} approach. Throughput throttled by 35%.`,
      delayImpactMins: conditions.downstreamCongestion.delayImpactMinutes,
      active: true,
      timeAdded: '13:10 IST',
      severity: 'high',
    });
  }

  if (conditions.precedingTrain.active) {
    timelineDisruptions.unshift({
      id: 'cond-preceding',
      type: 'signal_precedence',
      title: `Preceding Train #${conditions.precedingTrain.trainNumber} Delayed (+${conditions.precedingTrain.currentDelayMinutes}m)`,
      stationCode: conditions.precedingTrain.affectedSectionCode,
      description: `Trailing ${conditions.precedingTrain.trainName} on ${conditions.precedingTrain.affectedSection}. Block headway narrowed.`,
      delayImpactMins: conditions.precedingTrain.expectedImpactMinutes,
      active: true,
      timeAdded: '13:05 IST',
      severity: 'medium',
    });
  }

  if (conditions.signalHalt.active) {
    timelineDisruptions.unshift({
      id: 'cond-signal-halt',
      type: 'signal_precedence',
      title: 'Signal Halt at Red / Danger Aspect',
      stationCode: stations[currentStationIndex].code,
      description: `Train stopped at ${conditions.signalHalt.locationName}. Locomotive at 0 km/h awaiting line clearance.`,
      delayImpactMins: conditions.signalHalt.delayImpactMinutes,
      active: true,
      timeAdded: '13:12 IST',
      severity: 'high',
    });
  }

  if (conditions.speedRestriction.active) {
    timelineDisruptions.unshift({
      id: 'cond-speed-restrict',
      type: 'caution_order',
      title: `Temporary Speed Restriction (${conditions.speedRestriction.restrictedSpeedKmH} km/h)`,
      stationCode: conditions.speedRestriction.sectionCode,
      description: `Engineering caution order enforced near ${conditions.speedRestriction.sectionCode}. Normal ${conditions.speedRestriction.normalSpeedKmH} km/h speed reduced.`,
      delayImpactMins: conditions.speedRestriction.delayImpactMinutes,
      speedRestrictionKmH: conditions.speedRestriction.restrictedSpeedKmH,
      active: true,
      timeAdded: '12:50 IST',
      severity: 'medium',
    });
  }

  if (conditions.unscheduledStop.active) {
    timelineDisruptions.unshift({
      id: 'cond-unscheduled-stop',
      type: 'platform_congestion',
      title: 'Unscheduled Section Stoppage (5 mins)',
      stationCode: stations[currentStationIndex].code,
      description: conditions.unscheduledStop.reason,
      delayImpactMins: conditions.unscheduledStop.durationMinutes,
      active: true,
      timeAdded: '13:14 IST',
      severity: 'high',
    });
  }

  if (conditions.maintenanceBlock.active) {
    timelineDisruptions.unshift({
      id: 'cond-maint-block',
      type: 'track_maintenance',
      title: 'Maintenance Power & Traffic Block',
      stationCode: conditions.maintenanceBlock.sectionCode,
      description: `${conditions.maintenanceBlock.blockType} on ${conditions.maintenanceBlock.sectionName}.`,
      delayImpactMins: conditions.maintenanceBlock.delayImpactMinutes,
      active: true,
      timeAdded: '11:45 IST',
      severity: 'high',
    });
  }

  if (conditions.levelCrossing.active) {
    timelineDisruptions.unshift({
      id: 'cond-level-crossing',
      type: 'caution_order',
      title: `Level Crossing Gate Delay (${conditions.levelCrossing.gateNumber})`,
      stationCode: conditions.levelCrossing.sectionCode,
      description: 'Manned level crossing gate detention awaiting road traffic clearance before signal interlocking.',
      delayImpactMins: conditions.levelCrossing.delayImpactMinutes,
      active: true,
      timeAdded: '13:00 IST',
      severity: 'low',
    });
  }

  if (conditions.weather !== 'normal') {
    const weatherImpact =
      conditions.weather === 'severe_weather' ? 25 : conditions.weather === 'poor_visibility' ? 14 : 4;
    timelineDisruptions.unshift({
      id: 'cond-weather',
      type: 'weather_fog',
      title: `Weather Alert: ${conditions.weather.replace('_', ' ').toUpperCase()}`,
      stationCode: 'AGC',
      description: `Corridor environmental alert. Permissible sectional speed capped by loco safety pass device.`,
      delayImpactMins: weatherImpact,
      active: true,
      timeAdded: '06:00 IST',
      severity: conditions.weather === 'severe_weather' ? 'high' : 'medium',
    });
  }

  if (isGpsStale) {
    timelineDisruptions.unshift({
      id: 'cond-gps-stale',
      type: 'platform_congestion',
      title: 'GNSS GPS Data Stale · Dead Reckoning Active',
      stationCode: stations[currentStationIndex].code,
      description: 'Satellite transponder signal lost. Prediction engine fell back to historical section travel times.',
      delayImpactMins: 0,
      active: true,
      timeAdded: '13:15 IST',
      severity: 'medium',
    });
  }

  // Overall confidence
  const upcomingETAs = stationETAs.slice(currentStationIndex);
  let overallConfidence = Math.round(
    upcomingETAs.reduce((acc, s) => acc + s.confidenceScore, 0) /
      Math.max(1, upcomingETAs.length)
  );

  return {
    stationETAs,
    currentSectionIndex,
    currentStationIndex,
    totalDelayMinutes: currentAccumulatedDelay,
    overallConfidence,
    explainabilityFactors,
    currentVsHistorical,
    effectiveSpeedKmH: effectiveSpeed,
    timelineDisruptions,
    signalState,
    isGpsStale,
  };
}

/**
 * Builds the ETA Trend dataset for comparing:
 * - Scheduled Timetable ETA
 * - Previous Prediction ETA
 * - Current Prediction ETA
 */
export function buildEtaTrendPoints(
  currentETAs: DynamicStationETA[],
  previousETAs: DynamicStationETA[] | null,
  stations = ROUTE_STATIONS
): EtaTrendPoint[] {
  return currentETAs.map((curr, idx) => {
    const st = stations[idx];
    const isDay2 = idx >= 8;
    const dayOffset = isDay2 ? 1 : 0;
    const scheduledMins = timeStringToMinutes(st.scheduledArrival, dayOffset);

    const prev = previousETAs && previousETAs[idx] ? previousETAs[idx] : curr;
    const prevPredMins = prev.predictedArrivalMinutes || scheduledMins + prev.delayMinutes;
    const currPredMins = curr.predictedArrivalMinutes || scheduledMins + curr.delayMinutes;

    return {
      stationCode: curr.stationCode,
      stationName: curr.stationName,
      distanceKm: curr.distanceKm,
      scheduledTime: st.scheduledArrival === 'Source' ? '06:00' : st.scheduledArrival,
      scheduledMinutes: scheduledMins,
      previousPredictionTime: formatTimeOnly(prevPredMins),
      previousPredictionMinutes: prevPredMins,
      currentPredictionTime: curr.predictedArrival,
      currentPredictionMinutes: currPredMins,
      varianceDeltaMinutes: currPredMins - prevPredMins,
    };
  });
}
