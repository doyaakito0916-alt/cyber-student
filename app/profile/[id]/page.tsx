"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import { useParams } from "next/navigation"
import { HexagonRadarChart } from "@/components/hexagon-radar-chart"
import { DigitalIdCard } from "@/components/digital-id-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { Trophy, Brain, Zap, Star, Heart, Code, Shield } from "lucide-react"
import type { Profile, MyTag } from "@/types"
import { studentStats } from "@/types"

const statIcons = [
  <Brain key="brain" className="w-4 h-4" />,
  <Zap key="zap" className="w-4 h-4" />,
  <Star key="star" className="w-4 h-4" />,
  <Heart key="heart" className="w-4 h-4" />,
  <Code key="code" className="w-4 h-4" />,
  <Shield key="shield" className="w-4 h-4" />,
]

function ProfileContent() {
  const params = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [myTags, setMyTags] = useState<MyTag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileId = params.id as string

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single()

        if (profileError) {
          setError('プロフィールが見つかりません')
          return
        }

        const { data: tagsData, error: tagsError } = await supabase
          .from('my_tags')
          .select('*')
          .eq('profile_id', profileId)
          .order('created_at', { ascending: false })

        if (tagsError) {
          console.error('Tags fetch error:', tagsError)
        }

        setProfile(profileData)
        setMyTags(tagsData || [])
      } catch (err) {
        console.error('Profile fetch error:', err)
        setError('エラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProfile()
    }
  }, [params.id, supabase])

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground overflow-x-hidden flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    )
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-background text-foreground overflow-x-hidden flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">プロフィールが見つかりません</h1>
          <p className="text-muted-foreground">URLが正しいか確認してください</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
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
        <Tabs defaultValue="id" className="w-full">
          {/* ID Card Tab */}
          <TabsContent value="id" className="space-y-6">
            <DigitalIdCard
              nickname={profile.name}
              occupation="フルスタック開発者"
              id={profile.id}
              level={profile.level}
              exp={profile.exp}
              maxExp={10000}
              visibility="public"
              myTags={myTags}
            />
          </TabsContent>

          {/* Status Tab */}
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
    </main>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background text-foreground overflow-x-hidden flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    }>
      <ProfileContent />
    </Suspense>
  )
}
