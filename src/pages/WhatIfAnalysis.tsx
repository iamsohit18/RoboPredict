/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useRoboPredict } from '../hooks/useRoboPredict';
import { WhatIfPanel } from '../components/WhatIfPanel';
import { RobotId } from '../types/robotics';
import { SlidersHorizontal, Info, ShieldAlert, Zap } from 'lucide-react';

export const WhatIfAnalysis: React.FC = () => {
  const {
    selectedRobotId,
    setSelectedRobot,
    health,
    currentTelemetry,
  } = useRoboPredict();

  const robotIds: RobotId[] = ['RB-001', 'RB-002', 'RB-003', 'RB-004'];

  return (
    <div id="what-if-analysis-page" className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-cyan-400" />
            <span>What-If Scenario Simulation &amp; Stress Analysis</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Evaluate hypothetical mechanical, electrical, and thermal stress scenarios to anticipate failures before they occur
          </p>
        </div>

        {/* Robot Target Selector */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
          <span className="text-xs font-mono text-zinc-500 px-2">TARGET:</span>
          {robotIds.map((id) => (
            <button
              key={id}
              onClick={() => setSelectedRobot(id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedRobotId === id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Main What-If Interactive Panel */}
      <WhatIfPanel baselineHealth={health} baselineTelemetry={currentTelemetry} />

      {/* Practical Operational Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-zinc-200 font-bold">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Thermal Throttling Threshold</span>
          </div>
          <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">
            Stator coil windings degrade exponentially when continuous temperature exceeds 70°C. Consider reducing cycle accelerations during ambient heat spikes.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-zinc-200 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Harmonic Vibration Fatigue</span>
          </div>
          <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">
            Sustained vibration above 3.5 mm/s accelerates bearing race spalling and harmonic drive gear teeth fatigue by up to 4.2x.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-zinc-200 font-bold">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Dynamic Backlash Compensation</span>
          </div>
          <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">
            Encoder position errors above 0.08° trigger closed-loop current saturation, leading to thermal runaway and toolpath non-repeatability.
          </p>
        </div>
      </div>
    </div>
  );
};
