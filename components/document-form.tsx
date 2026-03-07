"use client"

import type { Profile } from "@/types"

interface DocumentFormProps {
  profile: Profile
  onChange: (updates: Partial<Profile>) => void
}

export function DocumentForm({ profile, onChange }: DocumentFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-mono text-neon-blue uppercase tracking-wider mb-2">
          名前
        </label>
        <input
          type="text"
          value={profile.name || ""}
          onChange={(e) => onChange({ name: e.target.value })}
          className="w-full px-3 py-2 bg-muted/20 border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-neon-blue"
          placeholder="山田 太郎"
        />
      </div>

      <div>
        <label className="block text-sm font-mono text-neon-blue uppercase tracking-wider mb-2">
          職業・肩書
        </label>
        <input
          type="text"
          value={profile.occupation || ""}
          onChange={(e) => onChange({ occupation: e.target.value })}
          className="w-full px-3 py-2 bg-muted/20 border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-neon-blue"
          placeholder="フルスタック開発者"
        />
      </div>

      <div>
        <label className="block text-sm font-mono text-neon-blue uppercase tracking-wider mb-2">
          連絡先メール
        </label>
        <input
          type="email"
          value={profile.contact_email || ""}
          onChange={(e) => onChange({ contact_email: e.target.value })}
          className="w-full px-3 py-2 bg-muted/20 border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-neon-blue"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-mono text-neon-blue uppercase tracking-wider mb-2">
          学歴・経歴
        </label>
        <textarea
          value={profile.education || ""}
          onChange={(e) => onChange({ education: e.target.value })}
          className="w-full px-3 py-2 bg-muted/20 border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-neon-blue min-h-[80px] resize-y"
          placeholder="○○大学 工学部 情報工学科&#10;20XX年4月入学"
        />
      </div>

      <div>
        <label className="block text-sm font-mono text-neon-blue uppercase tracking-wider mb-2">
          自己PR / 自己紹介
        </label>
        <textarea
          value={profile.bio || ""}
          onChange={(e) => onChange({ bio: e.target.value })}
          className="w-full px-3 py-2 bg-muted/20 border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-neon-blue min-h-[100px] resize-y"
          placeholder="自己PRやアピールポイントを記入..."
        />
      </div>
    </div>
  )
}
