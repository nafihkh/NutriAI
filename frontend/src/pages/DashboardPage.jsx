import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DashboardView from '../features/dashboard/DashboardView';

export default function DashboardPage() {
  const context = useOutletContext();

  return (
    <DashboardView
      isActive={true}
      dashboardChartData={context.dashboardChartData}
      onRefreshDashboard={context.handleRefreshDashboard}
    />
  );
}
