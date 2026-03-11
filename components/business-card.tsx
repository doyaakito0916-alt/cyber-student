"use client"

import { forwardRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import type { BusinessCardStyle, MyTag } from "@/types"
import { RARITY_ORDER } from "@/types"

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
          className="w-[364px] h-[220px] rounded-2xl overflow-hidden relative bg-white text-gray-700 p-5 flex flex-col justify-between"
          style={{
            fontFamily: "'Geist', sans-serif",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          {/* 上部アクセントライン */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-400 via-pink-300 to-amber-300" />

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold tracking-wide text-gray-800">{nickname}</h2>
              <p className="text-sm text-gray-400 mt-1">{occupation}</p>
              <p className="text-xs text-violet-400 mt-1.5">{displayId}</p>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="bg-gray-50 p-2 rounded-xl">
                <QRCodeSVG value={profileUrl} size={52} level="M" includeMargin={false} />
              </div>
              <span className="text-[9px] text-gray-300">Lv.{level}</span>
            </div>
          </div>

          <div>
            {topTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {topTags.map((tag) => (
                  <span
                    key={tag.name}
                    className="px-2.5 py-0.5 text-xs rounded-full bg-violet-50 text-violet-400 border border-violet-100"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="text-[9px] text-gray-300">Cyber Student</span>
            </div>
          </div>
        </div>
      )
    }

    // ダークテンプレート（やわらかダーク）
    return (
      <div
        ref={ref}
        className="w-[364px] h-[220px] rounded-2xl overflow-hidden relative p-5 flex flex-col justify-between"
        style={{
          background: "linear-gradient(135deg, #1e1b2e 0%, #2d2545 50%, #1f2937 100%)",
          fontFamily: "'Geist', sans-serif",
        }}
      >
        {/* やわらかいアクセント装飾 */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #f9a8d4 0%, transparent 70%)" }}
        />

        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold tracking-wide text-white/90">
              {nickname}
            </h2>
            <p className="text-sm text-violet-300/80 mt-1">{occupation}</p>
            <p className="text-xs text-pink-300/70 mt-1.5">{displayId}</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="bg-white/90 p-2 rounded-xl">
              <QRCodeSVG value={profileUrl} size={52} level="M" includeMargin={false} />
            </div>
            <span className="text-[9px] text-violet-300/60">
              Lv.{level}
            </span>
          </div>
        </div>

        <div className="relative z-10">
          {topTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {topTags.map((tag) => (
                <span
                  key={tag.name}
                  className="px-2.5 py-0.5 text-xs rounded-full border border-violet-400/30 bg-violet-500/10 text-violet-300/80"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[9px] text-violet-400/40">
              Cyber Student
            </span>
          </div>
        </div>
      </div>
    )
  }
)
