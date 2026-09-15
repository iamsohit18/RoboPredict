/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FaultType, OperatingMode } from '../types/robotics';
import { ShieldAlert, Zap, Flame, Activity, Cpu, Radio, Gauge, Move } from 'lucide-react';

interface FaultInjectionProps {
  activeFault: FaultType;
  operatingMode: OperatingMode;
  faultIntensity: number;
  onSelectFault: (fault: FaultType, intensity?: number) => void;
  onSelectMode: (mode: OperatingMode) => void;
}

export const FaultInjection: React.FC<FaultInjectionProps> = ({
  activeFault,
  operatingMode,
  faultIntensity,
  onSelectFault,
  onSelectMode,
}) => {
  const faultList: { type: FaultType; label: string; desc: string; icon: any }[] = [
    { type: 'None', label: 'Nominal Baseline', desc: 'Zero simulated anomalies or mechanical stress', icon: Cpu },
    { type: 'Gearbox Wear', label: 'Gearbox Wear (J4)', desc: 'Harmonic backlash, vibration surging, torque spikes', icon: ShieldAlert },
    { type: 'Motor Overheating', label: 'Motor Overheating (J2)', desc: 'Thermal buildup in stator coils exceeding 75°C', icon: Flame },
    { type: 'Excessive Vibration', label: 'Excessive Vibration (J3)', desc: 'Bearing misalignment and mechanical oscillation', icon: Activity },
    { type: 'Excessive Load', label: 'Excessive Payload', desc: 'Torque demand beyond motor nominal continuous rating', icon: Gauge },
    { type: 'Position Drift', label: 'Position Tracking Drift', desc: 'Encoder resolver slip and repeatable deviation', icon: Move },
    { type: 'Sensor Failure', label: 'Sensor Drift / Noise', desc: 'Erratic accelerometer and thermocouple signatures', icon: Zap },
    { type: 'Communication Failure', label: 'Fieldbus Latency Spike', desc: 'Intermittent packet drops in EtherCAT bus', icon: Radio },
  ];

  const modes: OperatingMode[] = ['Normal', 'High Load', 'Stress Test', 'Failure Simulation'];

  return (
    <div
      id="fault-injection-panel"
      className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div>
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Fault Injection Laboratory</span>
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Inject synthetic physical anomalies into active telemetry loop
          </p>
        </div>

        <span className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs font-mono text-cyan-300">
          MODE: {operatingMode.toUpperCase()}
        </span>
      </div>

      {/* Operating Mode Selector */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase text-zinc-400 block">
          Select Operating Duty Cycle:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {modes.map((m) => (
            <button
              key={m}
              id={`op-mode-${m.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectMode(m)}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                operatingMode === m
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Fault Profiles */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase text-zinc-400 block">
          Inject Hardware Anomaly Profile:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {faultList.map((f) => {
            const Icon = f.icon;
            const isSelected = activeFault === f.type;
            const isCritical = f.type !== 'None';

            return (
              <button
                key={f.type}
                id={`fault-btn-${f.type.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSelectFault(f.type, f.type === 'None' ? 0 : 0.85)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? isCritical
                      ? 'bg-rose-950/30 border-rose-500/60 ring-1 ring-rose-500/30 text-white'
                      : 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/30 text-white'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-950'
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    isSelected
                      ? isCritical
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="truncate">
                  <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                    <span>{f.label}</span>
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-sans line-clamp-1 mt-0.5">
                    {f.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fault Intensity Slider if active */}
      {activeFault !== 'None' && (
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-300">Fault Severity / Wear Progression:</span>
            <span className="text-rose-400 font-bold">{Math.round(faultIntensity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={faultIntensity}
            onChange={(e) => onSelectFault(activeFault, parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>Incipient (Micro-wear)</span>
            <span>Progressive</span>
            <span>Critical Failure Imminent</span>
          </div>
        </div>
      )}
    </div>
  );
};
