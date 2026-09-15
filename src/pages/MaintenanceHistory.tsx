/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MAINTENANCE_HISTORY } from '../data/mockMaintenance';
import { MaintenanceRecord } from '../types/robotics';
import { Calendar, Filter, User, CheckCircle2, FileText, Download } from 'lucide-react';

export const MaintenanceHistory: React.FC = () => {
  const [logs] = useState<MaintenanceRecord[]>(MAINTENANCE_HISTORY);
  const [robotFilter, setRobotFilter] = useState<string>('ALL');
  const [componentFilter, setComponentFilter] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    if (robotFilter !== 'ALL' && log.robotId !== robotFilter) return false;
    if (componentFilter !== 'ALL' && !log.component.includes(componentFilter)) return false;
    return true;
  });

  const handleExportLogs = () => {
    const headers = ['Date', 'Robot', 'Component', 'Issue', 'Type', 'Technician', 'Downtime', 'Status', 'Notes'];
    const rows = filteredLogs.map((l) => [l.date, l.robotId, l.component, l.issue, l.maintenanceType, l.technician, `${l.downtimeHours}h`, l.status, `"${l.notes}"`]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `maintenance_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="maintenance-history-page" className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-400" />
            <span>Industrial Maintenance History &amp; Work Orders</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Archival log of technician interventions, parts replacements, and post-service calibrations
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 transition-colors cursor-pointer w-fit"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Audit Trail</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">ROBOT FILTER:</span>
          <select
            value={robotFilter}
            onChange={(e) => setRobotFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 text-zinc-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Robots</option>
            <option value="RB-001">RB-001</option>
            <option value="RB-002">RB-002</option>
            <option value="RB-003">RB-003</option>
            <option value="RB-004">RB-004</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500">COMPONENT:</span>
          <select
            value={componentFilter}
            onChange={(e) => setComponentFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 text-zinc-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Components</option>
            <option value="Joint">Joint Actuators</option>
            <option value="Counterbalance">Counterbalance</option>
            <option value="Cable">Cable Harness / Umbilical</option>
            <option value="Brake">Motor Holding Brake</option>
            <option value="Gripper">Vacuum Gripper</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 shadow-sm">
        <table className="w-full text-left text-xs font-mono text-zinc-300">
          <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Robot</th>
              <th className="py-3 px-4">Component</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Technician</th>
              <th className="py-3 px-4">Downtime</th>
              <th className="py-3 px-4">Result</th>
              <th className="py-3 px-4">Engineering Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-900/50 transition-colors">
                <td className="py-3 px-4 text-zinc-400">{log.date}</td>
                <td className="py-3 px-4 font-bold text-white">{log.robotId}</td>
                <td className="py-3 px-4 text-cyan-300 font-semibold">{log.component}</td>
                <td className="py-3 px-4">
                  <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-300">
                    {log.maintenanceType}
                  </span>
                </td>
                <td className="py-3 px-4 text-zinc-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{log.technician}</span>
                </td>
                <td className="py-3 px-4 text-amber-400 font-bold">{log.downtimeHours}h</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    {log.status}
                  </span>
                </td>
                <td className="py-3 px-4 max-w-sm text-zinc-400 font-sans text-[11px] leading-relaxed">
                  {log.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
