"use client"

import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { X, Plus, Trash2, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Profile, MyTag, TagRarity } from "@/types"
import { TAG_RARITY_STYLES } from "@/types"

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  profile: Profile | null
  myTags: MyTag[]
  onSave: (profile: Profile, myTags: MyTag[]) => void
}

export function ProfileEditModal({ isOpen, onClose, profile, myTags, onSave }: ProfileEditModalProps) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(profile?.name || "")
  const [tags, setTags] = useState<MyTag[]>(myTags)
  const [newTag, setNewTag] = useState({ name: "", rarity: "common" as TagRarity })
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (profile) {
      setName(profile.name)
    }
    setTags(myTags)
  }, [profile, myTags])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setLoading(true)

    try {
      // プロフィール更新（名前のみ）
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name })
        .eq('id', profile.id)

      if (profileError) throw profileError

      // タグ更新（全削除→全挿入）
      const { error: deleteError } = await supabase
        .from('my_tags')
        .delete()
        .eq('profile_id', profile.id)

      if (deleteError) throw deleteError

      if (tags.length > 0) {
        const { error: insertError } = await supabase
          .from('my_tags')
          .insert(
            tags.map(tag => ({
              profile_id: profile.id,
              name: tag.name,
              rarity: tag.rarity,
              date: tag.date,
            }))
          )

        if (insertError) throw insertError
      }

      onSave({ ...profile, name }, tags)
      onClose()
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.name.trim()) {
      setTags([...tags, {
        name: newTag.name.trim(),
        rarity: newTag.rarity,
        date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      }])
      setNewTag({ name: "", rarity: "common" })
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative bg-card border-2 border-neon-blue rounded-xl p-6 shadow-[0_0_30px_oklch(0.7_0.2_250_/_0.3)] max-w-md w-full max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold font-sans tracking-wide mb-6">
          プロフィール<span className="text-neon-pink">編集</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-neon-blue uppercase tracking-wider mb-2">
                ユーザー名
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-muted/20 border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-neon-blue"
                placeholder="田中 サイバー"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                @ID（変更不可）
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-muted/30 border border-r-0 border-border rounded-l-lg text-sm font-mono text-muted-foreground">
                  @
                </span>
                <input
                  type="text"
                  value={profile?.id || ""}
                  disabled
                  className="flex-1 px-3 py-2 bg-muted/30 border border-border rounded-r-lg text-sm font-mono text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* MY TAG */}
          <div>
            <label className="block text-xs font-mono text-neon-blue uppercase tracking-wider mb-3">
              My Tag
            </label>

            {/* 既存タグ */}
            <div className="space-y-2 mb-4">
              {tags.map((tag, index) => {
                const styles = TAG_RARITY_STYLES[tag.rarity]
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border-2 transition-all",
                      styles.border,
                      styles.glow,
                      styles.bg
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className={cn("w-4 h-4", styles.text)} />
                      <span className={cn("text-sm font-mono", styles.text)}>{tag.name}</span>
                      <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded border", styles.bg, styles.text, styles.border)}>
                        {tag.rarity.toUpperCase()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="p-1 rounded text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* 新規タグ追加 */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                className="flex-1 px-3 py-2 bg-muted/20 border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-neon-blue"
                placeholder="新しいタグ名"
              />
              <select
                value={newTag.rarity}
                onChange={(e) => setNewTag({ ...newTag, rarity: e.target.value as TagRarity })}
                className="px-3 py-2 bg-muted/20 border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-neon-blue"
              >
                <option value="common">COMMON</option>
                <option value="rare">RARE</option>
                <option value="epic">EPIC</option>
                <option value="legendary">LEGENDARY</option>
              </select>
              <button
                type="button"
                onClick={addTag}
                className="p-2 rounded-lg border border-neon-blue/50 bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg border border-border bg-muted/20 text-muted-foreground text-sm font-mono hover:bg-muted/30"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 rounded-lg border border-neon-blue/50 bg-neon-blue/10 text-neon-blue text-sm font-mono hover:bg-neon-blue/20 disabled:opacity-50"
            >
              {loading ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
