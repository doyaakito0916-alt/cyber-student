"use client"

import { useMemo } from "react"
import type { StatData } from "@/types"

interface HexagonRadarChartProps {
  stats: StatData[]
  size?: number
}

export function HexagonRadarChart({ stats, size = 280 }: HexagonRadarChartProps) {
  const center = size / 2
  const maxRadius = size / 2 - 30

  const { hexagonPoints, dataPoints, labelPositions } = useMemo(() => {
    const angles = stats.map((_, i) => (Math.PI * 2 * i) / stats.length - Math.PI / 2)

    const hexPoints = angles.map((angle) => {
      const x = center + maxRadius * Math.cos(angle)
      const y = center + maxRadius * Math.sin(angle)
      return `${x},${y}`
    }).join(" ")

    const dataPoints = angles.map((angle, i) => {
      const ratio = stats[i].value / stats[i].maxValue
      const x = center + maxRadius * ratio * Math.cos(angle)
      const y = center + maxRadius * ratio * Math.sin(angle)
      return { x, y }
    })

    const labelPos = angles.map((angle, i) => {
      const labelRadius = maxRadius + 25
      const x = center + labelRadius * Math.cos(angle)
      const y = center + labelRadius * Math.sin(angle)
      return { x, y, label: stats[i].label, value: stats[i].value }
    })

    return {
      hexagonPoints: hexPoints,
      dataPoints,
      labelPositions: labelPos
    }
  }, [stats, center, maxRadius])

  const rings = [0.25, 0.5, 0.75, 1].map((scale) => {
    const angles = stats.map((_, i) => (Math.PI * 2 * i) / stats.length - Math.PI / 2)
    return angles.map((angle) => {
      const x = center + maxRadius * scale * Math.cos(angle)
      const y = center + maxRadius * scale * Math.sin(angle)
      return `${x},${y}`
    }).join(" ")
  })

  return (
    <div className="relative">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.2 250)" />
            <stop offset="100%" stopColor="oklch(0.65 0.22 330)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowStrong">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background hexagon rings */}
        {rings.map((ring, i) => (
          <polygon
            key={i}
            points={ring}
            fill="none"
            stroke="oklch(0.3 0.04 270)"
            strokeWidth="1"
            opacity={0.5}
          />
        ))}

        {/* Radial lines */}
        {stats.map((_, i) => {
          const angle = (Math.PI * 2 * i) / stats.length - Math.PI / 2
          const x = center + maxRadius * Math.cos(angle)
          const y = center + maxRadius * Math.sin(angle)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="oklch(0.3 0.04 270)"
              strokeWidth="1"
              opacity={0.5}
            />
          )
        })}

        {/* Data polygon */}
        <polygon
          points={dataPoints.map(p => `${p.x},${p.y}`).join(" ")}
          fill="url(#neonGradient)"
          fillOpacity={0.3}
          stroke="url(#neonGradient)"
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="oklch(0.7 0.2 250)"
            filter="url(#glowStrong)"
            className="animate-pulse"
          />
        ))}

        {/* Labels */}
        {labelPositions.map((pos, i) => (
          <g key={i}>
            <text
              x={pos.x}
              y={pos.y - 8}
              textAnchor="middle"
              className="fill-foreground text-xs font-mono uppercase tracking-wider"
            >
              {pos.label}
            </text>
            <text
              x={pos.x}
              y={pos.y + 8}
              textAnchor="middle"
              className="fill-neon-blue text-sm font-bold font-mono"
              filter="url(#glow)"
            >
              {pos.value}
            </text>
          </g>
        ))}

        {/* Center decoration */}
        <circle
          cx={center}
          cy={center}
          r="4"
          fill="oklch(0.65 0.22 330)"
          filter="url(#glowStrong)"
        />
      </svg>
    </div>
  )
}
