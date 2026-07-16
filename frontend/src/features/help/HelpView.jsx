import React, { useState } from 'react';
import { Search, BookOpen, Bot, Wallet, Coins, Plus } from 'lucide-react';

const FAQ_DATA = [
  {
    id: 1,
    question: "What is Nutri-AI and how does it execute strategies?",
    answer: "Nutri-AI is an AI-powered DeFi agent that operates directly through natural language. Once you ask Nutri-Ai to perform a task (e.g., \"Swap 1 ETH to USDC and stake the yield\"), Nutri-Ai utilizes specialized tools (called \"Official Bots\") to query liquid paths, check security values, structure transactions, and execute them securely with your authorization.",
    tags: ["agent", "defi"]
  },
  {
    id: 2,
    question: "Is Nutri-AI non-custodial? Can it steal my funds?",
    answer: "Yes, Nutri-AI is completely non-custodial. It formulates and schedules transactions, but you maintain full ownership of your private keys. Every single state modification, wallet interaction, or token swap requires your direct signature confirmation inside your connected browser wallet (like MetaMask or Rabby).",
    tags: ["wallet", "security"]
  },
  {
    id: 3,
    question: "How do I link an external bot like Uniswap or MetaMask?",
    answer: "Click on the wallet chip in the upper-right corner to initiate a connection. For integrating official protocols, select any bot from the \"Official Bots\" panel on the home view and choose \"Link Bot\". You'll be prompted to allow the agent read-only queries or write integrations.",
    tags: ["agent", "wallet"]
  },
  {
    id: 4,
    question: "How are swap slippage and gas fees minimized?",
    answer: "Nutri-AI integrates multi-hop routing engines (like 1inch, Uniswap V3, and CoW Protocol) to find the absolute lowest slippage. In addition, Nutri-Ai tracks gas prices and offers an \"Auto-Execute\" parameter under Labs to defer transaction submissions until gas fees drop below a pre-set threshold.",
    tags: ["defi"]
  }
];

