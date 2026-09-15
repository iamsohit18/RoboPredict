/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DATASETS, SAMPLE_DATASET_ROWS } from '../data/mockDatasets';
import { DatasetItem } from '../types/robotics';
import { Database, Download, Check, Eye, FileSpreadsheet, HardDrive, RefreshCw } from 'lucide-react';

export const DatasetCenter: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<DatasetItem>(DATASETS[1]);
  const [isLoaded, setIsLoaded] = useState<string>('DS-02');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleLoadDataset = (id: string) => {
    setLoadingId(id);
    setTimeout(() => {
      setIsLoaded(id);
      setLoadingId(null);
    }, 600);
  };

  return (
    <div id="dataset-center-page" className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-cyan-400" />
            <span>Industrial Robotics Dataset Center</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Standardized time-series training corpora, run-to-failure benchmarks, and hardware fault telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span>Active In-Memory Corpus:</span>
          <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold">
            {isLoaded}
          </span>
        </div>
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DATASETS.map((ds) => {
          const isCurrentActive = isLoaded === ds.id;
          const isCurrentSelected = selectedDataset.id === ds.id;

          return (
            <div
              key={ds.id}
              onClick={() => setSelectedDataset(ds)}
              className={`p-4 rounded-xl border transition-all cursor-pointer bg-zinc-900/90 flex flex-col justify-between space-y-3 ${
                isCurrentSelected
                  ? 'border-cyan-500 ring-1 ring-cyan-500/40'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">{ds.id}</span>
                  <span className="text-zinc-500">{ds.format}</span>
                </div>
                <h4 className="text-sm font-bold text-zinc-200 font-sans leading-tight">
                  {ds.name}
                </h4>
                <p className="text-xs text-zinc-400 font-sans line-clamp-2">
                  {ds.robots}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800/80 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Samples:</span>
                  <span className="text-zinc-200">{ds.records}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Size / Features:</span>
                  <span className="text-zinc-200">{ds.sizeMb} MB &bull; {ds.features} vars</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Quality Score:</span>
                  <span className="text-cyan-400">{ds.qualityScore}% verified</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadDataset(ds.id);
                  }}
                  disabled={isCurrentActive || loadingId === ds.id}
                  className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isCurrentActive
                      ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                  }`}
                >
                  {loadingId === ds.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : isCurrentActive ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Loaded into Model Engine</span>
                    </>
                  ) : (
                    <span>Load Dataset</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dataset Preview Inspector */}
      <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Corpus Inspector: {selectedDataset.name} ({selectedDataset.id})
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Date Range: {selectedDataset.dateRange}</span>
            <span>&bull;</span>
            <span>Format: {selectedDataset.format}</span>
          </div>
        </div>

        {/* Mock Data Matrix View */}
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-xs font-mono text-left text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Robot</th>
                <th className="p-2.5">Joint</th>
                <th className="p-2.5">Vib RMS</th>
                <th className="p-2.5">Temp (°C)</th>
                <th className="p-2.5">Torque (Nm)</th>
                <th className="p-2.5">Current (A)</th>
                <th className="p-2.5">Pos Err (deg)</th>
                <th className="p-2.5">Label / Ground Truth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/50">
              {SAMPLE_DATASET_ROWS.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/40">
                  <td className="p-2.5 text-zinc-500">{row.timestamp}</td>
                  <td className="p-2.5 font-bold text-white">{row.robotId}</td>
                  <td className="p-2.5 text-cyan-300">{row.joint}</td>
                  <td className={`p-2.5 ${row.vib > 3.5 ? 'text-rose-400 font-bold' : ''}`}>{row.vib}</td>
                  <td className={`p-2.5 ${row.temp > 65 ? 'text-rose-400 font-bold' : ''}`}>{row.temp}</td>
                  <td className="p-2.5">{row.torque}</td>
                  <td className="p-2.5">{row.current}</td>
                  <td className="p-2.5">{row.posErr}</td>
                  <td className="p-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        row.label.includes('Wear') || row.label.includes('Elevated')
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {row.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
