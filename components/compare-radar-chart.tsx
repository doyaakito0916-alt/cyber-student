"use client"

import { useMemo } from "react"
import type { StatData } from "@/types"

interface CompareRadarChartProps {
  myStats: StatData[]
  otherStats: StatData[]
  myName: string
  otherName: string
  size?: number
}

export function CompareRadarChart({
  myStats,
  otherStats,
  myName,
  otherName,
  size = 300,
}: CompareRadarChartProps) {
  const center = size / 2
  const maxRadius = size / 2 - 40

  const { myDataPoints, otherDataPoints, labelPositions, rings } = useMemo(() => {
    const angles = myStats.map((_, i) => (Math.PI * 2 * i) / myStats.length - Math.PI / 2)

    const computePoints = (stats: StatData[]) =>
      angles.map((angle, i) => {
        const ratio = stats[i].value / stats[i].maxValue
        const x = center + maxRadius * ratio * Math.cos(angle)
        const y = center + maxRadius * ratio * Math.sin(angle)
        return { x, y }
      })

    const labelPos = angles.map((angle, i) => {
      const labelRadius = maxRadius + 28
      const x = center + labelRadius * Math.cos(angle)
      const y = center + labelRadius * Math.sin(angle)
      return { x, y, label: myStats[i].label }
    })

    const ringData = [0.25, 0.5, 0.75, 1].map((scale) =>
      angles
        .map((angle) => {
          const x = center + maxRadius * scale * Math.cos(angle)
          const y = center + maxRadius * scale * Math.sin(angle)
          return `${x},${y}`
        })
        .join(" ")
    )

    return {
      myDataPoints: computePoints(myStats),
      otherDataPoints: computePoints(otherStats),
      labelPositions: labelPos,
      rings: ringData,
    }
  }, [myStats, otherStats, center, maxRadius])

  return (
    <div className="relative">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.2 250)" />
            <stop offset="100%" stopColor="oklch(0.75 0.15 200)" />
          </linearGradient>
          <linearGradient id="otherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.65 0.22 330)" />
            <stop offset="100%" stopColor="oklch(0.85 0.2 85)" />
          </linearGradient>
          <filter id="glowCompare">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
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
        {myStats.map((_, i) => {
          const angle = (Math.PI * 2 * i) / myStats.length - Math.PI / 2
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

        {/* Other user polygon (behind) */}
        <polygon
          points={otherDataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="url(#otherGradient)"
          fillOpacity={0.15}
          stroke="oklch(0.65 0.22 330)"
          strokeWidth="2"
          strokeDasharray="6 3"
          filter="url(#glowCompare)"
        />

        {/* My polygon (front) */}
        <polygon
          points={myDataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="url(#myGradient)"
          fillOpacity={0.2}
          stroke="oklch(0.7 0.2 250)"
          strokeWidth="2"
          filter="url(#glowCompare)"
        />

        {/* My data points */}
        {myDataPoints.map((point, i) => (
          <circle
            key={`my-${i}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="oklch(0.7 0.2 250)"
            filter="url(#glowCompare)"
          />
        ))}

        {/* Other data points */}
        {otherDataPoints.map((point, i) => (
          <circle
            key={`other-${i}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="oklch(0.65 0.22 330)"
            filter="url(#glowCompare)"
          />
        ))}

        {/* Labels */}
        {labelPositions.map((pos, i) => (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-foreground text-xs font-mono uppercase tracking-wider"
          >
            {pos.label}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neon-blue shadow-[0_0_8px_oklch(0.7_0.2_250)]" />
          <span className="text-sm font-mono text-neon-blue">{myName}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neon-pink shadow-[0_0_8px_oklch(0.65_0.22_330)]" />
          <span className="text-sm font-mono text-neon-pink">{otherName}</span>
        </div>
      </div>
    </div>
  )
}
