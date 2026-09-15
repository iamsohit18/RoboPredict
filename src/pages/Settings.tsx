/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRoboPredict } from '../hooks/useRoboPredict';
import { Settings as SettingsIcon, Shield, Radio, Bell, Save, CheckCircle2, Lock } from 'lucide-react';

export const Settings: React.FC = () => {
  const { telemetrySourceType, setTelemetrySourceType } = useRoboPredict();

  const [domainId, setDomainId] = useState('0');
  const [nodeName, setNodeName] = useState('robopredict_telemetry_listener');
  const [jointStateTopic, setJointStateTopic] = useState('/joint_states');
  const [diagTopic, setDiagTopic] = useState('/diagnostics');

  const [tempLimit, setTempLimit] = useState(68);
  const [vibLimit, setVibLimit] = useState(4.0);
  const [torqueLimit, setTorqueLimit] = useState(32);
  const [posErrLimit, setPosErrLimit] = useState(0.12);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T00/B00/XXXXX');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div id="settings-page" className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-cyan-400" />
            <span>Platform Configuration &amp; Telemetry Source Settings</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Configure ROS2 adapters, sensor threshold triggers, and plant safety boundaries
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-md"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </>
          )}
        </button>
      </div>

      {/* Safety Constraint Callout (Section 27) */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 flex items-start gap-3">
        <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono space-y-1">
          <span className="font-bold text-white uppercase block">
            Read-Only Deterministic Safety Architecture
          </span>
          <p className="text-zinc-300 font-sans leading-relaxed">
            RoboPredict AI operates strictly as a read-only telemetry listener. The platform is architecturally isolated and cannot issue motor commands, velocity overrides, or joint trajectories to plant robotics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Telemetry Source & ROS2 Configuration (Section 26) */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Telemetry Ingestion Source
            </h3>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-mono text-zinc-400 block">Active Provider:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTelemetrySourceType('simulation')}
                className={`p-3 rounded-xl text-left border text-xs font-mono transition-all cursor-pointer ${
                  telemetrySourceType === 'simulation'
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-white ring-1 ring-cyan-500/30'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                <div className="font-bold text-zinc-200">Simulation Telemetry Engine</div>
                <div className="text-[11px] text-zinc-400 font-sans mt-1">
                  100 Hz high-fidelity physics model with fault injection
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTelemetrySourceType('ros2')}
                className={`p-3 rounded-xl text-left border text-xs font-mono transition-all cursor-pointer ${
                  telemetrySourceType === 'ros2'
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-white ring-1 ring-cyan-500/30'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                <div className="font-bold text-zinc-200">ROS2 Hardware Bridge</div>
                <div className="text-[11px] text-zinc-400 font-sans mt-1">
                  Direct DDS subscriber for physical FANUC/KUKA nodes
                </div>
              </button>
            </div>
          </div>

          {/* ROS2 Node Configuration Details */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase">
              ROS2 DDS Bridge Parameters
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-zinc-400 block mb-1">ROS_DOMAIN_ID:</label>
                <input
                  type="text"
                  value={domainId}
                  onChange={(e) => setDomainId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Node Identifier:</label>
                <input
                  type="text"
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="col-span-2">
                <label className="text-zinc-400 block mb-1">Joint States Topic:</label>
                <input
                  type="text"
                  value={jointStateTopic}
                  onChange={(e) => setJointStateTopic(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="col-span-2">
                <label className="text-zinc-400 block mb-1">Diagnostics Topic:</label>
                <input
                  type="text"
                  value={diagTopic}
                  onChange={(e) => setDiagTopic(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Anomaly & Safety Thresholds */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Sensor Alarm Trigger Thresholds
            </h3>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-300">Temperature Alarm Limit:</span>
                <span className="text-rose-400 font-bold">{tempLimit}°C</span>
              </div>
              <input
                type="range"
                min="50"
                max="85"
                value={tempLimit}
                onChange={(e) => setTempLimit(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-300">Vibration RMS Hazard Limit:</span>
                <span className="text-amber-400 font-bold">{vibLimit} mm/s</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="6.0"
                step="0.1"
                value={vibLimit}
                onChange={(e) => setVibLimit(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-300">Torque Demand Continuous Limit:</span>
                <span className="text-purple-400 font-bold">{torqueLimit} Nm</span>
              </div>
              <input
                type="range"
                min="20"
                max="50"
                value={torqueLimit}
                onChange={(e) => setTorqueLimit(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-300">Position Tracking Error Tolerance:</span>
                <span className="text-cyan-400 font-bold">{posErrLimit}°</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.30"
                step="0.01"
                value={posErrLimit}
                onChange={(e) => setPosErrLimit(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          {/* Webhook & Notification alerts */}
          <div className="pt-3 border-t border-zinc-800 space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-purple-400" />
              <span>Emergency Dispatch Routing</span>
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-950 text-cyan-500"
                />
                <span>Email shift engineers on P1 Critical maintenance generation</span>
              </label>

              <div>
                <label className="text-zinc-400 block mb-1">Incident Webhook Endpoint:</label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
