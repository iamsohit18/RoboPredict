/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RobotId = 'RB-001' | 'RB-002' | 'RB-003' | 'RB-004';
export type RobotStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
export type JointId = 'J1' | 'J2' | 'J3' | 'J4' | 'J5' | 'J6';
export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AlertStatus = 'Active' | 'Acknowledged' | 'Resolved';
export type MaintenancePriority = 'P1' | 'P2' | 'P3';
export type OperatingMode = 'Normal' | 'High Load' | 'Stress Test' | 'Failure Simulation';

export type FaultType =
  | 'None'
  | 'Motor Overheating'
  | 'Excessive Vibration'
  | 'Gearbox Wear'
  | 'Motor Failure'
  | 'Sensor Failure'
  | 'Communication Failure'
  | 'Bearing Wear'
  | 'Excessive Load'
  | 'Position Drift';

export interface JointTelemetry {
  jointId: JointId;
  name: string;
  temperature: number; // °C
  current: number;     // Amperes
  torque: number;      // Nm
  vibration: number;   // mm/s RMS
  position: number;    // degrees
  positionError: number; // degrees
  speed: number;       // deg/s
  health: number;      // 0 - 100%
  status: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
}

export interface RobotTelemetry {
  robotId: RobotId;
  timestamp: number;
  timeString: string;
  temperature: number;      // Overall °C
  motorCurrent: number;     // Average A
  torque: number;           // Total/Avg Nm
  vibration: number;        // Overall mm/s
  positionError: number;    // deg
  motorLoad: number;        // 0 - 100%
  powerConsumption: number; // kW
  speed: number;            // % of max
  commStatus: 'ONLINE' | 'LATENCY_HIGH' | 'OFFLINE';
  sensorStatus: 'ALL_OK' | 'DEGRADED' | 'FAULT';
  joints: Record<JointId, JointTelemetry>;
}

export interface RobotHealth {
  robotId: RobotId;
  healthScore: number;       // 0 - 100%
  status: RobotStatus;
  failureProbability: number;// 0 - 100%
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  predictedIssue: string;
  targetComponent: string;
  confidence: number;        // 0 - 100%
  remainingUsefulLifeHours: number;
  operatingHours: number;
  lastMaintenanceDate: string;
  nextRecommendedMaintenance: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number; // percentage 0 - 100
  delta: string;      // e.g. "+124% vs baseline"
}

export interface Prediction {
  robotId: RobotId;
  failureProbability: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  predictedFailure: string;
  affectedJoint: JointId | 'Overall';
  confidence: number;
  estimatedRulHours: number;
  predictionHorizonDays: number;
  whyExplanation: string;
  featureImportances: FeatureImportance[];
  generatedAt: string;
}

export interface AnomalyEvent {
  id: string;
  robotId: RobotId;
  timestamp: string;
  severity: AlertSeverity;
  jointId?: JointId;
  metric: string;
  message: string;
  value: number;
  baseline: number;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  robotId: RobotId;
  component: string;
  issue: string;
  failureProbability: number;
  detectedAt: string;
  status: AlertStatus;
  description: string;
}

export interface MaintenanceRecommendation {
  id: string;
  robotId: RobotId;
  component: string;
  issue: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedAction: string;
  estimatedRulHours: number;
  priority: MaintenancePriority;
  estimatedDowntimeHours: number;
  scheduledDate?: string;
  isAcknowledged: boolean;
  status: 'Pending' | 'Scheduled' | 'Completed';
}

export interface MaintenanceRecord {
  id: string;
  robotId: RobotId;
  component: string;
  issue: string;
  maintenanceType: 'Preventive' | 'Corrective' | 'Predictive' | 'Calibration';
  technician: string;
  date: string;
  downtimeHours: number;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  notes: string;
}

export interface RobotMetadata {
  id: RobotId;
  name: string;
  model: string;
  manufacturer: string;
  dof: number;
  payloadKg: number;
  reachMm: number;
  firmware: string;
  controllerStatus: 'OPERATIONAL' | 'WARNING' | 'EMERGENCY_STOP';
  commStatus: 'CONNECTED' | 'DISCONNECTED';
  workcell: string;
  installationDate: string;
}

export interface DatasetItem {
  id: string;
  name: string;
  records: string;
  robots: string;
  features: number;
  dateRange: string;
  qualityScore: number;
  format: string;
  sizeMb: number;
}

export interface AIModelItem {
  id: string;
  name: string;
  algorithm: string;
  purpose: 'Anomaly Detection' | 'Failure Prediction' | 'Failure Classification' | 'RUL Estimation';
  status: 'Active' | 'Available' | 'Training';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: string;
  trainingRecords: string;
}

export interface SimulationState {
  isRunning: boolean;
  speedMultiplier: number;
  activeFault: FaultType;
  faultIntensity: number; // 0 - 100%
  operatingMode: OperatingMode;
  isDemoActive: boolean;
  demoStep: number;
  demoStepDescription: string;
}
