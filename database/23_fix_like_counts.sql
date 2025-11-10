-- =====================================================
-- RESET LIKE COUNTS TO MATCH ACTUAL LIKES
-- =====================================================
-- This fixes the issue where like_count shows wrong numbers
-- =====================================================

-- Step 1: Reset all like counts to 0 first
-- =====================================================
UPDATE public.learning_articles
SET like_count = 0;

-- Step 2: Recalculate like counts from actual likes table
-- =====================================================
UPDATE public.learning_articles la
SET like_count = (
    SELECT COUNT(*) FROM public.article_likes 
    WHERE article_id = la.id
);

-- Step 3: Verify the fix
-- =====================================================
SELECT 
    id,
    title,
    like_count,
    (SELECT COUNT(*) FROM public.article_likes WHERE article_id = learning_articles.id) as actual_likes
FROM public.learning_articles
ORDER BY like_count DESC
LIMIT 10;

-- Expected: like_count should match actual_likes for all articles
-- Most should be 0 or 1 if you just started liking
