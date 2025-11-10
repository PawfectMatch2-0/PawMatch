-- =====================================================
-- COMPREHENSIVE FIX FOR ARTICLE VIEWS
-- =====================================================
-- This script properly removes the broken constraint
-- and sets up the correct tracking system
-- =====================================================

-- Step 1: Check current constraint
-- =====================================================
-- SELECT constraint_name, table_name 
-- FROM information_schema.table_constraints 
-- WHERE table_name = 'article_views';

-- Step 2: Drop ALL constraints on article_views
-- =====================================================
ALTER TABLE IF EXISTS public.article_views 
DROP CONSTRAINT IF EXISTS unique_user_article_view CASCADE;

ALTER TABLE IF EXISTS public.article_views 
DROP CONSTRAINT IF EXISTS unique_authenticated_article_view CASCADE;

ALTER TABLE IF EXISTS public.article_views 
DROP CONSTRAINT IF EXISTS unique_guest_article_view CASCADE;

-- Step 3: Drop old indexes if they exist
-- =====================================================
DROP INDEX IF EXISTS idx_unique_authenticated_article_view;
DROP INDEX IF EXISTS idx_unique_guest_article_view;

-- Step 4: Create proper unique indexes
-- =====================================================
-- Index for authenticated users only
CREATE UNIQUE INDEX idx_article_views_authenticated 
ON public.article_views(article_id, user_id) 
WHERE user_id IS NOT NULL AND session_id IS NULL;

-- Index for guest users only
CREATE UNIQUE INDEX idx_article_views_guest 
ON public.article_views(article_id, session_id) 
WHERE user_id IS NULL AND session_id IS NOT NULL;

-- Step 5: Verify fix
-- =====================================================
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'article_views' 
AND indexname LIKE 'idx_article_views%';

-- =====================================================
-- SUCCESS INDICATORS:
-- ✅ Two indexes created: idx_article_views_authenticated, idx_article_views_guest
-- ✅ Old constraint removed
-- ✅ UPSERT will now work without errors
-- =====================================================
