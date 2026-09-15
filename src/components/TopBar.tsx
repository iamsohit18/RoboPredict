/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bell,
  Search,
  User,
  Radio,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { RobotId, Alert } from '../types/robotics';

interface TopBarProps {
  selectedRobotId: RobotId;
  onSelectRobot: (id: RobotId) => void;
  activeAlerts: Alert[];
  isDemoActive: boolean;
  demoStepDescription: string;
  onRunDemo: () => void;
  onResetDemo: () => void;
  onNavigateToAlerts?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  selectedRobotId,
  onSelectRobot,
  activeAlerts,
  isDemoActive,
  demoStepDescription,
  onRunDemo,
  onResetDemo,
  onNavigateToAlerts,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const robots: RobotId[] = ['RB-001', 'RB-002', 'RB-003', 'RB-004'];

  return (
    <header
      id="top-bar-header"
      className="h-16 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-4 md:px-6 flex items-center justify-between gap-4 z-20 shrink-0"
    >
      {/* Left: System Status & Robot Selector */}
      <div className="flex items-center gap-4">
        {/* Live Status Pill */}
        <div
          id="system-status-pill"
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>TELEMETRY STREAM ACTIVE</span>
          <span className="text-zinc-400 border-l border-zinc-800 pl-1.5 text-[10px]">100 Hz</span>
        </div>

        {/* Robot Quick Selector */}
        <div id="robot-quick-selector" className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          <span className="text-[11px] font-mono text-zinc-400 px-2 hidden md:inline">UNIT:</span>
          {robots.map((id) => (
            <button
              key={id}
              id={`quick-select-${id}`}
              onClick={() => onSelectRobot(id)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedRobotId === id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Center / Right: Demo Action & Tools */}
      <div className="flex items-center gap-3">
        {/* AI Failure Demo Button (Section 25) */}
        {!isDemoActive ? (
          <button
            id="run-ai-demo-btn"
            onClick={onRunDemo}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-medium shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Run AI Failure Demo</span>
            <span className="sm:hidden">AI Demo</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-amber-950/60 border border-amber-500/50 px-3 py-1 rounded-lg">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-mono text-amber-300 max-w-xs truncate hidden lg:inline">
              {demoStepDescription}
            </span>
            <button
              id="reset-demo-btn"
              onClick={onResetDemo}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div id="top-search-wrapper" className="relative hidden xl:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            id="top-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search telemetry, joints, alerts..."
            className="w-48 xl:w-64 pl-8 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            id="notification-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors cursor-pointer"
            title="Active Notifications"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              id="notifications-popover"
              className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-3 z-50 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-semibold text-zinc-200 font-mono">
                  ACTIVE ALERTS ({activeAlerts.length})
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {activeAlerts.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-4 text-center">No active alerts. All systems nominal.</p>
                ) : (
                  activeAlerts.slice(0, 4).map((alert) => (
                    <div
                      key={alert.id}
                      className="p-2 rounded bg-zinc-950/60 border border-zinc-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-zinc-300 font-bold">{alert.robotId} - {alert.component}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                            alert.severity === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-[11px] leading-tight">{alert.issue}</p>
                    </div>
                  ))
                )}
              </div>

              {onNavigateToAlerts && (
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigateToAlerts();
                  }}
                  className="w-full py-1.5 text-center text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-950/30 hover:bg-cyan-950/50 border border-cyan-500/30 rounded transition-colors"
                >
                  View All Alerts Center
                </button>
              )}
            </div>
          )}
        </div>

        {/* User / Engineer Profile */}
        <div id="user-profile-badge" className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-mono text-xs font-semibold">
            ENG
          </div>
          <div className="hidden 2xl:block text-left">
            <div className="text-xs font-semibold text-zinc-200">Robotics Control</div>
            <div className="text-[10px] text-zinc-400 font-mono">Lead Engineer</div>
          </div>
        </div>
      </div>
    </header>
  );
};
