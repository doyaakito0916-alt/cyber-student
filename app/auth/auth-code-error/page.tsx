import Link from "next/link"

export default function AuthCodeErrorPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <p className="text-sm text-muted-foreground font-mono mb-4">
        認証でエラーが発生しました。もう一度お試しください。
      </p>
      <Link
        href="/"
        className="text-xs font-mono text-neon-blue hover:underline"
      >
        ← トップに戻る
      </Link>
    </main>
  )
}
