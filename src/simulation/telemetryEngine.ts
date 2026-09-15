/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  RobotId,
  JointId,
  RobotTelemetry,
  JointTelemetry,
  FaultType,
  OperatingMode,
} from '../types/robotics';
import { INITIAL_JOINTS_RB003 } from '../data/mockRobots';
import { calculateJointHealth } from '../ai/healthScore';

export type TelemetryListener = (telemetry: RobotTelemetry) => void;

/**
 * Clean architectural abstraction for robot telemetry ingestion.
 * Allows swapping between simulated virtual robot data and future ROS2 / hardware streams.
 */
export interface ITelemetrySource {
  connect(): Promise<void>;
  disconnect(): void;
  subscribe(robotId: RobotId, listener: TelemetryListener): () => void;
  getLatestTelemetry(robotId: RobotId): RobotTelemetry | null;
  getHistory(robotId: RobotId): RobotTelemetry[];
  getSourceType(): 'SIMULATION' | 'ROS2_ADAPTER' | 'HARDWARE_DIRECT';
}

interface RobotSimState {
  timeStep: number;
  operatingMode: OperatingMode;
  activeFault: FaultType;
  faultIntensity: number; // 0 to 1
  joints: Record<JointId, {
    baseAngle: number;
    angleVelocity: number;
    temp: number;
    current: number;
    torque: number;
    vibration: number;
    posError: number;
  }>;
}

export class SimulationTelemetrySource implements ITelemetrySource {
  private listeners: Map<RobotId, Set<TelemetryListener>> = new Map();
  private history: Map<RobotId, RobotTelemetry[]> = new Map();
  private maxHistoryLength = 200;
  private intervalId: number | null = null;
  private speedMultiplier = 1;
  private isRunning = true;
  private robotStates: Map<RobotId, RobotSimState> = new Map();

  constructor() {
    const robotIds: RobotId[] = ['RB-001', 'RB-002', 'RB-003', 'RB-004'];
    robotIds.forEach((id) => {
      this.listeners.set(id, new Set());
      this.history.set(id, []);
      this.initRobotSimState(id);
    });

    // Seed initial history points
    this.seedInitialHistory();
  }

  private initRobotSimState(id: RobotId) {
    const isDemoTarget = id === 'RB-003';
    const isWarningRB002 = id === 'RB-002';

    const baseJoints: Record<JointId, any> = {
      J1: { baseAngle: 24.5, angleVelocity: 0.8, temp: 52, current: 3.2, torque: 18, vibration: 1.4, posError: 0.02 },
      J2: { baseAngle: -32.1, angleVelocity: 0.6, temp: isWarningRB002 ? 74 : 55, current: 3.8, torque: 22, vibration: isWarningRB002 ? 2.5 : 1.8, posError: 0.04 },
      J3: { baseAngle: 78.4, angleVelocity: 0.9, temp: 61, current: 4.5, torque: 29, vibration: 2.3, posError: 0.08 },
      J4: { baseAngle: 112.0, angleVelocity: 1.2, temp: isDemoTarget ? 68 : 53, current: isDemoTarget ? 5.7 : 3.4, torque: isDemoTarget ? 36 : 21, vibration: isDemoTarget ? 4.8 : 1.6, posError: isDemoTarget ? 0.42 : 0.03 },
      J5: { baseAngle: -15.8, angleVelocity: 0.7, temp: 57, current: 3.9, torque: 24, vibration: 2.0, posError: 0.05 },
      J6: { baseAngle: 5.2, angleVelocity: 1.4, temp: 54, current: 3.4, torque: 20, vibration: 1.7, posError: 0.03 },
    };

    this.robotStates.set(id, {
      timeStep: 0,
      operatingMode: 'Normal',
      activeFault: isDemoTarget ? 'Gearbox Wear' : 'None',
      faultIntensity: isDemoTarget ? 0.82 : 0,
      joints: baseJoints,
    });
  }

  private seedInitialHistory() {
    const now = Date.now();
    const count = 30;
    const robotIds: RobotId[] = ['RB-001', 'RB-002', 'RB-003', 'RB-004'];

    robotIds.forEach((id) => {
      const hist = this.history.get(id)!;
      for (let i = count; i >= 0; i--) {
        const time = now - i * 3000;
        const state = this.robotStates.get(id)!;
        state.timeStep += 1;
        const telem = this.calculateTelemetry(id, time);
        hist.push(telem);
      }
    });
  }

