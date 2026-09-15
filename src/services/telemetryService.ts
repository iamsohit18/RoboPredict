/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
import { SimulationTelemetrySource } from '../simulation/telemetryEngine';
import { INITIAL_HEALTH } from '../data/mockRobots';
import { INITIAL_ALERTS, INITIAL_RECOMMENDATIONS } from '../data/mockMaintenance';
import { INITIAL_ANOMALY_TIMELINE, evaluateAnomalies } from '../ai/anomalyDetection';
import { generatePrediction } from '../ai/failurePrediction';
import { calculateRobotHealth } from '../ai/healthScore';

type ChangeListener = () => void;

class TelemetryService {
  public source: SimulationTelemetrySource;
  public selectedRobotId: RobotId = 'RB-003';
  public robotHealths: Record<RobotId, RobotHealth> = { ...INITIAL_HEALTH };
  public alerts: Alert[] = [...INITIAL_ALERTS];
  public recommendations: MaintenanceRecommendation[] = [...INITIAL_RECOMMENDATIONS];
  public anomalyTimeline: AnomalyEvent[] = [...INITIAL_ANOMALY_TIMELINE];
  public currentPredictions: Record<RobotId, Prediction> = {} as any;

  // Demo Mode state
  public isDemoActive = false;
  public demoStep = 0;
  public demoStepDescription = 'Ready';
  private demoTimer: number | null = null;

  private listeners: Set<ChangeListener> = new Set();

  constructor() {
    this.source = new SimulationTelemetrySource();
    this.source.connect();

    // Initialize predictions
    const ids: RobotId[] = ['RB-001', 'RB-002', 'RB-003', 'RB-004'];
    ids.forEach((id) => {
      const telem = this.source.getLatestTelemetry(id);
      if (telem) {
        this.currentPredictions[id] = generatePrediction(telem);
      }
    });

    // Subscribe to all robot telemetry ticks
    ids.forEach((id) => {
      this.source.subscribe(id, (telem) => {
        this.handleTelemetryTick(id, telem);
      });
    });
  }

  private handleTelemetryTick(id: RobotId, telem: RobotTelemetry) {
    // Dynamic health update
    const currentHealth = this.robotHealths[id];
    const newHealth = calculateRobotHealth(
      id,
      telem.joints,
      currentHealth ? currentHealth.operatingHours : 3000,
      currentHealth ? currentHealth.lastMaintenanceDate : '2026-08-01'
    );
    this.robotHealths[id] = newHealth;

    // Predictions
    this.currentPredictions[id] = generatePrediction(telem);

    // Evaluate anomalies
    const newAnomalies = evaluateAnomalies(telem);
    if (newAnomalies.length > 0) {
      // Prepend up to 50 items
      this.anomalyTimeline = [...newAnomalies, ...this.anomalyTimeline].slice(0, 50);
    }

    this.notify();
  }

  public setSelectedRobot(id: RobotId) {
    this.selectedRobotId = id;
    this.notify();
  }

  public acknowledgeAlert(alertId: string) {
    this.alerts = this.alerts.map((a) => (a.id === alertId ? { ...a, status: 'Acknowledged' } : a));
    this.notify();
  }

  public resolveAlert(alertId: string) {
    this.alerts = this.alerts.map((a) => (a.id === alertId ? { ...a, status: 'Resolved' } : a));
    this.notify();
  }

  public acknowledgeRecommendation(recId: string) {
    this.recommendations = this.recommendations.map((r) =>
      r.id === recId ? { ...r, isAcknowledged: true, status: 'Scheduled' } : r
    );
    this.notify();
  }

  public setFault(robotId: RobotId, fault: FaultType, intensity: number = 1.0) {
    this.source.setFault(robotId, fault, intensity);
    this.notify();
  }

  public setOperatingMode(robotId: RobotId, mode: OperatingMode) {
    this.source.setOperatingMode(robotId, mode);
    this.notify();
  }

