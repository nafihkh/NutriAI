"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Menu, ChevronDown, Moon, Sun, Globe } from 'lucide-react';

export default function Header({
  sidebarCollapsed,
  onToggleSidebar,
  theme,
  onToggleTheme,
  onOpenUserSettings,
  streak = 24
}) {
  const pathname = usePathname();

  const navigationTabs = [
    { name: 'Dashboard', path: '/' },
    { name: 'AI Chatbot', path: '/chat' },
    { name: 'Nutritions', path: '/nutrition' },
    { name: 'Profile', path: '/profile' }
  ];

  return (
    <header className="h-[72px] px-[24px] flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)] transition-[var(--transition-smooth)] z-30 w-full">
      {/* Left side: Brand Logo + Menu Toggle */}
      <div className="flex items-center gap-[16px]">
        <Link href="/" className="flex items-center gap-[10px] cursor-pointer">
          <div className="w-[32px] h-[32px] overflow-hidden flex items-center justify-center bg-transparent">
            <img src="/logo.png" alt="Sorin-AI Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-bold text-[18px] tracking-tight bg-[linear-gradient(135deg,#10b981_0%,#05b6d4_100%)] bg-clip-text text-transparent">
            Nutri-AI
          </span>
        </Link>
        <button
          onClick={onToggleSidebar}
          className="p-[6px] hover:bg-[rgba(16,185,129,0.06)] hover:text-[var(--accent-color)] text-[var(--text-secondary)] rounded-lg transition-[var(--transition-fast)] cursor-pointer flex items-center justify-center"
          title="Toggle Sidebar"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Middle side: Navigation Pills */}
      <div className="hidden md:flex items-center gap-[6px] bg-[var(--bg-primary)] p-[4px] rounded-[14px] border border-[var(--border-color)]">
        {navigationTabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <Link
              key={tab.name}
              href={tab.path}
              className={`px-[16px] py-[8px] rounded-[10px] font-display font-semibold text-[13.5px] transition-[var(--transition-fast)] cursor-pointer ${
                isActive
                  ? 'bg-[var(--bg-secondary)] text-[var(--accent-color)] shadow-[var(--shadow-sm)] border border-[rgba(16,185,129,0.12)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(16,185,129,0.02)]'
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Right side: Streak, Theme toggle and User dropdown */}
      <div className="flex items-center gap-[16px]">
        {/* Streak Counter */}
        <div className="flex items-center gap-[8px] px-[12px] py-[6px] rounded-[var(--radius-sm)] bg-[rgba(249,115,22,0.06)] border border-[rgba(249,115,22,0.12)] text-[#f97316] font-display font-semibold text-[13.5px]">
          <Flame size={16} className="fill-current animate-pulse text-[#f97316]" />
          <span className="hidden xs:inline">{streak} Day Streak</span>
          <span className="inline xs:hidden">{streak}</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="w-[36px] h-[36px] rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Profile Card */}
        <div
          onClick={onOpenUserSettings}
          className="flex items-center gap-[8px] pl-[8px] pr-[12px] py-[4px] rounded-full hover:bg-[var(--bg-primary)] border border-transparent hover:border-[var(--border-color)] transition-[var(--transition-fast)] cursor-pointer"
        >
          <div className="w-[32px] h-[32px] rounded-full overflow-hidden border border-[var(--border-color)] bg-slate-200">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&h=120&auto=format&fit=crop"
              alt="Muhammed Nafih"
            />
          </div>
          <span className="hidden sm:inline font-display font-semibold text-[13.5px] text-[var(--text-primary)]">
            Muhammed Nafih
          </span>
          <ChevronDown size={14} className="text-[var(--text-muted)]" />
        </div>
      </div>
    </header>
  );
}
