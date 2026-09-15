/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Alert, AlertSeverity, RobotId } from '../types/robotics';
import { AlertTriangle, AlertCircle, Info, Check, ShieldCheck, Eye } from 'lucide-react';

interface AlertTableProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onViewRobot?: (robotId: RobotId) => void;
}

export const AlertTable: React.FC<AlertTableProps> = ({
  alerts,
  onAcknowledge,
  onResolve,
  onViewRobot,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [robotFilter, setRobotFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    if (robotFilter !== 'ALL' && a.robotId !== robotFilter) return false;
    return true;
  });

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300">
            <AlertCircle className="w-3 h-3" />
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
            <AlertTriangle className="w-3 h-3" />
            WARNING
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
            <Info className="w-3 h-3" />
            INFO
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/60 border border-rose-500/30 text-rose-400">
            Active
          </span>
        );
      case 'Acknowledged':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/60 border border-amber-500/30 text-amber-400">
            Acknowledged
          </span>
        );
      case 'Resolved':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
            <span>SEVERITY:</span>
            {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span>ROBOT:</span>
          <select
            value={robotFilter}
            onChange={(e) => setRobotFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 text-zinc-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Robots</option>
            <option value="RB-001">RB-001</option>
            <option value="RB-002">RB-002</option>
            <option value="RB-003">RB-003</option>
            <option value="RB-004">RB-004</option>
          </select>
        </div>
      </div>

      {/* Main Alerts Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/90 shadow-sm">
        <table className="w-full text-left text-xs font-mono text-zinc-300">
          <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Robot</th>
              <th className="py-3 px-4">Component</th>
              <th className="py-3 px-4">Issue</th>
              <th className="py-3 px-4">Failure Prob</th>
              <th className="py-3 px-4">Detected At</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {filteredAlerts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-zinc-500">
                  No alerts matching the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredAlerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="hover:bg-zinc-900/50 transition-colors group"
                >
                  <td className="py-3 px-4">{getSeverityBadge(alert.severity)}</td>
                  <td className="py-3 px-4 font-bold text-white">{alert.robotId}</td>
                  <td className="py-3 px-4 text-zinc-200">{alert.component}</td>
                  <td className="py-3 px-4 max-w-xs truncate font-sans text-zinc-300">
                    {alert.issue}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    {alert.failureProbability > 0 ? (
                      <span
                        className={
                          alert.failureProbability > 70
                            ? 'text-rose-400'
                            : alert.failureProbability > 40
                            ? 'text-amber-400'
                            : 'text-zinc-400'
                        }
                      >
                        {alert.failureProbability}%
                      </span>
                    ) : (
                      <span className="text-zinc-500">--</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-zinc-400">{alert.detectedAt}</td>
                  <td className="py-3 px-4">{getStatusBadge(alert.status)}</td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    {alert.status === 'Active' && (
                      <button
                        onClick={() => onAcknowledge(alert.id)}
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 hover:text-amber-200 border border-zinc-700 text-[10px] font-semibold transition-colors cursor-pointer"
                        title="Acknowledge this alert"
                      >
                        Acknowledge
                      </button>
                    )}
                    {alert.status !== 'Resolved' && (
                      <button
                        onClick={() => onResolve(alert.id)}
                        className="px-2 py-1 rounded bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 text-[10px] font-semibold transition-colors cursor-pointer"
                        title="Mark issue resolved"
                      >
                        Resolve
                      </button>
                    )}
                    {onViewRobot && (
                      <button
                        onClick={() => onViewRobot(alert.robotId)}
                        className="p-1 rounded bg-zinc-800 hover:bg-cyan-950/80 text-zinc-400 hover:text-cyan-300 border border-zinc-700 text-[10px] transition-colors cursor-pointer inline-flex items-center"
                        title="View Robot Telemetry"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
