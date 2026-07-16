import React from 'react';
import { X } from 'lucide-react';

export default function WalletModal({ isOpen, onClose, walletConnected, onDisconnectWallet }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] w-[360px] z-[150] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] opacity-100 pointer-events-auto shadow-[var(--shadow-lg)]" 
      id="wallet-modal" 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-[20px]">
        <h5 className="font-[var(--font-display)] text-[16px] font-bold">Connected Wallet</h5>
        <button 
          className="text-[var(--text-muted)] transition-[var(--transition-fast)] hover:text-[var(--text-primary)] cursor-pointer" 
          id="wallet-modal-close" 
          onClick={onClose}
        >
          <X size={16} />
        </button>
      </div>
      <div>
        <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-sm)] p-[16px] flex flex-col gap-[12px] mb-[20px]">
          <div className="flex justify-between text-[13px]">
            <span className="text-[var(--text-muted)]">Address</span>
            <span className="font-semibold font-mono">
              {walletConnected ? '0x084575...1234' : 'Not Connected'}
            </span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-[var(--text-muted)]">Network</span>
            <span className="font-semibold text-[var(--accent-color)]">Ethereum Mainnet</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-[var(--text-muted)]">Balance</span>
            <span className="font-semibold">{walletConnected ? '84.205 ETH' : '0 ETH'}</span>
          </div>
        </div>

        <div className="w-full">
          <button 
            className="w-full inline-flex items-center justify-center px-[20px] py-[10px] rounded-[var(--radius-sm)] font-[var(--font-display)] font-semibold text-[13.5px] border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.08)] text-[#ef4444] backdrop-blur-[8px] transition-[var(--transition-fast)] hover:bg-[#ef4444] hover:border-[#ef4444] hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] cursor-pointer" 
            id="btn-disconnect-wallet" 
            onClick={onDisconnectWallet}
          >
            {walletConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </div>
  );
}