  /**
   * Run AI Failure Demo (Section 25)
   */
  public runAiFailureDemo() {
    if (this.isDemoActive) return;
    this.isDemoActive = true;
    this.selectedRobotId = 'RB-003';
    this.demoStep = 1;
    this.demoStepDescription = 'Step 1/8: Initializing baseline baseline normal operation on RB-003...';
    this.notify();

    // Step 1: Normal base
    this.source.setFault('RB-003', 'None', 0);
    this.source.setOperatingMode('RB-003', 'Normal');

    this.demoTimer = window.setTimeout(() => {
      // Step 2: Micro-chatter begins in Joint 4
      this.demoStep = 2;
      this.demoStepDescription = 'Step 2/8: Gearbox micro-wear onset in Joint 4 harmonic gear set...';
      this.source.setFault('RB-003', 'Gearbox Wear', 0.25);
      this.notify();

      this.demoTimer = window.setTimeout(() => {
        // Step 3: Vibration & Torque rise
        this.demoStep = 3;
        this.demoStepDescription = 'Step 3/8: Vibration surging to 3.2 mm/s, torque deviation +18 Nm...';
        this.source.setFault('RB-003', 'Gearbox Wear', 0.5);
        this.notify();

        this.demoTimer = window.setTimeout(() => {
          // Step 4: Position tracking drift & temp rise
          this.demoStep = 4;
          this.demoStepDescription = 'Step 4/8: Dynamic tracking drift (0.28°) and thermal build-up to 64°C...';
          this.source.setFault('RB-003', 'Gearbox Wear', 0.75);
          this.notify();

          this.demoTimer = window.setTimeout(() => {
            // Step 5: Full failure signature reached (82% probability)
            this.demoStep = 5;
            this.demoStepDescription = 'Step 5/8: XGBoost detects Gearbox Wear signature: 82% Failure Prob, 91% Conf...';
            this.source.setFault('RB-003', 'Gearbox Wear', 1.0);

            // Add alert
            const nowTime = new Date().toLocaleTimeString('en-US', { hour12: false });
            const newAlert: Alert = {
              id: `ALT-${Math.floor(1100 + Math.random() * 900)}`,
              severity: 'CRITICAL',
              robotId: 'RB-003',
              component: 'Joint 4 Gearbox',
              issue: 'Gearbox Wear & Harmonic Backlash',
              failureProbability: 82,
              detectedAt: nowTime,
              status: 'Active',
              description: 'High-frequency vibration (4.8 mm/s), 36 Nm torque anomaly, RUL 126h predicted.',
            };
            this.alerts = [newAlert, ...this.alerts];

            // Add timeline event
            this.anomalyTimeline = [
              {
                id: `EVT-${Date.now()}`,
                robotId: 'RB-003',
                timestamp: nowTime,
                severity: 'CRITICAL',
                jointId: 'J4',
                metric: 'AI Predictive Engine',
                message: 'AI Failure Demo: High-risk gearbox wear pattern detected in J4',
                value: 82,
                baseline: 15,
              },
              ...this.anomalyTimeline,
            ];
            this.notify();

            this.demoTimer = window.setTimeout(() => {
              // Step 6: Predictive Maintenance generated
              this.demoStep = 6;
              this.demoStepDescription = 'Step 6/8: P1 Maintenance Action generated: Inspect J4 within 24 hours...';
              const newRec: MaintenanceRecommendation = {
                id: `REC-${Math.floor(400 + Math.random() * 500)}`,
                robotId: 'RB-003',
                component: 'Joint 4 Gearbox',
                issue: 'Joint 4 Gearbox Wear',
                risk: 'HIGH',
                recommendedAction: 'Inspect Joint 4 gearbox and lubrication system within 24 hours. Check backlash and bearing play.',
                estimatedRulHours: 126,
                priority: 'P1',
                estimatedDowntimeHours: 2.5,
                isAcknowledged: false,
                status: 'Pending',
              };
              this.recommendations = [newRec, ...this.recommendations];
              this.notify();

              this.demoTimer = window.setTimeout(() => {
                this.demoStep = 7;
                this.demoStepDescription = 'Demo Completed: Live AI prediction and alerts generated successfully!';
                this.notify();
              }, 2500);
            }, 2500);
          }, 2500);
        }, 2500);
      }, 2500);
    }, 2000);
  }

  public resetDemo() {
    if (this.demoTimer) {
      clearTimeout(this.demoTimer);
      this.demoTimer = null;
    }
    this.isDemoActive = false;
    this.demoStep = 0;
    this.demoStepDescription = 'Ready';
    this.source.resetSimulation();
    this.robotHealths = { ...INITIAL_HEALTH };
    this.alerts = [...INITIAL_ALERTS];
    this.recommendations = [...INITIAL_RECOMMENDATIONS];
    this.anomalyTimeline = [...INITIAL_ANOMALY_TIMELINE];
    this.notify();
  }

  public subscribe(listener: ChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }
}

export const telemetryService = new TelemetryService();
