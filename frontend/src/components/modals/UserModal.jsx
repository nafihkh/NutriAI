import React from 'react';
import { X, Settings, Bell, Key } from 'lucide-react';

export default function UserModal({ isOpen, onClose, onLogout }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] w-[360px] z-[150] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] opacity-100 pointer-events-auto shadow-[var(--shadow-lg)]" 
      id="user-modal" 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-[20px]">
        <h5 className="font-[var(--font-display)] text-[16px] font-bold">User Settings</h5>
        <button 
          className="text-[var(--text-muted)] transition-[var(--transition-fast)] hover:text-[var(--text-primary)] cursor-pointer" 
          id="user-modal-close" 
          onClick={onClose}
        >
          <X size={16} />
        </button>
      </div>
      <div>
        <div className="flex items-center gap-[16px] border-b border-[var(--border-color)] pb-[16px] mb-[16px]">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&h=120&auto=format&fit=crop"
            className="w-[52px] h-[52px] rounded-full object-cover"
            alt="Avatar"
          />
          <div>
            <h6 className="font-[var(--font-display)] text-[15px] font-bold">Jack Matrix</h6>
            <span className="text-[11px] text-[var(--accent-color)] font-bold">PRO Tier Account</span>
          </div>
        </div>
        <ul className="list-none flex flex-col gap-[6px] mb-[20px]">
          <li className="flex items-center gap-[12px] px-[12px] py-[10px] rounded-[var(--radius-xs)] text-[13px] text-[var(--text-secondary)] transition-[var(--transition-fast)] cursor-pointer hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]">
            <Settings size={14} className="text-[var(--text-muted)]" /> Account Settings
          </li>
          <li className="flex items-center gap-[12px] px-[12px] py-[10px] rounded-[var(--radius-xs)] text-[13px] text-[var(--text-secondary)] transition-[var(--transition-fast)] cursor-pointer hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]">
            <Bell size={14} className="text-[var(--text-muted)]" /> Alert Notifications
          </li>
          <li className="flex items-center gap-[12px] px-[12px] py-[10px] rounded-[var(--radius-xs)] text-[13px] text-[var(--text-secondary)] transition-[var(--transition-fast)] cursor-pointer hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]">
            <Key size={14} className="text-[var(--text-muted)]" /> API Access Credentials
          </li>
        </ul>
        <div>
          <button 
            className="w-full inline-flex items-center justify-center px-[20px] py-[10px] rounded-[var(--radius-sm)] font-[var(--font-display)] font-semibold text-[13.5px] border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-[var(--transition-fast)] hover:bg-[var(--bg-sidebar)] hover:text-[var(--text-primary)] hover:border-[var(--accent-color)] cursor-pointer" 
            id="btn-logout" 
            onClick={onLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
