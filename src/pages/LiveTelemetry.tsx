/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRoboPredict } from '../hooks/useRoboPredict';
import { TelemetryChart } from '../components/TelemetryChart';
import { RobotId, JointId } from '../types/robotics';
import { Activity, Download, Filter, RefreshCw, Radio } from 'lucide-react';

export const LiveTelemetry: React.FC = () => {
  const {
    selectedRobotId,
    setSelectedRobot,
    telemetryHistory,
    currentTelemetry,
  } = useRoboPredict();

  const [selectedJoint, setSelectedJoint] = useState<JointId | 'All'>('All');
  const [timeRange, setTimeRange] = useState<string>('5 min');

  const robotIds: RobotId[] = ['RB-001', 'RB-002', 'RB-003', 'RB-004'];
  const joints: (JointId | 'All')[] = ['All', 'J1', 'J2', 'J3', 'J4', 'J5', 'J6'];
  const timeRanges = ['1 min', '5 min', '15 min', '1 hour', '24 hours'];

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'RobotId', 'Temperature', 'Current', 'Torque', 'Vibration', 'PosError', 'Load', 'Power'];
    const rows = telemetryHistory.map((t) => [
      t.timestamp,
      t.robotId,
      t.temperature,
      t.motorCurrent,
      t.torque,
      t.vibration,
      t.positionError,
      t.motorLoad,
      t.powerConsumption,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `telemetry_${selectedRobotId}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="live-telemetry-page" className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Top Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            <span>Live Multi-Sensor Telemetry Laboratory</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Real-time streaming kinematic, dynamic, and thermal sensor diagnostics
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 transition-colors cursor-pointer w-fit"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Stream (.CSV)</span>
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
        {/* Robot selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-zinc-400 uppercase">Selected Robot Target:</label>
          <div className="flex items-center gap-1.5">
            {robotIds.map((rId) => (
              <button
                key={rId}
                onClick={() => setSelectedRobot(rId)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedRobotId === rId
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-xs'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {rId}
              </button>
            ))}
          </div>
        </div>

        {/* Joint selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-zinc-400 uppercase">Subsystem / Joint Node:</label>
          <div className="flex items-center gap-1">
            {joints.map((j) => (
              <button
                key={j}
                onClick={() => setSelectedJoint(j)}
                className={`flex-1 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                  selectedJoint === j
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {j}
              </button>
            ))}
          </div>
        </div>

        {/* Time range selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-zinc-400 uppercase">Display Window:</label>
          <div className="flex items-center gap-1">
            {timeRanges.map((tr) => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                className={`flex-1 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                  timeRange === tr
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {tr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 8 Charts Grid (Section 9) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TelemetryChart
          title="1. Temperature vs Time"
          metric="temperature"
          history={telemetryHistory}
          selectedJoint={selectedJoint}
          unit="°C"
          color="#f59e0b"
          threshold={68}
          height={180}
        />
        <TelemetryChart
          title="2. Motor Current vs Time"
          metric="motorCurrent"
          history={telemetryHistory}
          selectedJoint={selectedJoint}
          unit="A"
          color="#06b6d4"
          threshold={5.2}
          height={180}
        />
        <TelemetryChart
          title="3. Torque vs Time"
          metric="torque"
          history={telemetryHistory}
          selectedJoint={selectedJoint}
          unit="Nm"
          color="#a855f7"
          threshold={32}
          height={180}
        />
        <TelemetryChart
          title="4. Vibration vs Time"
          metric="vibration"
          history={telemetryHistory}
          selectedJoint={selectedJoint}
          unit="mm/s"
          color="#f43f5e"
          threshold={4.0}
          height={180}
        />
        <TelemetryChart
          title="5. Position Error vs Time"
          metric="positionError"
          history={telemetryHistory}
          selectedJoint={selectedJoint}
          unit="deg"
          color="#ec4899"
          threshold={0.12}
          height={180}
        />
        <TelemetryChart
          title="6. Motor Load vs Time"
          metric="motorLoad"
          history={telemetryHistory}
          selectedJoint={selectedJoint}
          unit="%"
          color="#10b981"
          threshold={80}
          height={180}
        />
        <TelemetryChart
          title="7. Power Consumption vs Time"
          metric="powerConsumption"
          history={telemetryHistory}
          selectedJoint={selectedJoint}
          unit="kW"
          color="#3b82f6"
          threshold={4.5}
          height={180}
        />
        <TelemetryChart
          title="8. Joint Speed vs Time"
          metric="speed"
          history={telemetryHistory}
          selectedJoint={selectedJoint}
          unit="deg/s"
          color="#8b5cf6"
          threshold={140}
          height={180}
        />
      </div>

      {/* Real-Time Joint Snapshot Matrix */}
      {currentTelemetry && (
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
            Active Snapshot Matrix &mdash; All 6 Degrees of Freedom
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-500 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Joint</th>
                  <th className="p-2.5">Position</th>
                  <th className="p-2.5">Speed</th>
                  <th className="p-2.5">Torque</th>
                  <th className="p-2.5">Current</th>
                  <th className="p-2.5">Temperature</th>
                  <th className="p-2.5">Vibration</th>
                  <th className="p-2.5">Pos Error</th>
                  <th className="p-2.5">Health</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {(['J1', 'J2', 'J3', 'J4', 'J5', 'J6'] as JointId[]).map((jId) => {
                  const j = currentTelemetry.joints[jId];
                  return (
                    <tr key={jId} className="hover:bg-zinc-800/40">
                      <td className="p-2.5 font-bold text-white">{jId} ({j.name})</td>
                      <td className="p-2.5">{j.position}°</td>
                      <td className="p-2.5">{j.speed} °/s</td>
                      <td className="p-2.5">{j.torque} Nm</td>
                      <td className="p-2.5">{j.current} A</td>
                      <td className={`p-2.5 ${j.temperature > 65 ? 'text-rose-400 font-bold' : ''}`}>
                        {j.temperature}°C
                      </td>
                      <td className={`p-2.5 ${j.vibration > 3.5 ? 'text-rose-400 font-bold' : ''}`}>
                        {j.vibration} mm/s
                      </td>
                      <td className="p-2.5">{j.positionError}°</td>
                      <td className="p-2.5 font-bold text-cyan-400">{j.health}%</td>
                      <td className="p-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            j.status === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : j.status === 'ELEVATED'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {j.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
