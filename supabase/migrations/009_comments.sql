-- ============================================================
-- Comments with threaded replies
-- ============================================================

-- 1. Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  text text NOT NULL CHECK (char_length(text) BETWEEN 1 AND 500),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_post_id ON public.comments (post_id, created_at);
CREATE INDEX idx_comments_parent_id ON public.comments (parent_id);

-- RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON public.comments FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Users can insert their own comments"
  ON public.comments FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- 2. Add comment_count to feed_posts
ALTER TABLE public.feed_posts
  ADD COLUMN IF NOT EXISTS comment_count int NOT NULL DEFAULT 0;

-- 3. RPC: add_comment — inserts comment and increments counter
CREATE OR REPLACE FUNCTION public.add_comment(
  p_post_id uuid,
  p_text text,
  p_parent_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_comment_id uuid;
BEGIN
  INSERT INTO public.comments (post_id, user_id, parent_id, text)
  VALUES (p_post_id, auth.uid(), p_parent_id, p_text)
  RETURNING id INTO v_comment_id;

  UPDATE public.feed_posts
    SET comment_count = comment_count + 1
    WHERE id = p_post_id;

  RETURN json_build_object('id', v_comment_id);
END;
$$;

-- 4. RPC: delete_comment — removes comment and decrements counter
CREATE OR REPLACE FUNCTION public.delete_comment(p_comment_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_post_id uuid;
BEGIN
  DELETE FROM public.comments
    WHERE id = p_comment_id AND user_id = auth.uid()
  RETURNING post_id INTO v_post_id;

  IF v_post_id IS NOT NULL THEN
    UPDATE public.feed_posts
      SET comment_count = greatest(comment_count - 1, 0)
      WHERE id = v_post_id;
  END IF;
END;
$$;
