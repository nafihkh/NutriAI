"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Leaf, SquarePen, MessageSquare, Apple, User, ChevronDown, History } from 'lucide-react';

export default function Sidebar({
  collapsed,
  onOpenUserSettings,
  onHistoryItemClick,
  onNewChat
}) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', icon: Leaf, path: '/' },
    { name: 'AI Chatbot', icon: MessageSquare, path: '/chat' },
    { name: 'Nutritions', icon: Apple, path: '/nutrition' },
    { name: 'Profile', icon: User, path: '/profile' }
  ];

  const handleRecentsClick = (text) => {
    if (onHistoryItemClick) {
      onHistoryItemClick(text);
    } else {
      router.push(`/chat?q=${encodeURIComponent(text)}`);
    }
  };

  return (
    <aside
      className={`bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] py-[24px] flex flex-col gap-[24px] relative z-[20] transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px] px-[12px]' : 'w-[280px] px-[16px]'
      }`}
      id="sidebar"
    >
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className={`flex items-center justify-center bg-[var(--bg-secondary)] hover:bg-[var(--bg-input)] text-[var(--text-primary)] font-display font-semibold text-[14px] py-[12px] rounded-[var(--radius-sm)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:-translate-y-[1px] cursor-pointer ${
          collapsed ? 'w-[48px] h-[48px] p-0 mx-auto' : 'w-full px-[16px]'
        }`}
        id="new-chat-btn"
        title="New Chat"
      >
        <SquarePen size={18} className="text-[var(--accent-color)] flex-shrink-0" />
        {!collapsed && <span>New Chat</span>}
      </button>

      {/* Navigation Menu */}
      <div className="flex flex-col gap-[8px]">
        {!collapsed && (
          <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[var(--text-muted)] pl-[8px]">
            Menu
          </span>
        )}
        <nav className="flex flex-col gap-[4px]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center rounded-[var(--radius-sm)] font-display font-medium text-[14.5px] transition-[var(--transition-fast)] cursor-pointer ${
                  collapsed ? 'justify-center w-[48px] h-[48px] p-0 mx-auto' : 'gap-[12px] px-[16px] py-[11px] w-full'
                } ${
                  isActive
                    ? 'bg-[rgba(16,185,129,0.08)] text-[var(--accent-color)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:bg-[rgba(16,185,129,0.03)] hover:text-[var(--text-primary)]'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-[var(--accent-color)]' : 'text-[var(--text-muted)]'}`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Chat History List */}
      {!collapsed && (
        <div className="flex flex-col gap-[8px] flex-1 min-h-[120px]">
          <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[var(--text-muted)] pl-[8px]">
            Yesterday
          </span>
          <ul className="list-none flex flex-col gap-[4px] overflow-y-auto max-h-[180px] scrollbar-none">
            <li
              className="flex items-center justify-between gap-[8px] px-[12px] py-[8px] rounded-[var(--radius-xs)] text-[var(--text-secondary)] text-[13px] transition-[var(--transition-fast)] cursor-pointer hover:text-[var(--accent-color)] hover:bg-[rgba(16,185,129,0.04)] group"
              onClick={() => handleRecentsClick("High protein breakfast ideas")}
            >
              <div className="flex items-center gap-[8px] truncate">
                <History size={14} className="text-[var(--text-muted)] flex-shrink-0" />
                <span className="truncate">High protein breakfast ideas</span>
              </div>
              <span className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-[var(--transition-fast)] text-[10px]">→</span>
            </li>
            <li
              className="flex items-center justify-between gap-[8px] px-[12px] py-[8px] rounded-[var(--radius-xs)] text-[var(--text-secondary)] text-[13px] transition-[var(--transition-fast)] cursor-pointer hover:text-[var(--accent-color)] hover:bg-[rgba(16,185,129,0.04)] group"
              onClick={() => handleRecentsClick("How much water should I drink daily?")}
            >
              <div className="flex items-center gap-[8px] truncate">
                <History size={14} className="text-[var(--text-muted)] flex-shrink-0" />
                <span className="truncate">How much water should I drink...</span>
              </div>
              <span className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-[var(--transition-fast)] text-[10px]">→</span>
            </li>
          </ul>
        </div>
      )}

      {/* Bottom User Card */}
      <div
        className={`mt-auto border-t border-[var(--border-color)] pt-[16px] z-10 ${collapsed ? 'w-full' : ''}`}
        onClick={onOpenUserSettings}
      >
        <div
          className={`flex items-center rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] cursor-pointer hover:border-[var(--accent-color)] hover:shadow-[var(--shadow-md)] ${
            collapsed ? 'justify-center w-[48px] h-[48px] p-0 mx-auto' : 'gap-[12px] p-[10px] w-full'
          }`}
          id="user-menu-trigger"
          title={collapsed ? "Muhammed Nafih Settings" : undefined}
        >
          <div className="w-[32px] h-[32px] rounded-full overflow-hidden border border-[var(--border-color)] bg-slate-200 flex-shrink-0">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&h=120&auto=format&fit=crop"
              alt="Muhammed Nafih Profile"
            />
          </div>
          {!collapsed && (
            <>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-[13px] font-semibold text-[var(--text-primary)] leading-tight">
                  Muhammed Nafih
                </span>
                <span className="text-[10px] text-[var(--text-muted)] truncate leading-tight mt-[1px]">
                  mnafih@example.com
                </span>
              </div>
              <ChevronDown className="w-[14px] h-[14px] text-[var(--text-muted)] flex-shrink-0" />
            </>
          )}
        </div>
      </div>

      {/* Interactive Glow Background inside Sidebar */}
      <div className="absolute bottom-[-50px] left-[-50px] w-[180px] h-[180px] rounded-full filter blur-[25px] pointer-events-none z-[-1] bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,rgba(16,185,129,0.02)_50%,rgba(16,185,129,0)_70%)]"></div>
    </aside>
  );
}
