-- ============================================
-- CYBER_STUDENT マイグレーション
-- Supabase ダッシュボード → SQL Editor で実行
-- ============================================

-- 1. profiles テーブル
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  exp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. my_tags テーブル（実績タグ）
CREATE TABLE my_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS 有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE my_tags ENABLE ROW LEVEL SECURITY;

-- 4. profiles RLS ポリシー
-- 自分のプロフィールを閲覧
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 公開プロフィールは誰でも閲覧可能（共有リンク用）
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- 自分のプロフィールを更新
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 自分のプロフィールを挿入
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 5. my_tags RLS ポリシー
-- 自分のタグを閲覧
CREATE POLICY "Users can view own tags"
  ON my_tags FOR SELECT
  USING (auth.uid() = profile_id);

-- 公開プロフィールのタグは誰でも閲覧可能
CREATE POLICY "Public tags are viewable by everyone"
  ON my_tags FOR SELECT
  USING (true);

-- 自分のタグを挿入
CREATE POLICY "Users can insert own tags"
  ON my_tags FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- 自分のタグを削除
CREATE POLICY "Users can delete own tags"
  ON my_tags FOR DELETE
  USING (auth.uid() = profile_id);

-- 6. 新規ユーザー登録時に profile を自動作成するトリガー
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
