import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './layouts/Header';
import Sidebar from './layouts/Sidebar';
import Footer from './layouts/Footer';
import WalletModal from './components/WalletModal';
import UserModal from './components/UserModal';
import MarketRadarDrawer from './features/radar/MarketRadarDrawer';
import { Info } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Core States
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('nutriai-theme');
    if (saved) return saved;
    const darkPref = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return darkPref ? 'dark' : 'light';
  });
  
  const [activeSidebarTab, setActiveSidebarTab] = useState('market-daily');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [walletConnected, setWalletConnected] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Modals & Drawers States
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [radarOpen, setRadarOpen] = useState(false);

  // Toast State
  const [toast, setToast] = useState({ message: '', visible: false });
  const toastTimeoutRef = useRef(null);

  // Live Crypto Tickers State
  const [cryptoTickers, setCryptoTickers] = useState([
    { sym: 'ETH', name: 'Ethereum', price: 3462.45, pct: 2.85, up: true },
    { sym: 'BTC', name: 'Bitcoin', price: 61840.00, pct: 1.15, up: true },
    { sym: 'SOL', name: 'Solana', price: 147.20, pct: -3.42, up: false },
    { sym: 'ARB', name: 'Arbitrum', price: 0.954, pct: 14.28, up: true },
    { sym: 'LINK', name: 'Chainlink', price: 13.82, pct: -0.45, up: false },
    { sym: 'UNI', name: 'Uniswap', price: 7.64, pct: 8.52, up: true }
  ]);

  // Dashboard Chart Data State
  const [dashboardChartData, setDashboardChartData] = useState([
    { day: 'Mon', value: 412000, display: '$412,000' },
    { day: 'Tue', value: 425000, display: '$425,000' },
    { day: 'Wed', value: 418000, display: '$418,000' },
    { day: 'Thu', value: 440000, display: '$440,000' },
    { day: 'Fri', value: 462000, display: '$462,000' },
    { day: 'Sat', value: 455000, display: '$455,000' },
    { day: 'Sun', value: 482910, display: '$482,910' }
  ]);

  // Labs Config State
  const [labsConfig, setLabsConfig] = useState({
    model: 'nutriai-v2',
    temperature: 0.2,
    simulate: true,
    slippage: true,
    mevGuard: true,
    arbitrageEnabled: false,
    voiceEnabled: false
  });

  // Sync Theme attribute on document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nutriai-theme', theme);
  }, [theme]);

  // Live price simulator loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCryptoTickers(prevTickers =>
        prevTickers.map(ticker => {
          const oldPrice = ticker.price;
          const pctDelta = (Math.random() - 0.49) * 0.01; // Small random changes
          const newPrice = oldPrice * (1 + pctDelta);
          const newPct = ticker.pct + (pctDelta * 100);
          return {
            ...ticker,
            price: newPrice,
            pct: newPct,
            up: newPrice >= oldPrice
          };
        })
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Global click listener to close modals when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const isWalletTrigger = e.target.closest('#wallet-dropdown-trigger');
      const isUserTrigger = e.target.closest('#user-menu-trigger');
      
      if (!isWalletTrigger && walletModalOpen) {
        setWalletModalOpen(false);
      }
      if (!isUserTrigger && userModalOpen) {
        setUserModalOpen(false);
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [walletModalOpen, userModalOpen]);

  // Toast Manager
  const showToast = (message) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, visible: true });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3200);
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sidebar item handler
  const handleSidebarTabChange = (tabId) => {
    setActiveSidebarTab(tabId);
    if (tabId === 'my-portfolio') {
      navigate('/dashboard');
    } else if (tabId === 'market-daily') {
      setRadarOpen(true);
    } else {
      const labels = {
        'my-monitor': 'My Monitor',
        'my-project': 'My Project'
      };
      showToast(`Loaded workspace section: ${labels[tabId] || tabId}`);
    }
  };

  // Simulated assistant response logic
  const handleSendMessage = (customText) => {
    const text = customText || chatInput;
    if (!text.trim()) return;

    if (!customText) {
      setChatInput('');
    }

    if (location.pathname !== '/chat') {
      navigate('/chat');
    }

    // Add user message
    setMessages(prev => [...prev, { text, sender: 'user' }]);
    setIsTyping(true);

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
        reply = `Welcome to the Nutri-Ai Help Center. Here are some quick things you can ask me to do:\n\n1. *\"Find arbitrage opportunities between Arbitrum and Base.\"*\n2. *\"What are the current lending rates on Aave?\"*\n3. *\"Help me optimize my staking portfolio.\"*\n\nFor detailed guides, please check the **Help** tab above.`;
      } else if (lowerText.includes('predict') || lowerText.includes('market')) {
        reply = `Based on historical volatility and liquid supply maps, here is our 7-day predictive framework:\n\n• **ETH (Ethereum)**: Short-term consolidation around $3,450, testing resistance at $3,600.\n• **SOL (Solana)**: Steady bullish volume indicator; support established at $145.\n• **USDC**: Liquid pools remain stable with average 7-day volume exceeding $4.2B.\n\n*Disclaimer: This prediction is formulated by beta models in the Labs panel and does not constitute financial advice.*`;
      } else {
        reply = `I've analyzed your prompt: *"${text}"*.\n\nAs your DeFi intelligence agent, I can research liquidity pools, check yield rates, structure multi-hop token routes, or review your wallet balances.\n\nCould you specify which protocol (e.g. **Uniswap**, **Aave**, **Lido**) or asset you would like to target?`;
      }

      setMessages(prev => [...prev, { text: reply, sender: 'assistant' }]);
    }, 1500);
  };

  // Start new chat session
  const handleNewChat = () => {
    setMessages([]);
    setChatInput('');
    setIsTyping(false);
    showToast('Started a new AI conversation thread.');
    navigate('/chat');
  };

  // Dashboard Randomizer
  const handleRefreshDashboard = () => {
    setDashboardChartData(prev =>
      prev.map(d => {
        const deltaPercent = (Math.random() - 0.45) * 0.1; // -4.5% to +5.5%
        const newValue = Math.round(d.value * (1 + deltaPercent));
        return {
          ...d,
          value: newValue,
          display: `$${newValue.toLocaleString()}`
        };
      })
    );
    showToast('Refreshed portfolio growth vectors.');
  };

  // Labs controls handler
  const handleLabsConfigChange = (key, value) => {
    setLabsConfig(prev => ({ ...prev, [key]: value }));

    const labels = {
      model: 'Active Core Model',
      temperature: 'Agent Creativity (Temperature)',
      simulate: 'Simulate Before Executing',
      slippage: 'Maximum Slippage Protection',
      mevGuard: 'MEV Sandwich Guard',
      arbitrageEnabled: 'Arbitrage Arbitrator',
      voiceEnabled: 'Voice Command Module'
    };

    if (key === 'model') {
      const modelNames = {
        'nutriai-v2': 'Nutri-Ai-Core-v2',
        'nutriai-flash': 'Nutri-Ai-Flash',
        'gpt-4o-defi': 'DeFi-GPT-4o-Specialist'
      };
      showToast(`Model updated to: ${modelNames[value] || value}`);
    } else if (key === 'temperature') {
      // Don't toast temperature slides to avoid clutter
    } else if (key === 'arbitrageEnabled') {
      showToast(value ? 'Arbitrage module initiated.' : 'Arbitrage module suspended.');
    } else if (key === 'voiceEnabled') {
      showToast(value ? 'Voice listener permissions requested.' : 'Voice listener disabled.');
    } else {
      showToast(`${labels[key] || key}: ${value ? 'ENABLED' : 'DISABLED'}`);
    }
  };

  // Market Radar Ticker click handler
  const handleTickerClick = (ticker) => {
    setRadarOpen(false);
    navigate('/chat');
    handleSendMessage(`Compare yield pools or liquidity rates for ${ticker.name} (${ticker.sym})`);
  };

  // Wallet disconnection toggle
  const handleDisconnectWallet = () => {
    setWalletConnected(prev => {
      const next = !prev;
      showToast(next ? 'Wallet linked successfully.' : 'Wallet connection terminated.');
      return next;
    });
    setWalletModalOpen(false);
  };

  const handleLogout = () => {
    showToast('Signing out profile jackmatrix89@gmail.com...');
    setUserModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen relative">
      {/* Top Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onToggleRadar={() => setRadarOpen(prev => !prev)}
        onOpenWallet={() => setWalletModalOpen(true)}
        onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
        walletConnected={walletConnected}
      />

      {/* App Body */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          collapsed={sidebarCollapsed}
          activeSidebarTab={activeSidebarTab}
          onChangeSidebarTab={handleSidebarTabChange}
          onNewChat={handleNewChat}
          onOpenUserSettings={() => setUserModalOpen(true)}
          onHistoryItemClick={handleSendMessage}
        />

        {/* Router Level Container */}
        <main className="flex-1 overflow-hidden relative">
          <Outlet context={{
            messages,
            isTyping,
            chatInput,
            setChatInput,
            handleSendMessage,
            handleBotClick: (botName) => showToast(`Loaded bot interface: ${botName}`),
            dashboardChartData,
            handleRefreshDashboard,
            labsConfig,
            handleLabsConfigChange
          }} />
        </main>
      </div>

      {/* Footer Layout component */}
      <Footer />

      {/* Drawers & Modals Overlay Layers */}
      <MarketRadarDrawer
        isOpen={radarOpen}
        onClose={() => setRadarOpen(false)}
        cryptoTickers={cryptoTickers}
        onTickerClick={handleTickerClick}
      />

      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        walletConnected={walletConnected}
        onDisconnectWallet={handleDisconnectWallet}
      />

      <UserModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        onLogout={handleLogout}
      />

      {/* Dynamic Toast Alert popup */}
      {toast.visible && (
        <div className="fixed bottom-[24px] right-[24px] bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] px-[20px] py-[12px] rounded-[var(--radius-sm)] shadow-[var(--shadow-lg)] z-[9999] text-[13px] font-semibold flex items-center gap-[8px] animate-[fade-in-up_0.3s_cubic-bezier(0.4,0,0.2,1)] font-[var(--font-display)]">
          <Info size={14} className="text-accent" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
