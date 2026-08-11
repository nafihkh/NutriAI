"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Flame, LineChart, Network, Layers3, RefreshCw, Activity, 
  Plus, Cpu, Wand2, Copy, ArrowUp, Sparkles, MessageSquare, Globe
} from 'lucide-react';
import { useMainLayout } from '@/components/MainLayout';

// Custom SVG Icons for bot list
const GithubIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="inline-block align-middle">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const OpenAiIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className="inline-block align-middle">
    <path d="M21.74 11.23c.12-.66.04-1.35-.22-1.96a3.67 3.67 0 0 0-1.57-1.74c-.06-.03-.13-.07-.2-.1v-.13c0-.68-.21-1.34-.6-1.92a3.73 3.73 0 0 0-1.63-1.42c-.07-.03-.14-.05-.22-.08v-.26c0-.98-.53-1.89-1.38-2.38a3.66 3.66 0 0 0-3.92-.12c-.06.04-.13.08-.2.12H12c-.68 0-1.34.21-1.92.6a3.73 3.73 0 0 0-1.42 1.63c-.03.07-.05.14-.08.22h-.26c-.98 0-1.89.53-2.38 1.38a3.66 3.66 0 0 0-.12 3.92c.04.06.08.13.12.2v.06c-.68 0-1.34.21-1.92.6a3.73 3.73 0 0 0-1.42 1.63c-.03.07-.05.14-.08.22H2.26c-.98 0-1.89.53-2.38 1.38a3.66 3.66 0 0 0-.12 3.92c.04.06.08.13.12.2V12c0 .68.21 1.34.6 1.92a3.73 3.73 0 0 0 1.63 1.42c.07.03.14.05.22.08v.26c0 .98.53 1.89 1.38 2.38a3.66 3.66 0 0 0 3.92.12c.06-.04.13-.08.2-.12h.06c.68 0 1.34-.21 1.92-.6a3.73 3.73 0 0 0 1.42-1.63c.03-.07.05-.14.08-.22h.26c.98 0 1.89-.53 2.38-1.38a3.66 3.66 0 0 0 .12-3.92c-.04-.06-.08-.13-.12-.2v-.06c.68 0 1.34-.21 1.92-.6a3.73 3.73 0 0 0 1.42-1.63c.03-.07.05-.14.08-.22h.26c.98 0 1.89-.53 2.38-1.38a3.66 3.66 0 0 0 .12-3.92c-.04-.06-.08-.13-.12-.2v-.06z" />
  </svg>
);

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useMainLayout() || { showToast: () => {} };
  
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef(null);

  // Load query from URL if present
  useEffect(() => {
    const query = searchParams.get('q');
    const isNew = searchParams.get('new');

    if (isNew === 'true') {
      setMessages([]);
      setChatInput('');
      router.replace('/chat');
      return;
    }

    if (query) {
      handleSendMessage(decodeURIComponent(query));
      router.replace('/chat');
    }
  }, [searchParams]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (customText?: string) => {
    const text = customText || chatInput;
    if (!text.trim()) return;

    if (!customText) {
      setChatInput('');
    }

    // Add user message
    setMessages(prev => [...prev, { text, sender: 'user' }]);
    setIsTyping(true);

    // AI Response simulation
    setTimeout(() => {
      setIsTyping(false);
      const lowerText = text.toLowerCase();
      let reply = '';

      if (lowerText.includes('hot topics') || lowerText.includes('trends')) {
        reply = `Here are the trending protocols and assets in DeFi today:\n\n• **Uniswap V4 Hook Deployments**: Layer-2 deployment rates have jumped 34% this week.\n• **Aave V3 GHO Collateral Expansion**: Over $120M in TVL has shifted to GHO lending pools.\n• **Lido Simple DVT Module**: Distributed Validator Technology rollout has lowered slashing risks on staking.\n\nWould you like to examine swap rates or stake yields for any of these platforms?`;
      } else if (lowerText.includes('portfolio') || lowerText.includes('balance') || lowerText.includes('dashboard')) {
        reply = `I have loaded your wallet metrics. Your total portfolio value stands at **$482,910.45**, reflecting a **+14.2%** increase over the last 7 days.\n\nYour asset distribution is:\n• **Ethereum (ETH)**: 45% ($217,309)\n• **USD Coin (USDC)**: 30% ($144,873)\n• **Wrapped BTC (WBTC)**: 15% ($72,436)\n• **Solana (SOL)**: 10% ($48,291)\n\nYou can explore full historical growth charts directly on the **Dashboard** tab!`;
      } else if (lowerText.includes('execute') || lowerText.includes('swap') || lowerText.includes('trade')) {
        reply = `I've mapped the optimal path for a potential token swap. By routing through Uniswap V3 and CoW Protocol, you'll minimize slippage:\n\n\`\`\`solidity\n// Optimized Trade Path Details\naddress router = 0xE592427A0AEce92De3Edee1F18E0157C05861564; // UniV3 Router\nuint24 poolFee = 3000; // 0.3% Pool Fee\nuint256 slippageLimit = 50; // Max 0.5% Slippage\n\`\`\`\n\nTo execute this, link your MetaMask wallet using the card in the upper-right corner and authorise the signature inside the browser pop-up.`;
      } else if (lowerText.includes('help') || lowerText.includes('docs')) {
        reply = `Welcome to the Help Center. Here are some quick things you can ask me to do:\n\n1. *\"Find arbitrage opportunities between Arbitrum and Base.\"*\n2. *\"What are the current lending rates on Aave?\"*\n3. *\"Help me optimize my staking portfolio.\"*\n\nFor detailed guides, please check the **Help** tab above.`;
      } else if (lowerText.includes('predict') || lowerText.includes('market')) {
        reply = `Based on historical volatility and liquid supply maps, here is our 7-day predictive framework:\n\n• **ETH (Ethereum)**: Short-term consolidation around $3,450, testing resistance at $3,600.\n• **SOL (Solana)**: Steady bullish volume indicator; support established at $145.\n• **USDC**: Liquid pools remain stable with average 7-day volume exceeding $4.2B.\n\n*Disclaimer: This prediction is formulated by beta models in the Labs panel and does not constitute financial advice.*`;
      } else {
        reply = `I've analyzed your prompt: *"${text}"*.\n\nAs your DeFi intelligence agent, I can research liquidity pools, check yield rates, structure multi-hop token routes, or review your wallet balances.\n\nCould you specify which protocol (e.g. **Uniswap**, **Aave**, **Lido**) or asset you would like to target?`;
      }

      setMessages(prev => [...prev, { text: reply, sender: 'assistant' }]);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick chips definitions matching the mockup image exactly
  const quickChips = [
    { label: 'Hot Topics', icon: Flame, text: 'Find hot topics in DeFi today' },
    { label: '24h Trends', icon: LineChart, text: 'Show me the 24h trading trends for major assets' },
    { label: 'Tokenized Assets', icon: Network, text: 'Analyze top tokenized real-world assets (RWAs)' },
    { label: 'Prediction', icon: Layers3, text: 'Generate market direction predictions for next week' },
    { label: 'Excute', icon: RefreshCw, text: 'Suggest optimal swap paths to execute' },
    { label: 'Monitor', icon: Activity, text: 'Start monitoring whale wallets for changes' }
  ];

  // Helper to render markdown-like text formatting
  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const elements = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="text-[var(--text-primary)] font-extrabold">{part.slice(2, -2)}</strong>;
        }
        // Inline code highlight
        const subParts = part.split(/(`[^`]+`)/g);
        return subParts.map((subPart, sIdx) => {
          if (subPart.startsWith('`') && subPart.endsWith('`')) {
            return <code key={sIdx} className="font-mono bg-[rgba(16,185,129,0.06)] text-[var(--accent-color)] px-[5px] py-[2px] rounded text-[13px]">{subPart.slice(1, -1)}</code>;
          }
          return subPart;
        });
      });

      return (
        <React.Fragment key={idx}>
          {elements}
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-128px)] justify-between max-w-[940px] mx-auto gap-[24px] px-[8px] py-[4px]">
      
      {/* Messages Feed */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-[28px] text-center px-[20px] animate-[fade-in-up_0.4s_ease-out]">
          
          {/* Logo Orb */}
          <div className="relative w-[110px] h-[110px]">
            <div className="absolute -inset-[10px] bg-[radial-gradient(circle,rgba(16,185,129,0.22)_0%,rgba(16,185,129,0)_70%)] rounded-full blur-[12px] animate-orb-pulse"></div>
            <div className="w-full h-full bg-[linear-gradient(135deg,rgba(16,185,129,0.12)_0%,rgba(6,186,212,0.02)_100%)] border border-[rgba(16,185,129,0.25)] rounded-full flex items-center justify-center shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
              <div className="w-[56px] h-[56px] overflow-hidden flex items-center justify-center bg-transparent">
                <img src="/logo.png" alt="Sorin-AI Logo" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          <h2 className="font-display text-[30px] md:text-[34px] font-extrabold tracking-tight text-[var(--text-primary)]">
            Hey, I'm <span className="text-[var(--accent-color)] font-extrabold">sorin</span>. How can I help you today?
          </h2>
        </div>
      ) : (
        <div 
          className="flex-1 overflow-y-auto px-[12px] py-[16px] flex flex-col gap-[20px] scrollbar-none"
          ref={scrollContainerRef}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[85%] px-[18px] py-[14px] rounded-[var(--radius-md)] leading-[1.6] text-[14.2px] border ${
                msg.sender === 'user'
                  ? 'self-end bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] rounded-br-xs shadow-[var(--shadow-sm)]'
                  : 'self-start bg-[rgba(16,185,129,0.03)] border-[rgba(16,185,129,0.1)] text-[var(--text-secondary)] rounded-bl-xs'
              }`}
            >
              {renderFormattedText(msg.text)}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-[4px] items-center px-[16px] py-[12px] rounded-[var(--radius-md)] bg-[rgba(16,185,129,0.03)] self-start w-fit border border-[rgba(16,185,129,0.06)]">
              <div className="w-[6px] h-[6px] bg-[var(--accent-color)] rounded-full animate-dot-jump"></div>
              <div className="w-[6px] h-[6px] bg-[var(--accent-color)] rounded-full animate-dot-jump" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-[6px] h-[6px] bg-[var(--accent-color)] rounded-full animate-dot-jump" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
        </div>
      )}

      {/* Quick Recommendation Chips */}
      <div className="flex flex-wrap items-center justify-center gap-[10px]" id="chat-quick-chips">
        {quickChips.map((chip) => {
          const Icon = chip.icon;
          return (
            <button
              key={chip.label}
              onClick={() => handleSendMessage(chip.text)}
              className="flex items-center gap-[8px] px-[16px] py-[10px] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full text-[var(--text-secondary)] font-semibold text-[13px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)] hover:bg-[rgba(16,185,129,0.01)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] cursor-pointer"
            >
              <Icon size={14} className="text-[var(--text-muted)]" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Prompt Input Box Container */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[16px] shadow-[var(--shadow-md)] flex flex-col gap-[12px]">
        <div className="flex items-start gap-[12px]">
          <button 
            onClick={() => showToast('Attachment options coming soon!')}
            className="w-[32px] h-[32px] rounded-full border border-[var(--border-color)] text-[var(--text-muted)] flex items-center justify-center hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:bg-[var(--bg-primary)] transition-[var(--transition-fast)] cursor-pointer flex-shrink-0"
            title="Attach options"
          >
            <Plus size={16} />
          </button>
          <textarea
            className="flex-1 text-[14.5px] leading-[1.5] text-[var(--text-primary)] pt-[4px] resize-none max-h-[120px] bg-transparent outline-none border-none placeholder-[var(--text-muted)]"
            rows={1}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Research markets, analyze positions, execute strategies and more...."
          />
        </div>
        
        {/* Bottom Sub-Bar inside Card */}
        <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-[10px]">
          <div className="flex items-center gap-[6px]">
            <button className="flex items-center gap-[5px] px-[12px] py-[6px] rounded-[10px] border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] text-[12px] font-semibold">
              <Cpu size={13} className="text-[var(--text-muted)]" />
              <span>Auto</span>
            </button>
            <button 
              onClick={() => showToast('Refining prompt...')}
              className="w-[30px] h-[30px] rounded-full text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--bg-primary)] flex items-center justify-center transition-[var(--transition-fast)] cursor-pointer"
              title="Refine question"
            >
              <Wand2 size={14} />
            </button>
            <button 
              onClick={() => showToast('Paste templates')}
              className="w-[30px] h-[30px] rounded-full text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--bg-primary)] flex items-center justify-center transition-[var(--transition-fast)] cursor-pointer"
              title="Copy details"
            >
              <Copy size={14} />
            </button>
          </div>
          
          <button
            onClick={() => handleSendMessage()}
            className="flex items-center gap-[6px] px-[18px] py-[8px] bg-[var(--accent-color)] hover:bg-[var(--text-primary)] text-white rounded-lg font-display font-semibold text-[13px] shadow-[0_4px_10px_rgba(16,185,129,0.15)] transition-[var(--transition-fast)] cursor-pointer"
          >
            <span>Send</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>

      {/* Official Bots Bottom Panel */}
      <div className="flex flex-col items-center gap-[12px] mt-[4px]">
        <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[var(--text-muted)]">Official Bots</span>
        <div className="flex items-center justify-center gap-[12px] flex-wrap">
          {/* Unicorn */}
          <button onClick={() => showToast('Uniswap Bot activated')} className="w-[40px] h-[40px] rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] flex items-center justify-center text-[18px] shadow-sm hover:scale-105 transition-all cursor-pointer">🦄</button>
          {/* OpenAI */}
          <button onClick={() => showToast('ChatGPT Bot activated')} className="w-[40px] h-[40px] rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] flex items-center justify-center text-[16px] text-emerald-600 shadow-sm hover:scale-105 transition-all cursor-pointer">
            <OpenAiIcon size={18} />
          </button>
          {/* Worldcoin */}
          <button onClick={() => showToast('Worldcoin Bot activated')} className="w-[40px] h-[40px] rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] flex items-center justify-center text-[18px] shadow-sm hover:scale-105 transition-all cursor-pointer">🌐</button>
          {/* Farcaster */}
          <button onClick={() => showToast('Farcaster Bot activated')} className="w-[40px] h-[40px] rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] flex items-center justify-center text-[18px] shadow-sm hover:scale-105 transition-all cursor-pointer">🟣</button>
          {/* Gemini */}
          <button onClick={() => showToast('Gemini Bot activated')} className="w-[40px] h-[40px] rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] flex items-center justify-center text-[18px] text-indigo-500 shadow-sm hover:scale-105 transition-all cursor-pointer">✨</button>
          {/* Github */}
          <button onClick={() => showToast('GitHub Bot activated')} className="w-[40px] h-[40px] rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] flex items-center justify-center text-[15px] shadow-sm hover:scale-105 transition-all cursor-pointer">
            <GithubIcon size={16} />
          </button>
          {/* MetaMask */}
          <button onClick={() => showToast('MetaMask Wallet Bot activated')} className="w-[40px] h-[40px] rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] flex items-center justify-center text-[18px] shadow-sm hover:scale-105 transition-all cursor-pointer">🦊</button>
          {/* Discord */}
          <button onClick={() => showToast('Discord Bot activated')} className="w-[40px] h-[40px] rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] flex items-center justify-center text-[18px] text-blue-500 shadow-sm hover:scale-105 transition-all cursor-pointer">💬</button>
          {/* Zcash */}
          <button onClick={() => showToast('Zcash Bot activated')} className="w-[40px] h-[40px] rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] flex items-center justify-center text-[18px] text-yellow-600 font-bold shadow-sm hover:scale-105 transition-all cursor-pointer">Ⓩ</button>
          {/* Google */}
          <button onClick={() => showToast('Google Search Bot activated')} className="w-[40px] h-[40px] rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] flex items-center justify-center text-[18px] text-blue-500 font-bold shadow-sm hover:scale-105 transition-all cursor-pointer">G</button>
        </div>
      </div>

    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><span className="text-[14px] text-[var(--text-muted)]">Loading Chatbot...</span></div>}>
      <ChatContent />
    </Suspense>
  );
}
