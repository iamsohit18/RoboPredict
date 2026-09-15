/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bot, CheckCircle2, AlertTriangle, AlertOctagon, BellRing, Sparkles } from 'lucide-react';

interface KPICardProps {
  id: string;
  title: string;
  value: number | string;
  subtitle?: string;
  variant: 'default' | 'healthy' | 'warning' | 'critical' | 'alert' | 'prediction';
  onClick?: () => void;
  isActive?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  id,
  title,
  value,
  subtitle,
  variant,
  onClick,
  isActive = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'healthy':
        return {
          border: 'border-emerald-500/30 hover:border-emerald-500/60',
          bg: 'bg-emerald-950/20 hover:bg-emerald-950/30',
          text: 'text-emerald-400',
          icon: CheckCircle2,
          badgeBg: 'bg-emerald-500/10 text-emerald-400',
        };
      case 'warning':
        return {
          border: 'border-amber-500/30 hover:border-amber-500/60',
          bg: 'bg-amber-950/20 hover:bg-amber-950/30',
          text: 'text-amber-400',
          icon: AlertTriangle,
          badgeBg: 'bg-amber-500/10 text-amber-400',
        };
      case 'critical':
        return {
          border: 'border-rose-500/30 hover:border-rose-500/60',
          bg: 'bg-rose-950/20 hover:bg-rose-950/30',
          text: 'text-rose-400',
          icon: AlertOctagon,
          badgeBg: 'bg-rose-500/10 text-rose-400',
        };
      case 'alert':
        return {
          border: 'border-purple-500/30 hover:border-purple-500/60',
          bg: 'bg-purple-950/20 hover:bg-purple-950/30',
          text: 'text-purple-400',
          icon: BellRing,
          badgeBg: 'bg-purple-500/10 text-purple-400',
        };
      case 'prediction':
        return {
          border: 'border-cyan-500/30 hover:border-cyan-500/60',
          bg: 'bg-cyan-950/20 hover:bg-cyan-950/30',
          text: 'text-cyan-400',
          icon: Sparkles,
          badgeBg: 'bg-cyan-500/10 text-cyan-400',
        };
      default:
        return {
          border: 'border-zinc-800 hover:border-zinc-700',
          bg: 'bg-zinc-900/60 hover:bg-zinc-900',
          text: 'text-zinc-100',
          icon: Bot,
          badgeBg: 'bg-zinc-800 text-zinc-300',
        };
    }
  };

  const style = getVariantStyles();
  const Icon = style.icon;

  return (
    <button
      id={id}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden group ${
        style.bg
      } ${style.border} ${isActive ? 'ring-2 ring-cyan-500/50 shadow-md' : 'shadow-xs'}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-1.5 rounded-lg ${style.badgeBg} transition-transform group-hover:scale-105`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-2xl lg:text-3xl font-bold font-mono tracking-tight ${style.text}`}>
          {value}
        </span>
        {subtitle && (
          <span className="text-[11px] text-zinc-400 font-sans">
            {subtitle}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-400 group-hover:text-zinc-300 transition-colors">
        <span>Click to filter view &rarr;</span>
      </div>
    </button>
  );
};
