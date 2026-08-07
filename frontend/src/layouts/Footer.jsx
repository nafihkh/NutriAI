import React from 'react';

export default function Footer() {
  return (
    <footer className="flex items-center justify-between px-[32px] py-[12px] border-t border-[var(--border-color)] bg-[var(--bg-secondary)] text-[11px] text-[var(--text-muted)] font-[var(--font-display)] h-[40px] shrink-0 z-[4] transition-[var(--transition-smooth)]">
      <div>
        &copy; {new Date().getFullYear()} Nutri-AI. All rights reserved.
      </div>
      <div className="flex items-center gap-[6px]">
        <span className="w-[6px] h-[6px] bg-[var(--accent-color)] rounded-full inline-block shadow-[0_0_8px_var(--accent-color)]"></span>
        <span>AI Engine v2.0 - Active Strategy Optimizer</span>
      </div>
    </footer>
  );
}
