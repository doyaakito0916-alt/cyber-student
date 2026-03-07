"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { DocumentForm } from "@/components/document-form"
import { ResumeDocument } from "@/components/document-resume"
import { PortfolioDocument } from "@/components/document-portfolio"
import { AuthUI } from "@/components/auth-ui"
import { createClient } from "@/lib/supabase/client"
import { studentStats } from "@/types"
import type { Profile, MyTag } from "@/types"
import type { User } from "@supabase/supabase-js"
import { ArrowLeft, FileText, Download, BookOpen, Briefcase } from "lucide-react"

// PDFDownloadLink を dynamic import（SSR無効化）
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <span className="text-sm font-mono text-muted-foreground">PDF準備中...</span> }
)

function DocumentsContent() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [myTags, setMyTags] = useState<MyTag[]>([])
  const [docType, setDocType] = useState<"resume" | "portfolio">("resume")
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user ?? null)

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        const { data: tagsData } = await supabase
          .from("my_tags")
          .select("*")
          .eq("profile_id", user.id)
          .order("created_at", { ascending: false })

        if (profileData) setProfile(profileData)
        if (tagsData) setMyTags(tagsData)
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

  const handleProfileChange = (updates: Partial<Profile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates })
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    )
  }

  if (!user || !profile) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">ログインが必要です</p>
          <a href="/" className="text-neon-blue font-mono text-sm hover:underline">
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
          <FileText className="w-5 h-5 text-neon-pink" />
          <h1 className="text-lg font-bold font-sans tracking-wide">
            DOCUMENT <span className="text-neon-pink">GENERATOR</span>
          </h1>
        </div>

        {/* Doc type selector */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setDocType("resume")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border text-sm font-mono transition-all ${
              docType === "resume"
                ? "border-neon-blue bg-neon-blue/20 text-neon-blue"
                : "border-border bg-muted/20 text-muted-foreground hover:border-neon-blue/50"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            履歴書
          </button>
          <button
            type="button"
            onClick={() => setDocType("portfolio")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border text-sm font-mono transition-all ${
              docType === "portfolio"
                ? "border-neon-pink bg-neon-pink/20 text-neon-pink"
                : "border-border bg-muted/20 text-muted-foreground hover:border-neon-pink/50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            ポートフォリオ
          </button>
        </div>

        {/* Form */}
        <section className="bg-card/50 border border-border rounded-xl p-4 backdrop-blur-sm mb-6">
          <h2 className="text-sm font-mono font-bold text-neon-cyan uppercase tracking-wider mb-4">
            書類情報を入力
          </h2>
          <DocumentForm profile={profile} onChange={handleProfileChange} />
        </section>

        {/* Download */}
        <section className="bg-card/50 border border-border rounded-xl p-4 backdrop-blur-sm">
          <h2 className="text-sm font-mono font-bold text-neon-cyan uppercase tracking-wider mb-4">
            PDFダウンロード
          </h2>
          <p className="text-xs text-muted-foreground font-mono mb-4">
            上のフォームに情報を入力してからダウンロードしてください。タグ情報はプロフィールから自動的に取得されます。
          </p>

          <PDFDownloadLink
            document={
              docType === "resume" ? (
                <ResumeDocument profile={profile} tags={myTags} />
              ) : (
                <PortfolioDocument profile={profile} stats={studentStats} tags={myTags} />
              )
            }
            fileName={`cyber-student-${docType}-${profile.id}.pdf`}
          >
            {({ loading: pdfLoading }) => (
              <button
                type="button"
                disabled={pdfLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-neon-pink/50 bg-neon-pink/10 text-neon-pink text-sm font-mono hover:bg-neon-pink/20 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {pdfLoading
                  ? "PDF生成中..."
                  : docType === "resume"
                  ? "履歴書PDFをダウンロード"
                  : "ポートフォリオPDFをダウンロード"}
              </button>
            )}
          </PDFDownloadLink>
        </section>

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

export default function DocumentsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </main>
      }
    >
      <DocumentsContent />
    </Suspense>
  )
}
