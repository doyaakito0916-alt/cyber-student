"use client"

import { forwardRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { cn } from "@/lib/utils"
import type { BusinessCardStyle, MyTag } from "@/types"
import { RARITY_ORDER, TAG_RARITY_STYLES } from "@/types"

interface BusinessCardProps {
  nickname: string
  occupation: string
  id: string
  level: number
  tags: MyTag[]
  profileUrl: string
  style: BusinessCardStyle
}

export const BusinessCard = forwardRef<HTMLDivElement, BusinessCardProps>(
  function BusinessCard({ nickname, occupation, id, level, tags, profileUrl, style }, ref) {
    const displayId = id.startsWith("@") ? id : `@${id}`
    const topTags = [...tags]
      .sort((a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity))
      .slice(0, 3)

    if (style === "light") {
      return (
        <div
          ref={ref}
          className="w-[364px] h-[220px] rounded-xl overflow-hidden relative bg-white text-gray-900 p-5 flex flex-col justify-between"
          style={{ fontFamily: "'Geist', sans-serif" }}
        >
          {/* 上部アクセントライン */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold tracking-wide">{nickname}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{occupation}</p>
              <p className="text-xs text-blue-500 font-mono mt-1">{displayId}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="bg-gray-100 p-1.5 rounded-lg">
                <QRCodeSVG value={profileUrl} size={56} level="M" includeMargin={false} />
              </div>
              <span className="text-[9px] text-gray-400 font-mono">LV.{level}</span>
            </div>
          </div>

          <div>
            {topTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {topTags.map((tag) => (
                  <span
                    key={tag.name}
                    className="px-2 py-0.5 text-xs font-mono rounded-full bg-gray-100 text-gray-600 border border-gray-200"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="text-[9px] text-gray-300 font-mono">CYBER_STUDENT</span>
            </div>
          </div>
        </div>
      )
    }

    // ダークテンプレート（サイバーパンク）
    return (
      <div
        ref={ref}
        className="w-[364px] h-[220px] rounded-xl overflow-hidden relative p-5 flex flex-col justify-between"
        style={{
          background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)",
          fontFamily: "'Geist', sans-serif",
        }}
      >
        {/* ネオングロー装飾 */}
        <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-blue-500/40 rounded-tl-xl" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-r border-b border-pink-500/40 rounded-br-xl" />

        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h2
              className="text-xl font-bold tracking-wide text-white"
              style={{ textShadow: "0 0 20px rgba(96,165,250,0.5)" }}
            >
              {nickname}
            </h2>
            <p className="text-sm text-pink-400 font-mono mt-0.5">{occupation}</p>
            <p className="text-xs text-cyan-400 font-mono mt-1">{displayId}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="bg-white p-1.5 rounded-lg">
              <QRCodeSVG value={profileUrl} size={56} level="M" includeMargin={false} />
            </div>
            <span
              className="text-[9px] text-blue-400 font-mono font-bold"
              style={{ textShadow: "0 0 8px rgba(96,165,250,0.8)" }}
            >
              LV.{level}
            </span>
          </div>
        </div>

        <div className="relative z-10">
          {topTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {topTags.map((tag) => {
                const styles = TAG_RARITY_STYLES[tag.rarity]
                return (
                  <span
                    key={tag.name}
                    className={cn(
                      "px-2 py-0.5 text-xs font-mono rounded-full border",
                      styles.border,
                      styles.bg,
                      styles.text
                    )}
                  >
                    {tag.name}
                  </span>
                )
              })}
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <span
              className="text-[9px] text-blue-500/60 font-mono"
              style={{ textShadow: "0 0 6px rgba(96,165,250,0.3)" }}
            >
              CYBER_STUDENT
            </span>
          </div>
        </div>
      </div>
    )
  }
)
