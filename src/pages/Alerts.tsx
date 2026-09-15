/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useRoboPredict } from '../hooks/useRoboPredict';
import { AlertTable } from '../components/AlertTable';
import { BellRing, AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { PageId } from '../components/Sidebar';

interface AlertsProps {
  onNavigate: (page: PageId) => void;
}

export const Alerts: React.FC<AlertsProps> = ({ onNavigate }) => {
  const { alerts, acknowledgeAlert, resolveAlert, setSelectedRobot } = useRoboPredict();

  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL' && a.status !== 'Resolved').length;
  const warningCount = alerts.filter((a) => a.severity === 'WARNING' && a.status !== 'Resolved').length;
  const infoCount = alerts.filter((a) => a.severity === 'INFO' && a.status !== 'Resolved').length;

  return (
    <div id="alerts-page" className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
            <BellRing className="w-6 h-6 text-purple-400" />
            <span>Industrial Incident &amp; Alert Management</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Real-time threshold and AI-generated predictive hazard notifications
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 font-bold">
            {criticalCount} Critical
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 font-bold">
            {warningCount} Warning
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-bold">
            {infoCount} Info
          </span>
        </div>
      </div>

      {/* Main Alert Table */}
      <AlertTable
        alerts={alerts}
        onAcknowledge={acknowledgeAlert}
        onResolve={resolveAlert}
        onViewRobot={(id) => {
          setSelectedRobot(id);
          onNavigate('Dashboard');
        }}
      />
    </div>
  );
};
