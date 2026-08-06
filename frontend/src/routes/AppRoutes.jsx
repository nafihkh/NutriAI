import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import ChatPage from '../pages/ChatPage';
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        {/* Default route redirects to /chat */}
        <Route index element={<Navigate to="/chat" replace />} />
        
        {/* Feature routes */}
        <Route path="chat" element={<ChatPage />} />
        
        {/* Wildcard fallback redirects to /chat */}
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Route>
    </Routes>
  );
}
