import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile, MyTag } from "@/types"

export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [myTags, setMyTags] = useState<MyTag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setMyTags([])
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        const supabase = createClient()

        // プロフィール取得
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile fetch error:', profileError)
        }

        // MY TAG取得
        const { data: tagsData, error: tagsError } = await supabase
          .from('my_tags')
          .select('*')
          .eq('profile_id', user.id)
          .order('created_at', { ascending: false })

        if (tagsError) {
          console.error('Tags fetch error:', tagsError)
        }

        setProfile(profileData)
        setMyTags(tagsData || [])
      } catch (error) {
        console.error('Profile fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const updateProfile = (newProfile: Profile, newTags: MyTag[]) => {
    setProfile(newProfile)
    setMyTags(newTags)
  }

  return { profile, myTags, loading, updateProfile }
}
