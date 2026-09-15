/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useRoboPredict } from '../hooks/useRoboPredict';
import { PredictionCard } from '../components/PredictionCard';
import { AnomalyTimeline } from '../components/AnomalyTimeline';
import { RobotId } from '../types/robotics';
import { BrainCircuit, ShieldAlert, Cpu, Sparkles, TrendingDown, Target, Layers } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';

export const AIPredictions: React.FC = () => {
  const {
    selectedRobotId,
    setSelectedRobot,
    prediction,
    health,
    anomalyTimeline,
  } = useRoboPredict();

  const robotIds: RobotId[] = ['RB-001', 'RB-002', 'RB-003', 'RB-004'];

  // Simulated 7-day failure trajectory projection curve for the selected robot
  const projectionCurve = [
    { day: 'Day 0 (Now)', failProb: health.failureProbability, healthScore: health.healthScore },
    { day: 'Day +1', failProb: Math.min(99, health.failureProbability + 4), healthScore: Math.max(10, health.healthScore - 3) },
    { day: 'Day +2', failProb: Math.min(99, health.failureProbability + 9), healthScore: Math.max(10, health.healthScore - 7) },
    { day: 'Day +3', failProb: Math.min(99, health.failureProbability + 15), healthScore: Math.max(8, health.healthScore - 12) },
    { day: 'Day +4', failProb: Math.min(99, health.failureProbability + 23), healthScore: Math.max(5, health.healthScore - 18) },
    { day: 'Day +5', failProb: Math.min(99, health.failureProbability + 32), healthScore: Math.max(5, health.healthScore - 26) },
    { day: 'Day +6', failProb: Math.min(99, health.failureProbability + 41), healthScore: Math.max(2, health.healthScore - 35) },
    { day: 'Day +7 (Limit)', failProb: Math.min(99, health.failureProbability + 50), healthScore: Math.max(1, health.healthScore - 44) },
  ];

  return (
    <div id="ai-predictions-page" className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-cyan-400" />
            <span>AI Predictive Maintenance &amp; Failure Prognostics</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Explainable AI diagnostics, remaining useful life (RUL) estimation, and failure mode attribution
          </p>
        </div>

        {/* Robot Target Selector */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
          <span className="text-xs font-mono text-zinc-500 px-2">TARGET:</span>
          {robotIds.map((id) => (
            <button
              key={id}
              onClick={() => setSelectedRobot(id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedRobotId === id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Top Main Cards: Prediction Card + Anomaly Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PredictionCard prediction={prediction} />
        </div>

        <div className="lg:col-span-1">
          <AnomalyTimeline
            events={anomalyTimeline.filter((e) => e.robotId === selectedRobotId)}
            maxEvents={8}
          />
        </div>
      </div>

      {/* 7-Day Degradation Forecast Chart */}
      <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>7-Day Projected Failure Horizon &amp; Health Degradation</span>
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Assuming current mechanical stress and cycle time without planned intervention
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/40 px-3 py-1 rounded border border-amber-500/30">
            PROJECTION CONFIDENCE: 91.4%
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="failGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="day" stroke="#52525b" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis domain={[0, 100]} stroke="#52525b" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#3f3f46',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#fff',
                }}
              />
              <Area type="monotone" dataKey="failProb" name="Failure Probability (%)" stroke="#f43f5e" strokeWidth={2} fill="url(#failGrad)" />
              <Area type="monotone" dataKey="healthScore" name="Health Score (%)" stroke="#06b6d4" strokeWidth={2} fill="url(#healthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
