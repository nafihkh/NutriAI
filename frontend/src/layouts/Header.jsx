import React from 'react';
import { PanelTop , Moon, Sun, Compass } from 'lucide-react';

export default function Header({
  activeView,
  onChangeView,
  theme,
  onToggleTheme,
  onToggleSidebar,
  walletConnected
}) {
  return (
    <header className="h-[72px] px-[28px] flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)] transition-[var(--transition-smooth)] z-10">
      <div className="flex items-center gap-[80px]">
        <div 
          className="flex items-center gap-[12px] cursor-pointer" 
          onClick={() => onChangeView('chat-view')}
        >
          <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[var(--text-primary)] animate-[logo-spin_20s_linear_infinite] shadow-[0_0_15px_var(--accent-glow)] bg-[radial-gradient(circle,var(--accent-color)_0%,rgba(var(--accent-color-rgb),0.2)_100%)]">
            <svg className="w-[24px] h-[24px] text-[var(--bg-secondary)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" strokeDasharray="6 6" />
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="4" />
              <path d="M50 5v90M5 50h90" stroke="currentColor" strokeWidth="4" />
              <path d="M22 22l56 56M22 78l56-56" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
          </div>
          <span className="font-[var(--font-display)] font-bold text-[22px] tracking-[-0.5px]">Nutri-AI</span>
        </div>

        <button 
          className="text-[var(--text-secondary)] p-[8px] rounded-[var(--radius-sm)] flex items-center justify-center transition-[var(--transition-fast)] hover:bg-[var(--bg-primary)] hover:text-[var(--accent-color)]" 
          aria-label="Toggle Sidebar" 
          id="sidebar-toggle" 
          onClick={onToggleSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            style={{ color: "#b2b3b5" }}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M16.5 21 L7.5 21" />
            <path d="M16.5 3 A4.5 4.5 0 0 1 21 7.5" />
            <path d="M21 16.5 A4.5 4.5 0 0 1 16.5 21" />
            <path d="M21 7.5 L21 16.5" />
            <path d="M3 16.5 L3 7.5" />
            <path d="M3 7.5 A4.5 4.5 0 0 1 7.5 3" />
            <path d="M3 9h18" />
            <path d="M7.5 21 A4.5 4.5 0 0 1 3 16.5" />
            <path d="M7.5 3 L16.5 3" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-[16px]">
        {/* Theme Toggle Switch */}
        <button 
          className="w-[40px] h-[40px] rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] relative transition-[var(--transition-smooth)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]" 
          id="theme-toggle" 
          title="Switch Theme" 
          onClick={onToggleTheme}
        >
          <Moon className="absolute w-[18px] h-[18px] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ opacity: theme === 'light' ? 1 : 0, transform: theme === 'light' ? 'rotate(0)' : 'rotate(-90deg)' }} />
          <Sun className="absolute w-[18px] h-[18px] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ opacity: theme === 'dark' ? 1 : 0, transform: theme === 'dark' ? 'rotate(0)' : 'rotate(90deg)' }} />
        </button>
    
      </div>
    </header>
  );
}
