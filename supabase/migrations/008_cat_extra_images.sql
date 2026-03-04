-- ============================================================
-- Add 2 extra image slots to cats (up to 3 photos total)
-- ============================================================

ALTER TABLE public.cats ADD COLUMN IF NOT EXISTS image_base64_2 text;
ALTER TABLE public.cats ADD COLUMN IF NOT EXISTS image_base64_3 text;
