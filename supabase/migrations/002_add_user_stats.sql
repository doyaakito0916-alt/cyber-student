-- Create user_stats table for storing individual stat values (currently hardcoded)
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  intelligence INTEGER DEFAULT 50 CHECK (intelligence >= 0 AND intelligence <= 100),
  stamina INTEGER DEFAULT 50 CHECK (stamina >= 0 AND stamina <= 100),
  creativity INTEGER DEFAULT 50 CHECK (creativity >= 0 AND creativity <= 100),
  cooperation INTEGER DEFAULT 50 CHECK (cooperation >= 0 AND cooperation <= 100),
  tech_skill INTEGER DEFAULT 50 CHECK (tech_skill >= 0 AND tech_skill <= 100),
  mental INTEGER DEFAULT 50 CHECK (mental >= 0 AND mental <= 100),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Users can view/update their own stats
CREATE POLICY "Users can view their own stats"
  ON user_stats FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can update their own stats"
  ON user_stats FOR UPDATE
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own stats"
  ON user_stats FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Public read access for comparison feature
CREATE POLICY "Stats are publicly viewable"
  ON user_stats FOR SELECT
  USING (true);

-- Auto-create stats row when profile is created
CREATE OR REPLACE FUNCTION public.handle_new_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (profile_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_add_stats
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_stats();

-- Auto-update updated_at
CREATE TRIGGER handle_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
