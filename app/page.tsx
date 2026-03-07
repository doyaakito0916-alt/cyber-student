"use client"
export const dynamic = "force-dynamic";
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import { HexagonRadarChart } from "@/components/hexagon-radar-chart"
import { AchievementBadge } from "@/components/achievement-badge"
import { DigitalIdCard } from "@/components/digital-id-card"
import type { VisibilityType } from "@/types"
import { AuthUI } from "@/components/auth-ui"
import { LoginScreen } from "@/components/login-screen"
import { ProfileEditModal } from "@/components/profile-edit-modal"
import { BusinessCardExport } from "@/components/business-card-export"
import { useProfile } from "@/hooks/use-profile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import {
  Brain,
  Zap,
  Target,
  Heart,
  Shield,
  Flame,
  Trophy,
  Code,
  BookOpen,
  Users,
  Rocket,
  Star,
  Share2,
  Globe,
  Lock,
  Pencil,
  Link2,
  X,
  GitCompare,
  FileText,
  CreditCard,
} from "lucide-react"

// Sample data
const studentStats = [
  { label: "知力", value: 85, maxValue: 100 },
  { label: "体力", value: 72, maxValue: 100 },
  { label: "創造力", value: 91, maxValue: 100 },
  { label: "協調性", value: 78, maxValue: 100 },
  { label: "技術力", value: 88, maxValue: 100 },
  { label: "精神力", value: 65, maxValue: 100 },
]

const achievements = [
  {
    title: "コードマスター",
    description: "プログラミング課題を全てクリア",
    icon: <Code className="w-5 h-5" />,
    rarity: "legendary" as const,
    unlocked: true,
    date: "2026.01.15",
  },
  {
    title: "知識の探求者",
    description: "図書館で100冊以上の本を借りた",
    icon: <BookOpen className="w-5 h-5" />,
    rarity: "epic" as const,
    unlocked: true,
    date: "2025.12.20",
  },
  {
    title: "チームリーダー",
    description: "グループプロジェクトでリーダーを務めた",
    icon: <Users className="w-5 h-5" />,
    rarity: "rare" as const,
    unlocked: true,
    date: "2025.11.08",
  },
  {
    title: "早起きの達人",
    description: "30日連続で朝活を達成",
    icon: <Zap className="w-5 h-5" />,
    rarity: "rare" as const,
    unlocked: true,
    date: "2025.10.01",
  },
  {
    title: "完璧主義者",
    description: "全てのテストで満点を獲得",
    icon: <Target className="w-5 h-5" />,
    rarity: "legendary" as const,
    unlocked: false,
  },
  {
    title: "パイオニア",
    description: "新しいクラブを設立した",
    icon: <Rocket className="w-5 h-5" />,
    rarity: "epic" as const,
    unlocked: false,
  },
  {
    title: "助け合いの心",
    description: "50人以上の学生をサポート",
    icon: <Heart className="w-5 h-5" />,
    rarity: "rare" as const,
    unlocked: true,
    date: "2025.09.15",
  },
  {
    title: "不屈の精神",
    description: "困難なプロジェクトを完遂",
    icon: <Shield className="w-5 h-5" />,
    rarity: "common" as const,
    unlocked: true,
    date: "2025.08.20",
  },
]

const statIcons = [
  <Brain key="brain" className="w-5 h-5" />,
  <Flame key="flame" className="w-5 h-5" />,
  <Star key="star" className="w-5 h-5" />,
  <Heart key="heart" className="w-5 h-5" />,
  <Code key="code" className="w-5 h-5" />,
  <Shield key="shield" className="w-5 h-5" />,
]

