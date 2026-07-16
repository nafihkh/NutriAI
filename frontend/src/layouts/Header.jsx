import React from 'react';
import { Columns3, Moon, Sun, Compass } from 'lucide-react';

export default function Header({
  activeView,
  onChangeView,
  theme,
  onToggleTheme,
  onToggleRadar,
  onOpenWallet,
  onToggleSidebar,
  walletConnected
}) {
  return (
    <header className="h-[72px] px-[28px] flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)] transition-[var(--transition-smooth)] z-10">
      <div className="flex items-center gap-[16px]">
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
          <Columns3 size={18} />
        </button>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex bg-[var(--bg-primary)] p-[4px] rounded-[var(--radius-xl)] relative border border-[var(--border-color)]">
        <button 
          className={`px-[24px] py-[8px] font-[var(--font-display)] font-medium text-[14px] rounded-[var(--radius-lg)] transition-[var(--transition-fast)] z-10 ${
            activeView === 'chat-view' 
              ? 'text-[var(--text-primary)] bg-[var(--bg-secondary)] shadow-[var(--shadow-sm)]' 
              : 'text-[var(--text-secondary)]'
          }`} 
          onClick={() => onChangeView('chat-view')}
        >
          AI Chatbot
        </button>
        <button 
          className={`px-[24px] py-[8px] font-[var(--font-display)] font-medium text-[14px] rounded-[var(--radius-lg)] transition-[var(--transition-fast)] z-10 ${
            activeView === 'dashboard-view' 
              ? 'text-[var(--text-primary)] bg-[var(--bg-secondary)] shadow-[var(--shadow-sm)]' 
              : 'text-[var(--text-secondary)]'
          }`} 
          onClick={() => onChangeView('dashboard-view')}
        >
          Dashboard
        </button>
        <button 
          className={`px-[24px] py-[8px] font-[var(--font-display)] font-medium text-[14px] rounded-[var(--radius-lg)] transition-[var(--transition-fast)] z-10 ${
            activeView === 'help-view' 
              ? 'text-[var(--text-primary)] bg-[var(--bg-secondary)] shadow-[var(--shadow-sm)]' 
              : 'text-[var(--text-secondary)]'
          }`} 
          onClick={() => onChangeView('help-view')}
        >
          Help
        </button>
        <button 
          className={`px-[24px] py-[8px] font-[var(--font-display)] font-medium text-[14px] rounded-[var(--radius-lg)] transition-[var(--transition-fast)] z-10 ${
            activeView === 'labs-view' 
              ? 'text-[var(--text-primary)] bg-[var(--bg-secondary)] shadow-[var(--shadow-sm)]' 
              : 'text-[var(--text-secondary)]'
          }`} 
          onClick={() => onChangeView('labs-view')}
        >
          Labs
        </button>
      </nav>

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

        {/* Market Radar Button */}
        <button 
          className="flex items-center gap-[8px] px-[16px] py-[8px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] font-[var(--font-display)] font-medium text-[13px] text-[var(--text-secondary)] transition-[var(--transition-fast)] hover:bg-[var(--bg-secondary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]" 
          id="radar-toggle" 
          onClick={onToggleRadar}
        >
          <Compass size={16} />
          <span>Market Radar</span>
        </button>

        {/* Wallet / User Profile chip */}
        <div 
          className="flex items-center gap-[10px] pl-[8px] pr-[16px] py-[6px] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] text-[13px] font-semibold font-[var(--font-display)] transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:shadow-[0_0_10px_var(--accent-glow)] cursor-pointer" 
          id="wallet-dropdown-trigger" 
          onClick={onOpenWallet}
        >
          <div className="w-[26px] h-[26px] rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&h=120&auto=format&fit=crop"
              alt="User Wallet Avatar"
            />
          </div>
          <span className="wallet-address">
            {walletConnected ? 'X084575...1234' : 'Connect Wallet'}
          </span>
        </div>
      </div>
    </header>
  );
}
