/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIModelItem } from '../types/robotics';

export const AI_MODELS: AIModelItem[] = [
  {
    id: 'MOD-01',
    name: 'Isolation Forest (Ensemble Unsupervised)',
    algorithm: 'iForest v2.4 (Contamination=0.03)',
    purpose: 'Anomaly Detection',
    status: 'Active',
    accuracy: 98.4,
    precision: 96.8,
    recall: 97.2,
    f1Score: 97.0,
    lastTrained: '2026-09-10 03:00',
    trainingRecords: '1,200,000 pts',
  },
  {
    id: 'MOD-02',
    name: 'XGBoost Multi-Class Classifier',
    algorithm: 'Gradient Boosted Trees (depth=6, eta=0.08)',
    purpose: 'Failure Prediction',
    status: 'Active',
    accuracy: 96.2,
    precision: 95.4,
    recall: 94.8,
    f1Score: 95.1,
    lastTrained: '2026-09-12 14:30',
    trainingRecords: '850,000 pts',
  },
  {
    id: 'MOD-03',
    name: 'Random Forest Failure Classifier',
    algorithm: 'RF Ensemble (n_estimators=300)',
    purpose: 'Failure Classification',
    status: 'Available',
    accuracy: 94.7,
    precision: 93.9,
    recall: 94.1,
    f1Score: 94.0,
    lastTrained: '2026-08-28 18:00',
    trainingRecords: '620,000 pts',
  },
  {
    id: 'MOD-04',
    name: 'Temporal LSTM Autoencoder',
    algorithm: 'Bidirectional LSTM + Weibull Survival Head',
    purpose: 'RUL Estimation',
    status: 'Active',
    accuracy: 92.8,
    precision: 91.5,
    recall: 93.4,
    f1Score: 92.4,
    lastTrained: '2026-09-08 22:15',
    trainingRecords: '940,000 pts',
  },
];
