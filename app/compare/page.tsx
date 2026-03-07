"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import { useRouter } from "next/navigation"
import { CompareSearch } from "@/components/compare-search"
import { CompareRadarChart } from "@/components/compare-radar-chart"
import { CompareStats } from "@/components/compare-stats"
import { AuthUI } from "@/components/auth-ui"
import { createClient } from "@/lib/supabase/client"
import { studentStats } from "@/types"
import type { StatData, Profile, MyTag } from "@/types"
import type { User } from "@supabase/supabase-js"
import { ArrowLeft, GitCompare } from "lucide-react"

function CompareContent() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [myProfile, setMyProfile] = useState<Profile | null>(null)
  const [otherProfile, setOtherProfile] = useState<Profile | null>(null)
  const [otherTags, setOtherTags] = useState<MyTag[]>([])
  const supabase = useMemo(() => createClient(), [])

  // 自分のステータス（現在はサンプルデータ、将来的にDB連動）
  const myStats: StatData[] = studentStats

  // 比較相手のステータス（検索後に設定）
  const [otherStats, setOtherStats] = useState<StatData[] | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user ?? null)

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        setMyProfile(data)
      }

      setLoading(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSearch = async (id: string) => {
    setSearchLoading(true)
    setError(null)
    setOtherProfile(null)
    setOtherStats(null)

    try {
      // IDでプロフィール検索
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single()

      if (profileError || !profileData) {
        setError("ユーザーが見つかりません。IDを確認してください。")
        return
      }

      // タグ取得
      const { data: tagsData } = await supabase
        .from("my_tags")
        .select("*")
        .eq("profile_id", id)
        .order("created_at", { ascending: false })

      // user_stats取得を試みる（テーブルがない場合はサンプルデータ）
      const { data: statsData } = await supabase
        .from("user_stats")
        .select("*")
        .eq("profile_id", id)
        .single()

      setOtherProfile(profileData)
      setOtherTags(tagsData || [])

      if (statsData) {
        setOtherStats([
          { label: "知力", value: statsData.intelligence, maxValue: 100 },
          { label: "体力", value: statsData.stamina, maxValue: 100 },
          { label: "創造力", value: statsData.creativity, maxValue: 100 },
          { label: "協調性", value: statsData.cooperation, maxValue: 100 },
          { label: "技術力", value: statsData.tech_skill, maxValue: 100 },
          { label: "精神力", value: statsData.mental, maxValue: 100 },
        ])
      } else {
        // サンプルデータ（DB未設定の場合）
        setOtherStats([
          { label: "知力", value: 50, maxValue: 100 },
          { label: "体力", value: 50, maxValue: 100 },
          { label: "創造力", value: 50, maxValue: 100 },
          { label: "協調性", value: 50, maxValue: 100 },
          { label: "技術力", value: 50, maxValue: 100 },
          { label: "精神力", value: 50, maxValue: 100 },
        ])
      }
    } catch (err) {
      console.error("Search error:", err)
      setError("検索中にエラーが発生しました")
    } finally {
      setSearchLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">ログインが必要です</p>
          <a
            href="/"
            className="text-neon-blue font-mono text-sm hover:underline"
          >
            ログインページへ
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background grid */}
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </button>
          <AuthUI />
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <GitCompare className="w-5 h-5 text-neon-cyan" />
          <h1 className="text-lg font-bold font-sans tracking-wide">
            COMPARE <span className="text-neon-pink">MODE</span>
          </h1>
        </div>

        {/* Search */}
        <section className="bg-card/50 border border-border rounded-xl p-4 backdrop-blur-sm mb-6">
          <CompareSearch onSearch={handleSearch} loading={searchLoading} error={error} />
        </section>

        {/* Comparison results */}
        {otherProfile && otherStats && (
          <div className="space-y-6">
            {/* Names */}
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-sm font-mono font-bold text-neon-blue">{myProfile?.name || "自分"}</p>
                <p className="text-xs font-mono text-muted-foreground">@{myProfile?.id || ""}</p>
              </div>
              <div className="px-3">
                <span className="text-sm font-mono text-muted-foreground">VS</span>
              </div>
              <div className="text-center flex-1">
                <p className="text-sm font-mono font-bold text-neon-pink">{otherProfile.name}</p>
                <p className="text-xs font-mono text-muted-foreground">@{otherProfile.id}</p>
              </div>
            </div>

            {/* Radar Chart */}
            <section className="bg-card/50 border border-border rounded-xl p-6 backdrop-blur-sm">
              <div className="flex justify-center">
                <CompareRadarChart
                  myStats={myStats}
                  otherStats={otherStats}
                  myName={myProfile?.name || "自分"}
                  otherName={otherProfile.name}
                  size={300}
                />
              </div>
            </section>

            {/* Stats Comparison */}
            <section className="bg-card/50 border border-border rounded-xl p-4 backdrop-blur-sm">
              <h2 className="text-sm font-mono font-bold text-neon-cyan uppercase tracking-wider mb-4">
                ステータス比較
              </h2>
              <CompareStats
                myStats={myStats}
                otherStats={otherStats}
                myName={myProfile?.name || "自分"}
                otherName={otherProfile.name}
              />
            </section>
          </div>
        )}

        {/* Empty state */}
        {!otherProfile && !searchLoading && (
          <div className="bg-card/50 border border-border border-dashed rounded-xl p-8 backdrop-blur-sm text-center">
            <GitCompare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-mono text-muted-foreground">
              @IDを入力して他のユーザーと比較しましょう
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center">
          <div className="text-xs font-mono text-muted-foreground">
            © 2026 CYBER_STUDENT
          </div>
        </footer>
      </div>
    </main>
  )
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </main>
      }
    >
      <CompareContent />
    </Suspense>
  )
}
