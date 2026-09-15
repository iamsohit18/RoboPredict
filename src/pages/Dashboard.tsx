/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useRoboPredict } from '../hooks/useRoboPredict';
import { KPICard } from '../components/KPICard';
import { RobotViewer } from '../components/RobotViewer';
import { RobotStatus } from '../components/RobotStatus';
import { JointHealthCard } from '../components/JointHealthCard';
import { TelemetryChart } from '../components/TelemetryChart';
import { PredictionCard } from '../components/PredictionCard';
import { AnomalyTimeline } from '../components/AnomalyTimeline';
import { MaintenanceCard } from '../components/MaintenanceCard';
import { SimulationControls } from '../components/SimulationControls';
import { RobotId, JointId } from '../types/robotics';
import { Sparkles, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { PageId } from '../components/Sidebar';

interface DashboardProps {
  onNavigate: (page: PageId) => void;
  onSelectJointDetail?: (jointId: JointId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onSelectJointDetail,
}) => {
  const {
    selectedRobotId,
    setSelectedRobot,
    currentTelemetry,
    telemetryHistory,
    health,
    prediction,
    metadata,
    kpis,
    alerts,
    recommendations,
    anomalyTimeline,
    isRunning,
    speedMultiplier,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setSpeed,
    acknowledgeAlert,
    resolveAlert,
    acknowledgeRecommendation,
    isDemoActive,
    demoStepDescription,
    runAiFailureDemo,
    resetDemo,
  } = useRoboPredict();

  const handleKpiClick = (type: string) => {
    switch (type) {
      case 'total':
      case 'healthy':
        onNavigate('Robots');
        break;
      case 'warning':
        setSelectedRobot('RB-002');
        break;
      case 'critical':
        setSelectedRobot('RB-003');
        break;
      case 'alerts':
        onNavigate('Alerts');
        break;
      case 'predictions':
        onNavigate('AI Predictions');
        break;
    }
  };

  return (
    <div id="dashboard-page" className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Dashboard Title & Subtitle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight flex items-center gap-3">
            <span>Robotic Intelligence Control Center</span>
            <span className="text-xs px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-medium">
              VIRTUAL DIGITAL TWIN
            </span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            AI-powered real-time robot health monitoring and predictive maintenance.
          </p>
        </div>

        {/* Live Simulation Controls */}
        <div className="w-full lg:w-auto">
          <SimulationControls
            isRunning={isRunning}
            speedMultiplier={speedMultiplier}
            onStart={startSimulation}
            onPause={pauseSimulation}
            onReset={resetSimulation}
            onSetSpeed={setSpeed}
          />
        </div>
      </div>

      {/* Top Interactive KPI Cards (Section 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard
          id="kpi-total-robots"
          title="Total Robots"
          value={kpis.totalRobots}
          subtitle="4 Online"
          variant="default"
          onClick={() => handleKpiClick('total')}
        />
        <KPICard
          id="kpi-healthy-robots"
          title="Healthy"
          value={kpis.healthyCount}
          subtitle="Nominal state"
          variant="healthy"
          onClick={() => handleKpiClick('healthy')}
        />
        <KPICard
          id="kpi-warning-robots"
          title="Warning"
          value={kpis.warningCount}
          subtitle="RB-002 Thermal"
          variant="warning"
          onClick={() => handleKpiClick('warning')}
        />
        <KPICard
          id="kpi-critical-robots"
          title="Critical"
          value={kpis.criticalCount}
          subtitle="RB-003 Wear"
          variant="critical"
          onClick={() => handleKpiClick('critical')}
        />
        <KPICard
          id="kpi-active-alerts"
          title="Active Alerts"
          value={kpis.activeAlerts}
          subtitle="Requires review"
          variant="alert"
          onClick={() => handleKpiClick('alerts')}
        />
        <KPICard
          id="kpi-predicted-failures"
          title="Predicted Failures"
          value={kpis.predictedFailures}
          subtitle="7-Day Horizon"
          variant="prediction"
          onClick={() => handleKpiClick('predictions')}
        />
      </div>

      {/* Main Central View: Robot 3D/Kinematic Visualizer + Robot Status Panel (Section 6 & 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RobotViewer
            robotId={selectedRobotId}
            telemetry={currentTelemetry}
            onSelectJoint={onSelectJointDetail}
          />
        </div>

        <div className="lg:col-span-1">
          <RobotStatus
            robotId={selectedRobotId}
            metadata={metadata}
            health={health}
            telemetry={currentTelemetry}
            onNavigateToPredictions={() => onNavigate('AI Predictions')}
          />
        </div>
      </div>

      {/* Joint Health Subsystem Section (Section 8) */}
      {currentTelemetry && (
        <JointHealthCard
          joints={currentTelemetry.joints}
          onSelectJoint={onSelectJointDetail}
        />
      )}

      {/* Middle Row: Live Real-Time Telemetry Charts (Section 9) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Dynamic Telemetry Stream ({selectedRobotId})</span>
          </h3>
          <button
            onClick={() => onNavigate('LiveTelemetry')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
          >
            <span>Open Dedicated Telemetry Lab &rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TelemetryChart
            title="Vibration RMS"
            metric="vibration"
            history={telemetryHistory}
            unit="mm/s"
            color="#f43f5e"
            threshold={4.0}
            height={160}
          />
          <TelemetryChart
            title="Motor Temperature"
            metric="temperature"
            history={telemetryHistory}
            unit="°C"
            color="#f59e0b"
            threshold={68.0}
            height={160}
          />
          <TelemetryChart
            title="Total Torque"
            metric="torque"
            history={telemetryHistory}
            unit="Nm"
            color="#a855f7"
            threshold={32.0}
            height={160}
          />
          <TelemetryChart
            title="Motor Current"
            metric="motorCurrent"
            history={telemetryHistory}
            unit="A"
            color="#06b6d4"
            threshold={5.2}
            height={160}
          />
        </div>
      </div>

      {/* Bottom Row: AI Explainable Prediction & Anomaly Timeline & Maintenance Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: AI Prediction with Explainable Feature Importances (Section 12 & 13) */}
        <div className="lg:col-span-2">
          <PredictionCard
            prediction={prediction}
            onViewDetails={() => onNavigate('AI Predictions')}
          />
        </div>

        {/* Right: Anomaly Timeline (Section 14) */}
        <div className="lg:col-span-1">
          <AnomalyTimeline events={anomalyTimeline} maxEvents={5} />
        </div>
      </div>

      {/* Active Predictive Maintenance Recommendations (Section 15) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-zinc-200 uppercase tracking-wider">
            Predictive Maintenance Actions Due
          </h3>
          <button
            onClick={() => onNavigate('Predictive Maintenance')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
          >
            All Work Orders &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.slice(0, 3).map((rec) => (
            <MaintenanceCard
              key={rec.id}
              recommendation={rec}
              onAcknowledge={acknowledgeRecommendation}
              onViewRobot={(id) => {
                setSelectedRobot(id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
