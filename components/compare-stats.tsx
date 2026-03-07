"use client"

import type { StatData } from "@/types"

interface CompareStatsProps {
  myStats: StatData[]
  otherStats: StatData[]
  myName: string
  otherName: string
}

export function CompareStats({ myStats, otherStats, myName, otherName }: CompareStatsProps) {
  return (
    <div className="space-y-3">
      {myStats.map((myStat, i) => {
        const otherStat = otherStats[i]
        const diff = myStat.value - otherStat.value
        return (
          <div key={myStat.label} className="bg-card/50 border border-border rounded-lg p-3 backdrop-blur-sm">
            <div className="text-sm font-mono text-muted-foreground text-center mb-2">
              {myStat.label}
            </div>
            <div className="flex items-center gap-3">
              {/* My value */}
              <div className="flex-1 text-right">
                <span className="text-lg font-mono font-bold text-neon-blue">{myStat.value}</span>
              </div>

              {/* Bar comparison */}
              <div className="w-32 flex flex-col gap-1">
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neon-blue rounded-full transition-all"
                    style={{ width: `${(myStat.value / myStat.maxValue) * 100}%` }}
                  />
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neon-pink rounded-full transition-all"
                    style={{ width: `${(otherStat.value / otherStat.maxValue) * 100}%` }}
                  />
                </div>
              </div>

              {/* Other value */}
              <div className="flex-1">
                <span className="text-lg font-mono font-bold text-neon-pink">{otherStat.value}</span>
              </div>
            </div>

            {/* Diff indicator */}
            <div className="text-center mt-1">
              <span
                className={`text-xs font-mono ${
                  diff > 0 ? "text-neon-cyan" : diff < 0 ? "text-neon-pink" : "text-muted-foreground"
                }`}
              >
                {diff > 0 ? `+${diff}` : diff === 0 ? "±0" : `${diff}`}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
