/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RobotHealth, RobotTelemetry } from '../types/robotics';
import { SlidersHorizontal, ArrowRight, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { calculateJointHealth } from '../ai/healthScore';

interface WhatIfPanelProps {
  baselineHealth: RobotHealth;
  baselineTelemetry: RobotTelemetry | null;
}

export const WhatIfPanel: React.FC<WhatIfPanelProps> = ({
  baselineHealth,
  baselineTelemetry,
}) => {
  // Baseline initial state
  const baseTemp = baselineTelemetry?.temperature ?? 55;
  const baseVib = baselineTelemetry?.vibration ?? 2.1;
  const baseCurrent = baselineTelemetry?.motorCurrent ?? 3.5;
  const baseTorque = baselineTelemetry?.torque ?? 22;
  const baseLoad = baselineTelemetry?.motorLoad ?? 45;
  const basePosErr = baselineTelemetry?.positionError ?? 0.03;

  // Sliders state
  const [temperature, setTemperature] = useState(baseTemp);
  const [vibration, setVibration] = useState(baseVib);
  const [current, setCurrent] = useState(baseCurrent);
  const [torque, setTorque] = useState(baseTorque);
  const [load, setLoad] = useState(baseLoad);
  const [positionError, setPositionError] = useState(basePosErr);

  // Reset to baseline
  const handleReset = () => {
    setTemperature(baseTemp);
    setVibration(baseVib);
    setCurrent(baseCurrent);
    setTorque(baseTorque);
    setLoad(baseLoad);
    setPositionError(basePosErr);
  };

  // Dynamically calculate projected health, failure probability, and RUL
  const { health: projectedJointHealth } = calculateJointHealth({
    temperature,
    vibration,
    current,
    torque,
    positionError,
    motorLoad: load,
  });

  const projectedHealth = projectedJointHealth;
  const healthDeficit = 100 - projectedHealth;
  const projectedFailureProb = Math.min(99, Math.max(3, Math.round(Math.pow(healthDeficit / 10, 1.9) + 4)));
  const projectedRul = Math.max(12, Math.round((projectedHealth / 100) * 1600 * Math.max(0.08, (100 - projectedFailureProb) / 100)));

  return (
    <div id="whatif-panel-container" className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
            <span>What happens if robot operating conditions change?</span>
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Interactively simulate thermal, mechanical, and inertial stresses to forecast failure trajectory
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-mono transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* Projected Comparison Hero Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Health */}
        <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
          <span className="text-xs font-mono text-zinc-400 uppercase">Composite Health</span>
          <div className="flex items-center justify-between font-mono">
            <div>
              <span className="text-xs text-zinc-500 block">Baseline</span>
              <span className="text-xl font-bold text-zinc-300">{baselineHealth.healthScore}%</span>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500" />
            <div className="text-right">
              <span className="text-xs text-zinc-500 block">Projected</span>
              <span
                className={`text-2xl font-bold ${
                  projectedHealth < 75
                    ? 'text-rose-400'
                    : projectedHealth < 88
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {projectedHealth}%
              </span>
            </div>
          </div>
        </div>

        {/* Failure Probability */}
        <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
          <span className="text-xs font-mono text-zinc-400 uppercase">Failure Probability</span>
          <div className="flex items-center justify-between font-mono">
            <div>
              <span className="text-xs text-zinc-500 block">Baseline</span>
              <span className="text-xl font-bold text-zinc-300">{baselineHealth.failureProbability}%</span>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500" />
            <div className="text-right">
              <span className="text-xs text-zinc-500 block">Projected</span>
              <span
                className={`text-2xl font-bold ${
                  projectedFailureProb > 70
                    ? 'text-rose-400'
                    : projectedFailureProb > 40
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {projectedFailureProb}%
              </span>
            </div>
          </div>
        </div>

        {/* Estimated RUL */}
        <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
          <span className="text-xs font-mono text-zinc-400 uppercase">Remaining Useful Life (RUL)</span>
          <div className="flex items-center justify-between font-mono">
            <div>
              <span className="text-xs text-zinc-500 block">Baseline</span>
              <span className="text-xl font-bold text-zinc-300">{baselineHealth.remainingUsefulLifeHours}h</span>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500" />
            <div className="text-right">
              <span className="text-xs text-zinc-500 block">Projected</span>
              <span className="text-2xl font-bold text-cyan-400">{projectedRul}h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Parameter Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {/* Vibration Slider */}
        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/80 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-300">Vibration RMS</span>
            <span className="font-bold text-amber-400">{vibration.toFixed(1)} mm/s</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="8.0"
            step="0.1"
            value={vibration}
            onChange={(e) => setVibration(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>0.5 mm/s (Smooth)</span>
            <span>8.0 mm/s (Severe)</span>
          </div>
        </div>

        {/* Temperature Slider */}
        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/80 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-300">Stator Temperature</span>
            <span className="font-bold text-rose-400">{temperature.toFixed(0)}°C</span>
          </div>
          <input
            type="range"
            min="30"
            max="95"
            step="1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>30°C (Ambient)</span>
            <span>95°C (Critical)</span>
          </div>
        </div>

        {/* Motor Current Slider */}
        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/80 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-300">Motor Current Draw</span>
            <span className="font-bold text-cyan-400">{current.toFixed(1)} A</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="8.0"
            step="0.1"
            value={current}
            onChange={(e) => setCurrent(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>1.0 A (Idle)</span>
            <span>8.0 A (Overload)</span>
          </div>
        </div>

        {/* Torque Slider */}
        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/80 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-300">Dynamic Torque</span>
            <span className="font-bold text-purple-400">{torque.toFixed(0)} Nm</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="1"
            value={torque}
            onChange={(e) => setTorque(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>10 Nm</span>
            <span>60 Nm</span>
          </div>
        </div>

        {/* Motor Load Slider */}
        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/80 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-300">Duty Load Cycle</span>
            <span className="font-bold text-emerald-400">{load}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={load}
            onChange={(e) => setLoad(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>20% (Light)</span>
            <span>100% (Continuous Max)</span>
          </div>
        </div>

        {/* Position Error Slider */}
        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/80 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-300">Dynamic Position Drift</span>
            <span className="font-bold text-rose-400">{positionError.toFixed(3)}°</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.60"
            step="0.01"
            value={positionError}
            onChange={(e) => setPositionError(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>0.01° (Calibrated)</span>
            <span>0.60° (Backlash)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
