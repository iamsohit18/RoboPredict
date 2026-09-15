/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnomalyEvent, AlertSeverity } from '../types/robotics';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Clock } from 'lucide-react';

interface AnomalyTimelineProps {
  events: AnomalyEvent[];
  maxEvents?: number;
}

export const AnomalyTimeline: React.FC<AnomalyTimelineProps> = ({
  events,
  maxEvents = 10,
}) => {
  const displayEvents = events.slice(0, maxEvents);

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          icon: AlertCircle,
          color: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
          dot: 'bg-rose-500',
        };
      case 'WARNING':
        return {
          icon: AlertTriangle,
          color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
          dot: 'bg-amber-500',
        };
      default:
        return {
          icon: Info,
          color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
          dot: 'bg-cyan-500',
        };
    }
  };

  return (
    <div
      id="anomaly-timeline-container"
      className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 shadow-xs space-y-3"
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-Time Anomaly Stream</span>
        </h4>
        <span className="text-[10px] font-mono text-zinc-400">
          Unsupervised Isolation Forest
        </span>
      </div>

      <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
        {displayEvents.map((evt) => {
          const badge = getSeverityBadge(evt.severity);
          const Icon = badge.icon;

          return (
            <div key={evt.id} className="relative group text-xs font-mono">
              {/* Timeline Dot */}
              <div
                className={`absolute -left-[19px] top-1.5 h-2.5 w-2.5 rounded-full ${badge.dot} ring-4 ring-zinc-900`}
              />

              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 font-bold">{evt.timestamp}</span>
                    <span className="text-zinc-300 font-semibold">{evt.robotId}</span>
                    {evt.jointId && (
                      <span className="px-1 py-0.2 rounded bg-zinc-800 text-[10px] text-zinc-300">
                        {evt.jointId}
                      </span>
                    )}
                  </div>

                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border ${badge.color}`}
                  >
                    {evt.severity}
                  </span>
                </div>

                <p className="text-[11px] font-sans text-zinc-300 leading-snug">
                  {evt.message}
                </p>

                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
                  <span>Sensor: {evt.metric}</span>
                  {evt.value !== undefined && (
                    <span>
                      Observed: <strong className="text-zinc-300">{evt.value}</strong> (Ref: {evt.baseline})
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
