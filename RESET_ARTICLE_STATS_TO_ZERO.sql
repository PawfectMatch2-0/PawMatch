-- =====================================================
-- RESET ALL ARTICLE STATISTICS TO 0
-- =====================================================
-- Run this to start fresh with 0 counts
-- All future views and likes will be tracked from 0
-- =====================================================

-- 1. Clear all view history
-- =====================================================
DELETE FROM public.article_views;

-- 2. Clear all like history
-- =====================================================
DELETE FROM public.article_likes;

-- 3. Reset all article counts to 0
-- =====================================================
UPDATE public.learning_articles
SET view_count = 0, like_count = 0;

-- 4. Verify reset
-- =====================================================
SELECT 
    '✅ RESET COMPLETE' as status,
    COUNT(*) as total_articles,
    SUM(view_count) as total_views,
    SUM(like_count) as total_likes
FROM public.learning_articles;
-- Expected: total_views = 0, total_likes = 0

-- 5. Show all articles with 0 counts
-- =====================================================
SELECT 
    id,
    title,
    category,
    read_time,
    view_count,
    like_count,
    CASE 
        WHEN view_count = 0 AND like_count = 0 THEN '✅ Reset to 0'
        ELSE '⚠️ Still has counts'
    END as status
FROM public.learning_articles
ORDER BY category, title;

-- =====================================================
-- RESULT:
-- After running this script:
-- - All articles will show 0 views
-- - All articles will show 0 likes
-- - From now on, real tracking starts fresh
-- 
-- Next time you open the app:
-- - Article cards will show: 👁️ 0  ❤️ 0
-- - As users view/like, counts will increase in real-time
-- =====================================================
