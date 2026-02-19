-- ============================================
-- CYBER_STUDENT マイグレーション
-- Supabase ダッシュボード → SQL Editor で実行
-- ============================================

-- 1. テーブル作成
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  exp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS my_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS 有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE my_tags ENABLE ROW LEVEL SECURITY;

-- 3. 既存ポリシー削除（冪等性のため）
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are publicly viewable" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can view their own tags" ON my_tags;
DROP POLICY IF EXISTS "Users can view own tags" ON my_tags;
DROP POLICY IF EXISTS "Users can manage their own tags" ON my_tags;
DROP POLICY IF EXISTS "Users can insert own tags" ON my_tags;
DROP POLICY IF EXISTS "Users can delete own tags" ON my_tags;
DROP POLICY IF EXISTS "My tags are publicly viewable" ON my_tags;
DROP POLICY IF EXISTS "Public tags are viewable by everyone" ON my_tags;

-- 4. 既存トリガー削除
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_updated_at ON profiles;

-- 5. profiles RLS ポリシー
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. my_tags RLS ポリシー
CREATE POLICY "Public tags are viewable by everyone"
  ON my_tags FOR SELECT USING (true);

CREATE POLICY "Users can insert own tags"
  ON my_tags FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete own tags"
  ON my_tags FOR DELETE USING (auth.uid() = profile_id);

-- 7. 新規ユーザー登録時に profile を自動作成するトリガー
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'ユーザー'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
