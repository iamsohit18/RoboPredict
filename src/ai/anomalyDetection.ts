/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnomalyEvent, RobotTelemetry, AlertSeverity, JointId } from '../types/robotics';

let anomalyCounter = 200;

export function evaluateAnomalies(telemetry: RobotTelemetry): AnomalyEvent[] {
  const anomalies: AnomalyEvent[] = [];
  const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });

  // Check each joint
  for (const [jKey, joint] of Object.entries(telemetry.joints)) {
    const jId = jKey as JointId;

    // Vibration anomaly
    if (joint.vibration > 4.2) {
      anomalies.push({
        id: `ANOM-${++anomalyCounter}`,
        robotId: telemetry.robotId,
        timestamp: nowStr,
        severity: 'CRITICAL',
        jointId: jId,
        metric: 'Vibration RMS',
        message: `Severe mechanical chatter in ${jId}: ${joint.vibration.toFixed(1)} mm/s (threshold: 4.0 mm/s)`,
        value: joint.vibration,
        baseline: 1.5,
      });
    } else if (joint.vibration > 2.8) {
      anomalies.push({
        id: `ANOM-${++anomalyCounter}`,
        robotId: telemetry.robotId,
        timestamp: nowStr,
        severity: 'WARNING',
        jointId: jId,
        metric: 'Vibration RMS',
        message: `Elevated vibration detected on ${jId}: ${joint.vibration.toFixed(1)} mm/s`,
        value: joint.vibration,
        baseline: 1.5,
      });
    }

    // Temperature anomaly
    if (joint.temperature > 72) {
      anomalies.push({
        id: `ANOM-${++anomalyCounter}`,
        robotId: telemetry.robotId,
        timestamp: nowStr,
        severity: 'CRITICAL',
        jointId: jId,
        metric: 'Stator Temperature',
        message: `High thermal overload in ${jId} winding: ${joint.temperature.toFixed(1)}°C`,
        value: joint.temperature,
        baseline: 52.0,
      });
    } else if (joint.temperature > 65) {
      anomalies.push({
        id: `ANOM-${++anomalyCounter}`,
        robotId: telemetry.robotId,
        timestamp: nowStr,
        severity: 'WARNING',
        jointId: jId,
        metric: 'Stator Temperature',
        message: `Elevated thermal signature on ${jId}: ${joint.temperature.toFixed(1)}°C`,
        value: joint.temperature,
        baseline: 52.0,
      });
    }

    // Position error anomaly
    if (joint.positionError > 0.3) {
      anomalies.push({
        id: `ANOM-${++anomalyCounter}`,
        robotId: telemetry.robotId,
        timestamp: nowStr,
        severity: 'CRITICAL',
        jointId: jId,
        metric: 'Dynamic Position Error',
        message: `Harmonic backlash/tracking drift: ${joint.positionError.toFixed(3)}° deviation`,
        value: joint.positionError,
        baseline: 0.03,
      });
    }
  }

  return anomalies;
}

export const INITIAL_ANOMALY_TIMELINE: AnomalyEvent[] = [
  {
    id: 'ANOM-101',
    robotId: 'RB-003',
    timestamp: '10:35:18',
    severity: 'CRITICAL',
    jointId: 'J4',
    metric: 'Predictive Maintenance Engine',
    message: 'Predictive maintenance alert generated for J4 harmonic drive',
    value: 82,
    baseline: 10,
  },
  {
    id: 'ANOM-102',
    robotId: 'RB-003',
    timestamp: '10:35:11',
    severity: 'CRITICAL',
    jointId: 'J4',
    metric: 'Pattern Recognition',
    message: 'High-risk gearbox wear pattern detected (confidence 91%)',
    value: 91,
    baseline: 20,
  },
  {
    id: 'ANOM-103',
    robotId: 'RB-003',
    timestamp: '10:34:02',
    severity: 'WARNING',
    jointId: 'J4',
    metric: 'Vibration RMS',
    message: 'Persistent vibration anomaly sustained > 3 minutes (4.8 mm/s)',
    value: 4.8,
    baseline: 1.6,
  },
  {
    id: 'ANOM-104',
    robotId: 'RB-003',
    timestamp: '10:33:21',
    severity: 'WARNING',
    jointId: 'J4',
    metric: 'Torque Sensor',
    message: 'Torque deviation detected during wrist rotation (+36 Nm)',
    value: 36,
    baseline: 20,
  },
  {
    id: 'ANOM-105',
    robotId: 'RB-003',
    timestamp: '10:32:12',
    severity: 'INFO',
    jointId: 'J4',
    metric: 'Accelerometer',
    message: 'Minor vibration spectral anomaly detected at 240 Hz',
    value: 2.9,
    baseline: 1.5,
  },
  {
    id: 'ANOM-106',
    robotId: 'RB-003',
    timestamp: '10:31:04',
    severity: 'INFO',
    jointId: 'J4',
    metric: 'System Diagnostic',
    message: 'All six servo axes nominal in production cycle',
    value: 0.02,
    baseline: 0.02,
  },
];
