-- =====================================================
-- FIX ARTICLE VIEWS UNIQUE CONSTRAINT
-- =====================================================
-- The current constraint doesn't work with NULL values
-- We need separate indexes for authenticated vs guest users
-- =====================================================

-- 1. Drop the old constraint
-- =====================================================
ALTER TABLE IF EXISTS public.article_views 
DROP CONSTRAINT IF EXISTS unique_user_article_view;

-- 2. Create partial unique indexes that handle NULL properly
-- =====================================================
-- For authenticated users (user_id NOT NULL, session_id IS NULL)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_authenticated_article_view 
ON public.article_views(article_id, user_id) 
WHERE user_id IS NOT NULL;

-- For guest users (user_id IS NULL, session_id NOT NULL)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_guest_article_view 
ON public.article_views(article_id, session_id) 
WHERE session_id IS NOT NULL;

-- =====================================================
-- RESULT:
-- Now UPSERT will work properly:
-- - For authenticated users: uses (article_id, user_id)
-- - For guest users: uses (article_id, session_id)
-- =====================================================
