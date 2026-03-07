"use client"

import { useState } from "react"
import { Search, AlertCircle } from "lucide-react"

interface CompareSearchProps {
  onSearch: (id: string) => Promise<void>
  loading: boolean
  error: string | null
}

export function CompareSearch({ onSearch, loading, error }: CompareSearchProps) {
  const [searchId, setSearchId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanId = searchId.replace(/^@/, "").trim()
    if (cleanId) {
      await onSearch(cleanId)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 flex">
          <span className="inline-flex items-center px-3 bg-muted/30 border border-r-0 border-border rounded-l-lg text-sm font-mono text-muted-foreground">
            @
          </span>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 px-3 py-2.5 bg-muted/20 border border-border rounded-r-lg text-sm font-mono focus:outline-none focus:border-neon-cyan"
            placeholder="比較したいユーザーのIDを入力"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !searchId.trim()}
          className="px-4 py-2.5 rounded-lg border border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan text-sm font-mono hover:bg-neon-cyan/20 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {loading ? "検索中..." : "検索"}
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-sm font-mono text-neon-pink">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </form>
  )
}
