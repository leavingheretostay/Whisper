/*
  # Fix Security Issues in increment_message_count Function

  ## Security Changes
  - Switch `increment_message_count()` from SECURITY DEFINER to SECURITY INVOKER
  - Revoke EXECUTE permissions from anon and authenticated roles
  - Function will now execute with caller's privileges instead of owner's
  - Trigger will still work correctly as it's invoked by the database system

  ## Why These Changes
  - SECURITY DEFINER functions callable via RPC are a privilege escalation risk
  - By switching to SECURITY INVOKER, the function respects RLS policies
  - Anonymous users inserting messages will use their own permissions
  - Authenticated users inserting messages will use their own permissions
*/

-- Drop the trigger temporarily
DROP TRIGGER IF EXISTS on_message_insert ON messages;

-- Drop the old SECURITY DEFINER function
DROP FUNCTION IF EXISTS increment_message_count();

-- Create the function as SECURITY INVOKER instead
CREATE OR REPLACE FUNCTION increment_message_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET message_count = message_count + 1,
      last_active = now()
  WHERE id = NEW.recipient_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- Recreate the trigger
CREATE TRIGGER on_message_insert
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION increment_message_count();

-- Revoke any execute permissions from public roles (belt and suspenders)
REVOKE EXECUTE ON FUNCTION increment_message_count() FROM anon;
REVOKE EXECUTE ON FUNCTION increment_message_count() FROM authenticated;
