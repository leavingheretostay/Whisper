/*
  # Fix Function Search Path Mutability

  ## Security Issue
  - Function `public.increment_message_count()` has a role-mutable search_path
  - This allows a role to change the search_path, potentially redirecting function calls

  ## Solution
  - Recreate the function with an explicit, immutable search_path
  - Set search_path to 'pg_catalog, public' to be explicit
  - This prevents search_path injection attacks
*/

-- Drop the trigger first
DROP TRIGGER IF EXISTS on_message_insert ON messages;

-- Drop the function
DROP FUNCTION IF EXISTS increment_message_count();

-- Recreate with explicit immutable search_path
CREATE FUNCTION increment_message_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
BEGIN
  UPDATE profiles
  SET message_count = message_count + 1,
      last_active = now()
  WHERE id = NEW.recipient_id;
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_message_insert
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION increment_message_count();

-- Ensure no execute permissions on public roles
REVOKE EXECUTE ON FUNCTION increment_message_count() FROM anon;
REVOKE EXECUTE ON FUNCTION increment_message_count() FROM authenticated;
