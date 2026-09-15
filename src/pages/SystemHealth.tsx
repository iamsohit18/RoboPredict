/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SystemStatus } from '../components/SystemStatus';
import { ShieldCheck, HardDrive, Wifi, Cpu, Server } from 'lucide-react';

export const SystemHealth: React.FC = () => {
  return (
    <div id="system-health-page" className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Infrastructure &amp; System Health Diagnostics</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Real-time pipeline verification, container health, broker latency, and ROS2 adapter readiness
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold">
            PLATFORM: 100% OPERATIONAL
          </span>
        </div>
      </div>

      {/* Main System Status and Architecture */}
      <SystemStatus />

      {/* Telemetry Buffer & Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-zinc-200 font-bold">
            <Wifi className="w-4 h-4 text-cyan-400" />
            <span>Ingestion Pipeline Throughput</span>
          </div>
          <div className="text-2xl font-bold text-white">4,800 msgs/sec</div>
          <p className="text-zinc-400 text-[11px]">
            100 Hz per joint axis across 4 manipulators (24 DOF total streams).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-zinc-200 font-bold">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <span>Circular Buffer Utilization</span>
          </div>
          <div className="text-2xl font-bold text-white">12.4% (3.2 MB)</div>
          <p className="text-zinc-400 text-[11px]">
            In-memory ring buffer storing 2,000 sliding window telemetry frames.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-zinc-200 font-bold">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Mean Pipeline Latency</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">11.8 ms</div>
          <p className="text-zinc-400 text-[11px]">
            Sensor tick &rarr; Isolation Forest &rarr; UI frame render latency.
          </p>
        </div>
      </div>
    </div>
  );
};
