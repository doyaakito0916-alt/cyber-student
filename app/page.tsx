"use client"
export const dynamic = "force-dynamic";
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import { HexagonRadarChart } from "@/components/hexagon-radar-chart"
import { DigitalIdCard } from "@/components/digital-id-card"
import { AuthUI } from "@/components/auth-ui"
import { LoginScreen } from "@/components/login-screen"
import { ProfileEditModal } from "@/components/profile-edit-modal"
import { useProfile } from "@/hooks/use-profile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { VisibilityType } from "@/types"
import { studentStats } from "@/types"
import {
  Brain,
  Zap,
  Star,
  Heart,
  Code,
  Shield,
  Trophy,
  Share2,
  Globe,
  Lock,
  Pencil,
  Link2,
  X,
} from "lucide-react"

const statIcons = [
  <Brain key="brain" className="w-4 h-4" />,
  <Zap key="flame" className="w-4 h-4" />,
  <Star key="star" className="w-4 h-4" />,
  <Heart key="heart" className="w-4 h-4" />,
  <Code key="code" className="w-4 h-4" />,
  <Shield key="shield" className="w-4 h-4" />,
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

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user ?? null)
      setLoading(false)
    }

    checkAuth()

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

  if (loading || profileLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground overflow-x-hidden flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    )
  }

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
      {/* QRコードモーダル */}
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
            <p className="text-xs font-mono text-neon-blue uppercase tracking-wider mb-3 text-center">
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
            <p className="text-[10px] font-mono text-muted-foreground mt-3 text-center">
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
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-neon-blue/20" />
        <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-neon-pink/20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-neon-pink/20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-neon-blue/20" />
      </div>

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-10 w-full max-w-[390px] sm:max-w-6xl mx-auto">
        {/* ユーザー表示 */}
        <div className="flex justify-end mb-4">
          <AuthUI />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* STATUS Tab */}
          <TabsContent value="status" className="space-y-6">
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
                      <div className="text-xs text-muted-foreground font-mono">{stat.label}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-neon-blue to-neon-pink rounded-full"
                            style={{ width: `${(stat.value / stat.maxValue) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono font-bold text-foreground">
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
                  <div className="text-[10px] text-muted-foreground font-mono mt-1 uppercase">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ID CARD Tab */}
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
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-neon-blue/50 bg-neon-blue/10 text-neon-blue text-xs font-mono hover:bg-neon-blue/20 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                名刺をシェア
              </button>
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-neon-pink/50 bg-neon-pink/10 text-neon-pink text-xs font-mono hover:bg-neon-pink/20 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                プロフィールを編集
              </button>
            </div>

            {/* API連携 */}
            <section className="bg-card/50 border border-border rounded-xl p-4 backdrop-blur-sm border-dashed border-neon-cyan/30">
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4 text-neon-cyan" />
                <h3 className="text-xs font-mono font-bold text-neon-cyan uppercase tracking-wider">
                  連携で実績が自動記録
                </h3>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                  準備中
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">
                GitHub・Notion・学習サービスなどと連携すると、使っているだけでステータスや実績が自動でたまります。入力の手間を減らして継続しやすく。
              </p>
            </section>

            {/* 表示範囲 */}
            <section className="bg-card/50 border border-border rounded-xl p-4 backdrop-blur-sm">
              <h3 className="text-xs font-mono font-bold text-neon-blue uppercase tracking-wider mb-3">
                表示範囲
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility("public")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-mono transition-all ${
                    visibility === "public"
                      ? "border-neon-blue bg-neon-blue/20 text-neon-blue"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-neon-blue/50"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  公開
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility("limited")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-mono transition-all ${
                    visibility === "limited"
                      ? "border-neon-pink bg-neon-pink/20 text-neon-pink"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-neon-pink/50"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  限定公開
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono mt-2">
                {visibility === "public"
                  ? "許可したユーザーのみが閲覧できます"
                  : "同じコミュニティ（学校・会社）のメンバーのみ閲覧できます"}
              </p>
            </section>
          </TabsContent>

          <TabsList className="w-full grid grid-cols-2 bg-muted/20 border border-border rounded-lg p-1 mt-6">
            <TabsTrigger
              value="id"
              className="font-mono text-xs data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan data-[state=active]:shadow-[0_0_10px_oklch(0.75_0.15_200_/_0.3)]"
            >
              ID CARD
            </TabsTrigger>
            <TabsTrigger
              value="status"
              className="font-mono text-xs data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue data-[state=active]:shadow-[0_0_10px_oklch(0.7_0.2_250_/_0.3)]"
            >
              STATUS
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <div className="text-[10px] font-mono text-muted-foreground">
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
