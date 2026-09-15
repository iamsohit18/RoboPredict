/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  RobotId,
  RobotHealth,
  RobotTelemetry,
  RobotMetadata,
} from '../types/robotics';
import {
  AlertTriangle,
  Clock,
  Calendar,
  Activity,
  Gauge,
  Thermometer,
  Zap,
  CheckCircle2,
  TrendingDown,
} from 'lucide-react';

interface RobotStatusProps {
  robotId: RobotId;
  metadata: RobotMetadata;
  health: RobotHealth;
  telemetry: RobotTelemetry | null;
  onNavigateToPredictions?: () => void;
}

export const RobotStatus: React.FC<RobotStatusProps> = ({
  robotId,
  metadata,
  health,
  telemetry,
  onNavigateToPredictions,
}) => {
  const isWarning = health.status === 'WARNING';
  const isCritical = health.status === 'CRITICAL';
  const isHealthy = health.status === 'HEALTHY';

  const statusColor = isCritical
    ? 'text-rose-400 bg-rose-950/40 border-rose-500/40'
    : isWarning
    ? 'text-amber-400 bg-amber-950/40 border-amber-500/40'
    : 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';

  const currentTemp = telemetry?.temperature ?? 68;
  const currentVib = telemetry?.vibration ?? 4.8;
  const currentLoad = telemetry?.motorLoad ?? 76;

  return (
    <div
      id="robot-status-panel"
      className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 shadow-md space-y-4 flex flex-col justify-between"
    >
      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-mono text-white tracking-tight">
                {robotId}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${statusColor}`}
              >
                {health.status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{metadata.model}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">
              Health Score
            </span>
            <span
              className={`text-2xl font-bold font-mono ${
                health.healthScore < 75
                  ? 'text-rose-400'
                  : health.healthScore < 88
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {health.healthScore}%
            </span>
          </div>
        </div>

        {/* AI Failure Prediction Highlight Card */}
        <div
          onClick={onNavigateToPredictions}
          className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-cyan-500/40 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Predicted Issue:
            </span>
            <span className="font-mono text-[10px] text-cyan-400 group-hover:underline">
              View AI Analysis &rarr;
            </span>
          </div>
          <div className="font-bold text-sm text-zinc-100 font-mono">
            {health.predictedIssue}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/80 text-xs font-mono">
            <div>
              <span className="text-zinc-400 text-[10px] block">Failure Probability</span>
              <span
                className={`font-bold text-base ${
                  health.failureProbability > 70
                    ? 'text-rose-400'
                    : health.failureProbability > 40
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {health.failureProbability}%
              </span>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px] block">Remaining Life (RUL)</span>
              <span className="font-bold text-base text-cyan-300">
                {health.remainingUsefulLifeHours} hours
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Physical Telemetry Badges */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/80 text-center">
            <Thermometer className="w-4 h-4 mx-auto text-rose-400 mb-1" />
            <div className="text-[10px] text-zinc-400 font-mono uppercase">Temp</div>
            <div className="text-sm font-bold font-mono text-zinc-200">{currentTemp}°C</div>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/80 text-center">
            <Activity className="w-4 h-4 mx-auto text-amber-400 mb-1" />
            <div className="text-[10px] text-zinc-400 font-mono uppercase">Vibration</div>
            <div className="text-sm font-bold font-mono text-zinc-200">{currentVib} mm/s</div>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/80 text-center">
            <Gauge className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
            <div className="text-[10px] text-zinc-400 font-mono uppercase">Motor Load</div>
            <div className="text-sm font-bold font-mono text-zinc-200">{currentLoad}%</div>
          </div>
        </div>

        {/* Maintenance Timestamps */}
        <div className="space-y-2 text-xs font-mono pt-1 text-zinc-300">
          <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              Last Maintenance:
            </span>
            <span className="text-zinc-200">{health.lastMaintenanceDate}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              Next Recommended:
            </span>
            <span
              className={`font-semibold ${
                health.nextRecommendedMaintenance.includes('24 hours') ||
                health.nextRecommendedMaintenance.includes('Immediate')
                  ? 'text-rose-400'
                  : 'text-zinc-200'
              }`}
            >
              {health.nextRecommendedMaintenance}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-zinc-400" />
              Operating Hours:
            </span>
            <span className="text-zinc-200">{health.operatingHours.toLocaleString()} h</span>
          </div>
        </div>
      </div>

      {/* Footer Workcell & Controller Status */}
      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <span>{metadata.workcell}</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {metadata.controllerStatus}
        </span>
      </div>
    </div>
  );
};
