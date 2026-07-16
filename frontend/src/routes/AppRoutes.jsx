import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import ChatPage from '../pages/ChatPage';
import DashboardPage from '../pages/DashboardPage';
import HelpPage from '../pages/HelpPage';
import LabsPage from '../pages/LabsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        {/* Default route redirects to /chat */}
        <Route index element={<Navigate to="/chat" replace />} />
        
        {/* Feature routes */}
        <Route path="chat" element={<ChatPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="labs" element={<LabsPage />} />
        
        {/* Wildcard fallback redirects to /chat */}
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Route>
    </Routes>
  );
}
