/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useRoboPredict } from '../hooks/useRoboPredict';
import { ROBOTS_METADATA } from '../data/mockRobots';
import { RobotId } from '../types/robotics';
import { Bot, Thermometer, Activity, Gauge, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { PageId } from '../components/Sidebar';

interface RobotsProps {
  onSelectRobotDetail: (id: RobotId) => void;
  onNavigate: (page: PageId) => void;
}

export const Robots: React.FC<RobotsProps> = ({
  onSelectRobotDetail,
  onNavigate,
}) => {
  const { allHealths, setSelectedRobot, selectedRobotId } = useRoboPredict();
  const robotIds: RobotId[] = ['RB-001', 'RB-002', 'RB-003', 'RB-004'];

  return (
    <div id="robots-fleet-page" className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-400" />
            <span>Robotic Fleet Management</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Real-time status, health distributions, and predictive indicators across all industrial manipulators
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
            Total Units: 4
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
            Online: 100%
          </span>
        </div>
      </div>

      {/* Fleet Robot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {robotIds.map((id) => {
          const meta = ROBOTS_METADATA[id];
          const health = allHealths[id];
          const isSelected = selectedRobotId === id;
          const isCritical = health?.status === 'CRITICAL';
          const isWarning = health?.status === 'WARNING';

          return (
            <div
              key={id}
              id={`robot-card-${id.toLowerCase()}`}
              className={`p-5 rounded-2xl border transition-all duration-200 bg-zinc-900/90 flex flex-col justify-between space-y-5 hover:border-cyan-500/50 shadow-md ${
                isCritical
                  ? 'border-rose-500/50 ring-1 ring-rose-500/30'
                  : isWarning
                  ? 'border-amber-500/50'
                  : 'border-zinc-800'
              } ${isSelected ? 'ring-2 ring-cyan-400' : ''}`}
            >
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-400">{meta.manufacturer}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {health?.status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-bold font-mono text-white">{id}</h3>
                  <span
                    className={`text-2xl font-bold font-mono ${
                      health && health.healthScore < 75
                        ? 'text-rose-400'
                        : health && health.healthScore < 88
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {health?.healthScore}%
                  </span>
                </div>
                <p className="text-xs text-zinc-300 font-sans">{meta.name}</p>
                <div className="text-[11px] text-zinc-500 font-mono">{meta.workcell}</div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                <div>
                  <span className="text-zinc-500 text-[10px] block">Failure Prob</span>
                  <span
                    className={`font-bold ${
                      health && health.failureProbability > 70
                        ? 'text-rose-400'
                        : health && health.failureProbability > 40
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {health?.failureProbability}%
                  </span>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] block">Est. RUL</span>
                  <span className="font-bold text-cyan-400">
                    {health?.remainingUsefulLifeHours}h
                  </span>
                </div>

                <div className="pt-2 border-t border-zinc-800/60">
                  <span className="text-zinc-500 text-[10px] block">DOF / Payload</span>
                  <span className="text-zinc-300">{meta.dof}-Axis / {meta.payloadKg}kg</span>
                </div>

                <div className="pt-2 border-t border-zinc-800/60">
                  <span className="text-zinc-500 text-[10px] block">Operating Hours</span>
                  <span className="text-zinc-300">{health?.operatingHours.toLocaleString()}h</span>
                </div>
              </div>

              {/* Issue Snippet */}
              <div className="text-xs font-mono text-zinc-400 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/60">
                <span className="text-[10px] text-zinc-500 block uppercase">Diagnostics:</span>
                <span className="text-zinc-200 font-sans line-clamp-1">{health?.predictedIssue}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setSelectedRobot(id);
                    onNavigate('Dashboard');
                  }}
                  className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors cursor-pointer text-center"
                >
                  Set Active
                </button>
                <button
                  onClick={() => {
                    setSelectedRobot(id);
                    onSelectRobotDetail(id);
                  }}
                  className="flex-1 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-mono font-bold text-white transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                >
                  <span>Detail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
