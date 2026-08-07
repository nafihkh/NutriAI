"use client";

import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function BmiCard({ bmi = 22.4 }) {
  // Let's compute the pointer offset based on the BMI range (15 to 35)
  const minBmi = 15;
  const maxBmi = 35;
  const range = maxBmi - minBmi;
  const percentage = Math.min(Math.max(((bmi - minBmi) / range) * 100, 5), 95);

  let status = "Normal";
  let statusColor = "text-[#10b981]";
  let statusBg = "bg-[#10b981]/10";

  if (bmi < 18.5) {
    status = "Underweight";
    statusColor = "text-[#3b82f6]";
    statusBg = "bg-[#3b82f6]/10";
  } else if (bmi >= 18.5 && bmi < 25) {
    status = "Normal";
    statusColor = "text-[#10b981]";
    statusBg = "bg-[#10b981]/10";
  } else if (bmi >= 25 && bmi < 30) {
    status = "Overweight";
    statusColor = "text-[#f97316]";
    statusBg = "bg-[#f97316]/10";
  } else {
    status = "Obese";
    statusColor = "text-[#ef4444]";
    statusBg = "bg-[#ef4444]/10";
  }

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-[20px] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] flex flex-col gap-[16px]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[var(--text-muted)]">
          BMI
        </span>
        <span className={`text-[12px] font-bold uppercase tracking-[0.5px] px-[8px] py-[3px] rounded-md ${statusBg} ${statusColor}`}>
          {status}
        </span>
      </div>

      <div className="flex items-baseline gap-[8px] justify-center mt-[4px]">
        <span className="font-display text-[34px] font-extrabold text-[var(--text-primary)] leading-none">
          {bmi}
        </span>
      </div>

      {/* Visual Color Scale Bar */}
      <div className="relative mt-[8px]">
        {/* Pointer Arrow */}
        <div 
          className="absolute -top-[16px] transform -translate-x-1/2 transition-all duration-500 ease-out flex flex-col items-center"
          style={{ left: `${percentage}%` }}
        >
          <div className="w-[10px] h-[10px] bg-[var(--text-primary)] rounded-full mb-[2px]"></div>
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-[var(--text-primary)]"></div>
        </div>

        {/* Bar segments */}
        <div className="h-[8px] rounded-full overflow-hidden flex">
          <div className="flex-1 bg-[#3b82f6]" title="Underweight" style={{ flexGrow: 18.5 - 15 }} />
          <div className="flex-1 bg-[#10b981]" title="Normal" style={{ flexGrow: 25 - 18.5 }} />
          <div className="flex-1 bg-[#f97316]" title="Overweight" style={{ flexGrow: 30 - 25 }} />
          <div className="flex-1 bg-[#ef4444]" title="Obese" style={{ flexGrow: 35 - 30 }} />
        </div>
      </div>

      {/* Labels under the bar */}
      <div className="grid grid-cols-4 text-center mt-[4px]">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-[var(--text-primary)]">&lt; 18.5</span>
          <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-tighter">Under</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-[var(--text-primary)]">18.5 - 24.9</span>
          <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-tighter">Normal</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-[var(--text-primary)]">25 - 29.9</span>
          <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-tighter">Over</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-[var(--text-primary)]">&gt; 29.9</span>
          <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-tighter">Obese</span>
        </div>
      </div>
    </div>
  );
}
