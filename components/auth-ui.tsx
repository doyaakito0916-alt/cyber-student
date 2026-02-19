"use client"

import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { LogIn, LogOut } from "lucide-react"

export function AuthUI() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleGoogleLogin = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?tab=id`,
      },
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="h-10 w-24 animate-pulse rounded-lg bg-muted/30" />
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {user.user_metadata?.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt=""
            className="h-8 w-8 rounded-full border border-border"
          />
        )}
        <span className="max-w-[140px] truncate text-xs font-mono text-muted-foreground sm:max-w-[200px]">
          {user.email}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/20 px-2.5 py-1.5 text-[10px] font-mono text-muted-foreground hover:bg-muted/40"
        >
          <LogOut className="w-3.5 h-3.5" />
          ログアウト
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex items-center gap-2 rounded-lg border border-neon-blue/50 bg-neon-blue/10 px-3 py-2 text-xs font-mono text-neon-blue hover:bg-neon-blue/20"
    >
      <LogIn className="w-4 h-4" />
      Googleでログイン
    </button>
  )
}
