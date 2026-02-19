"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Trophy, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { VisibilityType, MyTag } from "@/types"
import { RARITY_ORDER, TAG_RARITY_STYLES } from "@/types"

// サンプルデータ（API連携で差し替え想定）
const STEPS_WEEK = [
  { day: "月", steps: 6200 },
  { day: "火", steps: 8100 },
  { day: "水", steps: 5400 },
  { day: "木", steps: 9200 },
  { day: "金", steps: 7500 },
  { day: "土", steps: 11000 },
  { day: "日", steps: 8234 },
]
const SLEEP_WEEK = [
  { day: "月", hours: 6.5 },
  { day: "火", hours: 7 },
  { day: "水", hours: 5.5 },
  { day: "木", hours: 7.5 },
  { day: "金", hours: 6 },
  { day: "土", hours: 8 },
  { day: "日", hours: 7.2 },
]
const MOCK_EXAMS = [
  { name: "第1回", score: 58 },
  { name: "第2回", score: 62 },
  { name: "第3回", score: 65 },
  { name: "第4回", score: 61 },
  { name: "第5回", score: 68 },
]
const STANDING_WEEK = [
  { day: "月", min: 180 },
  { day: "火", min: 220 },
  { day: "水", min: 150 },
  { day: "木", min: 240 },
  { day: "金", min: 190 },
  { day: "土", min: 120 },
  { day: "日", min: 195 },
]

interface DigitalIdCardProps {
  avatarUrl?: string
  nickname: string
  occupation: string
  id: string
  level?: number
  exp?: number
  maxExp?: number
  visibility?: VisibilityType
  myTags?: MyTag[]
}

