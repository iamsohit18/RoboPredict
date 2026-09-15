/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Prediction, RobotTelemetry, RobotId } from '../types/robotics';

export function generatePrediction(telemetry: RobotTelemetry): Prediction {
  const j4 = telemetry.joints['J4'];
  const worstJoint = Object.values(telemetry.joints).reduce((prev, curr) => (curr.health < prev.health ? curr : prev), j4);

  // If J4 or any joint has significant vibration & torque deviation
  let failureType = 'Gearbox Wear';
  let probability = 82;
  let confidence = 91;
  let rulHours = 126;
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'HIGH';

  if (worstJoint.temperature > 72) {
    failureType = 'Motor Thermal Breakdown';
    probability = Math.min(96, Math.round(worstJoint.temperature * 1.25));
    riskLevel = 'CRITICAL';
    rulHours = Math.max(18, Math.round(200 - worstJoint.temperature * 2));
  } else if (worstJoint.vibration > 4.0) {
    failureType = 'Gearbox Wear & Backlash';
    probability = Math.min(95, Math.max(50, Math.round(worstJoint.vibration * 16 + 5)));
    riskLevel = probability > 80 ? 'HIGH' : 'MEDIUM';
    rulHours = Math.max(24, Math.round(400 - worstJoint.vibration * 55));
  } else if (worstJoint.health > 88) {
    failureType = 'Nominal Degradation';
    probability = 14;
    confidence = 94;
    riskLevel = 'LOW';
    rulHours = 1480;
  }

  // Feature Importance breakdown
  const vibWeight = Math.min(60, Math.max(15, Math.round((worstJoint.vibration / 5.0) * 40)));
  const torqWeight = Math.min(40, Math.max(12, Math.round((worstJoint.torque / 40.0) * 26)));
  const currWeight = Math.min(30, Math.max(10, Math.round((worstJoint.current / 6.0) * 20)));
  const posWeight = Math.min(25, Math.max(8, Math.round((worstJoint.positionError / 0.5) * 15)));
  const tempWeight = Math.max(5, 100 - (vibWeight + torqWeight + currWeight + posWeight));

  const explanation = worstJoint.vibration > 3.0
    ? `The XGBoost multi-sensor model detected an abnormal combination of increasing vibration (${worstJoint.vibration.toFixed(1)} mm/s), persistent torque deviation (${worstJoint.torque.toFixed(0)} Nm) and harmonic backlash in ${worstJoint.jointId} (${worstJoint.name}).`
    : `Operating parameters for ${telemetry.robotId} are within acceptable envelope with minor expected wear consistent with operating hours.`;

  return {
    robotId: telemetry.robotId,
    failureProbability: probability,
    riskLevel,
    predictedFailure: failureType,
    affectedJoint: worstJoint.jointId,
    confidence,
    estimatedRulHours: rulHours,
    predictionHorizonDays: 7,
    whyExplanation: explanation,
    featureImportances: [
      { feature: 'Vibration RMS (High Freq)', importance: vibWeight, delta: `+${Math.round((worstJoint.vibration / 1.5 - 1) * 100)}% vs baseline` },
      { feature: 'Torque Deviation', importance: torqWeight, delta: `+${Math.round((worstJoint.torque / 20.0 - 1) * 100)}% vs baseline` },
      { feature: 'Motor Current Draw', importance: currWeight, delta: `+${Math.round((worstJoint.current / 3.5 - 1) * 100)}% vs baseline` },
      { feature: 'Dynamic Position Error', importance: posWeight, delta: `+${Math.round((worstJoint.positionError / 0.04 - 1) * 100)}% vs baseline` },
      { feature: 'Stator Temperature', importance: tempWeight, delta: `+${Math.round((worstJoint.temperature / 52.0 - 1) * 100)}% vs baseline` },
    ],
    generatedAt: new Date().toLocaleTimeString('en-US', { hour12: false }),
  };
}

export const INITIAL_PREDICTION_RB003: Prediction = {
  robotId: 'RB-003',
  failureProbability: 82,
  riskLevel: 'HIGH',
  predictedFailure: 'Gearbox Wear',
  affectedJoint: 'J4',
  confidence: 91,
  estimatedRulHours: 126,
  predictionHorizonDays: 7,
  whyExplanation: 'The model detected an abnormal combination of increasing vibration (4.8 mm/s), torque deviation (+36 Nm) and position error (0.42°) in Joint 4.',
  featureImportances: [
    { feature: 'Vibration (High Freq RMS)', importance: 38, delta: '+220% vs baseline' },
    { feature: 'Torque Deviation', importance: 24, delta: '+80% vs baseline' },
    { feature: 'Motor Current', importance: 18, delta: '+62% vs baseline' },
    { feature: 'Position Error', importance: 12, delta: '+950% vs baseline' },
    { feature: 'Temperature', importance: 8, delta: '+30% vs baseline' },
  ],
  generatedAt: '10:35:18',
};
