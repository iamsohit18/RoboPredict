/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { RobotTelemetry, JointId } from '../types/robotics';

export type MetricType =
  | 'temperature'
  | 'motorCurrent'
  | 'torque'
  | 'vibration'
  | 'positionError'
  | 'motorLoad'
  | 'powerConsumption'
  | 'speed';

interface TelemetryChartProps {
  id?: string;
  title: string;
  metric: MetricType;
  history: RobotTelemetry[];
  selectedJoint?: JointId | 'All';
  unit: string;
  color?: string;
  threshold?: number;
  height?: number;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  id,
  title,
  metric,
  history,
  selectedJoint = 'All',
  unit,
  color = '#06b6d4', // cyan default
  threshold,
  height = 180,
}) => {
  // Transform telemetry history for chart
  const data = history.map((pt) => {
    let val = 0;
    if (selectedJoint !== 'All' && pt.joints && pt.joints[selectedJoint]) {
      const j = pt.joints[selectedJoint];
      switch (metric) {
        case 'temperature':
          val = j.temperature;
          break;
        case 'motorCurrent':
          val = j.current;
          break;
        case 'torque':
          val = j.torque;
          break;
        case 'vibration':
          val = j.vibration;
          break;
        case 'positionError':
          val = j.positionError;
          break;
        case 'speed':
          val = j.speed;
          break;
        default:
          val = (pt as any)[metric] ?? 0;
      }
    } else {
      val = (pt as any)[metric] ?? 0;
    }

    return {
      time: pt.timeString,
      value: val,
      threshold,
    };
  });

  const latestVal = data.length > 0 ? data[data.length - 1].value : 0;
  const isOverThreshold = threshold !== undefined && latestVal > threshold;

  return (
    <div
      id={id || `chart-${metric}`}
      className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 shadow-xs flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">
            {title}
          </h4>
          <span className="text-[10px] text-zinc-400 font-mono">
            {selectedJoint === 'All' ? 'System Mean' : `${selectedJoint} Isolated Sensor`}
          </span>
        </div>

        <div className="text-right">
          <span
            className={`text-base font-mono font-bold ${
              isOverThreshold ? 'text-rose-400' : 'text-white'
            }`}
          >
            {typeof latestVal === 'number' ? (metric === 'positionError' ? latestVal.toFixed(3) : latestVal.toFixed(1)) : latestVal} {unit}
          </span>
          {threshold && (
            <div className="text-[9px] font-mono text-zinc-400">
              Limit: {threshold} {unit}
            </div>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div style={{ height: `${height}px`, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${metric}-${selectedJoint}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#52525b"
              tick={{ fill: '#71717a', fontSize: 9, fontFamily: 'monospace' }}
              tickLine={false}
              minTickGap={25}
            />
            <YAxis
              stroke="#52525b"
              tick={{ fill: '#71717a', fontSize: 9, fontFamily: 'monospace' }}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                borderColor: '#3f3f46',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#fff',
              }}
              formatter={(value: any) => [`${value} ${unit}`, title]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#grad-${metric}-${selectedJoint})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
