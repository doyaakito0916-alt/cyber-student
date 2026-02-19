"use client"

import { useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { LogIn, Shield, Zap, Users, Trophy } from "lucide-react"

export function LoginScreen() {
  const [loading, setLoading] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      })
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden flex items-center justify-center">
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

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-neon-blue to-neon-pink flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-wide">
              CYBER<span className="text-neon-pink">_STUDENT</span>
            </h1>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            サイバーパンク風学生ポートフォリオ
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card/50 border border-border rounded-xl p-8 backdrop-blur-sm shadow-[0_0_30px_oklch(0.7_0.2_250_/_0.3)]">
          <div className="text-center mb-8">
            <h2 className="text-lg font-bold font-sans tracking-wide mb-2">
              ようこそ、<span className="text-neon-pink">サイバー</span>な世界へ
            </h2>
            <p className="text-xs text-muted-foreground font-mono">
              Googleアカウントでログインして、あなたのプロフィールを構築
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-neon-blue" />
              </div>
              <p className="text-[10px] font-mono text-muted-foreground">実績管理</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-neon-pink/10 border border-neon-pink/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-neon-pink" />
              </div>
              <p className="text-[10px] font-mono text-muted-foreground">プロフィール</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-neon-cyan" />
              </div>
              <p className="text-[10px] font-mono text-muted-foreground">シェア機能</p>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg border border-neon-blue/50 bg-neon-blue/10 text-neon-blue font-mono text-sm hover:bg-neon-blue/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
                ログイン中...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Googleでログイン
              </>
            )}
          </button>

          {/* Privacy Note */}
          <div className="mt-6 text-center">
            <p className="text-[10px] text-muted-foreground font-mono">
              セキュアな認証システム • データは暗号化保存
            </p>
          </div>
        </div>

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