export default function HelpView({ isActive }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaqId, setOpenFaqId] = useState(null);

  if (!isActive) return null;

  const handleToggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const filteredFaqs = FAQ_DATA.filter(faq => {
    // Tag filter
    const matchesCategory = activeCategory === 'all' || faq.tags.includes(activeCategory);
    
    // Search query filter
    const lowerQuery = searchQuery.toLowerCase().trim();
    const matchesQuery = !lowerQuery || 
      faq.question.toLowerCase().includes(lowerQuery) || 
      faq.answer.toLowerCase().includes(lowerQuery);

    return matchesCategory && matchesQuery;
  });

  return (
    <section id="help-view" className="absolute inset-0 opacity-100 visible translate-y-0 transition-[opacity,transform] duration-300 ease-out overflow-y-auto p-[32px]">
      <div className="max-w-[720px] mx-auto flex flex-col gap-[32px]">
        <div className="flex flex-col items-center gap-[16px] text-center border-b border-[var(--border-color)] pb-[32px]">
          <h1 className="font-[var(--font-display)] font-bold text-[26px] tracking-[-0.5px] text-[var(--text-primary)] mb-[6px]">How can we help you?</h1>
          <p className="text-[13.5px] text-[var(--text-secondary)]">Search documentation, watch tutorials, or talk to support agents</p>

          {/* Help Search */}
          <div className="relative w-full max-w-[480px] mt-[8px]">
            <Search size={18} className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              id="faq-search" 
              className="w-full pl-[48px] pr-[20px] py-[14px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-sm)] text-[14px] text-[var(--text-primary)] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] focus:border-[var(--accent-color)] focus:shadow-[0_0_10px_var(--accent-glow)] outline-none"
              placeholder="Search guides, strategies, errors, and bot commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
          <div 
            className={`flex flex-col items-center gap-[10px] p-[16px] border rounded-[var(--radius-sm)] font-[var(--font-display)] font-semibold text-[13px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] cursor-pointer ${
              activeCategory === 'all' 
                ? 'bg-[rgba(var(--accent-color-rgb),0.04)] border-[var(--accent-color)] text-[var(--accent-color)] shadow-[0_4px_15px_rgba(var(--accent-color-rgb),0.05)]' 
                : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]'
            }`} 
            onClick={() => setActiveCategory('all')}
          >
            <BookOpen size={16} />
            <span>All Guides</span>
          </div>
          <div 
            className={`flex flex-col items-center gap-[10px] p-[16px] border rounded-[var(--radius-sm)] font-[var(--font-display)] font-semibold text-[13px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] cursor-pointer ${
              activeCategory === 'agent' 
                ? 'bg-[rgba(var(--accent-color-rgb),0.04)] border-[var(--accent-color)] text-[var(--accent-color)] shadow-[0_4px_15px_rgba(var(--accent-color-rgb),0.05)]' 
                : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]'
            }`} 
            onClick={() => setActiveCategory('agent')}
          >
            <Bot size={16} />
            <span>Agent Commands</span>
          </div>
          <div 
            className={`flex flex-col items-center gap-[10px] p-[16px] border rounded-[var(--radius-sm)] font-[var(--font-display)] font-semibold text-[13px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] cursor-pointer ${
              activeCategory === 'wallet' 
                ? 'bg-[rgba(var(--accent-color-rgb),0.04)] border-[var(--accent-color)] text-[var(--accent-color)] shadow-[0_4px_15px_rgba(var(--accent-color-rgb),0.05)]' 
                : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]'
            }`} 
            onClick={() => setActiveCategory('wallet')}
          >
            <Wallet size={16} />
            <span>Wallet & Security</span>
          </div>
          <div 
            className={`flex flex-col items-center gap-[10px] p-[16px] border rounded-[var(--radius-sm)] font-[var(--font-display)] font-semibold text-[13px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] cursor-pointer ${
              activeCategory === 'defi' 
                ? 'bg-[rgba(var(--accent-color-rgb),0.04)] border-[var(--accent-color)] text-[var(--accent-color)] shadow-[0_4px_15px_rgba(var(--accent-color-rgb),0.05)]' 
                : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]'
            }`} 
            onClick={() => setActiveCategory('defi')}
          >
            <Coins size={16} />
            <span>DeFi & Swaps</span>
          </div>
        </div>

        {/* FAQ Accordions */}
        <div className="flex flex-col gap-[20px]">
          <h3 className="font-[var(--font-display)] text-[16px] font-bold text-[var(--text-primary)] mb-[4px]">Frequently Asked Questions</h3>

          <div className="flex flex-col gap-[12px]" id="faq-list">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className={`border rounded-[var(--radius-sm)] overflow-hidden transition-[var(--transition-fast)] ${
                    isOpen 
                      ? 'bg-[var(--bg-card)] border-[var(--accent-color)] shadow-[var(--shadow-sm)]' 
                      : 'bg-[var(--bg-card)] border-[var(--border-color)]'
                  }`}
                >
                  <button className="w-full px-[24px] py-[18px] flex justify-between items-center font-[var(--font-display)] font-semibold text-[14px] text-[var(--text-primary)] text-left transition-[var(--transition-fast)] hover:text-[var(--accent-color)] cursor-pointer" onClick={() => handleToggleFaq(faq.id)}>
                    <span>{faq.question}</span>
                    <Plus size={16} className="faq-icon text-[var(--text-muted)]" style={{ 
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }} />
                  </button>
                  <div 
                    className={`overflow-hidden px-[24px] ${isOpen ? 'pb-[20px]' : ''}`} 
                    style={{ 
                      maxHeight: isOpen ? '200px' : '0px',
                      transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <p className="text-[13.5px] leading-[1.6] text-[var(--text-secondary)]">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
            {filteredFaqs.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '20px' }}>
                No guides found matching "{searchQuery}" in this category.
              </p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
