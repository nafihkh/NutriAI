import React from 'react';
import { BrainCircuit, ShieldAlert, FlaskConical } from 'lucide-react';

export default function LabsView({ isActive, labsConfig, onChangeLabsConfig }) {
  if (!isActive) return null;

  const handleCheckboxChange = (key, e) => {
    onChangeLabsConfig(key, e.target.checked);
  };

  const handleInputChange = (key, value) => {
    onChangeLabsConfig(key, value);
  };

  return (
    <section id="labs-view" className="absolute inset-0 opacity-100 visible translate-y-0 transition-[opacity,transform] duration-300 ease-out overflow-y-auto p-[32px]">
      <div className="max-w-[1040px] mx-auto flex flex-col gap-[32px]">
        <div className="border-b border-[var(--border-color)] pb-[24px]">
          <h1 className="font-[var(--font-display)] font-bold text-[26px] tracking-[-0.5px] text-[var(--text-primary)] mb-[6px]">Labs & Experiments</h1>
          <p className="text-[13.5px] text-[var(--text-secondary)]">Enable beta algorithms, modify cognitive models, and adjust security thresholds</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          {/* Cognitive Model Selector */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col gap-[20px]">
            <div className="flex items-center gap-[10px] font-[var(--font-display)] font-bold text-[15px] text-[var(--text-primary)] border-b border-[var(--border-color)] pb-[12px]">
              <BrainCircuit size={18} />
              <span>Cognitive Models</span>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.5px]">Active Core Model</label>
              <select 
                className="w-full px-[16px] py-[12px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-sm)] text-[13.5px] text-[var(--text-primary)] transition-[var(--transition-fast)] focus:border-[var(--accent-color)] outline-none" 
                id="model-select"
                value={labsConfig.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
              >
                <option value="nutriai-v2">Nutri-Ai-Core-v2 (Recommended - High Reasoning)</option>
                <option value="nutriai-flash">Nutri-Ai-Flash (Ultra Fast - Lower Gas Calculations)</option>
                <option value="gpt-4o-defi">DeFi-GPT-4o-Specialist (Advanced Contract Reading)</option>
              </select>
            </div>

            <div className="flex flex-col gap-[8px]">
              <div className="flex justify-between items-center">
                <label className="text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.5px]">Agent Creativity (Temperature)</label>
                <span className="text-[14px] font-bold text-[var(--accent-color)]" id="temp-val">{labsConfig.temperature}</span>
              </div>
              <input 
                type="range" 
                className="w-full h-[6px] bg-[var(--bg-primary)] rounded-[3px] outline-none cursor-pointer accent-[var(--accent-color)]" 
                id="temp-range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={labsConfig.temperature}
                onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
              />
              <span className="text-[11.5px] text-[var(--text-muted)] leading-[1.4]">
                Lower values produce strict, deterministic financial responses. Higher values propose creative yield strategies.
              </span>
            </div>
          </div>

          {/* Automated Execution Guards */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col gap-[20px]">
            <div className="flex items-center gap-[10px] font-[var(--font-display)] font-bold text-[15px] text-[var(--text-primary)] border-b border-[var(--border-color)] pb-[12px]">
              <ShieldAlert size={18} />
              <span>Execution Risk Controls</span>
            </div>

            <div className="flex justify-between items-center gap-[16px]">
              <div className="flex flex-col gap-[4px]">
                <span className="text-[13.5px] font-semibold text-[var(--text-primary)]">Simulate Before Executing</span>
                <span className="text-[11.5px] text-[var(--text-muted)] leading-[1.4]">Dry-run transactions on a local fork to check reverts and gas exhaustion.</span>
              </div>
              <label className="relative inline-block w-[44px] h-[24px] shrink-0 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  id="fork-simulate-toggle" 
                  checked={labsConfig.simulate}
                  onChange={(e) => handleCheckboxChange('simulate', e)}
                />
                <span className="absolute inset-0 bg-[var(--border-color)] rounded-full transition-colors duration-300 peer-checked:bg-[var(--accent-color)] after:content-[''] after:absolute after:h-[18px] after:w-[18px] after:left-[3px] after:bottom-[3px] after:bg-white after:rounded-full after:transition-transform after:duration-300 peer-checked:after:translate-x-[20px]"></span>
              </label>
            </div>

            <div className="flex justify-between items-center gap-[16px]">
              <div className="flex flex-col gap-[4px]">
                <span className="text-[13.5px] font-semibold text-[var(--text-primary)]">Maximum Slippage Protection</span>
                <span className="text-[11.5px] text-[var(--text-muted)] leading-[1.4]">Instantly reject transactions if swap rates slip beyond 0.5%.</span>
              </div>
              <label className="relative inline-block w-[44px] h-[24px] shrink-0 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  id="slippage-toggle" 
                  checked={labsConfig.slippage}
                  onChange={(e) => handleCheckboxChange('slippage', e)}
                />
                <span className="absolute inset-0 bg-[var(--border-color)] rounded-full transition-colors duration-300 peer-checked:bg-[var(--accent-color)] after:content-[''] after:absolute after:h-[18px] after:w-[18px] after:left-[3px] after:bottom-[3px] after:bg-white after:rounded-full after:transition-transform after:duration-300 peer-checked:after:translate-x-[20px]"></span>
              </label>
            </div>

            <div className="flex justify-between items-center gap-[16px]">
              <div className="flex flex-col gap-[4px]">
                <span className="text-[13.5px] font-semibold text-[var(--text-primary)]">MEV Sandwich Guard</span>
                <span className="text-[11.5px] text-[var(--text-muted)] leading-[1.4]">Submit transactions via private RPC nodes (Flashbots) to block frontrunning bots.</span>
              </div>
              <label className="relative inline-block w-[44px] h-[24px] shrink-0 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  id="mev-guard-toggle" 
                  checked={labsConfig.mevGuard}
                  onChange={(e) => handleCheckboxChange('mevGuard', e)}
                />
                <span className="absolute inset-0 bg-[var(--border-color)] rounded-full transition-colors duration-300 peer-checked:bg-[var(--accent-color)] after:content-[''] after:absolute after:h-[18px] after:w-[18px] after:left-[3px] after:bottom-[3px] after:bg-white after:rounded-full after:transition-transform after:duration-300 peer-checked:after:translate-x-[20px]"></span>
              </label>
            </div>
          </div>

          {/* Experimental Agents Features */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-[24px] shadow-[var(--shadow-sm)] flex flex-col gap-[20px] md:col-span-2">
            <div className="flex items-center gap-[10px] font-[var(--font-display)] font-bold text-[15px] text-[var(--text-primary)] border-b border-[var(--border-color)] pb-[12px]">
              <FlaskConical size={18} />
              <span>Active Beta Protocols</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] w-full">
              <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-sm)] p-[20px] flex flex-col gap-[12px] flex-1">
                <div className="flex justify-between items-center">
                  <h5 className="font-[var(--font-display)] text-[14px] font-bold text-[var(--text-primary)]">Arbitrage Arbitrator</h5>
                  <span className="text-[9px] font-bold tracking-[1px] px-[6px] py-[2px] rounded-[var(--radius-xs)] bg-[rgba(0,202,141,0.1)] text-[var(--accent-color)]">BETA</span>
                </div>
                <p className="text-[12px] text-[var(--text-secondary)] leading-[1.5]">Monitors price disparities across localized Arbitrum and Base dex pairs, proposing paths to capitalize on price inefficiencies.</p>
                <button 
                  className={`w-fit inline-flex items-center justify-center px-[12px] py-[6px] rounded-[var(--radius-xs)] font-[var(--font-display)] font-semibold text-[11px] border transition-[var(--transition-fast)] cursor-pointer ${
                    labsConfig.arbitrageEnabled 
                      ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-[var(--bg-secondary)] hover:bg-[var(--text-primary)] hover:border-[var(--text-primary)]' 
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar)] hover:text-[var(--text-primary)] hover:border-[var(--accent-color)]'
                  }`}
                  id="btn-toggle-arbitrage"
                  onClick={() => handleInputChange('arbitrageEnabled', !labsConfig.arbitrageEnabled)}
                >
                  {labsConfig.arbitrageEnabled ? 'Disable Protocol' : 'Enable Protocol'}
                </button>
              </div>

              <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-sm)] p-[20px] flex flex-col gap-[12px] flex-1">
                <div className="flex justify-between items-center">
                  <h5 className="font-[var(--font-display)] text-[14px] font-bold text-[var(--text-primary)]">Voice Command Module</h5>
                  <span className="text-[9px] font-bold tracking-[1px] px-[6px] py-[2px] rounded-[var(--radius-xs)] bg-[rgba(0,202,141,0.1)] text-[var(--accent-color)]">EXPERIMENTAL</span>
                </div>
                <p className="text-[12px] text-[var(--text-secondary)] leading-[1.5]">Allows hands-free conversational voice commands to analyze portfolios. Dictate trades using speech-to-text directly.</p>
                <button 
                  className={`w-fit inline-flex items-center justify-center px-[12px] py-[6px] rounded-[var(--radius-xs)] font-[var(--font-display)] font-semibold text-[11px] border transition-[var(--transition-fast)] cursor-pointer ${
                    labsConfig.voiceEnabled 
                      ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-[var(--bg-secondary)] hover:bg-[var(--text-primary)] hover:border-[var(--text-primary)]' 
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar)] hover:text-[var(--text-primary)] hover:border-[var(--accent-color)]'
                  }`}
                  id="btn-toggle-voice"
                  onClick={() => handleInputChange('voiceEnabled', !labsConfig.voiceEnabled)}
                >
                  {labsConfig.voiceEnabled ? 'Disable Module' : 'Enable Module'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
