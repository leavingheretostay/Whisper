/*
  # Whisper App - Anonymous Messaging Schema

  ## Overview
  Creates the core database schema for an anonymous messaging application.

  ## New Tables

  ### profiles
  - `id` (uuid, PK, references auth.users) - User identifier
  - `username` (text, unique) - Unique username for the shareable link
  - `display_name` (text) - User's display name shown on their profile
  - `bio` (text) - Short bio visible on public profile
  - `avatar_url` (text) - URL to profile avatar image
  - `mood_theme` (text) - Current mood theme (cosmic, aurora, nebula, etc.)
  - `message_count` (int) - Total messages received
  - `streak_days` (int) - Current daily engagement streak
  - `last_active` (timestamptz) - Last activity timestamp
  - `created_at` (timestamptz)

  ### messages
  - `id` (uuid, PK)
  - `recipient_id` (uuid, FK -> profiles.id) - Who receives the message
  - `content` (text) - The anonymous message body
  - `emoji_reaction` (text) - Optional emoji reaction
  - `is_favorited` (boolean) - Marked as favorite by recipient
  - `is_archived` (boolean) - Archived by recipient
  - `is_deleted` (boolean) - Soft deleted
  - `is_flagged` (boolean) - Flagged as potentially toxic (AI moderation)
  - `public_reply` (text) - Recipient's optional public reply
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on both tables
  - Profiles: publicly readable, owners can update
  - Messages: anyone can insert (anonymous), only recipient can read/update own messages
*/

-- profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text DEFAULT '',
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  mood_theme text DEFAULT 'cosmic',
  message_count integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  emoji_reaction text DEFAULT '',
  is_favorited boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  is_flagged boolean DEFAULT false,
  public_reply text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send anonymous messages"
  ON messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(content) > 0 AND length(content) <= 1000
  );

CREATE POLICY "Recipients can read their own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = recipient_id);

CREATE POLICY "Recipients can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- Index for fast message retrieval by recipient
CREATE INDEX IF NOT EXISTS messages_recipient_id_idx ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);

-- Function to increment message count when a new message arrives
CREATE OR REPLACE FUNCTION increment_message_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET message_count = message_count + 1,
      last_active = now()
  WHERE id = NEW.recipient_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_message_insert
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION increment_message_count();
