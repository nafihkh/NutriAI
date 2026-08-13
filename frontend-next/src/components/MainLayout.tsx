"use client";

import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import UserModal from './UserModal';
import { Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clearToken } from '@/lib/api';

const MainLayoutContext = createContext(null);

export function useMainLayout() {
  return useContext(MainLayoutContext);
}

export default function MainLayout({ children }) {
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [streak, setStreak] = useState(24);
  const [toast, setToast] = useState({ message: '', visible: false });
  const toastTimeoutRef = useRef(null);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('nutriai-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const darkPref = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(darkPref ? 'dark' : 'light');
    }
  }, []);

  // Sync data-theme attribute with theme state
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nutriai-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (message) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, visible: true });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ message: '', visible: false });
    }, 3000);
  };

  const handleLogout = () => {
    clearToken();
    setUserModalOpen(false);
    router.replace('/login');
  };

  const handleNewChat = () => {
    // Navigate to chatbot page and set state for a fresh chat session
    showToast('Started a new AI coaching session.');
    router.push('/chat?new=true');
  };

  const handleHistoryItemClick = (query) => {
    router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  const contextValue = {
    theme,
    toggleTheme,
    sidebarCollapsed,
    setSidebarCollapsed,
    userModalOpen,
    setUserModalOpen,
    streak,
    setStreak,
    showToast,
    handleNewChat
  };

  return (
    <MainLayoutContext.Provider value={contextValue}>
      <div className="flex flex-col h-screen w-screen relative overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
        
        {/* Top Header - Spans Full Width */}
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenUserSettings={() => setUserModalOpen(true)}
          streak={streak}
        />

        {/* Body Container - Sidebar and main content under the Header */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          
          {/* Left Sidebar - Shrinks to icon-only mini mode when collapsed */}
          <Sidebar
            collapsed={sidebarCollapsed}
            onOpenUserSettings={() => setUserModalOpen(true)}
            onHistoryItemClick={handleHistoryItemClick}
            onNewChat={handleNewChat}
          />

          {/* Page Routing Level Wrapper */}
          <main className="flex-1 overflow-y-auto relative p-[16px] md:p-[28px] scrollbar-none">
            <div className="max-w-[1400px] mx-auto animate-[fade-in-up_0.35s_cubic-bezier(0.4,0,0.2,1)]">
              {children}
            </div>
          </main>
        </div>

        {/* User Modal Settings */}
        <UserModal
          isOpen={userModalOpen}
          onClose={() => setUserModalOpen(false)}
          onLogout={handleLogout}
        />

        {/* Dynamic Toast Popup */}
        {toast.visible && (
          <div className="fixed bottom-[24px] right-[24px] bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] px-[20px] py-[12px] rounded-[var(--radius-sm)] shadow-[var(--shadow-lg)] z-[9999] text-[13px] font-semibold flex items-center gap-[8px] animate-[fade-in-up_0.25s_cubic-bezier(0.4,0,0.2,1)] font-display border-l-4 border-l-[var(--accent-color)]">
            <Info size={15} className="text-[var(--accent-color)]" />
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </MainLayoutContext.Provider>
  );
}
