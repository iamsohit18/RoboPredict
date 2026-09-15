/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock } from 'lucide-react';

interface SimulationControlsProps {
  isRunning: boolean;
  speedMultiplier: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSetSpeed: (speed: number) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  speedMultiplier,
  onStart,
  onPause,
  onReset,
  onSetSpeed,
}) => {
  const speeds = [0.5, 1, 2, 5, 10];

  return (
    <div
      id="simulation-controls-bar"
      className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono"
    >
      {/* Left: Play / Pause / Reset */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-500 hidden sm:inline uppercase text-[10px]">
          SIM ENGINE:
        </span>
        {isRunning ? (
          <button
            id="sim-pause-btn"
            onClick={onPause}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition-all cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>PAUSE</span>
          </button>
        ) : (
          <button
            id="sim-start-btn"
            onClick={onStart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>RESUME</span>
          </button>
        )}

        <button
          id="sim-reset-btn"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 font-medium transition-all cursor-pointer"
          title="Reset telemetry simulation clock"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET</span>
        </button>

        <div className="flex items-center gap-1.5 pl-2 border-l border-zinc-800 text-zinc-400">
          <span
            className={`h-2 w-2 rounded-full ${
              isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="text-[11px] font-semibold text-zinc-300">
            {isRunning ? 'SIMULATION TICKING' : 'CLOCK FROZEN'}
          </span>
        </div>
      </div>

      {/* Right: Multiplier Speeds */}
      <div className="flex items-center gap-1.5">
        <span className="text-zinc-500 text-[10px] hidden md:inline">TIMESTEP RATE:</span>
        <div className="bg-zinc-950 p-1 rounded-lg border border-zinc-800 flex items-center gap-1">
          {speeds.map((s) => (
            <button
              key={s}
              id={`sim-speed-${s}x`}
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                speedMultiplier === s
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
