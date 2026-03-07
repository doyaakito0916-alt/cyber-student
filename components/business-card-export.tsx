"use client"

import { useState, useRef, useCallback } from "react"
import html2canvas from "html2canvas"
import { BusinessCard } from "@/components/business-card"
import { Download, Palette } from "lucide-react"
import type { BusinessCardStyle, MyTag } from "@/types"

interface BusinessCardExportProps {
  nickname: string
  occupation: string
  id: string
  level: number
  tags: MyTag[]
  profileUrl: string
}

export function BusinessCardExport({
  nickname,
  occupation,
  id,
  level,
  tags,
  profileUrl,
}: BusinessCardExportProps) {
  const [cardStyle, setCardStyle] = useState<BusinessCardStyle>("dark")
  const [exporting, setExporting] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleExport = useCallback(async () => {
    if (!cardRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      })
      const link = document.createElement("a")
      link.download = `cyber-student-card-${id}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Export error:", error)
    } finally {
      setExporting(false)
    }
  }, [id])

  return (
    <div className="space-y-4">
      {/* スタイル切り替え */}
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-neon-cyan" />
        <span className="text-sm font-mono text-neon-cyan uppercase tracking-wider">テンプレート</span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setCardStyle("dark")}
          className={`flex-1 py-2 px-3 rounded-lg border text-sm font-mono transition-all ${
            cardStyle === "dark"
              ? "border-neon-blue bg-neon-blue/20 text-neon-blue"
              : "border-border bg-muted/20 text-muted-foreground hover:border-neon-blue/50"
          }`}
        >
          ダーク
        </button>
        <button
          type="button"
          onClick={() => setCardStyle("light")}
          className={`flex-1 py-2 px-3 rounded-lg border text-sm font-mono transition-all ${
            cardStyle === "light"
              ? "border-neon-pink bg-neon-pink/20 text-neon-pink"
              : "border-border bg-muted/20 text-muted-foreground hover:border-neon-pink/50"
          }`}
        >
          ライト
        </button>
      </div>

      {/* プレビュー */}
      <div className="flex justify-center overflow-x-auto py-2">
        <BusinessCard
          ref={cardRef}
          nickname={nickname}
          occupation={occupation}
          id={id}
          level={level}
          tags={tags}
          profileUrl={profileUrl}
          style={cardStyle}
        />
      </div>

      {/* ダウンロードボタン */}
      <button
        type="button"
        onClick={handleExport}
        disabled={exporting}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-neon-blue/50 bg-neon-blue/10 text-neon-blue text-sm font-mono hover:bg-neon-blue/20 transition-colors disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        {exporting ? "エクスポート中..." : "名刺をPNG画像でダウンロード"}
      </button>
    </div>
  )
}
