"use client";

import React from 'react';

export default function DonutChart({ calories = 1320 }) {
  // Data definitions
  const data = [
    { name: 'Protein', value: 80, pct: 24, color: '#10b981', label: '80g' },
    { name: 'Carbs', value: 150, pct: 45, color: '#f59e0b', label: '150g' },
    { name: 'Fats', value: 45, pct: 31, color: '#f43f5e', label: '45g' },
    { name: 'Others', value: 10, pct: 8, color: '#3b82f6', label: '10g' }
  ];

  // Circle SVG properties
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Let's normalize the percentages so they add up to 100% for the visual SVG donut
  const totalPct = data.reduce((acc, item) => acc + item.pct, 0);
  
  let currentOffset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-[24px]">
      {/* SVG Donut Circle */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          width={size} 
          height={size} 
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--bg-primary)"
            strokeWidth={strokeWidth}
          />
          {data.map((item, index) => {
            // Calculate segment length based on relative percentage
            const share = item.pct / totalPct;
            const strokeLength = circumference * share;
            const gapLength = circumference - strokeLength;
            const offset = currentOffset;
            
            // Increment offset for next slice
            currentOffset -= strokeLength;

            return (
              <circle
                key={item.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${strokeLength} ${gapLength}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out hover:stroke-[22px] cursor-pointer"
                style={{ transformOrigin: 'center' }}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display text-[26px] font-extrabold text-[var(--text-primary)] leading-none">
            {calories.toLocaleString()}
          </span>
          <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-[4px]">
            kcal
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 w-full flex flex-col gap-[10px]">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-[13.5px]">
            <div className="flex items-center gap-[8px]">
              <span 
                className="w-[10px] h-[10px] rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-semibold text-[var(--text-secondary)]">{item.name}</span>
            </div>
            <span className="font-display font-bold text-[var(--text-primary)]">
              {item.label} <span className="font-normal text-[var(--text-muted)] text-[12px] ml-[2px]">({item.pct}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
