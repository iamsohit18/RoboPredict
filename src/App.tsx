/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar, PageId } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { useRoboPredict } from './hooks/useRoboPredict';
import { RobotId, JointId } from './types/robotics';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Robots } from './pages/Robots';
import { RobotDetail } from './pages/RobotDetail';
import { LiveTelemetry } from './pages/LiveTelemetry';
import { AIPredictions } from './pages/AIPredictions';
import { SimulationLab } from './pages/SimulationLab';
import { WhatIfAnalysis } from './pages/WhatIfAnalysis';
import { PredictiveMaintenance } from './pages/PredictiveMaintenance';
import { Alerts } from './pages/Alerts';
import { DatasetCenter } from './pages/DatasetCenter';
import { AIModelCenter } from './pages/AIModelCenter';
import { MaintenanceHistory } from './pages/MaintenanceHistory';
import { SystemHealth } from './pages/SystemHealth';
import { Settings } from './pages/Settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId | 'RobotDetail'>('Dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeDetailJoint, setActiveDetailJoint] = useState<JointId | null>(null);

  const {
    selectedRobotId,
    setSelectedRobot,
    alerts,
    isDemoActive,
    demoStepDescription,
    runAiFailureDemo,
    resetDemo,
  } = useRoboPredict();

  const activeAlertCount = alerts.filter((a) => a.status !== 'Resolved').length;

  const handleSelectPage = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRobotDetail = (robotId: RobotId) => {
    setSelectedRobot(robotId);
    setCurrentPage('RobotDetail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectJointDetail = (jointId: JointId) => {
    setActiveDetailJoint(jointId);
    setCurrentPage('Live Telemetry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="robopredict-app-root" className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Industrial Sidebar */}
        <Sidebar
          activePage={currentPage === 'RobotDetail' ? 'Robots' : currentPage}
          onSelectPage={handleSelectPage}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeAlertCount={activeAlertCount}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen bg-zinc-950">
          {/* Persistent Industrial Top Navigation Bar */}
          <TopBar
            selectedRobotId={selectedRobotId}
            onSelectRobot={setSelectedRobot}
            activeAlerts={alerts}
            isDemoActive={isDemoActive}
            demoStepDescription={demoStepDescription}
            onRunDemo={runAiFailureDemo}
            onResetDemo={resetDemo}
            onNavigateToAlerts={() => setCurrentPage('Alerts')}
          />

          {/* Dynamic Page Router Container */}
          <main id="main-scroll-canvas" className="flex-1 pb-12">
            {currentPage === 'Dashboard' && (
              <Dashboard
                onNavigate={handleSelectPage}
                onSelectJointDetail={handleSelectJointDetail}
              />
            )}

            {currentPage === 'Robots' && (
              <Robots
                onSelectRobotDetail={handleOpenRobotDetail}
                onNavigate={handleSelectPage}
              />
            )}

            {currentPage === 'RobotDetail' && (
              <RobotDetail
                onBack={() => setCurrentPage('Robots')}
                onNavigate={handleSelectPage}
              />
            )}

            {currentPage === 'Live Telemetry' && <LiveTelemetry />}

            {currentPage === 'AI Predictions' && <AIPredictions />}

            {currentPage === 'Simulation Lab' && <SimulationLab />}

            {currentPage === 'What-If Analysis' && <WhatIfAnalysis />}

            {currentPage === 'Predictive Maintenance' && (
              <PredictiveMaintenance onNavigate={handleSelectPage} />
            )}

            {currentPage === 'Alerts' && <Alerts onNavigate={handleSelectPage} />}

            {currentPage === 'Dataset Center' && <DatasetCenter />}

            {currentPage === 'AI Model Center' && <AIModelCenter />}

            {currentPage === 'Maintenance History' && <MaintenanceHistory />}

            {currentPage === 'System Health' && <SystemHealth />}

            {currentPage === 'Settings' && <Settings />}
          </main>
        </div>
      </div>
    </div>
  );
}
