-- ============================================================
-- Add published column to feed_posts + publish RPC
-- ============================================================

-- 1. Add published column (defaults false so new posts require explicit publish)
ALTER TABLE public.feed_posts
  ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT false;

-- 2. Backfill: mark all existing posts as published
UPDATE public.feed_posts SET published = true WHERE published = false;

-- 3. RPC: publish_feed_post — sets published = true for the feed_post matching a session_id
CREATE OR REPLACE FUNCTION public.publish_feed_post(p_session_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_post_id uuid;
BEGIN
  UPDATE public.feed_posts
    SET published = true
    WHERE session_id = p_session_id
      AND owner_id = auth.uid()
  RETURNING id INTO v_post_id;

  RETURN v_post_id;
END;
$$;
