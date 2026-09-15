/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatasetItem } from '../types/robotics';

export const DATASETS: DatasetItem[] = [
  {
    id: 'DS-01',
    name: 'robot_telemetry_v1',
    records: '1.2M records',
    robots: '4 robots (RB-001 - RB-004)',
    features: 42,
    dateRange: '2026-01-01 to 2026-08-31',
    qualityScore: 96,
    format: 'Parquet / HDF5',
    sizeMb: 428.5,
  },
  {
    id: 'DS-02',
    name: 'fault_simulation_dataset',
    records: '350K records',
    robots: 'Synthetic multi-DOF test rig',
    features: 36,
    dateRange: '2026-05-10 to 2026-09-01',
    qualityScore: 93,
    format: 'CSV / Arrow',
    sizeMb: 118.2,
  },
  {
    id: 'DS-03',
    name: 'gearbox_wear_run_to_failure',
    records: '840K records',
    robots: 'Accelerated Life Testing (ALT-3)',
    features: 48,
    dateRange: '2025-10-15 to 2026-03-20',
    qualityScore: 98,
    format: 'Parquet',
    sizeMb: 310.8,
  },
  {
    id: 'DS-04',
    name: 'thermal_overload_stress_profiles',
    records: '195K records',
    robots: 'ABB & FANUC continuous cycles',
    features: 28,
    dateRange: '2026-04-01 to 2026-07-30',
    qualityScore: 91,
    format: 'JSON Lines',
    sizeMb: 76.4,
  }
];

export const SAMPLE_DATASET_ROWS = [
  { timestamp: '2026-09-15 10:41:00.12', robotId: 'RB-003', joint: 'J4', temp: 68.2, current: 5.74, torque: 36.1, vib: 4.82, posErr: 0.42, label: 'Gearbox_Wear' },
  { timestamp: '2026-09-15 10:41:00.14', robotId: 'RB-003', joint: 'J4', temp: 68.3, current: 5.76, torque: 36.4, vib: 4.85, posErr: 0.43, label: 'Gearbox_Wear' },
  { timestamp: '2026-09-15 10:41:00.16', robotId: 'RB-003', joint: 'J4', temp: 68.3, current: 5.71, torque: 35.9, vib: 4.81, posErr: 0.41, label: 'Gearbox_Wear' },
  { timestamp: '2026-09-15 10:41:00.18', robotId: 'RB-001', joint: 'J1', temp: 51.8, current: 3.19, torque: 18.2, vib: 1.38, posErr: 0.02, label: 'Nominal' },
  { timestamp: '2026-09-15 10:41:00.20', robotId: 'RB-001', joint: 'J2', temp: 54.9, current: 3.82, torque: 22.0, vib: 1.79, posErr: 0.04, label: 'Nominal' },
  { timestamp: '2026-09-15 10:41:00.22', robotId: 'RB-002', joint: 'J2', temp: 73.8, current: 4.65, torque: 27.5, vib: 2.45, posErr: 0.09, label: 'Thermal_Elevated' },
  { timestamp: '2026-09-15 10:41:00.24', robotId: 'RB-004', joint: 'J3', temp: 48.2, current: 2.89, torque: 16.1, vib: 1.12, posErr: 0.01, label: 'Nominal' },
];
