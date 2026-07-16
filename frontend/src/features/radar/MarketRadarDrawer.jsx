import React, { useState, useEffect, useRef } from 'react';
import { Compass, X } from 'lucide-react';

function TickerItem({ ticker, onClick }) {
  const [pulse, setPulse] = useState(null); // 'up' | 'down' | null
  const prevPriceRef = useRef(ticker.price);

  useEffect(() => {
    if (ticker.price > prevPriceRef.current) {
      setPulse('up');
      const timer = setTimeout(() => setPulse(null), 450);
      prevPriceRef.current = ticker.price;
      return () => clearTimeout(timer);
    } else if (ticker.price < prevPriceRef.current) {
      setPulse('down');
      const timer = setTimeout(() => setPulse(null), 450);
      prevPriceRef.current = ticker.price;
      return () => clearTimeout(timer);
    }
  }, [ticker.price]);

  const priceColor = pulse === 'up' ? '#10b981' : pulse === 'down' ? '#ef4444' : 'inherit';
  const priceText = ticker.price >= 100
    ? `$${ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${ticker.price.toFixed(3)}`;

  return (
    <div 
      className="flex justify-between items-center p-[16px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-sm)] transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-sm)] cursor-pointer" 
      onClick={() => onClick(ticker)}
    >
      <div className="flex flex-col gap-[4px]">
        <span className="font-[var(--font-display)] font-bold text-[14px] text-[var(--text-primary)]">{ticker.sym}</span>
        <span className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-[0.5px]">{ticker.name}</span>
      </div>
      <div className="flex flex-col items-end gap-[4px]">
        <span className="font-mono text-[14px] font-bold" style={{ color: priceColor, transition: 'color 0.2s' }}>
          {priceText}
        </span>
        <span className={`text-[11px] font-semibold ${ticker.up ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
          {ticker.up ? '+' : ''}{ticker.pct.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

export default function MarketRadarDrawer({ isOpen, onClose, cryptoTickers, onTickerClick }) {
  return (
    <>
      <div className={`fixed top-0 right-0 w-[380px] h-full bg-[var(--bg-sidebar)] border-l border-[var(--border-color)] px-[24px] py-[32px] z-[200] flex flex-col gap-[28px] overflow-y-auto transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} id="radar-drawer">
        <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-[16px]">
          <div className="flex items-center gap-[10px] font-[var(--font-display)] font-bold text-[16px] text-[var(--text-primary)]">
            <Compass className="text-accent spinner" size={18} />
            <span>Live Market Radar</span>
          </div>
          <button className="text-[var(--text-muted)] transition-[var(--transition-fast)] hover:text-[var(--text-primary)] cursor-pointer" id="radar-close" aria-label="Close Drawer" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="flex flex-col gap-[20px]">
          <p className="text-[13px] leading-[1.5] text-[var(--text-secondary)]">Real-time token trackers queried from multiple decentralized exchange pools.</p>

          <div className="flex flex-col gap-[12px]" id="radar-price-list">
            {cryptoTickers.map((ticker) => (
              <TickerItem 
                key={ticker.sym} 
                ticker={ticker} 
                onClick={onTickerClick} 
              />
            ))}
          </div>

          <div className="bg-[linear-gradient(135deg,rgba(var(--accent-color-rgb),0.08)_0%,rgba(var(--accent-secondary),0.08)_100%)] border border-[rgba(var(--accent-color-rgb),0.2)] rounded-[var(--radius-sm)] p-[18px] flex flex-col gap-[10px] mt-[10px]">
            <div className="text-[9px] font-bold text-[var(--accent-color)] tracking-[0.5px]">BREAKING NEWS</div>
            <h6 className="font-[var(--font-display)] text-[13px] font-bold">Optimism Network Upgrade Set for Next Thursday</h6>
            <p className="text-[11.5px] leading-[1.5] text-[var(--text-secondary)]">
              Layer-2 gas efficiency is expected to improve by 20% following the Canyon hard fork. Nutri-AI has adjusted transaction queues to defer bulk executions.
            </p>
            <span className="text-[10px] text-[var(--text-muted)]">5 mins ago</span>
          </div>
        </div>
      </div>

      {/* Drawer Overlay */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[180] transition-[opacity,visibility] duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} id="radar-overlay" onClick={onClose}></div>
    </>
  );
}
