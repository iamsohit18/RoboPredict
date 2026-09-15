/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Activity,
  BrainCircuit,
  FlaskConical,
  SlidersHorizontal,
  Wrench,
  AlertTriangle,
  Database,
  Cpu,
  History,
  HeartPulse,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export type PageId =
  | 'Dashboard'
  | 'Robots'
  | 'Live Telemetry'
  | 'AI Predictions'
  | 'Simulation Lab'
  | 'What-If Analysis'
  | 'Predictive Maintenance'
  | 'Alerts'
  | 'Dataset Center'
  | 'AI Model Center'
  | 'Maintenance History'
  | 'System Health'
  | 'Settings';

interface SidebarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeAlertCount: number;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  isCollapsed,
  onToggleCollapse,
  activeAlertCount,
}) => {
  const navItems: NavItem[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Robots', label: 'Robots Fleet', icon: Bot },
    { id: 'Live Telemetry', label: 'Live Telemetry', icon: Activity },
    { id: 'AI Predictions', label: 'AI Predictions', icon: BrainCircuit },
    { id: 'Simulation Lab', label: 'Simulation Lab', icon: FlaskConical },
    { id: 'What-If Analysis', label: 'What-If Analysis', icon: SlidersHorizontal },
    { id: 'Predictive Maintenance', label: 'Predictive Maint.', icon: Wrench },
    { id: 'Alerts', label: 'Alerts', icon: AlertTriangle, badge: activeAlertCount },
    { id: 'Dataset Center', label: 'Dataset Center', icon: Database },
    { id: 'AI Model Center', label: 'AI Model Center', icon: Cpu },
    { id: 'Maintenance History', label: 'Maint. History', icon: History },
    { id: 'System Health', label: 'System Health', icon: HeartPulse },
    { id: 'Settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      id="sidebar-nav"
      className={`relative flex flex-col bg-zinc-950 border-r border-zinc-800/80 text-zinc-300 transition-all duration-300 ease-in-out z-30 shrink-0 ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800/80 bg-zinc-950/60">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <BrainCircuit className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>RoboPredict</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono font-medium">AI</span>
              </div>
              <div className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">Predictive Robotics</div>
            </div>
          )}
        </div>

        <button
          id="sidebar-collapse-toggle"
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectPage(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-zinc-300'
                }`}
              />
              {!isCollapsed && <span className="truncate">{item.label}</span>}

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`ml-auto px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isCollapsed
                      ? 'absolute top-1 right-1 h-2 w-2 p-0 bg-rose-500'
                      : 'bg-rose-500/20 border border-rose-500/30 text-rose-400'
                  }`}
                >
                  {!isCollapsed && item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Industrial Safety & Adapter Footer */}
      {!isCollapsed ? (
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/40 text-[11px] space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300 font-mono text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SAFETY INTERLOCK
            </span>
            <span className="text-emerald-400 font-mono font-semibold text-[10px]">READ-ONLY</span>
          </div>
          <div className="text-[10px] text-zinc-400 leading-tight">
            Telemetry ingestion only. Direct motor commands isolated.
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-zinc-800/80 flex justify-center">
          <ShieldCheck className="w-4 h-4 text-emerald-400" title="Safety Interlock Active (Read-Only)" />
        </div>
      )}
    </aside>
  );
};
