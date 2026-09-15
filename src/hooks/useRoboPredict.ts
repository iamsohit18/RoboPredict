/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { telemetryService } from '../services/telemetryService';
import {
  RobotId,
  RobotTelemetry,
  RobotHealth,
  Alert,
  MaintenanceRecommendation,
  AnomalyEvent,
  Prediction,
  FaultType,
  OperatingMode,
} from '../types/robotics';
import { ROBOTS_METADATA } from '../data/mockRobots';

export function useRoboPredict() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = telemetryService.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsub;
  }, []);

  const selectedRobotId = telemetryService.selectedRobotId;
  const currentTelemetry: RobotTelemetry | null = telemetryService.source.getLatestTelemetry(selectedRobotId);
  const telemetryHistory: RobotTelemetry[] = telemetryService.source.getHistory(selectedRobotId);
  const health: RobotHealth = telemetryService.robotHealths[selectedRobotId] || {
    robotId: selectedRobotId,
    healthScore: 85,
    status: 'HEALTHY',
    failureProbability: 15,
    riskLevel: 'LOW',
    predictedIssue: 'Nominal',
    targetComponent: 'None',
    confidence: 90,
    remainingUsefulLifeHours: 1200,
    operatingHours: 4000,
    lastMaintenanceDate: '2026-08-01',
    nextRecommendedMaintenance: 'In 90 days',
  };

  const prediction: Prediction | undefined = telemetryService.currentPredictions[selectedRobotId];
  const metadata = ROBOTS_METADATA[selectedRobotId];
  const simState = telemetryService.source.getRobotSimState(selectedRobotId);

  // Fleet wide KPIs
  const allHealths = Object.values(telemetryService.robotHealths);
  const totalRobots = allHealths.length;
  const healthyCount = allHealths.filter((h) => h.status === 'HEALTHY').length;
  const warningCount = allHealths.filter((h) => h.status === 'WARNING').length;
  const criticalCount = allHealths.filter((h) => h.status === 'CRITICAL').length;
  const activeAlerts = telemetryService.alerts.filter((a) => a.status === 'Active').length;
  const predictedFailures = allHealths.filter((h) => h.failureProbability > 60).length;

  return {
    selectedRobotId,
    setSelectedRobot: (id: RobotId) => telemetryService.setSelectedRobot(id),
    currentTelemetry,
    telemetryHistory,
    health,
    prediction,
    metadata,
    allHealths: telemetryService.robotHealths,
    alerts: telemetryService.alerts,
    recommendations: telemetryService.recommendations,
    anomalyTimeline: telemetryService.anomalyTimeline,
    acknowledgeAlert: (id: string) => telemetryService.acknowledgeAlert(id),
    resolveAlert: (id: string) => telemetryService.resolveAlert(id),
    acknowledgeRecommendation: (id: string) => telemetryService.acknowledgeRecommendation(id),
    // Simulation controls
    isRunning: telemetryService.source.getIsRunning(),
    speedMultiplier: telemetryService.source.getSpeed(),
    startSimulation: () => telemetryService.source.resume(),
    pauseSimulation: () => telemetryService.source.pause(),
    resetSimulation: () => telemetryService.source.resetSimulation(),
    setSpeed: (speed: number) => telemetryService.source.setSpeed(speed),
    setFault: (fault: FaultType, intensity?: number) => telemetryService.setFault(selectedRobotId, fault, intensity),
    injectFault: (fault: FaultType, intensity?: number) => telemetryService.setFault(selectedRobotId, fault, intensity),
    setOperatingMode: (mode: OperatingMode) => telemetryService.setOperatingMode(selectedRobotId, mode),
    activeFault: simState ? simState.activeFault : 'None',
    faultIntensity: simState ? simState.faultIntensity : 0,
    operatingMode: simState ? simState.operatingMode : 'Normal',
    // Telemetry source type
    telemetrySourceType: 'simulation' as 'simulation' | 'ros2',
    setTelemetrySourceType: (type: 'simulation' | 'ros2') => {},
    // Demo Mode
    isDemoActive: telemetryService.isDemoActive,
    demoStep: telemetryService.demoStep,
    demoStepDescription: telemetryService.demoStepDescription,
    runAiFailureDemo: () => telemetryService.runAiFailureDemo(),
    resetDemo: () => telemetryService.resetDemo(),
    // Fleet KPIs
    kpis: {
      totalRobots,
      healthyCount,
      warningCount,
      criticalCount,
      activeAlerts,
      predictedFailures,
    },
  };
}
