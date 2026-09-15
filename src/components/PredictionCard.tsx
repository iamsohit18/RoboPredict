/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Prediction } from '../types/robotics';
import { BrainCircuit, AlertTriangle, HelpCircle, ShieldAlert, Sparkles, Clock, Target } from 'lucide-react';

interface PredictionCardProps {
  prediction?: Prediction;
  onViewDetails?: () => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  onViewDetails,
}) => {
  if (!prediction) {
    return (
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-center text-zinc-400 text-xs">
        No active prediction data.
      </div>
    );
  }

  const isHighRisk = prediction.riskLevel === 'HIGH' || prediction.riskLevel === 'CRITICAL';

  return (
    <div
      id="ai-prediction-card"
      className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 shadow-md space-y-5"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              AI Failure Prediction
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono">
              XGBoost + Isolation Forest Pipeline
            </span>
          </div>
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
            isHighRisk
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}
        >
          {prediction.riskLevel} RISK
        </span>
      </div>

      {/* Main Prediction Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-left">
          <span className="text-[10px] font-mono text-zinc-400 uppercase block">
            Failure Probability
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span
              className={`text-2xl font-bold font-mono ${
                prediction.failureProbability > 70
                  ? 'text-rose-400'
                  : prediction.failureProbability > 40
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {prediction.failureProbability}%
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-left">
          <span className="text-[10px] font-mono text-zinc-400 uppercase block">
            Confidence
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-cyan-300">
              {prediction.confidence}%
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-left">
          <span className="text-[10px] font-mono text-zinc-400 uppercase block">
            Estimated RUL
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-amber-300">
              {prediction.estimatedRulHours}h
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-left">
          <span className="text-[10px] font-mono text-zinc-400 uppercase block">
            Predicted Issue
          </span>
          <div className="mt-1 font-mono font-bold text-sm text-zinc-100 truncate">
            {prediction.predictedFailure}
          </div>
        </div>
      </div>

      {/* Explainable AI: "Why did AI predict this?" (Section 13) */}
      <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/90 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Why did AI predict {prediction.predictedFailure.toLowerCase()}?
            </h4>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">Shapley Attribution</span>
        </div>

        {/* Narrative Explanation */}
        <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-lg border border-zinc-800 font-sans">
          &ldquo;{prediction.whyExplanation}&rdquo;
        </p>

        {/* Feature Importance Bars */}
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-mono text-zinc-400 uppercase flex justify-between">
            <span>Sensor Metric Contribution</span>
            <span>Relative Weight</span>
          </div>

          {prediction.featureImportances.map((f, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-300">{f.feature}</span>
                <span className="text-cyan-400 font-bold">{f.importance}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden flex items-center">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === 0 ? 'bg-rose-500' : i === 1 ? 'bg-amber-500' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${f.importance}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-zinc-400 text-right">
                {f.delta}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-1">
        <span>Horizon: 7 Days (Predictive Window)</span>
        <span className="text-zinc-400">Inference generated: {prediction.generatedAt}</span>
      </div>
    </div>
  );
};
