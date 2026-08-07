"use client";

import React, { useState } from 'react';

export default function LineChart({
  data = [],
  color = '#10b981',
  gradientId = 'chart-grad',
  height = 130,
  minVal = 0,
  maxVal = 2000,
  highlightIndex = 3,
  highlightLabel = '1,320 kcal'
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  if (!data || data.length === 0) return null;

  // Svg dimensions
  const svgWidth = 500;
  const svgHeight = height;
  const paddingX = 24;
  const paddingY = 20;

  // Calculate coordinates
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const points = data.map((item, idx) => {
    const x = paddingX + (idx * (chartWidth / (data.length - 1)));
    const ratio = (item.value - minVal) / (maxVal - minVal);
    const y = svgHeight - paddingY - (ratio * chartHeight);
    return { x, y, ...item, index: idx };
  });

  // Construct smooth Bezier Path
  let pathD = '';
  let areaD = '';

  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      // Control points for smooth horizontal wave
      const cpX1 = curr.x + (next.x - curr.x) / 2;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (next.x - curr.x) / 2;
      const cpY2 = next.y;
      
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }

    // Close the area for gradient fill
    areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;
  }

  return (
    <div className="w-full">
      <div className="relative">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-auto overflow-visible"
        >
          <defs>
            {/* Gradient fill */}
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.16" />
              <stop offset="100%" stopColor={color} stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          <line 
            x1={paddingX} 
            y1={paddingY} 
            x2={svgWidth - paddingX} 
            y2={paddingY} 
            stroke="var(--border-color)" 
            strokeWidth="1" 
            strokeDasharray="4 6" 
          />
          <line 
            x1={paddingX} 
            y1={paddingY + chartHeight / 2} 
            x2={svgWidth - paddingX} 
            y2={paddingY + chartHeight / 2} 
            stroke="var(--border-color)" 
            strokeWidth="1" 
            strokeDasharray="4 6" 
          />
          <line 
            x1={paddingX} 
            y1={svgHeight - paddingY} 
            x2={svgWidth - paddingX} 
            y2={svgHeight - paddingY} 
            stroke="var(--border-color)" 
            strokeWidth="1" 
          />

          {/* Area under curve */}
          {areaD && (
            <path 
              d={areaD} 
              fill={`url(#${gradientId})`} 
            />
          )}

          {/* The curvy line */}
          {pathD && (
            <path
              d={pathD}
              fill="transparent"
              stroke={color}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive dots and hover guides */}
          {points.map((pt, idx) => {
            const isHighlighted = idx === highlightIndex;
            const isHovered = hoveredIndex === idx;
            const active = isHovered || (hoveredIndex === null && isHighlighted);

            return (
              <g 
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Vertical hover line indicator */}
                {active && (
                  <line
                    x1={pt.x}
                    y1={paddingY}
                    x2={pt.x}
                    y2={svgHeight - paddingY}
                    stroke={color}
                    strokeWidth="1.5"
                    strokeOpacity="0.3"
                    strokeDasharray="2 3"
                  />
                )}

                {/* Glow ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={active ? 10 : 0}
                  fill={color}
                  fillOpacity="0.15"
                  className="transition-all duration-200"
                />

                {/* Inner dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={active ? 5 : 4}
                  fill="var(--bg-secondary)"
                  stroke={color}
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />

                {/* Tooltip Box Overlay rendered inside SVG */}
                {active && (
                  <g className="pointer-events-none">
                    <rect
                      x={pt.x - 45}
                      y={pt.y - 32}
                      width="90"
                      height="22"
                      rx="6"
                      fill={color}
                      className="shadow-sm"
                    />
                    <polygon
                      points={`${pt.x - 4},${pt.y - 11} ${pt.x + 4},${pt.y - 11} ${pt.x},${pt.y - 7}`}
                      fill={color}
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 17}
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="var(--font-display)"
                    >
                      {idx === highlightIndex ? highlightLabel : pt.display || `${pt.value}`}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between mt-[10px] px-[16px]">
        {data.map((item, idx) => (
          <span 
            key={idx} 
            className={`text-[11px] font-bold tracking-tight uppercase transition-colors duration-200 ${
              hoveredIndex === idx || (hoveredIndex === null && idx === highlightIndex)
                ? 'text-[var(--text-primary)]'
                : 'text-[var(--text-muted)]'
            }`}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
