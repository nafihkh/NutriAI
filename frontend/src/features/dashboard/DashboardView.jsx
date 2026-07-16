import React, { useState, useRef } from 'react';
import { Download, RotateCw, Wallet, Percent, ShieldCheck, TrendingUp, ArrowDownLeft, RefreshCw } from 'lucide-react';

export default function DashboardView({ isActive, dashboardChartData, onRefreshDashboard }) {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, day: '', display: '' });
  const chartRef = useRef(null);

  if (!isActive) return null;

  const width = 600;
  const height = 240;
  const paddingX = 40;
  const paddingY = 40;

  const chartWidth = width - (paddingX * 2);
  const chartHeight = height - (paddingY * 2);

  // Find min and max value
  const values = dashboardChartData.map(d => d.value);
  const minVal = Math.min(...values) * 0.98; // Add breathing room
  const maxVal = Math.max(...values) * 1.02;

  const points = dashboardChartData.map((d, index) => {
    const x = paddingX + (index * (chartWidth / (dashboardChartData.length - 1)));
    const y = height - paddingY - (((d.value - minVal) / (maxVal - minVal)) * chartHeight);
    return { x, y, info: d };
  });

  // Build Line SVG path
  let linePath = '';
  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const cpX1 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY1 = points[i - 1].y;
      const cpX2 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY2 = points[i].y;
      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
    }
  }

  // Build Area SVG path
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  const handleMouseEnterNode = (point, e) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const tooltipX = (point.x / width) * rect.width - 60;
    const tooltipY = (point.y / height) * rect.height - 55;

    setTooltip({
      visible: true,
      x: tooltipX,
      y: tooltipY,
      day: point.info.day,
      display: point.info.display
    });
  };

  const handleMouseLeaveNode = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const latestSundayValue = dashboardChartData[dashboardChartData.length - 1]?.display || '$482,910';

  return (
    <section id="dashboard-view" className="absolute inset-0 opacity-100 visible translate-y-0 transition-[opacity,transform] duration-300 ease-out overflow-y-auto p-[32px]">
      <div className="max-w-[1120px] mx-auto flex flex-col gap-[32px]">
        <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-[24px]">
          <div>
            <h1 className="font-[var(--font-display)] font-bold text-[26px] tracking-[-0.5px] text-[var(--text-primary)] mb-[6px]">Nutri-Ai DeFi Dashboard</h1>
            <p className="text-[13.5px] text-[var(--text-secondary)]">Real-time asset tracking and portfolio analytics</p>
          </div>
          <div className="flex items-center gap-[12px]">
            <button className="inline-flex items-center justify-center px-[20px] py-[10px] rounded-[var(--radius-sm)] font-[var(--font-display)] font-semibold text-[13.5px] border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-[var(--transition-fast)] hover:bg-[var(--bg-sidebar)] hover:text-[var(--text-primary)] hover:border-[var(--accent-color)] cursor-pointer">
              <Download size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Export Data
            </button>
            <button className="inline-flex items-center justify-center px-[20px] py-[10px] rounded-[var(--radius-sm)] font-[var(--font-display)] font-semibold text-[13.5px] border border-[var(--accent-color)] bg-[var(--accent-color)] text-[var(--bg-secondary)] transition-[var(--transition-fast)] hover:bg-[var(--text-primary)] hover:border-[var(--text-primary)] hover:shadow-[0_4px_12px_var(--accent-glow)] cursor-pointer" id="refresh-dashboard" onClick={onRefreshDashboard}>
              <RotateCw size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Refresh Chart
            </button>
          </div>
        </div>

        {/* Info Stats Grid */}
        <div className="grid grid-cols-3 gap-[24px]">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] flex items-center gap-[20px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)]">
            <div className="w-[48px] h-[48px] rounded-[var(--radius-sm)] flex items-center justify-center bg-[rgba(0,202,141,0.08)] text-[var(--accent-color)]">
              <Wallet size={18} />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[var(--text-muted)] mb-[6px]">Total Value Locked (TVL)</span>
              <h3 className="font-[var(--font-display)] text-[22px] font-bold text-[var(--text-primary)] mb-[4px]">{latestSundayValue}</h3>
              <span className="text-[12px] font-medium inline-flex items-center gap-[4px] text-[#10b981]">
                <TrendingUp size={12} /> +14.2% this week
              </span>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] flex items-center gap-[20px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)]">
            <div className="w-[48px] h-[48px] rounded-[var(--radius-sm)] flex items-center justify-center bg-[rgba(0,171,239,0.08)] text-[var(--accent-secondary)]">
              <Percent size={18} />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[var(--text-muted)] mb-[6px]">Avg. APY Performance</span>
              <h3 className="font-[var(--font-display)] text-[22px] font-bold text-[var(--text-primary)] mb-[4px]">12.84%</h3>
              <span className="text-[12px] font-medium inline-flex items-center gap-[4px] text-[#10b981]">
                <TrendingUp size={12} /> +1.3% vs last month
              </span>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] flex items-center gap-[20px] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] hover:border-[var(--accent-color)] hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)]">
            <div className="w-[48px] h-[48px] rounded-[var(--radius-sm)] flex items-center justify-center bg-[rgba(168,85,247,0.08)] text-[#a855f7]">
              <ShieldCheck size={18} />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[var(--text-muted)] mb-[6px]">DeFi Health Score</span>
              <h3 className="font-[var(--font-display)] text-[22px] font-bold text-[var(--text-primary)] mb-[4px]">94/100</h3>
              <span className="self-start px-[8px] py-[2px] rounded-[var(--radius-xs)] text-[11px] font-semibold bg-[rgba(16,185,129,0.08)] text-[#10b981]">Optimal</span>
            </div>
          </div>
        </div>

        {/* Analytics and Charts Area */}
        <div className="grid grid-cols-[2fr_1fr] gap-[24px]">
          {/* Custom SVG Chart Card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col gap-[20px]">
            <div className="flex justify-between items-center">
              <h4 className="font-[var(--font-display)] text-[15px] font-bold text-[var(--text-primary)]">Portfolio Balance History</h4>
              <div className="flex bg-[var(--bg-primary)] p-[3px] rounded-[var(--radius-sm)] border border-[var(--border-color)]">
                <button className="px-[12px] py-[4px] text-[11px] font-semibold rounded-[var(--radius-xs)] text-[var(--text-primary)] bg-[var(--bg-secondary)] shadow-[var(--shadow-sm)] transition-[var(--transition-fast)] cursor-pointer">1W</button>
                <button className="px-[12px] py-[4px] text-[11px] font-semibold rounded-[var(--radius-xs)] text-[var(--text-secondary)] transition-[var(--transition-fast)] cursor-pointer hover:text-[var(--text-primary)]">1M</button>
                <button className="px-[12px] py-[4px] text-[11px] font-semibold rounded-[var(--radius-xs)] text-[var(--text-secondary)] transition-[var(--transition-fast)] cursor-pointer hover:text-[var(--text-primary)]">1Y</button>
              </div>
            </div>
            <div className="relative h-[240px] w-full">
              <svg 
                id="portfolio-chart" 
                className="w-full h-full"
                viewBox="0 0 600 240" 
                preserveAspectRatio="none"
                ref={chartRef}
              >
                <defs>
                  <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-color)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--accent-color)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="var(--border-color)" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1="90" x2="600" y2="90" stroke="var(--border-color)" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="var(--border-color)" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1="190" x2="600" y2="190" stroke="var(--border-color)" strokeDasharray="4 4" strokeWidth="1" />

                {/* Area Path */}
                {areaPath && <path id="chart-area" d={areaPath} fill="url(#chart-glow)"></path>}
                {/* Line Path */}
                {linePath && <path id="chart-line" d={linePath} fill="none" stroke="var(--accent-color)" strokeWidth={3}></path>}

                {/* Interactive Nodes */}
                {points.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={tooltip.visible && tooltip.day === point.info.day ? 8 : 5}
                    fill="var(--accent-color)"
                    stroke="var(--bg-secondary)"
                    strokeWidth={2}
                    className="chart-node"
                    style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                    onMouseEnter={(e) => handleMouseEnterNode(point, e)}
                    onMouseLeave={handleMouseLeaveNode}
                  />
                ))}
              </svg>
              <div 
                className="chart-tooltip" 
                id="chart-tooltip" 
                style={{ 
                  opacity: tooltip.visible ? 1 : 0, 
                  left: `${tooltip.x}px`, 
                  top: `${tooltip.y}px`,
                  transition: 'opacity 0.15s, left 0.15s, top 0.15s',
                  pointerEvents: 'none'
                }}
              >
                <strong>{tooltip.day}</strong>Portfolio Value: {tooltip.display}
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-[var(--text-muted)] font-semibold px-[10px]">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* Distribution & Allocations */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col gap-[20px]">
            <h4 className="font-[var(--font-display)] text-[15px] font-bold text-[var(--text-primary)]">Asset Distribution</h4>
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center gap-[16px]">
                <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center font-bold text-[14px] text-white bg-[#627eea]">Ξ</div>
                <div className="flex-1 flex flex-col gap-[6px]">
                  <div className="flex justify-between items-center text-[12.5px] font-semibold">
                    <span className="text-[var(--text-primary)]">Ethereum (ETH)</span>
                    <span className="text-[var(--text-secondary)]">45%</span>
                  </div>
                  <div className="h-[6px] bg-[var(--bg-primary)] rounded-[3px] overflow-hidden">
                    <div className="h-full rounded-[3px]" style={{ width: '45%', backgroundColor: '#627eea' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-[16px]">
                <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center font-bold text-[14px] text-white bg-[#2775ca]">$</div>
                <div className="flex-1 flex flex-col gap-[6px]">
                  <div className="flex justify-between items-center text-[12.5px] font-semibold">
                    <span className="text-[var(--text-primary)]">USD Coin (USDC)</span>
                    <span className="text-[var(--text-secondary)]">30%</span>
                  </div>
                  <div className="h-[6px] bg-[var(--bg-primary)] rounded-[3px] overflow-hidden">
                    <div className="h-full rounded-[3px]" style={{ width: '30%', backgroundColor: '#2775ca' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-[16px]">
                <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center font-bold text-[14px] text-white bg-[#f7931a]">₿</div>
                <div className="flex-1 flex flex-col gap-[6px]">
                  <div className="flex justify-between items-center text-[12.5px] font-semibold">
                    <span className="text-[var(--text-primary)]">Wrapped BTC (WBTC)</span>
                    <span className="text-[var(--text-secondary)]">15%</span>
                  </div>
                  <div className="h-[6px] bg-[var(--bg-primary)] rounded-[3px] overflow-hidden">
                    <div className="h-full rounded-[3px]" style={{ width: '15%', backgroundColor: '#f7931a' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-[16px]">
                <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center font-bold text-[14px] text-black bg-[#14f195]">◎</div>
                <div className="flex-1 flex flex-col gap-[6px]">
                  <div className="flex justify-between items-center text-[12.5px] font-semibold">
                    <span className="text-[var(--text-primary)]">Solana (SOL)</span>
                    <span className="text-[var(--text-secondary)]">10%</span>
                  </div>
                  <div className="h-[6px] bg-[var(--bg-primary)] rounded-[3px] overflow-hidden">
                    <div className="h-full rounded-[3px]" style={{ width: '10%', backgroundColor: '#14f195' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Panel */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)]">
          <h4 className="font-[var(--font-display)] text-[15px] font-bold text-[var(--text-primary)] mb-[16px]">Recent Agent Execution Log</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr>
                  <th className="px-[16px] py-[12px] font-semibold text-[var(--text-muted)] border-b border-[var(--border-color)] uppercase text-[10px] tracking-[1px]">Action / Strategy</th>
                  <th className="px-[16px] py-[12px] font-semibold text-[var(--text-muted)] border-b border-[var(--border-color)] uppercase text-[10px] tracking-[1px]">Protocol</th>
                  <th className="px-[16px] py-[12px] font-semibold text-[var(--text-muted)] border-b border-[var(--border-color)] uppercase text-[10px] tracking-[1px]">Amount</th>
                  <th className="px-[16px] py-[12px] font-semibold text-[var(--text-muted)] border-b border-[var(--border-color)] uppercase text-[10px] tracking-[1px]">Transaction ID</th>
                  <th className="px-[16px] py-[12px] font-semibold text-[var(--text-muted)] border-b border-[var(--border-color)] uppercase text-[10px] tracking-[1px]">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-[16px] py-[16px] border-b border-[var(--border-color)] text-[var(--text-primary)]">
                    <div className="flex items-center gap-[12px]">
                      <RefreshCw size={14} className="text-accent" style={{ marginRight: '8px' }} />
                      <div>
                        <strong className="font-semibold block">Liquidity Provision swap</strong>
                        <small className="text-[11px] text-[var(--text-muted)] mt-[2px]" style={{ display: 'block' }}>Auto-rebalanced portfolio allocation</small>
                      </div>
                    </div>
                  </td>
                  <td className="px-[16px] py-[16px] border-b border-[var(--border-color)] text-[var(--text-primary)]">Uniswap V3</td>
                  <td className="px-[16px] py-[16px] border-b border-[var(--border-color)] text-[var(--text-primary)]">12.5 ETH ($43,200)</td>
                  <td className="px-[16px] py-[16px] border-b border-[var(--border-color)] text-[var(--text-primary)] font-mono text-muted">0x5fa8...e19a</td>
                  <td className="px-[16px] py-[16px] border-b border-[var(--border-color)] text-[var(--text-primary)]"><span className="px-[10px] py-[4px] rounded-[var(--radius-xs)] text-[11px] font-semibold bg-[rgba(16,185,129,0.08)] text-[#10b981]">Executed</span></td>
                </tr>
                <tr>
                  <td className="px-[16px] py-[16px] border-b border-[var(--border-color)] text-[var(--text-primary)]">
                    <div className="flex items-center gap-[12px]">
                      <ArrowDownLeft size={14} className="text-yield" style={{ marginRight: '8px' }} />
                      <div>
                        <strong className="font-semibold block">Stake Yield Optimization</strong>
                        <small className="text-[11px] text-[var(--text-muted)] mt-[2px]" style={{ display: 'block' }}>Compounded monthly Aave interest</small>
                      </div>
                    </div>
                  </td>
                  <td className="px-[16px] py-[16px] border-b border-[var(--border-color)] text-[var(--text-primary)]">Aave V3</td>
                  <td className="px-[16px] py-[16px] border-b border-[var(--border-color)] text-[var(--text-primary)]">5,200 USDC</td>
                  <td className="px-[16px] py-[16px] border-b border-[var(--border-color)] text-[var(--text-primary)] font-mono text-muted">0x91d3...f82e</td>
                  <td className="px-[16px] py-[16px] border-b border-[var(--border-color)] text-[var(--text-primary)]"><span className="px-[10px] py-[4px] rounded-[var(--radius-xs)] text-[11px] font-semibold bg-[rgba(16,185,129,0.08)] text-[#10b981]">Executed</span></td>
                </tr>
                <tr>
                  <td className="px-[16px] py-[16px] border-b border-[var(--border-color)] text-[var(--text-primary)]">
                    <div className="flex items-center gap-[12px]">
                      <ShieldCheck size={14} className="text-safety" style={{ marginRight: '8px' }} />
                      <div>
                        <strong className="font-semibold block">Risk Threshold Adjustment</strong>
                        <small className="text-[11px] text-[var(--text-muted)] mt-[2px]" style={{ display: 'block' }}>Adjusted LTV ratio from 75% to 68%</small>
                      </div>
                    </div>
                  </td>
                  <td className="px-[16px] py-[16px] border-b border-[var(--border-color)] text-[var(--text-primary)]">MakerDAO</td>
                  <td className="px-[16px] py-[16px] border-b border-[var(--border-color)] text-[var(--text-primary)]">--</td>
                  <td className="px-[16px] py-[16px] border-b border-[var(--border-color)] text-[var(--text-primary)] font-mono text-muted">0xc32a...ba81</td>
                  <td className="px-[16px] py-[16px] border-b border-[var(--border-color)] text-[var(--text-primary)]"><span className="px-[10px] py-[4px] rounded-[var(--radius-xs)] text-[11px] font-semibold bg-[rgba(16,185,129,0.08)] text-[#10b981]">Executed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
