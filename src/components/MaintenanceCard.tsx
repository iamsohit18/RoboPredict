/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MaintenanceRecommendation, RobotId } from '../types/robotics';
import { Wrench, Calendar, Clock, AlertTriangle, Check, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface MaintenanceCardProps {
  recommendation: MaintenanceRecommendation;
  onAcknowledge: (id: string) => void;
  onViewRobot?: (robotId: RobotId) => void;
  onSchedule?: (id: string, date: string) => void;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  recommendation,
  onAcknowledge,
  onViewRobot,
  onSchedule,
}) => {
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'P1':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-black';
      case 'P2':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-medium';
    }
  };

  const handleScheduleClick = () => {
    setIsScheduling(true);
    setTimeout(() => {
      setIsScheduling(false);
      setScheduledSuccess(true);
      onSchedule?.(recommendation.id, '2026-09-16 08:00');
    }, 600);
  };

  return (
    <div
      id={`maint-card-${recommendation.id.toLowerCase()}`}
      className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 shadow-md space-y-4 flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-white">
                {recommendation.robotId}
              </span>
              <span className="text-zinc-500">&bull;</span>
              <span className="text-xs font-mono text-zinc-300">
                {recommendation.component}
              </span>
            </div>
            <h4 className="text-base font-bold text-zinc-100 mt-1 font-sans">
              {recommendation.issue}
            </h4>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded text-xs font-mono border ${getPriorityBadge(
                recommendation.priority
              )}`}
            >
              PRIORITY {recommendation.priority}
            </span>
          </div>
        </div>

        {/* Recommended Action Quote */}
        <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            Prescribed AI Action:
          </div>
          <p className="text-xs text-zinc-200 leading-relaxed font-sans font-medium">
            &ldquo;{recommendation.recommendedAction}&rdquo;
          </p>
        </div>

        {/* Quantitative Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 block">Est. RUL</span>
            <span className="font-bold text-cyan-400 text-sm">
              {recommendation.estimatedRulHours}h
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 block">Downtime</span>
            <span className="font-bold text-amber-400 text-sm">
              {recommendation.estimatedDowntimeHours}h
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 block">Risk Tier</span>
            <span
              className={`font-bold text-sm ${
                recommendation.risk === 'HIGH' ? 'text-rose-400' : 'text-amber-400'
              }`}
            >
              {recommendation.risk}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
        {onViewRobot && (
          <button
            onClick={() => onViewRobot(recommendation.robotId)}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-mono transition-colors cursor-pointer"
          >
            View Robot
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {!recommendation.isAcknowledged && (
            <button
              onClick={() => onAcknowledge(recommendation.id)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-amber-300 border border-zinc-700 font-medium transition-colors cursor-pointer"
            >
              Acknowledge
            </button>
          )}

          <button
            onClick={handleScheduleClick}
            disabled={scheduledSuccess || recommendation.status === 'Scheduled'}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              scheduledSuccess || recommendation.status === 'Scheduled'
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs'
            }`}
          >
            {scheduledSuccess || recommendation.status === 'Scheduled' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Work Order Created</span>
              </>
            ) : (
              <>
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Maintenance</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