function StudentPortfolioContent() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("status")
  const [visibility, setVisibility] = useState<VisibilityType>("public")
  const [showQrModal, setShowQrModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const searchParams = useSearchParams()
  
  const { profile, myTags, loading: profileLoading, updateProfile } = useProfile(user)

  useEffect(() => {
    const supabase = createClient()
    
    // 認証状態をチェック
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user ?? null)
      setLoading(false)
    }

    checkAuth()

    // 認証状態の変更をリッスン
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // ローディング中
  if (loading || profileLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground overflow-x-hidden flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    )
  }

  // 未ログインの場合はログイン画面を表示
  if (!user) {
    return <LoginScreen />
  }

  const profileUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/profile/${profile?.id || user?.id}` 
    : ""

  const handleShare = () => {
    setShowQrModal(true)
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* QRコードモーダル - 読み込むとPROFILEを閲覧できるURL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative bg-card border-2 border-neon-blue rounded-xl p-6 shadow-[0_0_30px_oklch(0.7_0.2_250_/_0.3)] max-w-[280px]">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-2 right-2 p-1 rounded text-muted-foreground hover:text-foreground"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
            <p className="text-sm font-mono text-neon-blue uppercase tracking-wider mb-3 text-center">
              カメラで読み取ってPROFILEを閲覧
            </p>
            <div className="flex justify-center bg-white p-3 rounded-lg">
              <QRCodeSVG
                value={profileUrl}
                size={200}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-xs font-mono text-muted-foreground mt-3 text-center">
              このQRコードを読み取るとこのPROFILEが開きます
            </p>
          </div>
        </div>
      )}

      {/* Animated background grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(oklch(0.7 0.2 250) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.7 0.2 250) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-neon-blue/20" />
        <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-neon-pink/20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-neon-pink/20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-neon-blue/20" />
      </div>

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-10 w-full max-w-[390px] sm:max-w-6xl mx-auto">
        {/* Googleログイン / ユーザー表示 */}
        <div className="flex justify-end mb-4">
          <AuthUI />
        </div>
        {/* Mobile tabs navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Status Tab */}
          <TabsContent value="status" className="space-y-6">
            {/* Radar Chart */}
            <section className="bg-card/50 border border-border rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-neon-blue" />
                <h2 className="text-lg font-bold font-sans tracking-wide">
                  ABILITY <span className="text-neon-pink">MATRIX</span>
                </h2>
              </div>
              
              <div className="flex justify-center">
                <HexagonRadarChart stats={studentStats} size={280} />
              </div>

              {/* Stats list */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {studentStats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border border-border/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center text-neon-blue">
                      {statIcons[index]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-muted-foreground font-mono">{stat.label}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-neon-blue to-neon-pink rounded-full"
                            style={{ width: `${(stat.value / stat.maxValue) * 100}%` }}
                          />
                        </div>
                        <span className="text-base font-mono font-bold text-foreground">
                          {stat.value}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "総合ランク", value: "A+", color: "text-neon-blue" },
                { label: "達成率", value: "87%", color: "text-neon-pink" },
                { label: "アクティブ日数", value: "156", color: "text-neon-cyan" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-card/50 border border-border rounded-lg p-4 text-center backdrop-blur-sm"
                >
                  <div className={`text-2xl font-bold font-mono ${item.color}`}>{item.value}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1 uppercase">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ID Card Tab - カジュアル名刺（デジタルステータス） */}
          <TabsContent value="id" className="space-y-6">
            <DigitalIdCard
              nickname={profile?.name || "ゲスト"}
              occupation="フルスタック開発者"
              id={profile?.id || "guest"}
              level={profile?.level || 1}
              exp={profile?.exp || 0}
              maxExp={10000}
              visibility={visibility}
              myTags={myTags}
            />

            {/* 共有・編集 */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-neon-blue/50 bg-neon-blue/10 text-neon-blue text-sm font-mono hover:bg-neon-blue/20 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                名刺をシェア
              </button>
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-neon-pink/50 bg-neon-pink/10 text-neon-pink text-sm font-mono hover:bg-neon-pink/20 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                プロフィールを編集
              </button>
            </div>

            {/* API連携 - 使っているだけで実績が育つ */}
            <section className="bg-card/50 border border-border rounded-xl p-4 backdrop-blur-sm border-dashed border-neon-cyan/30">
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4 text-neon-cyan" />
                <h3 className="text-sm font-mono font-bold text-neon-cyan uppercase tracking-wider">
                  連携で実績が自動記録
                </h3>
                <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                  準備中
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                GitHub・Notion・学習サービスなどと連携すると、使っているだけでステータスや実績が自動でたまります。入力の手間を減らして継続しやすく。
              </p>
            </section>

            {/* 表示範囲 - 連携セクションの下 */}
            <section className="bg-card/50 border border-border rounded-xl p-4 backdrop-blur-sm">
              <h3 className="text-sm font-mono font-bold text-neon-blue uppercase tracking-wider mb-3">
                表示範囲
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility("public")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-mono transition-all ${
                    visibility === "public"
                      ? "border-neon-blue bg-neon-blue/20 text-neon-blue"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-neon-blue/50"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  公開
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility("limited")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-mono transition-all ${
                    visibility === "limited"
                      ? "border-neon-pink bg-neon-pink/20 text-neon-pink"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-neon-pink/50"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  限定公開
                </button>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-2">
                {visibility === "public"
                  ? "許可したユーザーのみが閲覧できます"
                  : "同じコミュニティ（学校・会社）のメンバーのみ閲覧できます"}
              </p>
            </section>
          </TabsContent>

          {/* Card Tab - 名刺エクスポート */}
          <TabsContent value="card" className="space-y-6">
            <section className="bg-card/50 border border-border rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-neon-cyan" />
                <h2 className="text-lg font-bold font-sans tracking-wide">
                  BUSINESS <span className="text-neon-pink">CARD</span>
                </h2>
              </div>
              <BusinessCardExport
                nickname={profile?.name || "ゲスト"}
                occupation={profile?.occupation || "フルスタック開発者"}
                id={profile?.id || "guest"}
                level={profile?.level || 1}
                tags={myTags}
                profileUrl={profileUrl}
              />
            </section>
          </TabsContent>

          {/* 機能リンク（比較・書類作成） */}
          <div className="flex gap-2 mt-4">
            <a
              href="/compare"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan text-sm font-mono hover:bg-neon-cyan/20 transition-colors"
            >
              <GitCompare className="w-4 h-4" />
              他者と比較
            </a>
            <a
              href="/documents"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-neon-pink/50 bg-neon-pink/10 text-neon-pink text-sm font-mono hover:bg-neon-pink/20 transition-colors"
            >
              <FileText className="w-4 h-4" />
              書類作成
            </a>
          </div>

          <TabsList className="w-full grid grid-cols-3 bg-muted/20 border border-border rounded-lg p-1 mt-4">
            <TabsTrigger
              value="id"
              className="font-mono text-sm data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan data-[state=active]:shadow-[0_0_10px_oklch(0.75_0.15_200_/_0.3)]"
            >
              ID CARD
            </TabsTrigger>
            <TabsTrigger
              value="status"
              className="font-mono text-sm data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue data-[state=active]:shadow-[0_0_10px_oklch(0.7_0.2_250_/_0.3)]"
            >
              STATUS
            </TabsTrigger>
            <TabsTrigger
              value="card"
              className="font-mono text-sm data-[state=active]:bg-neon-pink/20 data-[state=active]:text-neon-pink data-[state=active]:shadow-[0_0_10px_oklch(0.65_0.22_330_/_0.3)]"
            >
              CARD
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <div className="text-xs font-mono text-muted-foreground">
            © 2026 CYBER_STUDENT
          </div>
        </footer>
      </div>

      {/* プロフィール編集モーダル */}
      {profile && (
        <ProfileEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          profile={profile}
          myTags={myTags}
          onSave={updateProfile}
        />
      )}

    </main>
  )
}

export default function StudentPortfolio() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background text-foreground overflow-x-hidden flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    }>
      <StudentPortfolioContent />
    </Suspense>
  )
}
