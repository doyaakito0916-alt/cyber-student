// 共通の型定義

export type TagRarity = "common" | "rare" | "epic" | "legendary"

export interface Profile {
  id: string
  name: string
  avatar_url: string | null
  level: number
  exp: number
}

export interface MyTag {
  id?: string
  name: string
  rarity: TagRarity
  date: string
}

export type VisibilityType = "public" | "limited"

// サンプルステータスデータ
export interface StatData {
  label: string
  value: number
  maxValue: number
}

export const studentStats: StatData[] = [
  { label: "知力", value: 85, maxValue: 100 },
  { label: "体力", value: 72, maxValue: 100 },
  { label: "創造力", value: 91, maxValue: 100 },
  { label: "協調性", value: 78, maxValue: 100 },
  { label: "技術力", value: 88, maxValue: 100 },
  { label: "精神力", value: 65, maxValue: 100 },
]

// レアリティの順序（ソート用）
export const RARITY_ORDER: TagRarity[] = ["legendary", "epic", "rare", "common"]

// レアリティごとのスタイル
export const TAG_RARITY_STYLES: Record<TagRarity, { border: string; glow: string; bg: string; text: string }> = {
  common: {
    border: "border-muted-foreground/50",
    glow: "",
    bg: "bg-muted/30",
    text: "text-muted-foreground",
  },
  rare: {
    border: "border-neon-blue",
    glow: "shadow-[0_0_15px_oklch(0.7_0.2_250_/_0.4)]",
    bg: "bg-neon-blue/10",
    text: "text-neon-blue",
  },
  epic: {
    border: "border-neon-pink",
    glow: "shadow-[0_0_20px_oklch(0.65_0.22_330_/_0.4)]",
    bg: "bg-neon-pink/10",
    text: "text-neon-pink",
  },
  legendary: {
    border: "border-yellow-400",
    glow: "shadow-[0_0_25px_oklch(0.85_0.2_85_/_0.5)]",
    bg: "bg-yellow-400/10",
    text: "text-yellow-400",
  },
}
