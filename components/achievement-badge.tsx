"use client"

import React from "react"
import { cn } from "@/lib/utils"
import type { TagRarity } from "@/types"
import { TAG_RARITY_STYLES } from "@/types"

interface AchievementBadgeProps {
  title: string
  description: string
  icon: React.ReactNode
  rarity: TagRarity
  unlocked: boolean
  date?: string
}

export function AchievementBadge({
  title,
  description,
  icon,
  rarity,
  unlocked,
  date,
}: AchievementBadgeProps) {
  const styles = TAG_RARITY_STYLES[rarity]

  return (
    <div
      className={cn(
        "relative group p-4 rounded-lg border-2 transition-all duration-300",
        "hover:scale-105 hover:z-10",
        unlocked ? styles.border : "border-muted/30",
        unlocked ? styles.glow : "",
        unlocked ? styles.bg : "bg-muted/10",
        !unlocked && "opacity-50 grayscale"
      )}
    >
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-current opacity-50" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-current opacity-50" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-current opacity-50" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-current opacity-50" />

      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            "border-2",
            unlocked ? styles.border : "border-muted/30",
            unlocked ? styles.bg : "bg-muted/20"
          )}
        >
          <span className={cn("text-xl", unlocked ? styles.text : "text-muted-foreground")}>
            {icon}
          </span>
        </div>

        <div>
          <h3
            className={cn(
              "font-mono text-sm font-bold uppercase tracking-wide",
              unlocked ? styles.text : "text-muted-foreground"
            )}
          >
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </div>

        {unlocked && date && (
          <div className="text-[10px] text-muted-foreground font-mono mt-1">
            UNLOCKED: {date}
          </div>
        )}

        {!unlocked && (
          <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
            [LOCKED]
          </div>
        )}

        {/* Rarity indicator */}
        <div
          className={cn(
            "absolute -top-1 -right-1 px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest rounded",
            unlocked ? styles.bg : "bg-muted/30",
            unlocked ? styles.text : "text-muted-foreground",
            "border",
            unlocked ? styles.border : "border-muted/30"
          )}
        >
          {rarity}
        </div>
      </div>
    </div>
  )
}
