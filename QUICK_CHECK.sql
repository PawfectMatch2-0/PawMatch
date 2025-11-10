-- Quick verification - run this in Supabase SQL Editor
SELECT 
    title,
    view_count,
    like_count
FROM public.learning_articles
LIMIT 5;

-- If you see numbers other than 0, the reset didn't work
-- Run RESET_ARTICLE_STATS_TO_ZERO.sql again
