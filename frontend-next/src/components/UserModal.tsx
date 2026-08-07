"use client";

import React from 'react';
import { X, Settings, Bell, Key, LogOut } from 'lucide-react';

export default function UserModal({ isOpen, onClose, onLogout, user = { name: "Muhammed Nafih", email: "mnafih@example.com", tier: "Premium Tier Account" } }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[16px]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/35 backdrop-blur-[3px] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className="relative bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] w-full max-w-[360px] z-[150] shadow-[var(--shadow-lg)] animate-[fade-in-up_0.2s_ease-out] font-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-[20px]">
          <h5 className="font-display text-[16px] font-bold text-[var(--text-primary)]">User Settings</h5>
          <button 
            className="text-[var(--text-muted)] transition-[var(--transition-fast)] hover:text-[var(--text-primary)] cursor-pointer" 
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-[16px] border-b border-[var(--border-color)] pb-[16px] mb-[16px]">
          <div className="w-[52px] h-[52px] rounded-full overflow-hidden border border-[var(--border-color)] bg-slate-200">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&h=120&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt="Avatar"
            />
          </div>
          <div>
            <h6 className="font-display text-[15px] font-bold text-[var(--text-primary)]">{user.name}</h6>
            <span className="text-[10px] text-[var(--accent-color)] font-bold uppercase tracking-wider bg-[rgba(16,185,129,0.06)] px-[8px] py-[3px] rounded-md">
              {user.tier}
            </span>
          </div>
        </div>

        {/* Settings Links */}
        <ul className="list-none flex flex-col gap-[6px] mb-[20px] p-0">
          <li className="flex items-center gap-[12px] px-[12px] py-[10px] rounded-[var(--radius-xs)] text-[13.5px] text-[var(--text-secondary)] transition-[var(--transition-fast)] cursor-pointer hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]">
            <Settings size={15} className="text-[var(--text-muted)]" /> 
            <span>Account Settings</span>
          </li>
          <li className="flex items-center gap-[12px] px-[12px] py-[10px] rounded-[var(--radius-xs)] text-[13.5px] text-[var(--text-secondary)] transition-[var(--transition-fast)] cursor-pointer hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]">
            <Bell size={15} className="text-[var(--text-muted)]" /> 
            <span>Alert Notifications</span>
          </li>
          <li className="flex items-center gap-[12px] px-[12px] py-[10px] rounded-[var(--radius-xs)] text-[13.5px] text-[var(--text-secondary)] transition-[var(--transition-fast)] cursor-pointer hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]">
            <Key size={15} className="text-[var(--text-muted)]" /> 
            <span>API Access Credentials</span>
          </li>
        </ul>

        {/* Action Button */}
        <div>
          <button 
            className="w-full inline-flex items-center justify-center gap-[8px] px-[20px] py-[11px] rounded-[var(--radius-sm)] font-display font-semibold text-[13.5px] border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-[var(--transition-fast)] hover:bg-[rgba(16,185,129,0.05)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] cursor-pointer" 
            onClick={onLogout}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
