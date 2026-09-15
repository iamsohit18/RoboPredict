/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RobotId, RobotTelemetry, JointId, JointTelemetry } from '../types/robotics';
import { Eye, ShieldAlert, Cpu, ZoomIn, RefreshCw } from 'lucide-react';

interface RobotViewerProps {
  robotId: RobotId;
  telemetry: RobotTelemetry | null;
  onSelectJoint?: (jointId: JointId) => void;
  selectedJointId?: JointId | null;
}

export const RobotViewer: React.FC<RobotViewerProps> = ({
  robotId,
  telemetry,
  onSelectJoint,
  selectedJointId,
}) => {
  const [viewMode, setViewMode] = useState<'kinematic' | 'thermal' | 'stress'>('kinematic');
  const [zoomLevel, setZoomLevel] = useState(1);

  const joints = telemetry?.joints;
  const j1Angle = joints?.J1.position ?? 24.5;
  const j2Angle = joints?.J2.position ?? -32.1;
  const j3Angle = joints?.J3.position ?? 78.4;
  const j4Angle = joints?.J4.position ?? 112.0;
  const j5Angle = joints?.J5.position ?? -15.8;
  const j6Angle = joints?.J6.position ?? 5.2;

  // Joint color according to mode
  const getJointColor = (jId: JointId, defaultColor = '#38bdf8') => {
    if (!joints) return defaultColor;
    const j = joints[jId];

    if (viewMode === 'thermal') {
      if (j.temperature > 68) return '#f43f5e'; // rose
      if (j.temperature > 58) return '#f59e0b'; // amber
      return '#10b981'; // emerald
    }

    if (viewMode === 'stress') {
      if (j.vibration > 4.0 || j.health < 75) return '#f43f5e';
      if (j.vibration > 2.5 || j.health < 88) return '#f59e0b';
      return '#06b6d4';
    }

    // Default kinematic
    if (j.status === 'CRITICAL') return '#f43f5e';
    if (j.status === 'ELEVATED') return '#f59e0b';
    return defaultColor;
  };

  const isJ4Critical = joints?.J4.status === 'CRITICAL' || joints?.J4.health! < 75;

  return (
    <div
      id="robot-viewer-container"
      className="relative w-full rounded-2xl bg-zinc-950 border border-zinc-800/90 overflow-hidden shadow-lg flex flex-col"
      style={{ minHeight: '440px' }}
    >
      {/* Visualizer Top Overlay Bar */}
      <div className="absolute top-3 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Unit Info Badge */}
        <div className="flex items-center gap-2 pointer-events-auto bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-700/60 text-xs font-mono">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-zinc-400">UNIT:</span>
          <span className="font-bold text-white">{robotId}</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">STATUS:</span>
          <span
            className={`font-semibold ${
              telemetry?.commStatus === 'ONLINE' ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {telemetry?.commStatus ?? 'ONLINE'}
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-zinc-900/90 backdrop-blur-md p-1 rounded-lg border border-zinc-700/60 pointer-events-auto text-xs font-mono">
          <button
            id="viewmode-kinematic-btn"
            onClick={() => setViewMode('kinematic')}
            className={`px-2.5 py-1 rounded transition-colors ${
              viewMode === 'kinematic' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Kinematics
          </button>
          <button
            id="viewmode-stress-btn"
            onClick={() => setViewMode('stress')}
            className={`px-2.5 py-1 rounded transition-colors ${
              viewMode === 'stress' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Vibration/Stress
          </button>
          <button
            id="viewmode-thermal-btn"
            onClick={() => setViewMode('thermal')}
            className={`px-2.5 py-1 rounded transition-colors ${
              viewMode === 'thermal' ? 'bg-rose-500/20 text-rose-300 font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Thermal Heatmap
          </button>
        </div>
      </div>

      {/* Main SVG 6-DOF Industrial Arm Canvas */}
      <div className="flex-1 flex items-center justify-center p-4 relative select-none">
        {/* Background Grid & Perspective Grid lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="industrial-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#52525b" strokeWidth="0.75" />
              <circle cx="0" cy="0" r="1.5" fill="#06b6d4" opacity="0.6" />
            </pattern>
            <linearGradient id="grid-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#000" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#industrial-grid)" />
        </svg>

        {/* 6-Axis Robotic Arm Graphic */}
        <svg
          viewBox="0 0 800 520"
          className="w-full h-full max-h-[480px] transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Metallic Linear Gradients */}
            <linearGradient id="metal-base" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="50%" stopColor="#3f3f46" />
              <stop offset="100%" stopColor="#18181b" />
            </linearGradient>
            <linearGradient id="metal-arm-lower" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3f3f46" />
              <stop offset="35%" stopColor="#71717a" />
              <stop offset="100%" stopColor="#27272a" />
            </linearGradient>
            <linearGradient id="metal-arm-upper" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.2" />
            </linearGradient>

            {/* Glowing Anomaly Filter */}
            <filter id="glow-critical" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Coordinate Platform / Base Stand */}
          <g transform="translate(400, 460)">
            {/* Ground circle with radial marks */}
            <ellipse cx="0" cy="0" rx="180" ry="40" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
            <ellipse cx="0" cy="0" rx="140" ry="30" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
            <ellipse cx="0" cy="0" rx="90" ry="20" fill="#27272a" stroke="#52525b" strokeWidth="2" />

            {/* Heavy Base Casting */}
            <path
              d="M -70 -10 L -60 -50 L 60 -50 L 70 -10 Z"
              fill="url(#metal-base)"
              stroke="#52525b"
              strokeWidth="2"
            />
            {/* Anchor Bolts */}
            <circle cx="-50" cy="-20" r="3" fill="#a1a1aa" />
            <circle cx="50" cy="-20" r="3" fill="#a1a1aa" />
            <circle cx="0" cy="-15" r="3" fill="#a1a1aa" />

            {/* Joint 1 (Turntable Axis) */}
            <g
              id="joint-1-group"
              className="cursor-pointer"
              onClick={() => onSelectJoint?.('J1')}
            >
              <rect
                x="-45"
                y="-75"
                width="90"
                height="25"
                rx="6"
                fill={getJointColor('J1', '#38bdf8')}
                fillOpacity="0.25"
                stroke={getJointColor('J1', '#38bdf8')}
                strokeWidth="2"
              />
              <text x="0" y="-58" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="monospace" fontWeight="bold">
                J1 ({j1Angle > 0 ? `+${j1Angle}°` : `${j1Angle}°`})
              </text>
            </g>

            {/* Joint 2 Pivot (Lower Arm Base) */}
            <g transform={`translate(0, -85) rotate(${j2Angle * 0.4})`}>
              <circle
                cx="0"
                cy="0"
                r="28"
                fill="#27272a"
                stroke={getJointColor('J2', '#38bdf8')}
                strokeWidth="3"
                className="cursor-pointer hover:opacity-80"
                onClick={() => onSelectJoint?.('J2')}
              />
              <circle cx="0" cy="0" r="14" fill="#09090b" />
              <text x="0" y="4" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                J2
              </text>

              {/* Lower Arm Casting (Segment 1) */}
              <path
                d="M -16 -10 L -12 -160 L 12 -160 L 16 -10 Z"
                fill="url(#metal-arm-lower)"
                stroke="#52525b"
                strokeWidth="2"
              />
              {/* Internal cabling conduits */}
              <line x1="-6" y1="-10" x2="-6" y2="-155" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 2" opacity="0.7" />

              {/* Joint 3 Pivot (Elbow) */}
              <g transform={`translate(0, -165) rotate(${j3Angle * 0.45})`}>
                <circle
                  cx="0"
                  cy="0"
                  r="24"
                  fill="#27272a"
                  stroke={getJointColor('J3', '#38bdf8')}
                  strokeWidth="3"
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => onSelectJoint?.('J3')}
                />
                <circle cx="0" cy="0" r="10" fill="#09090b" />
                <text x="0" y="4" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  J3
                </text>

                {/* Upper Arm Casting (Segment 2) */}
                <path
                  d="M -12 -5 L -8 -130 L 8 -130 L 12 -5 Z"
                  fill="url(#metal-arm-lower)"
                  stroke="#52525b"
                  strokeWidth="2"
                />

                {/* Joint 4 Pivot - Wrist Roll (CRITICAL / HIGH RISK TARGET) */}
                <g transform={`translate(0, -135) rotate(${j4Angle * 0.3})`}>
                  {/* Warning pulse ring if J4 has gearbox wear */}
                  {isJ4Critical && (
                    <circle
                      cx="0"
                      cy="0"
                      r="36"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="animate-spin"
                    />
                  )}

                  <circle
                    cx="0"
                    cy="0"
                    r="22"
                    fill={isJ4Critical ? '#881337' : '#27272a'}
                    stroke={getJointColor('J4', '#f43f5e')}
                    strokeWidth={isJ4Critical ? '4' : '2'}
                    filter={isJ4Critical ? 'url(#glow-critical)' : undefined}
                    className="cursor-pointer hover:opacity-90"
                    onClick={() => onSelectJoint?.('J4')}
                  />
                  <circle cx="0" cy="0" r="9" fill={isJ4Critical ? '#f43f5e' : '#09090b'} />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill={isJ4Critical ? '#fff' : '#f43f5e'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    J4
                  </text>

                  {/* Joint 5 Pivot - Wrist Pitch */}
                  <g transform={`translate(0, -35) rotate(${j5Angle * 0.5})`}>
                    <rect
                      x="-14"
                      y="-12"
                      width="28"
                      height="24"
                      rx="4"
                      fill="#27272a"
                      stroke={getJointColor('J5', '#38bdf8')}
                      strokeWidth="2"
                      className="cursor-pointer"
                      onClick={() => onSelectJoint?.('J5')}
                    />
                    <text x="0" y="4" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      J5
                    </text>

                    {/* Joint 6 Flange - Yaw & End Effector */}
                    <g transform={`translate(0, -25) rotate(${j6Angle * 0.6})`}>
                      <circle
                        cx="0"
                        cy="0"
                        r="14"
                        fill="#18181b"
                        stroke={getJointColor('J6', '#38bdf8')}
                        strokeWidth="2"
                        className="cursor-pointer"
                        onClick={() => onSelectJoint?.('J6')}
                      />
                      <text x="0" y="3" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                        J6
                      </text>

                      {/* Industrial Tooling: Precision Vacuum/Claw Gripper */}
                      <g transform="translate(0, -18)">
                        {/* Tool baseplate */}
                        <rect x="-18" y="-4" width="36" height="8" rx="2" fill="#52525b" stroke="#71717a" strokeWidth="1" />
                        {/* Gripper Left Jaw */}
                        <path d="M -12 -4 L -18 -26 L -10 -32" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                        {/* Gripper Right Jaw */}
                        <path d="M 12 -4 L 18 -26 L 10 -32" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                        {/* Tool Center Point (TCP) Crosshair */}
                        <circle cx="0" cy="-35" r="3" fill="#f59e0b" className="animate-ping" opacity="0.8" />
                        <circle cx="0" cy="-35" r="2" fill="#f59e0b" />
                        <line x1="-8" y1="-35" x2="8" y2="-35" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
                        <line x1="0" y1="-43" x2="0" y2="-27" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
                        <text x="24" y="-32" fill="#f59e0b" fontSize="9" fontFamily="monospace">TCP</text>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>

          {/* J4 High Risk Callout Overlay */}
          {isJ4Critical && (
            <g transform="translate(560, 140)">
              <rect x="0" y="0" width="210" height="74" rx="8" fill="#18181b" stroke="#f43f5e" strokeWidth="1.5" />
              <circle cx="16" cy="18" r="5" fill="#f43f5e" className="animate-ping" />
              <circle cx="16" cy="18" r="4" fill="#f43f5e" />
              <text x="30" y="22" fill="#fff" fontSize="12" fontFamily="monospace" fontWeight="bold">
                J4 ANOMALY DETECTED
              </text>
              <text x="14" y="42" fill="#fca5a5" fontSize="11" fontFamily="sans-serif">
                Gearbox harmonic wear
              </text>
              <text x="14" y="58" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
                Vib: 4.8 mm/s | Temp: 68°C
              </text>
              {/* Connector line pointing toward arm */}
              <line x1="0" y1="36" x2="-80" y2="70" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" />
            </g>
          )}
        </svg>
      </div>

      {/* Visualizer Bottom Telemetry Strip */}
      <div className="bg-zinc-900/90 border-t border-zinc-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-300">
        <div className="flex items-center gap-4">
          <span className="text-zinc-500">DOF: 6-AXIS</span>
          <span>
            TCP SPEED:{' '}
            <strong className="text-cyan-400">
              {telemetry ? (telemetry.speed * 1.8).toFixed(0) : 180} mm/s
            </strong>
          </span>
          <span>
            LOAD: <strong className="text-white">{telemetry?.motorLoad ?? 45}%</strong>
          </span>
          <span>
            VIB RMS:{' '}
            <strong className={isJ4Critical ? 'text-rose-400' : 'text-emerald-400'}>
              {telemetry?.vibration ?? 1.8} mm/s
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-400">Click any joint node (J1-J6) to isolate telemetry</span>
        </div>
      </div>
    </div>
  );
};
