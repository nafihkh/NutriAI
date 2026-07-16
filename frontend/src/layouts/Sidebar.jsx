import React from 'react';
import { SquarePen, Award, Star, Monitor, FileText, MessageSquare, ChevronDown } from 'lucide-react';

export default function Sidebar({
  collapsed,
  activeSidebarTab,
  onChangeSidebarTab,
  onNewChat,
  onOpenUserSettings,
  onHistoryItemClick
}) {
  return (
    <aside className={`w-[280px] bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] px-[16px] py-[24px] flex flex-col gap-[28px] relative overflow-y-auto z-[5] transition-[var(--transition-smooth)] ${collapsed ? 'translate-x-[-100%] w-0 p-0 border-r-0 pointer-events-none' : 'translate-x-0'}`} id="sidebar">
      {/* New Chat Button */}
      <button 
        className="flex items-center justify-center gap-[10px] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-[var(--font-display)] font-semibold text-[15px] p-[14px] rounded-[var(--radius-md)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)]" 
        id="new-chat-btn" 
        onClick={onNewChat}
      >
        <SquarePen size={18} />
        <span>New Chat</span>
      </button>

      {/* Sidebar Navigation Menu */}
      <div className="flex flex-col gap-[12px]">
        <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[var(--text-muted)] pl-[8px]">Menu</span>
        <ul className="list-none flex flex-col gap-[6px]">
          <li
            className={`flex items-center gap-[12px] px-[14px] py-[10px] rounded-[var(--radius-sm)] transition-[var(--transition-fast)] cursor-pointer ${
              activeSidebarTab === 'market-daily' 
                ? 'text-[var(--text-primary)] bg-[var(--bg-secondary)] font-semibold shadow-[var(--shadow-sm)] border-l-[3px] border-l-[var(--accent-color)]' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(var(--accent-color-rgb),0.05)]'
            }`}
            onClick={() => onChangeSidebarTab('market-daily')}
          >
            <Award size={16} />
            <span>Market Daily</span>
          </li>
          <li
            className={`flex items-center gap-[12px] px-[14px] py-[10px] rounded-[var(--radius-sm)] transition-[var(--transition-fast)] cursor-pointer ${
              activeSidebarTab === 'my-portfolio' 
                ? 'text-[var(--text-primary)] bg-[var(--bg-secondary)] font-semibold shadow-[var(--shadow-sm)] border-l-[3px] border-l-[var(--accent-color)]' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(var(--accent-color-rgb),0.05)]'
            }`}
            onClick={() => onChangeSidebarTab('my-portfolio')}
          >
            <Star size={16} />
            <span>My Portfolio</span>
          </li>
          <li
            className={`flex items-center gap-[12px] px-[14px] py-[10px] rounded-[var(--radius-sm)] transition-[var(--transition-fast)] cursor-pointer ${
              activeSidebarTab === 'my-monitor' 
                ? 'text-[var(--text-primary)] bg-[var(--bg-secondary)] font-semibold shadow-[var(--shadow-sm)] border-l-[3px] border-l-[var(--accent-color)]' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(var(--accent-color-rgb),0.05)]'
            }`}
            onClick={() => onChangeSidebarTab('my-monitor')}
          >
            <Monitor size={16} />
            <span>My Monitor</span>
          </li>
          <li
            className={`flex items-center gap-[12px] px-[14px] py-[10px] rounded-[var(--radius-sm)] transition-[var(--transition-fast)] cursor-pointer ${
              activeSidebarTab === 'my-project' 
                ? 'text-[var(--text-primary)] bg-[var(--bg-secondary)] font-semibold shadow-[var(--shadow-sm)] border-l-[3px] border-l-[var(--accent-color)]' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(var(--accent-color-rgb),0.05)]'
            }`}
            onClick={() => onChangeSidebarTab('my-project')}
          >
            <FileText size={16} />
            <span>My Project</span>
          </li>
        </ul>
      </div>

      {/* Chat History List */}
      <div className="flex flex-col gap-[12px] flex-1">
        <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[var(--text-muted)] pl-[8px]">Yesterday</span>
        <ul className="list-none flex flex-col gap-[6px]">
          <li
            className="flex items-center gap-[10px] px-[12px] py-[8px] rounded-[var(--radius-sm)] text-[var(--text-secondary)] text-[13px] transition-[var(--transition-fast)] cursor-pointer hover:text-[var(--accent-color)] hover:bg-[rgba(var(--accent-color-rgb),0.04)]"
            onClick={() => onHistoryItemClick("Which blockchain project offers the best yields?")}
          >
            <MessageSquare size={14} className="text-[var(--text-muted)] flex-shrink-0" />
            <span className="truncate">Which blockchain project off....</span>
          </li>
          <li
            className="flex items-center gap-[10px] px-[12px] py-[8px] rounded-[var(--radius-sm)] text-[var(--text-secondary)] text-[13px] transition-[var(--transition-fast)] cursor-pointer hover:text-[var(--accent-color)] hover:bg-[rgba(var(--accent-color-rgb),0.04)]"
            onClick={() => onHistoryItemClick("What's Crypto Trading Plan for next week?")}
          >
            <MessageSquare size={14} className="text-[var(--text-muted)] flex-shrink-0" />
            <span className="truncate">What's Crypto Trading Plant......</span>
          </li>
        </ul>
      </div>

      {/* Bottom User Card */}
      <div className="mt-auto border-t border-[var(--border-color)] pt-[16px] relative z-10" onClick={onOpenUserSettings}>
        <div className="flex items-center gap-[12px] p-[12px] rounded-[var(--radius-md)] bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] cursor-pointer hover:border-[var(--accent-color)] hover:shadow-[var(--shadow-md)]" id="user-menu-trigger">
          <div className="w-[36px] h-[36px] rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&h=120&auto=format&fit=crop"
              alt="Jack Matrix Profile"
            />
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">Jack Matrix</span>
            <span className="text-[11px] text-[var(--text-muted)] truncate">jackmatrix89@gmail.com</span>
          </div>
          <ChevronDown className="w-[16px] h-[16px] text-[var(--text-muted)]" size={16} />
        </div>
      </div>

      {/* Interactive Glow Background inside Sidebar */}
      <div className="absolute bottom-[-50px] left-[-50px] w-[180px] h-[180px] rounded-full filter blur-[25px] pointer-events-none z-[1] bg-[radial-gradient(circle,rgba(var(--accent-color-rgb),0.3)_0%,rgba(var(--accent-color-rgb),0.05)_50%,rgba(var(--accent-color-rgb),0)_70%)]"></div>
    </aside>
  );
}
