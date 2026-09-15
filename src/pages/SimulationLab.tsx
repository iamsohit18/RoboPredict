/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useRoboPredict } from '../hooks/useRoboPredict';
import { SimulationControls } from '../components/SimulationControls';
import { FaultInjection } from '../components/FaultInjection';
import { RobotViewer } from '../components/RobotViewer';
import { TelemetryChart } from '../components/TelemetryChart';
import { FlaskConical, Play, Sparkles, RotateCcw, AlertTriangle } from 'lucide-react';
import { RobotId } from '../types/robotics';

export const SimulationLab: React.FC = () => {
  const {
    selectedRobotId,
    setSelectedRobot,
    currentTelemetry,
    telemetryHistory,
    isRunning,
    speedMultiplier,
    activeFault,
    operatingMode,
    faultIntensity,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setSpeed,
    injectFault,
    setOperatingMode,
    isDemoActive,
    demoStepDescription,
    runAiFailureDemo,
    resetDemo,
  } = useRoboPredict();

  const robotIds: RobotId[] = ['RB-001', 'RB-002', 'RB-003', 'RB-004'];

  return (
    <div id="simulation-lab-page" className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-cyan-400" />
            <span>Digital Twin Simulation &amp; Fault Injection Lab</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Simulate dynamic load profiles, inject hardware anomalies, and test AI prognostic algorithms safely
          </p>
        </div>

        {/* 1-Click Guided Failure Demo Button (Section 25) */}
        <div className="flex items-center gap-2">
          {isDemoActive ? (
            <button
              onClick={resetDemo}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Demo Mode</span>
            </button>
          ) : (
            <button
              onClick={runAiFailureDemo}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold shadow-lg shadow-cyan-950/40 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span>Run RB-003 AI Failure Demo &rarr;</span>
            </button>
          )}
        </div>
      </div>

      {/* Guided Demo Banner if active */}
      {isDemoActive && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-amber-300 uppercase block">
                Scenario Step Active:
              </span>
              <span className="text-sm font-sans text-zinc-200 font-medium">
                {demoStepDescription}
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-zinc-400">Target: RB-003 Joint 4</span>
        </div>
      )}

      {/* Simulation Controls Strip */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
        <SimulationControls
          isRunning={isRunning}
          speedMultiplier={speedMultiplier}
          onStart={startSimulation}
          onPause={pauseSimulation}
          onReset={resetSimulation}
          onSetSpeed={setSpeed}
        />

        {/* Robot Target Selector */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-zinc-500">ROBOT:</span>
          {robotIds.map((id) => (
            <button
              key={id}
              onClick={() => setSelectedRobot(id)}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                selectedRobotId === id
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Fault Injection Panel + Real-time Arm Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FaultInjection
          activeFault={activeFault}
          operatingMode={operatingMode}
          faultIntensity={faultIntensity}
          onSelectFault={injectFault}
          onSelectMode={setOperatingMode}
        />

        <div className="flex flex-col">
          <RobotViewer robotId={selectedRobotId} telemetry={currentTelemetry} />
        </div>
      </div>

      {/* Live Impact Reaction Charts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-zinc-200 uppercase tracking-wider">
            Real-Time Fault Transient Response Traces
          </h3>
          <span className="text-xs font-mono text-zinc-500">
            Sampling Rate: 100 Hz Ingestion Loop
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TelemetryChart title="Vibration RMS" metric="vibration" history={telemetryHistory} unit="mm/s" color="#f43f5e" threshold={4.0} height={160} />
          <TelemetryChart title="Motor Current" metric="motorCurrent" history={telemetryHistory} unit="A" color="#06b6d4" threshold={5.2} height={160} />
          <TelemetryChart title="Torque Demand" metric="torque" history={telemetryHistory} unit="Nm" color="#a855f7" threshold={32.0} height={160} />
          <TelemetryChart title="Stator Temp" metric="temperature" history={telemetryHistory} unit="°C" color="#f59e0b" threshold={68.0} height={160} />
        </div>
      </div>
    </div>
  );
};
