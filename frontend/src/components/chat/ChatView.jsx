import React, { useRef, useEffect } from 'react';
import { 
  Flame, LineChart, Network, Layers3, RefreshCw, Activity, 
  Plus, Cpu, Wand2, Copy, ArrowUp 
} from 'lucide-react';

// Custom GitHub SVG Icon to replace the missing brand icon in newer Lucide versions
const GithubIcon = ({ size = 14, ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function ChatView({
  isActive,
  messages,
  isTyping,
  chatInput,
  onChatInputChange,
  onSendMessage,
  onQuickChipClick,
  onBotClick
}) {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isActive) return null;

  // Simple React text formatter for markdown bold **text** and backticks `code`
  const renderFormattedText = (text) => {
    if (!text.includes('```')) {
      // Split by bold patterns **bold**
      const lines = text.split('\n');
      return lines.map((line, idx) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const elements = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
          }
          // handle inline code like `code`
          const subParts = part.split(/(`[^`]+`)/g);
          return subParts.map((subPart, sIdx) => {
            if (subPart.startsWith('`') && subPart.endsWith('`')) {
              return <code key={sIdx} className="font-mono bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.08)] px-[4px] py-[2px] rounded">{subPart.slice(1, -1)}</code>;
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
    }

    const parts = text.split('```');
    return parts.map((part, index) => {
      if (index % 2 === 1) { // Code block
        const codeLines = part.trim().split('\n');
        const lang = codeLines[0].match(/^[a-zA-Z0-9_-]+$/) ? codeLines.shift() : 'javascript';
        return (
          <pre key={index} className="bg-[var(--bg-primary)] p-[12px] rounded-[var(--radius-sm)] mt-[8px] font-mono overflow-x-auto border border-[var(--border-color)]">
            <code className={`language-${lang}`}>
              {codeLines.join('\n')}
            </code>
          </pre>
        );
      } else {
        return renderFormattedText(part);
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <section id="chat-view" className="absolute inset-0 opacity-100 visible translate-y-0 transition-[opacity,transform] duration-300 ease-out overflow-y-auto p-[32px]">
      <div className="max-w-[820px] mx-auto h-full flex flex-col gap-[24px] justify-between pb-[8px]">
        
        {/* Default Greeting Screen */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-[28px] text-center animate-[fade-in-up_0.6s_cubic-bezier(0.4,0,0.2,1)]" id="chat-greeting-screen">
            <div className="relative w-[120px] h-[120px]">
              <div className="absolute -inset-[10px] bg-[radial-gradient(circle,rgba(var(--accent-color-rgb),0.25)_0%,rgba(var(--accent-color-rgb),0)_70%)] rounded-full blur-[15px] animate-orb-pulse"></div>
              <div className="w-full h-full bg-[linear-gradient(135deg,rgba(var(--accent-color-rgb),0.15)_0%,rgba(var(--accent-color-rgb),0.03)_100%)] border border-[rgba(var(--accent-color-rgb),0.3)] rounded-full flex items-center justify-center shadow-[inset_0_0_20px_rgba(var(--accent-color-rgb),0.15)] shadow-[var(--shadow-glow)]">
                <div className="w-[48px] h-[48px] text-[var(--accent-color)] animate-[logo-spin_30s_linear_infinite]">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" />
                    <path d="M50 20v60M20 50h60" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M29 29l42 42M29 71l42-42" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  </svg>
                </div>
              </div>
            </div>
            <h1 className="font-[var(--font-display)] text-[34px] font-bold tracking-[-0.8px] max-w-[600px] leading-[1.25]">
              Hey, I'm <span className="text-[var(--accent-color)] bg-[linear-gradient(90deg,var(--accent-color),var(--accent-secondary))] bg-clip-text text-transparent font-bold">nutriai</span>. How can I help you today?
            </h1>
          </div>
        ) : (
          /* Chat Message Feed */
          <div className="flex-1 overflow-y-auto rounded-[var(--radius-md)] px-[8px] py-[16px] mb-[8px]" id="chat-feed" ref={scrollContainerRef}>
            <div className="flex flex-col gap-[20px]" id="chat-scroll-area">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`max-w-[85%] px-[20px] py-[16px] rounded-[var(--radius-md)] leading-[1.5] text-[14.5px] animate-[fade-in-up_0.4s_cubic-bezier(0.4,0,0.2,1)] ${
                    msg.sender === 'user' 
                      ? 'self-end bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-br-[4px] shadow-[var(--shadow-sm)]' 
                      : 'self-start bg-[rgba(var(--accent-color-rgb),0.04)] text-[var(--text-primary)] border border-[rgba(var(--accent-color-rgb),0.15)] rounded-bl-[4px] shadow-[0_4px_15px_rgba(var(--accent-color-rgb),0.02)]'
                  }`}
                >
                  {renderFormattedText(msg.text)}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-[4px] items-center px-[16px] py-[12px] rounded-[var(--radius-md)] bg-[rgba(var(--accent-color-rgb),0.04)] self-start w-fit" id="typing-indicator">
                  <div className="w-[6px] h-[6px] bg-[var(--accent-color)] rounded-full animate-dot-jump"></div>
                  <div className="w-[6px] h-[6px] bg-[var(--accent-color)] rounded-full animate-dot-jump" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-[6px] h-[6px] bg-[var(--accent-color)] rounded-full animate-dot-jump" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Middle Quick recommendations chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-[12px] w-full" id="chat-quick-chips">
          <button className="flex items-center gap-[10px] px-[18px] py-[14px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-sm)] text-[var(--text-secondary)] font-medium text-[13.5px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)] hover:bg-[rgba(var(--accent-color-rgb),0.02)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] cursor-pointer" onClick={() => onQuickChipClick("Find hot topics in DeFi today")}>
            <Flame size={15} />
            <span>Hot Topics</span>
          </button>
          <button className="flex items-center gap-[10px] px-[18px] py-[14px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-sm)] text-[var(--text-secondary)] font-medium text-[13.5px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)] hover:bg-[rgba(var(--accent-color-rgb),0.02)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] cursor-pointer" onClick={() => onQuickChipClick("Show me the 24h trading trends for major assets")}>
            <LineChart size={15} />
            <span>24h Trends</span>
          </button>
          <button className="flex items-center gap-[10px] px-[18px] py-[14px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-sm)] text-[var(--text-secondary)] font-medium text-[13.5px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)] hover:bg-[rgba(var(--accent-color-rgb),0.02)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] cursor-pointer" onClick={() => onQuickChipClick("Analyze top tokenized real-world assets (RWAs)")}>
            <Network size={15} />
            <span>Tokenized Assets</span>
          </button>
          <button className="flex items-center gap-[10px] px-[18px] py-[14px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-sm)] text-[var(--text-secondary)] font-medium text-[13.5px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)] hover:bg-[rgba(var(--accent-color-rgb),0.02)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] cursor-pointer" onClick={() => onQuickChipClick("Generate market direction predictions for next week")}>
            <Layers3 size={15} />
            <span>Prediction</span>
          </button>
          <button className="flex items-center gap-[10px] px-[18px] py-[14px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-sm)] text-[var(--text-secondary)] font-medium text-[13.5px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)] hover:bg-[rgba(var(--accent-color-rgb),0.02)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] cursor-pointer" onClick={() => onQuickChipClick("Suggest optimal swap paths to execute")}>
            <RefreshCw size={15} />
            <span>Execute</span>
          </button>
          <button className="flex items-center gap-[10px] px-[18px] py-[14px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-sm)] text-[var(--text-secondary)] font-medium text-[13.5px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)] hover:bg-[rgba(var(--accent-color-rgb),0.02)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] cursor-pointer" onClick={() => onQuickChipClick("Start monitoring whale wallets for changes")}>
            <Activity size={15} />
            <span>Monitor</span>
          </button>
        </div>

        {/* Prompt Input Textarea Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] px-[20px] py-[16px] shadow-[var(--shadow-md)] flex flex-col gap-[16px] transition-[var(--transition-fast)]">
          <div className="flex items-start gap-[16px]">
            <button className="w-[36px] h-[36px] rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] flex items-center justify-center transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:bg-[var(--bg-primary)] cursor-pointer" title="Add Assets or Files">
              <Plus size={16} />
            </button>
            <textarea
              className="flex-1 text-[14.5px] leading-[1.5] text-[var(--text-primary)] pt-[8px] resize-none max-h-[160px] bg-transparent outline-none"
              id="chat-input"
              rows={1}
              value={chatInput}
              onChange={(e) => onChatInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Research markets, analyze positions, execute strategies and more...."
              style={{ height: 'auto' }}
            />
          </div>
          <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-[12px]">
            <div className="flex items-center gap-[10px]">
              <button className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-[var(--radius-lg)] border border-[rgba(var(--accent-color-rgb),0.2)] bg-[rgba(var(--accent-color-rgb),0.05)] text-[var(--accent-color)] text-[11px] font-semibold uppercase tracking-[0.5px] transition-[var(--transition-fast)]">
                <Cpu size={14} />
                <span>Auto</span>
              </button>
              <button className="w-[30px] h-[30px] rounded-full text-[var(--text-secondary)] flex items-center justify-center transition-[var(--transition-fast)] hover:text-[var(--accent-color)] hover:bg-[var(--bg-primary)] cursor-pointer" title="Refine Prompt">
                <Wand2 size={14} />
              </button>
              <button className="w-[30px] h-[30px] rounded-full text-[var(--text-secondary)] flex items-center justify-center transition-[var(--transition-fast)] hover:text-[var(--accent-color)] hover:bg-[var(--bg-primary)] cursor-pointer" title="Paste Template">
                <Copy size={14} />
              </button>
            </div>
            <button className="flex items-center gap-[8px] px-[20px] py-[8px] bg-[var(--accent-color)] text-[var(--bg-secondary)] rounded-[var(--radius-sm)] font-[var(--font-display)] font-semibold text-[13.5px] shadow-[0_4px_12px_rgba(var(--accent-color-rgb),0.2)] transition-[var(--transition-fast)] hover:bg-[var(--text-primary)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.15)] cursor-pointer" id="send-msg-btn" onClick={onSendMessage}>
              <span>Send</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* Official Bots Section */}
        <div className="flex flex-col gap-[12px]">
          <h2 className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[var(--text-muted)] pl-[4px]">Official Bots</h2>
          <div className="flex items-center gap-[14px] overflow-x-auto py-[4px] scrollbar-none">
            <button className="transition-[var(--transition-fast)] hover:scale-110 cursor-pointer" title="Uniswap" onClick={() => onBotClick('uniswap')}>
              <span className="w-[44px] h-[44px] rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[20px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] uni-color">🦄</span>
            </button>
            <button className="transition-[var(--transition-fast)] hover:scale-110 cursor-pointer" title="ChatGPT" onClick={() => onBotClick('chatgpt')}>
              <span className="w-[44px] h-[44px] rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[20px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] openai-color">🧠</span>
            </button>
            <button className="transition-[var(--transition-fast)] hover:scale-110 cursor-pointer" title="Worldcoin" onClick={() => onBotClick('worldcoin')}>
              <span className="w-[44px] h-[44px] rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[20px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] world-color">🌐</span>
            </button>
            <button className="transition-[var(--transition-fast)] hover:scale-110 cursor-pointer" title="Farcaster" onClick={() => onBotClick('farcaster')}>
              <span className="w-[44px] h-[44px] rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[20px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] farcaster-color">🟣</span>
            </button>
            <button className="transition-[var(--transition-fast)] hover:scale-110 cursor-pointer" title="Google Gemini" onClick={() => onBotClick('gemini')}>
              <span className="w-[44px] h-[44px] rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[20px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] gemini-color">✨</span>
            </button>
            <button className="transition-[var(--transition-fast)] hover:scale-110 cursor-pointer" title="GitHub Agent" onClick={() => onBotClick('github')}>
              <span className="w-[44px] h-[44px] rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[20px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] github-color"><GithubIcon size={14} /></span>
            </button>
            <button className="transition-[var(--transition-fast)] hover:scale-110 cursor-pointer" title="MetaMask Wallet" onClick={() => onBotClick('metamask')}>
              <span className="w-[44px] h-[44px] rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[20px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] metamask-color">🦊</span>
            </button>
            <button className="transition-[var(--transition-fast)] hover:scale-110 cursor-pointer" title="Discord Bot" onClick={() => onBotClick('discord')}>
              <span className="w-[44px] h-[44px] rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[20px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] discord-color">💬</span>
            </button>
            <button className="transition-[var(--transition-fast)] hover:scale-110 cursor-pointer" title="Zcash" onClick={() => onBotClick('zcash')}>
              <span className="w-[44px] h-[44px] rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[20px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] zcash-color">Ⓩ</span>
            </button>
            <button className="transition-[var(--transition-fast)] hover:scale-110 cursor-pointer" title="Google Cloud" onClick={() => onBotClick('google')}>
              <span className="w-[44px] h-[44px] rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[20px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] google-color">G</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