export function DigitalIdCard({
  avatarUrl,
  nickname,
  occupation,
  id,
  level = 1,
  exp = 0,
  maxExp = 1000,
  visibility = "public",
  myTags = [],
}: DigitalIdCardProps) {
  const [showAllTags, setShowAllTags] = useState(false)
  const [showAllTrends, setShowAllTrends] = useState(false)

  const expPercentage = maxExp > 0 ? (exp / maxExp) * 100 : 0
  const displayId = id.startsWith("@") ? id : `@${id}`

  const sortedTags = [...myTags].sort(
    (a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity)
  )
  const displayedTags = showAllTags ? sortedTags : sortedTags.slice(0, 4)

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Outer glow frame */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-pink to-neon-blue rounded-xl blur-sm opacity-50" />

      {/* Main card */}
      <div className="relative bg-card border-2 border-neon-blue rounded-xl overflow-hidden shadow-[0_0_30px_oklch(0.7_0.2_250_/_0.3)]">
        {/* Header bar */}
        <div className="bg-gradient-to-r from-neon-blue/20 to-neon-pink/20 px-4 py-2 border-b border-neon-blue/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
              <span className="text-xs font-mono text-neon-blue uppercase tracking-widest">
                Profile
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                {visibility === "public" ? "公開" : "限定公開"}
              </span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">v2.0.26</span>
          </div>
        </div>

        {/* Card content */}
        <div className="p-4 space-y-4">
          <div className="flex gap-4">
            {/* プロフィール写真 */}
            <div className="relative">
              <div className="w-20 h-20 rounded-lg border-2 border-neon-pink overflow-hidden bg-muted/30 shadow-[0_0_15px_oklch(0.65_0.22_330_/_0.4)]">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={nickname} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-neon-pink">
                    {nickname.charAt(0)}
                  </div>
                )}
              </div>
              {level > 0 && (
                <div className="absolute -bottom-2 -right-2 bg-background border-2 border-neon-blue rounded-full px-2 py-0.5 text-xs font-mono font-bold text-neon-blue shadow-[0_0_10px_oklch(0.7_0.2_250_/_0.5)]">
                  LV.{level}
                </div>
              )}
            </div>

            {/* ニックネーム・職業・ID */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground truncate font-sans tracking-wide">
                {nickname}
              </h2>
              <p className="text-sm text-neon-pink font-mono">{occupation}</p>
              <p className="text-xs font-mono text-neon-cyan tracking-wider mt-2">
                {displayId}
              </p>
            </div>
          </div>

          {/* EXP Bar */}
          {maxExp > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-muted-foreground uppercase">経験値</span>
                <span className="text-neon-blue">{exp} / {maxExp} XP</span>
              </div>
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-gradient-to-r from-neon-blue to-neon-pink transition-all duration-500 shadow-[0_0_10px_oklch(0.7_0.2_250)]"
                  style={{ width: `${expPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* My Tag */}
          <div className="pt-2 border-t border-border/50">
            <h3 className="text-xs font-mono font-bold text-neon-blue uppercase tracking-wider mb-2">
              My Tag
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {displayedTags.map((tag) => {
                const styles = TAG_RARITY_STYLES[tag.rarity]
                const rarityLabel = tag.rarity.toUpperCase()
                return (
                  <div
                    key={tag.name}
                    className={cn(
                      "relative p-4 rounded-lg border-2 transition-all",
                      styles.border,
                      styles.glow,
                      styles.bg
                    )}
                  >
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-current opacity-50" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-current opacity-50" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-current opacity-50" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-current opacity-50" />
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center border-2",
                          styles.border,
                          styles.bg
                        )}
                      >
                        <Trophy className={cn("w-6 h-6", styles.text)} />
                      </div>
                      <h4 className={cn("font-mono text-sm font-bold uppercase tracking-wide line-clamp-2", styles.text)}>
                        {tag.name}
                      </h4>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        {tag.date}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "absolute -top-1 -right-1 px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest rounded border",
                        styles.bg,
                        styles.text,
                        styles.border
                      )}
                    >
                      {rarityLabel}
                    </div>
                  </div>
                )
              })}
            </div>
            {!showAllTags && sortedTags.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllTags(true)}
                className="w-full mt-2 py-2 rounded-lg border border-border/50 text-[10px] font-mono text-muted-foreground hover:bg-muted/20 flex items-center justify-center gap-1"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                もっと見る
              </button>
            )}
            {showAllTags && (
              <button
                type="button"
                onClick={() => setShowAllTags(false)}
                className="w-full mt-2 py-2 rounded-lg border border-neon-blue/50 bg-neon-blue/10 text-[10px] font-mono text-neon-blue hover:bg-neon-blue/20 flex items-center justify-center gap-1"
              >
                <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                戻る
              </button>
            )}
          </div>

          {/* My Trend */}
          <div className="pt-3 mt-3 border-t border-border/50">
            <h3 className="text-xs font-mono font-bold text-neon-blue uppercase tracking-wider mb-2">
              My Trend
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {/* 歩数 */}
              <div className="rounded-lg border-2 border-neon-blue/60 bg-card/80 p-2 shadow-md">
                <p className="text-[9px] font-mono text-muted-foreground uppercase mb-0.5">歩数</p>
                <p className="text-xs font-mono text-neon-blue font-bold">今日 {STEPS_WEEK[6].steps.toLocaleString()}歩</p>
                <div className="h-12 mt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={STEPS_WEEK} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
                      <Bar dataKey="steps" fill="oklch(0.7 0.2 250)" radius={[2, 2, 0, 0]} />
                      <XAxis dataKey="day" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
                      <YAxis hide domain={[0, "dataMax + 2000"]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 睡眠 */}
              <div className="rounded-lg border-2 border-neon-blue/60 bg-card/80 p-2 shadow-md">
                <p className="text-[9px] font-mono text-muted-foreground uppercase mb-0.5">睡眠</p>
                <p className="text-xs font-mono text-neon-pink font-bold">今日 {SLEEP_WEEK[6].hours}h</p>
                <div className="h-12 mt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SLEEP_WEEK} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
                      <Bar dataKey="hours" fill="oklch(0.65 0.22 330)" radius={[2, 2, 0, 0]} />
                      <XAxis dataKey="day" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
                      <YAxis hide domain={[0, 9]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 模試成績 */}
              <div className="rounded-lg border-2 border-neon-blue/60 bg-card/80 p-2 shadow-md">
                <p className="text-[9px] font-mono text-muted-foreground uppercase mb-0.5">模試成績</p>
                <p className="text-xs font-mono text-neon-cyan font-bold">直近 {MOCK_EXAMS[MOCK_EXAMS.length - 1].score}点</p>
                <div className="h-12 mt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_EXAMS} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
                      <Line type="monotone" dataKey="score" stroke="oklch(0.75 0.15 200)" strokeWidth={2} dot={{ r: 2 }} />
                      <XAxis dataKey="name" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
                      <YAxis hide domain={[50, 80]} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 立位時間 */}
              <div className="rounded-lg border-2 border-neon-blue/60 bg-card/80 p-2 shadow-md">
                <p className="text-[9px] font-mono text-muted-foreground uppercase mb-0.5">立位時間</p>
                <p className="text-xs font-mono text-foreground font-bold">今日 {STANDING_WEEK[6].min}分</p>
                <div className="h-12 mt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={STANDING_WEEK} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
                      <Bar dataKey="min" fill="oklch(0.6 0.2 300)" radius={[2, 2, 0, 0]} />
                      <XAxis dataKey="day" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
                      <YAxis hide domain={[0, "dataMax + 50"]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {showAllTrends && (
              <p className="mt-2 text-[10px] font-mono text-muted-foreground text-center py-2 bg-muted/20 rounded-lg">
                ほかのTRENDは準備中です
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowAllTrends(true)}
              className={cn(
                "w-full mt-2 py-2 rounded-lg border border-border/50 text-[10px] font-mono text-muted-foreground hover:bg-muted/20 flex items-center justify-center gap-1",
                showAllTrends && "hidden"
              )}
            >
              <ChevronDown className="w-3.5 h-3.5" />
              もっと見る
            </button>
          </div>
        </div>

        {/* Scan line animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent animate-scan" />
        </div>
      </div>
    </div>
  )
}
