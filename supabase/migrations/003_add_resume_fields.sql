-- Add resume/portfolio fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact_email TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS occupation TEXT DEFAULT '';
