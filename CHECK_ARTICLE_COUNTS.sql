-- =====================================================
-- QUICK CHECK - ARE ARTICLE COUNTS AT 0?
-- =====================================================

-- Check if reset worked
SELECT 
    COUNT(*) as total_articles,
    SUM(view_count) as total_views,
    SUM(like_count) as total_likes,
    MAX(view_count) as max_views,
    MAX(like_count) as max_likes,
    CASE 
        WHEN SUM(view_count) = 0 AND SUM(like_count) = 0 THEN '✅ All counts at 0 - Reset successful!'
        ELSE '⚠️ Still has counts - Reset may not have run'
    END as status
FROM public.learning_articles;

-- Show first 5 articles with their counts
SELECT 
    title,
    view_count,
    like_count,
    read_time
FROM public.learning_articles
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- WHAT TO DO NEXT:
-- 
-- If counts are NOT at 0:
-- 1. Run RESET_ARTICLE_STATS_TO_ZERO.sql again
-- 2. Make sure you click "Run" in Supabase SQL Editor
-- 3. Wait for confirmation message
-- 
-- If counts ARE at 0:
-- 1. Close the Pawfect Match app completely
-- 2. Reopen the app
-- 3. Go to Learning Center
-- 4. Pull down to refresh (or it will auto-refresh)
-- 5. Should now show 0 views and 0 likes
-- =====================================================
