export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
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
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-neon-blue/20" />
        <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-neon-pink/20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-neon-pink/20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-neon-blue/20" />
      </div>

      <div className="relative z-10 text-center space-y-6">
        {/* CRT scanline effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-0 w-full h-[2px] bg-neon-blue/20 animate-scan" />
        </div>

        <h1 className="text-4xl font-bold tracking-wider">
          <span className="text-neon-blue">CYBER</span>
          <span className="text-foreground">_</span>
          <span className="text-neon-pink">STUDENT</span>
        </h1>

        <p className="text-sm font-mono text-muted-foreground tracking-wide">
          // システム初期化中...
        </p>

        <div className="flex items-center justify-center gap-2 text-xs font-mono text-neon-cyan">
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          Phase 1 基盤セットアップ完了
        </div>
      </div>
    </main>
  )
}
