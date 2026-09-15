/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JointTelemetry, RobotHealth, RobotId, RobotStatus } from '../types/robotics';

export interface HealthCalculationInput {
  temperature: number;
  vibration: number;
  current: number;
  torque: number;
  positionError: number;
  motorLoad: number;
}

/**
 * Calculates health for an individual joint based on physical telemetry thresholds.
 */
export function calculateJointHealth(input: HealthCalculationInput): {
  health: number;
  status: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
} {
  let penalty = 0;

  // Vibration penalty (Baseline ~1.5 mm/s)
  if (input.vibration > 1.8) {
    const vibOver = input.vibration - 1.8;
    penalty += Math.min(45, vibOver * 14);
  }

  // Temperature penalty (Baseline ~50°C, Warning >65°C, Critical >75°C)
  if (input.temperature > 58) {
    const tempOver = input.temperature - 58;
    penalty += Math.min(30, tempOver * 1.5);
  }

  // Position error penalty (Baseline <0.05 deg, Critical >0.3 deg)
  if (input.positionError > 0.06) {
    const errOver = input.positionError - 0.06;
    penalty += Math.min(35, errOver * 80);
  }

  // Current / Load penalty
  if (input.current > 4.8) {
    penalty += Math.min(20, (input.current - 4.8) * 6);
  }

  const rawHealth = Math.max(10, Math.min(100, Math.round(100 - penalty)));
  let status: 'NORMAL' | 'ELEVATED' | 'CRITICAL' = 'NORMAL';
  if (rawHealth < 75) {
    status = 'CRITICAL';
  } else if (rawHealth < 88) {
    status = 'ELEVATED';
  }

  return { health: rawHealth, status };
}

/**
 * Calculates overall robot health score combining joint health and auxiliary subsystems.
 */
export function calculateRobotHealth(
  robotId: RobotId,
  joints: Record<string, JointTelemetry>,
  operatingHours: number,
  lastMaintenanceDate: string
): RobotHealth {
  const jointList = Object.values(joints);
  if (jointList.length === 0) {
    return {
      robotId,
      healthScore: 95,
      status: 'HEALTHY',
      failureProbability: 10,
      riskLevel: 'LOW',
      predictedIssue: 'Nominal',
      targetComponent: 'None',
      confidence: 95,
      remainingUsefulLifeHours: 1200,
      operatingHours,
      lastMaintenanceDate,
      nextRecommendedMaintenance: 'In 90 days',
    };
  }

  // Find worst joint
  let minHealth = 100;
  let worstJoint = jointList[0];
  let sumHealth = 0;

  for (const j of jointList) {
    sumHealth += j.health;
    if (j.health < minHealth) {
      minHealth = j.health;
      worstJoint = j;
    }
  }

  const avgHealth = sumHealth / jointList.length;
  // Weighted: 60% minimum joint bottleneck + 40% fleet average
  const compositeHealth = Math.round(minHealth * 0.6 + avgHealth * 0.4);

  // Failure probability is inverse of health with non-linear sigmoid growth
  const healthDeficit = 100 - compositeHealth;
  const failureProbability = Math.min(99, Math.max(2, Math.round(Math.pow(healthDeficit / 10, 1.9) + 4)));

  let status: RobotStatus = 'HEALTHY';
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let nextMaintenance = 'In 3 months (Routine)';
  let predictedIssue = 'Nominal Operation';

  if (compositeHealth < 72 || failureProbability > 85) {
    status = 'CRITICAL';
    riskLevel = 'CRITICAL';
    nextMaintenance = 'Immediate Intervention (< 12 hours)';
    predictedIssue = `${worstJoint.name} Critical Failure Imminent`;
  } else if (compositeHealth < 85 || failureProbability > 50) {
    status = 'WARNING';
    riskLevel = failureProbability > 75 ? 'HIGH' : 'MEDIUM';
    nextMaintenance = failureProbability > 75 ? 'Within 24 hours' : 'Within 7 days';
    predictedIssue = worstJoint.vibration > 3.0 ? `Gearbox Wear (${worstJoint.jointId})` : `Elevated Thermal Stress (${worstJoint.jointId})`;
  }

  // Estimate RUL roughly based on remaining health reserve
  const remainingUsefulLifeHours = Math.max(12, Math.round((compositeHealth / 100) * 1600 * Math.max(0.08, (100 - failureProbability) / 100)));

  return {
    robotId,
    healthScore: compositeHealth,
    status,
    failureProbability,
    riskLevel,
    predictedIssue,
    targetComponent: `${worstJoint.jointId} (${worstJoint.name})`,
    confidence: Math.min(96, Math.max(82, 85 + Math.round(failureProbability / 10))),
    remainingUsefulLifeHours,
    operatingHours,
    lastMaintenanceDate,
    nextRecommendedMaintenance: nextMaintenance,
  };
}
