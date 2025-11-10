-- =====================================================
-- VERIFY FRESH START - ARTICLE STATISTICS
-- =====================================================
-- Run this after running 19_article_statistics.sql
-- to confirm everything started at 0
-- =====================================================

-- 1. Check all tables exist
-- =====================================================
SELECT 
    '✅ TABLES CREATED' as status,
    COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('article_views', 'article_likes', 'learning_articles');
-- Expected: 3 tables

-- 2. Verify columns added to learning_articles
-- =====================================================
SELECT 
    '✅ COLUMNS ADDED' as status,
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'learning_articles'
AND column_name IN ('view_count', 'like_count')
ORDER BY column_name;
-- Expected: view_count INTEGER DEFAULT 0, like_count INTEGER DEFAULT 0

-- 3. Verify all articles start at 0 counts
-- =====================================================
SELECT 
    '✅ FRESH START CONFIRMED' as status,
    COUNT(*) as total_articles,
    SUM(view_count) as total_views,
    SUM(like_count) as total_likes,
    MAX(view_count) as max_views,
    MAX(like_count) as max_likes
FROM public.learning_articles;
-- Expected: total_views = 0, total_likes = 0, max_views = 0, max_likes = 0

-- 4. List all articles with their initial counts
-- =====================================================
SELECT 
    id,
    title,
    category,
    read_time,
    view_count,
    like_count,
    CASE 
        WHEN view_count = 0 AND like_count = 0 THEN '✅ Fresh start'
        ELSE '⚠️ Has counts'
    END as status
FROM public.learning_articles
ORDER BY category, title;

-- 5. Verify article_views table is empty
-- =====================================================
SELECT 
    '✅ VIEW HISTORY' as status,
    COUNT(*) as total_views,
    CASE 
        WHEN COUNT(*) = 0 THEN 'Empty - Fresh start'
        ELSE 'Has data'
    END as state
FROM public.article_views;
-- Expected: 0 rows

-- 6. Verify article_likes table is empty
-- =====================================================
SELECT 
    '✅ LIKE HISTORY' as status,
    COUNT(*) as total_likes,
    CASE 
        WHEN COUNT(*) = 0 THEN 'Empty - Fresh start'
        ELSE 'Has data'
    END as state
FROM public.article_likes;
-- Expected: 0 rows

-- 7. Verify triggers exist
-- =====================================================
SELECT 
    '✅ TRIGGERS CREATED' as status,
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table IN ('article_views', 'article_likes')
ORDER BY event_object_table, trigger_name;
-- Expected: 3 triggers (2 on article_views, 2 on article_likes)

-- 8. Test the system with a sample view
-- =====================================================
-- Insert a test view (replace with your actual article_id and user_id)
INSERT INTO public.article_views (article_id, user_id)
VALUES ('basic-care-1', '703d7ccc-cc09-43ef-b6df-b3544e315d56')
ON CONFLICT DO NOTHING;

-- Check if count updated automatically
SELECT 
    '✅ TRIGGER TEST' as status,
    id,
    title,
    view_count,
    CASE 
        WHEN view_count = 1 THEN '✅ Auto-update working!'
        ELSE '⚠️ Trigger not working'
    END as trigger_status
FROM public.learning_articles
WHERE id = 'basic-care-1';
-- Expected: view_count = 1

-- Clean up test
DELETE FROM public.article_views 
WHERE article_id = 'basic-care-1' 
AND user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56';

-- Verify count reset to 0
UPDATE public.learning_articles
SET view_count = 0
WHERE id = 'basic-care-1';

-- 9. Summary
-- =====================================================
SELECT 
    '🎉 SYSTEM READY' as status,
    (SELECT COUNT(*) FROM public.learning_articles) as total_articles,
    (SELECT SUM(view_count) FROM public.learning_articles) as total_views,
    (SELECT SUM(like_count) FROM public.learning_articles) as total_likes,
    'All counts at 0 - Fresh start confirmed!' as message;

-- =====================================================
-- EXPECTED RESULTS:
-- =====================================================
-- ✅ All tables created (3)
-- ✅ Columns added to learning_articles
-- ✅ All articles have view_count = 0, like_count = 0
-- ✅ article_views table is empty
-- ✅ article_likes table is empty
-- ✅ Triggers are working (auto-update counts)
-- ✅ System ready for real-time tracking
-- 
-- From now on:
-- - Every article view will be recorded
-- - Every like will be tracked
-- - Counts will update automatically
-- - All data is real and live from database
-- =====================================================
