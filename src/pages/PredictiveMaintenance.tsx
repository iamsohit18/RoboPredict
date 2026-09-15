/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRoboPredict } from '../hooks/useRoboPredict';
import { MaintenanceCard } from '../components/MaintenanceCard';
import { RobotId } from '../types/robotics';
import { Wrench, Filter, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { PageId } from '../components/Sidebar';

interface PredictiveMaintenanceProps {
  onNavigate: (page: PageId) => void;
}

export const PredictiveMaintenance: React.FC<PredictiveMaintenanceProps> = ({ onNavigate }) => {
  const {
    recommendations,
    setSelectedRobot,
    acknowledgeRecommendation,
  } = useRoboPredict();

  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [robotFilter, setRobotFilter] = useState<string>('ALL');

  const filteredRecs = recommendations.filter((r) => {
    if (priorityFilter !== 'ALL' && r.priority !== priorityFilter) return false;
    if (robotFilter !== 'ALL' && r.robotId !== robotFilter) return false;
    return true;
  });

  return (
    <div id="predictive-maintenance-page" className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-cyan-400" />
            <span>AI Predictive Maintenance Action Center</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Proactive maintenance dispatch recommendations generated from real-time wear progression
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
            Pending Recommendations: {recommendations.length}
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">PRIORITY:</span>
          {['ALL', 'P1', 'P2', 'P3'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                priorityFilter === p
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500">ROBOT:</span>
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
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecs.map((rec) => (
          <MaintenanceCard
            key={rec.id}
            recommendation={rec}
            onAcknowledge={acknowledgeRecommendation}
            onViewRobot={(id) => {
              setSelectedRobot(id);
              onNavigate('Dashboard');
            }}
          />
        ))}
      </div>
    </div>
  );
};
