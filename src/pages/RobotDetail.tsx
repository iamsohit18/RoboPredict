/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRoboPredict } from '../hooks/useRoboPredict';
import { RobotViewer } from '../components/RobotViewer';
import { JointHealthCard } from '../components/JointHealthCard';
import { TelemetryChart } from '../components/TelemetryChart';
import { PredictionCard } from '../components/PredictionCard';
import { AnomalyTimeline } from '../components/AnomalyTimeline';
import { MaintenanceCard } from '../components/MaintenanceCard';
import { RobotId, JointId } from '../types/robotics';
import {
  Cpu,
  Layers,
  Activity,
  BrainCircuit,
  Wrench,
  Clock,
  ArrowLeft,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { PageId } from '../components/Sidebar';

interface RobotDetailProps {
  onBack: () => void;
  onNavigate: (page: PageId) => void;
}

export const RobotDetail: React.FC<RobotDetailProps> = ({ onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Telemetry' | 'Joints' | 'AI Prediction' | 'Maintenance' | 'Events'
  >('Overview');

  const {
    selectedRobotId,
    metadata,
    health,
    currentTelemetry,
    telemetryHistory,
    prediction,
    anomalyTimeline,
    recommendations,
    acknowledgeRecommendation,
  } = useRoboPredict();

  const tabs = ['Overview', 'Telemetry', 'Joints', 'AI Prediction', 'Maintenance', 'Events'] as const;

  return (
    <div id="robot-detail-page" className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Back button & Robot Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors cursor-pointer"
            title="Back to fleet"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
                {selectedRobotId} &bull; {metadata.name}
              </h1>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                  health.status === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : health.status === 'WARNING'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {health.status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {metadata.manufacturer} &bull; {metadata.model} &bull; Workcell: {metadata.workcell}
            </p>
          </div>
        </div>

        {/* Quick Health Summary Pill */}
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 font-mono text-xs">
          <div>
            <span className="text-zinc-500 text-[10px] block">HEALTH</span>
            <span className="text-lg font-bold text-white">{health.healthScore}%</span>
          </div>
          <div className="border-l border-zinc-800 pl-3">
            <span className="text-zinc-500 text-[10px] block">FAIL PROB</span>
            <span className="text-lg font-bold text-rose-400">{health.failureProbability}%</span>
          </div>
          <div className="border-l border-zinc-800 pl-3">
            <span className="text-zinc-500 text-[10px] block">EST. RUL</span>
            <span className="text-lg font-bold text-cyan-400">{health.remainingUsefulLifeHours}h</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            id={`tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer shrink-0 ${
              activeTab === tab
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RobotViewer robotId={selectedRobotId} telemetry={currentTelemetry} />
            </div>

            {/* Robot Metadata Card (Section 19) */}
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
                Mechanical &amp; Controller Specifications
              </h3>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Robot Model:</span>
                  <span className="text-zinc-200">{metadata.model}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Manufacturer:</span>
                  <span className="text-zinc-200">{metadata.manufacturer}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Degrees of Freedom:</span>
                  <span className="text-cyan-400 font-bold">{metadata.dof}-Axis Articulated</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Payload Capacity:</span>
                  <span className="text-zinc-200">{metadata.payloadKg} kg</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Max Radial Reach:</span>
                  <span className="text-zinc-200">{metadata.reachMm} mm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Operating Hours:</span>
                  <span className="text-zinc-200">{health.operatingHours.toLocaleString()} h</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Firmware Build:</span>
                  <span className="text-zinc-200">{metadata.firmware}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Controller Status:</span>
                  <span className="text-emerald-400 font-bold">{metadata.controllerStatus}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Fieldbus Comm:</span>
                  <span className="text-emerald-400 font-bold">{metadata.commStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {currentTelemetry && <JointHealthCard joints={currentTelemetry.joints} />}
        </div>
      )}

      {/* Tab 2: Telemetry */}
      {activeTab === 'Telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TelemetryChart title="Vibration RMS" metric="vibration" history={telemetryHistory} unit="mm/s" color="#f43f5e" />
          <TelemetryChart title="Motor Current" metric="motorCurrent" history={telemetryHistory} unit="A" color="#06b6d4" />
          <TelemetryChart title="Total Torque" metric="torque" history={telemetryHistory} unit="Nm" color="#a855f7" />
          <TelemetryChart title="Temperature" metric="temperature" history={telemetryHistory} unit="°C" color="#f59e0b" />
          <TelemetryChart title="Position Error" metric="positionError" history={telemetryHistory} unit="deg" color="#ec4899" />
          <TelemetryChart title="Motor Load" metric="motorLoad" history={telemetryHistory} unit="%" color="#10b981" />
          <TelemetryChart title="Power Demand" metric="powerConsumption" history={telemetryHistory} unit="kW" color="#3b82f6" />
          <TelemetryChart title="Joint Speed" metric="speed" history={telemetryHistory} unit="deg/s" color="#6366f1" />
        </div>
      )}

      {/* Tab 3: Joints */}
      {activeTab === 'Joints' && currentTelemetry && (
        <JointHealthCard joints={currentTelemetry.joints} />
      )}

      {/* Tab 4: AI Prediction */}
      {activeTab === 'AI Prediction' && (
        <PredictionCard prediction={prediction} />
      )}

      {/* Tab 5: Maintenance */}
      {activeTab === 'Maintenance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations
            .filter((r) => r.robotId === selectedRobotId)
            .map((rec) => (
              <MaintenanceCard
                key={rec.id}
                recommendation={rec}
                onAcknowledge={acknowledgeRecommendation}
              />
            ))}
        </div>
      )}

      {/* Tab 6: Events */}
      {activeTab === 'Events' && (
        <AnomalyTimeline
          events={anomalyTimeline.filter((e) => e.robotId === selectedRobotId)}
          maxEvents={25}
        />
      )}
    </div>
  );
};
