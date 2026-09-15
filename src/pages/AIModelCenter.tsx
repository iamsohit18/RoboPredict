/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AI_MODELS } from '../data/mockModels';
import { AIModelItem } from '../types/robotics';
import { BrainCircuit, Cpu, Zap, Activity, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AIModelCenter: React.FC = () => {
  const [models, setModels] = useState<AIModelItem[]>(AI_MODELS);
  const [selectedModel, setSelectedModel] = useState<AIModelItem>(AI_MODELS[1]);
  const [retrainingId, setRetrainingId] = useState<string | null>(null);

  const handleSelectActive = (id: string) => {
    setModels((prev) =>
      prev.map((m) => ({
        ...m,
        status: m.id === id ? 'Active' : 'Available',
      }))
    );
  };

  const handleRetrain = (id: string) => {
    setRetrainingId(id);
    setTimeout(() => {
      setRetrainingId(null);
      setModels((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                lastTrained: 'Just now (Simulated 200 Epochs)',
                accuracy: Math.min(99.4, Number((m.accuracy + 0.3).toFixed(1))),
                f1Score: Math.min(98.8, Number((m.f1Score + 0.2).toFixed(1))),
              }
            : m
        )
      );
    }, 1200);
  };

  return (
    <div id="ai-model-center-page" className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-cyan-400" />
            <span>AI Model Management &amp; Inference Registry</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Supervised classifiers, unsupervised anomaly detectors, and recurrent RUL estimators
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
            Active Inference Architecture: XGBoost Multi-Class + Isolation Forest
          </span>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {models.map((model) => {
          const isSelected = selectedModel.id === model.id;
          const isActive = model.status === 'Active';

          return (
            <div
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-zinc-900/90 flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-cyan-500 ring-1 ring-cyan-500/40'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-400">{model.purpose}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {model.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold font-mono text-white leading-snug">
                  {model.name}
                </h3>
                <p className="text-xs text-zinc-400 font-sans line-clamp-2">
                  {model.algorithm}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                <div>
                  <span className="text-zinc-500 text-[10px] block">Accuracy</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {model.accuracy}%
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">F1-Score</span>
                  <span className="font-bold text-cyan-400 text-sm">
                    {model.f1Score}%
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">Precision</span>
                  <span className="font-bold text-amber-400 text-sm">
                    {model.precision}%
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">Recall</span>
                  <span className="font-bold text-purple-400 text-sm">
                    {model.recall}%
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                {!isActive ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectActive(model.id);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
                  >
                    Set Active
                  </button>
                ) : (
                  <div className="flex-1 py-1.5 text-center text-xs font-mono text-emerald-400 font-bold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Serving Live</span>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRetrain(model.id);
                  }}
                  disabled={retrainingId === model.id}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-950 border border-cyan-500/40 text-xs font-mono text-cyan-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  {retrainingId === model.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Retrain</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Inspection Panel for Selected Model */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Model Telemetry &amp; Hyperparameter Topology: {selectedModel.name}
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Trained on: {selectedModel.lastTrained} &bull; Training Corpus: {selectedModel.trainingRecords}
            </p>
          </div>
          <span className="px-3 py-1 rounded bg-zinc-950 text-xs font-mono text-cyan-400 border border-zinc-800">
            ALGORITHM: {selectedModel.algorithm.toUpperCase()}
          </span>
        </div>

        {/* Confusion Matrix / Diagnostics Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Normalized Confusion Matrix (Validation Set N=12,500)
            </h4>
            <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-mono pt-1">
              <div className="p-2 bg-zinc-900 text-zinc-400">Class</div>
              <div className="p-2 bg-zinc-900 text-zinc-400">Pred: Nominal</div>
              <div className="p-2 bg-zinc-900 text-zinc-400">Pred: Fault</div>

              <div className="p-2 bg-zinc-900 text-zinc-300 font-bold">True: Nominal</div>
              <div className="p-3 bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-500/30">
                98.4% (TN)
              </div>
              <div className="p-3 bg-zinc-900 text-zinc-400">1.6% (FP)</div>

              <div className="p-2 bg-zinc-900 text-zinc-300 font-bold">True: Fault</div>
              <div className="p-3 bg-zinc-900 text-zinc-400">3.8% (FN)</div>
              <div className="p-3 bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-500/30">
                96.2% (TP)
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-3 text-xs font-mono">
            <h4 className="text-zinc-300 uppercase tracking-wider">
              Inference &amp; Quantization Diagnostics
            </h4>
            <div className="space-y-2 text-zinc-400">
              <div className="flex justify-between py-1 border-b border-zinc-800/80">
                <span>Quantization Target:</span>
                <span className="text-zinc-200">INT8 ONNX Runtime Engine</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/80">
                <span>Inference Memory Footprint:</span>
                <span className="text-zinc-200">24.6 MB Peak</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/80">
                <span>Throughput:</span>
                <span className="text-cyan-400 font-bold">1,820 Inferences / Sec</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Input Sensor Vector Dim:</span>
                <span className="text-zinc-200">48-Dimensional Windowed Sliding Feature Array</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
