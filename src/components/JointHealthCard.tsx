/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { JointTelemetry, JointId } from '../types/robotics';
import { Thermometer, Zap, Activity, Gauge, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface JointHealthCardProps {
  joints: Record<JointId, JointTelemetry>;
  selectedJointId?: JointId | null;
  onSelectJoint?: (jointId: JointId) => void;
}

export const JointHealthCard: React.FC<JointHealthCardProps> = ({
  joints,
  selectedJointId,
  onSelectJoint,
}) => {
  const [expandedJoint, setExpandedJoint] = useState<JointId | null>(null);

  const jointOrder: JointId[] = ['J1', 'J2', 'J3', 'J4', 'J5', 'J6'];

  const toggleExpand = (jId: JointId, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedJoint(expandedJoint === jId ? null : jId);
  };

  return (
    <div id="joint-health-section" className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-mono text-zinc-200 uppercase tracking-wider flex items-center gap-2">
          <span>6-DOF Joint Subsystem Health</span>
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-normal">
            Real-Time Diagnostics
          </span>
        </h3>
        <span className="text-xs text-zinc-400 font-mono">
          Click card to isolate sensor traces
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {jointOrder.map((jId) => {
          const j = joints[jId];
          if (!j) return null;

          const isCritical = j.health < 75 || j.status === 'CRITICAL';
          const isElevated = j.health < 88 || j.status === 'ELEVATED';
          const isSelected = selectedJointId === jId;
          const isExpanded = expandedJoint === jId;

          return (
            <div
              key={jId}
              id={`joint-card-${jId.toLowerCase()}`}
              onClick={() => onSelectJoint?.(jId)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isCritical
                  ? 'bg-rose-950/20 border-rose-500/50 hover:border-rose-500 hover:bg-rose-950/30 ring-1 ring-rose-500/30 shadow-xs'
                  : isElevated
                  ? 'bg-amber-950/15 border-amber-500/40 hover:border-amber-500 hover:bg-amber-950/25'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
              } ${isSelected ? 'ring-2 ring-cyan-400 shadow-md' : ''}`}
            >
              {/* Top Row: Joint ID, Risk Tag, and Health % */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-sm text-white">{jId}</span>
                  {isCritical && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300 animate-pulse">
                      HIGH RISK
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm font-mono font-bold ${
                      isCritical
                        ? 'text-rose-400'
                        : isElevated
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {j.health}%
                  </span>
                </div>
              </div>

              {/* Joint Descriptive Name */}
              <div className="text-[11px] text-zinc-400 font-sans truncate mb-2.5">
                {j.name}
              </div>

              {/* Health Progress Bar */}
              <div className="w-full bg-zinc-800/80 rounded-full h-1.5 mb-3 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCritical
                      ? 'bg-rose-500'
                      : isElevated
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${j.health}%` }}
                />
              </div>

              {/* Primary Sensor Metric Readouts */}
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[11px] font-mono text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-rose-400 shrink-0" />
                    Temp
                  </span>
                  <span className={j.temperature > 65 ? 'text-rose-400 font-bold' : 'text-zinc-200'}>
                    {j.temperature}°C
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                    Curr
                  </span>
                  <span className={j.current > 5.0 ? 'text-amber-400 font-bold' : 'text-zinc-200'}>
                    {j.current} A
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-cyan-400 shrink-0" />
                    Torq
                  </span>
                  <span className={j.torque > 32 ? 'text-rose-400 font-bold' : 'text-zinc-200'}>
                    {j.torque} Nm
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-purple-400 shrink-0" />
                    Vib
                  </span>
                  <span className={j.vibration > 3.5 ? 'text-rose-400 font-bold' : 'text-zinc-200'}>
                    {j.vibration} mm/s
                  </span>
                </div>
              </div>

              {/* Expand Toggle */}
              <button
                onClick={(e) => toggleExpand(jId, e)}
                className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer w-full"
              >
                <span>{isExpanded ? 'Less details' : 'More telemetry'}</span>
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {/* Extended Drawer */}
              {isExpanded && (
                <div className="mt-2 pt-2 border-t border-zinc-800 text-[10px] font-mono space-y-1 text-zinc-400 bg-zinc-950/60 p-2 rounded">
                  <div className="flex justify-between">
                    <span>Pos Error:</span>
                    <span className="text-zinc-200 font-bold">{j.positionError}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Angle:</span>
                    <span className="text-zinc-200">{j.position}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span className="text-zinc-200">{j.speed} deg/s</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