  public async connect(): Promise<void> {
    if (this.intervalId) return;
    this.startLoop();
  }

  public disconnect(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public setSpeed(multiplier: number) {
    this.speedMultiplier = multiplier;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.startLoop();
    }
  }

  public getSpeed(): number {
    return this.speedMultiplier;
  }

  public pause() {
    this.isRunning = false;
  }

  public resume() {
    this.isRunning = true;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public resetSimulation() {
    const robotIds: RobotId[] = ['RB-001', 'RB-002', 'RB-003', 'RB-004'];
    robotIds.forEach((id) => {
      this.initRobotSimState(id);
      this.history.set(id, []);
    });
    this.seedInitialHistory();
  }

  public setFault(robotId: RobotId, fault: FaultType, intensity: number = 1.0) {
    const state = this.robotStates.get(robotId);
    if (state) {
      state.activeFault = fault;
      state.faultIntensity = intensity;
    }
  }

  public setOperatingMode(robotId: RobotId, mode: OperatingMode) {
    const state = this.robotStates.get(robotId);
    if (state) {
      state.operatingMode = mode;
    }
  }

  public getRobotSimState(robotId: RobotId): RobotSimState | undefined {
    return this.robotStates.get(robotId);
  }

  private startLoop() {
    const intervalMs = Math.max(200, Math.round(1000 / this.speedMultiplier));
    this.intervalId = window.setInterval(() => {
      if (!this.isRunning) return;
      this.tick();
    }, intervalMs);
  }

  private tick() {
    const now = Date.now();
    const robotIds: RobotId[] = ['RB-001', 'RB-002', 'RB-003', 'RB-004'];

    robotIds.forEach((id) => {
      const state = this.robotStates.get(id);
      if (!state) return;
      state.timeStep += 1;

      const telem = this.calculateTelemetry(id, now);
      const hist = this.history.get(id)!;
      hist.push(telem);
      if (hist.length > this.maxHistoryLength) {
        hist.shift();
      }

      // Notify subscribers
      const subs = this.listeners.get(id);
      if (subs) {
        subs.forEach((cb) => cb(telem));
      }
    });
  }

  private calculateTelemetry(id: RobotId, timestamp: number): RobotTelemetry {
    const state = this.robotStates.get(id)!;
    const t = state.timeStep * 0.1;
    const isGearboxFault = state.activeFault === 'Gearbox Wear';
    const isThermalFault = state.activeFault === 'Motor Overheating';
    const isVibFault = state.activeFault === 'Excessive Vibration';
    const isHighLoad = state.operatingMode === 'High Load' || state.operatingMode === 'Stress Test';

    const loadMultiplier = isHighLoad ? 1.4 : 1.0;
    const faultIntensity = state.faultIntensity;

    const jointNames: Record<JointId, string> = {
      J1: 'Base Rotation',
      J2: 'Lower Arm Pitch',
      J3: 'Upper Arm Pitch',
      J4: 'Wrist Roll (High Risk)',
      J5: 'Wrist Pitch',
      J6: 'Flange Yaw / End Tool',
    };

    const joints: Record<JointId, JointTelemetry> = {} as any;
    let sumTemp = 0;
    let sumCurrent = 0;
    let sumTorque = 0;
    let sumVib = 0;
    let sumPosErr = 0;

    (Object.keys(state.joints) as JointId[]).forEach((jId, idx) => {
      const jState = state.joints[jId];
      // Harmonic kinematic trajectory
      const angleDelta = Math.sin(t * jState.angleVelocity + idx) * 35;
      const currentAngle = jState.baseAngle + angleDelta;
      const speed = Math.abs(Math.cos(t * jState.angleVelocity + idx) * 45);

      // Natural stochastic jitter
      const jitter = (Math.sin(t * 3.7 + idx * 1.5) + Math.cos(t * 5.1)) * 0.08;

      let temp = jState.temp + Math.sin(t * 0.05 + idx) * 0.8 * loadMultiplier;
      let current = (jState.current + Math.abs(Math.sin(t * 1.2 + idx)) * 0.9) * loadMultiplier;
      let torque = (jState.torque + Math.sin(t * 1.5 + idx) * 3.5) * loadMultiplier;
      let vibration = jState.vibration + jitter;
      let posErr = jState.posError + Math.abs(jitter * 0.1);

      // Fault dynamic scaling: Joint 4 is primarily affected by gearbox wear
      if (jId === 'J4' && isGearboxFault) {
        vibration += 3.2 * faultIntensity + Math.random() * 0.4;
        torque += 14 * faultIntensity + Math.sin(t * 4) * 4;
        current += 2.2 * faultIntensity;
        posErr += 0.38 * faultIntensity;
        temp += 14 * faultIntensity;
      }

      // Thermal fault on J2
      if (jId === 'J2' && isThermalFault) {
        temp += 22 * faultIntensity;
        current += 1.8 * faultIntensity;
      }

      // Excessive vibration on J3
      if (jId === 'J3' && isVibFault) {
        vibration += 3.5 * faultIntensity;
        torque += 9 * faultIntensity;
      }

      // Calculate health & status
      const { health, status } = calculateJointHealth({
        temperature: temp,
        vibration,
        current,
        torque,
        positionError: posErr,
        motorLoad: Math.min(100, Math.round(current * 14)),
      });

      joints[jId] = {
        jointId: jId,
        name: jointNames[jId],
        temperature: Math.round(temp * 10) / 10,
        current: Math.round(current * 100) / 100,
        torque: Math.round(torque * 10) / 10,
        vibration: Math.round(vibration * 100) / 100,
        position: Math.round(currentAngle * 10) / 10,
        positionError: Math.round(posErr * 1000) / 1000,
        speed: Math.round(speed),
        health,
        status,
      };

      sumTemp += temp;
      sumCurrent += current;
      sumTorque += torque;
      sumVib += vibration;
      sumPosErr += posErr;
    });

    const date = new Date(timestamp);
    const timeString = date.toLocaleTimeString('en-US', { hour12: false });
    const avgLoad = Math.min(98, Math.max(20, Math.round((sumCurrent / 6) * 14 * loadMultiplier)));

    return {
      robotId: id,
      timestamp,
      timeString,
      temperature: Math.round((sumTemp / 6) * 10) / 10,
      motorCurrent: Math.round((sumCurrent / 6) * 100) / 100,
      torque: Math.round((sumTorque / 6) * 10) / 10,
      vibration: Math.round((sumVib / 6) * 100) / 100,
      positionError: Math.round((sumPosErr / 6) * 1000) / 1000,
      motorLoad: avgLoad,
      powerConsumption: Math.round((sumCurrent * 0.48) * 10) / 10, // kW
      speed: Math.round(45 * loadMultiplier),
      commStatus: 'ONLINE',
      sensorStatus: isGearboxFault ? 'DEGRADED' : 'ALL_OK',
      joints,
    };
  }

  public subscribe(robotId: RobotId, listener: TelemetryListener): () => void {
    const subs = this.listeners.get(robotId);
    if (subs) {
      subs.add(listener);
    }
    return () => {
      subs?.delete(listener);
    };
  }

  public getLatestTelemetry(robotId: RobotId): RobotTelemetry | null {
    const hist = this.history.get(robotId);
    if (!hist || hist.length === 0) return null;
    return hist[hist.length - 1];
  }

  public getHistory(robotId: RobotId): RobotTelemetry[] {
    return this.history.get(robotId) || [];
  }

  public getSourceType(): 'SIMULATION' | 'ROS2_ADAPTER' | 'HARDWARE_DIRECT' {
    return 'SIMULATION';
  }
}

/**
 * Future ROS2 adapter implementation stub.
 * Read-only telemetry listener adhering to safety architecture.
 */
export class ROS2TelemetrySource implements ITelemetrySource {
  private connected = false;

  public async connect(): Promise<void> {
    console.log('[ROS2] Initializing ROS2 telemetry node (read-only subscriber)...');
    this.connected = true;
  }

  public disconnect(): void {
    this.connected = false;
  }

  public subscribe(robotId: RobotId, listener: TelemetryListener): () => void {
    console.log(`[ROS2] Subscribed to topic /robot/${robotId}/joint_states`);
    return () => {};
  }

  public getLatestTelemetry(robotId: RobotId): RobotTelemetry | null {
    return null;
  }

  public getHistory(robotId: RobotId): RobotTelemetry[] {
    return [];
  }

  public getSourceType(): 'SIMULATION' | 'ROS2_ADAPTER' | 'HARDWARE_DIRECT' {
    return 'ROS2_ADAPTER';
  }
}
