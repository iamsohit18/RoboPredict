/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Activity,
  Cpu,
  BrainCircuit,
  Database,
  Radio,
  Share2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const SystemStatus: React.FC = () => {
  const subsystems = [
    { name: 'Telemetry Engine', status: 'CONNECTED', desc: '100 Hz ingestion pipeline active', color: 'emerald' },
    { name: 'Simulation Engine', status: 'RUNNING', desc: 'Synthetic physics loop synchronized', color: 'emerald' },
    { name: 'AI Prediction Engine', status: 'ACTIVE', desc: 'XGBoost multi-sensor inference active', color: 'emerald' },
    { name: 'Anomaly Detection', status: 'ACTIVE', desc: 'Isolation Forest unsupervised stream', color: 'emerald' },
    { name: 'Database Service', status: 'CONNECTED', desc: 'Time-series buffer & metadata store', color: 'emerald' },
    { name: 'WebSocket Link', status: 'CONNECTED', desc: 'Real-time pub/sub event bus', color: 'emerald' },
    { name: 'ROS2 Adapter', status: 'READY FOR INTEGRATION', desc: 'Read-only node architecture staged', color: 'cyan' },
  ];

  const pipelineStages = [
    { label: 'Robot Hardware / Virtual Sim', icon: Cpu, sub: '6-DOF Servos' },
    { label: 'Telemetry Stream', icon: Activity, sub: 'J1-J6 Sensors' },
    { label: 'Data Processing', icon: Database, sub: 'Filtering & Buffering' },
    { label: 'Feature Engineering', icon: Radio, sub: 'Vib RMS, Backlash' },
    { label: 'AI Models', icon: BrainCircuit, sub: 'XGBoost & iForest' },
    { label: 'Prediction & RUL', icon: Share2, sub: 'Failure Prob.' },
    { label: 'Alert Generation', icon: Activity, sub: 'P1-P3 Thresholds' },
    { label: 'Maintenance Action', icon: ShieldCheck, sub: 'Work Order Dispatched' },
  ];

  return (
    <div id="system-health-dashboard" className="space-y-6">
      {/* Infrastructure Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {subsystems.map((sub, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300 font-semibold">{sub.name}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  sub.color === 'cyan'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {sub.status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans">{sub.desc}</p>
          </div>
        ))}
      </div>

      {/* End-to-End System Architecture Visualization */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              RoboPredict AI &mdash; End-to-End Predictive Architecture
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Strictly read-only monitoring architecture ensuring deterministic plant safety
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-zinc-800 text-xs font-mono text-emerald-400">
            PIPELINE LATENCY: 12ms
          </span>
        </div>

        {/* Horizontal Flow Stages */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {pipelineStages.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <div
                key={i}
                className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex flex-col justify-between text-center relative group hover:border-cyan-500/40 transition-colors"
              >
                <div className="p-2 rounded-lg bg-zinc-900 text-cyan-400 mx-auto mb-2 w-fit">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-mono font-bold text-zinc-200 leading-tight">
                  {stage.label}
                </div>
                <div className="text-[10px] text-zinc-500 font-sans mt-1">
                  {stage.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
