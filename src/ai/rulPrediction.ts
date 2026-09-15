/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RulPoint {
  hoursElapsed: number;
  remainingHours: number;
  healthPercent: number;
  confidenceLower: number;
  confidenceUpper: number;
}

export function generateRulDegradationCurve(
  currentRul: number,
  currentHealth: number,
  degradationRate: number = 1.0 // 1.0 = standard, >1.0 = accelerated wear
): RulPoint[] {
  const points: RulPoint[] = [];
  const steps = 10;
  const timeStep = Math.round(currentRul / steps);

  for (let i = 0; i <= steps; i++) {
    const hours = i * timeStep;
    const remaining = Math.max(0, currentRul - hours * degradationRate);
    const health = Math.max(5, Math.round(currentHealth * (remaining / Math.max(1, currentRul))));
    const uncertainty = hours * 0.15;

    points.push({
      hoursElapsed: hours,
      remainingHours: Math.round(remaining),
      healthPercent: health,
      confidenceLower: Math.max(0, Math.round(remaining - uncertainty)),
      confidenceUpper: Math.round(remaining + uncertainty),
    });
  }

  return points;
}
