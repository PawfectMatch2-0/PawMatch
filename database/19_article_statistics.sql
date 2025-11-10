-- =====================================================
-- LEARNING ARTICLES - REAL-TIME STATISTICS SYSTEM
-- =====================================================
-- Adds view tracking, like tracking, and real-time stats
-- 
-- FRESH START: All counts reset to 0
-- From this point forward, all views and likes are tracked
-- in real-time from the database
-- =====================================================

-- 1. Create article_views table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.article_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id TEXT NOT NULL REFERENCES public.learning_articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    session_id TEXT, -- For guest users
    CONSTRAINT unique_user_article_view UNIQUE (article_id, user_id, session_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON public.article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_article_views_user_id ON public.article_views(user_id);
CREATE INDEX IF NOT EXISTS idx_article_views_viewed_at ON public.article_views(viewed_at);

-- Enable RLS
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anyone to record article views" ON public.article_views;
DROP POLICY IF EXISTS "Allow public read access to article views" ON public.article_views;

-- Allow anyone to insert views
CREATE POLICY "Allow anyone to record article views"
ON public.article_views
FOR INSERT
TO public
WITH CHECK (true);

-- Allow public to read views (for counts)
CREATE POLICY "Allow public read access to article views"
ON public.article_views
FOR SELECT
TO public
USING (true);

-- 2. Create article_likes table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.article_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id TEXT NOT NULL REFERENCES public.learning_articles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    liked_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_article_like UNIQUE (article_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_article_likes_article_id ON public.article_likes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_user_id ON public.article_likes(user_id);

-- Enable RLS
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to like articles" ON public.article_likes;
DROP POLICY IF EXISTS "Allow users to unlike articles" ON public.article_likes;
DROP POLICY IF EXISTS "Allow public read access to article likes" ON public.article_likes;

-- Allow authenticated users to like articles
CREATE POLICY "Allow authenticated users to like articles"
ON public.article_likes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to unlike (delete their likes)
CREATE POLICY "Allow users to unlike articles"
ON public.article_likes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow public to read likes (for counts)
CREATE POLICY "Allow public read access to article likes"
ON public.article_likes
FOR SELECT
TO public
USING (true);

-- 3. Create view for article statistics (fast queries)
-- =====================================================
CREATE OR REPLACE VIEW public.article_stats AS
SELECT 
    la.id as article_id,
    la.title,
    la.category,
    la.read_time,
    COUNT(DISTINCT av.id) as view_count,
    COUNT(DISTINCT al.id) as like_count,
    la.created_at
FROM public.learning_articles la
LEFT JOIN public.article_views av ON la.id = av.article_id
LEFT JOIN public.article_likes al ON la.id = al.article_id
GROUP BY la.id, la.title, la.category, la.read_time, la.created_at;

-- Grant access to the view
GRANT SELECT ON public.article_stats TO public;

-- 4. Add view_count and like_count to learning_articles table (denormalized for performance)
-- =====================================================
ALTER TABLE public.learning_articles 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- 5. Create function to update article stats (called after insert into views/likes)
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_article_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'article_views' THEN
        UPDATE public.learning_articles
        SET view_count = (
            SELECT COUNT(*) FROM public.article_views 
            WHERE article_id = NEW.article_id
        )
        WHERE id = NEW.article_id;
    ELSIF TG_TABLE_NAME = 'article_likes' THEN
        UPDATE public.learning_articles
        SET like_count = (
            SELECT COUNT(*) FROM public.article_likes 
            WHERE article_id = NEW.article_id
        )
        WHERE id = NEW.article_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for DELETE operations (unlike)
CREATE OR REPLACE FUNCTION public.update_article_stats_on_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'article_likes' THEN
        UPDATE public.learning_articles
        SET like_count = (
            SELECT COUNT(*) FROM public.article_likes 
            WHERE article_id = OLD.article_id
        )
        WHERE id = OLD.article_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create triggers to auto-update stats
-- =====================================================
DROP TRIGGER IF EXISTS trigger_update_article_views ON public.article_views;
CREATE TRIGGER trigger_update_article_views
AFTER INSERT ON public.article_views
FOR EACH ROW
EXECUTE FUNCTION public.update_article_stats();

DROP TRIGGER IF EXISTS trigger_update_article_likes ON public.article_likes;
CREATE TRIGGER trigger_update_article_likes
AFTER INSERT ON public.article_likes
FOR EACH ROW
EXECUTE FUNCTION public.update_article_stats();

DROP TRIGGER IF EXISTS trigger_update_article_unlikes ON public.article_likes;
CREATE TRIGGER trigger_update_article_unlikes
AFTER DELETE ON public.article_likes
FOR EACH ROW
EXECUTE FUNCTION public.update_article_stats_on_delete();

-- 7. FRESH START - Reset all counts to 0
-- =====================================================
-- Clear all existing view and like history
DELETE FROM public.article_views;
DELETE FROM public.article_likes;

-- Reset all article counts to 0 (fresh start)
UPDATE public.learning_articles
SET view_count = 0, like_count = 0;

-- 8. Add comments
-- =====================================================
COMMENT ON TABLE public.article_views IS 'Tracks article views by users and guests';
COMMENT ON TABLE public.article_likes IS 'Tracks article likes by authenticated users';
COMMENT ON VIEW public.article_stats IS 'Aggregated statistics for articles (views, likes)';
COMMENT ON FUNCTION public.update_article_stats IS 'Auto-updates view_count and like_count in learning_articles';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check article stats view
SELECT * FROM public.article_stats ORDER BY view_count DESC LIMIT 5;

-- Check current counts
SELECT 
    id,
    title,
    view_count,
    like_count,
    read_time
FROM public.learning_articles
ORDER BY view_count DESC;

-- =====================================================
-- USAGE EXAMPLES
-- =====================================================

-- Record a view (user_id OR session_id)
-- INSERT INTO public.article_views (article_id, user_id)
-- VALUES ('article-id', 'user-id');

-- Like an article (authenticated user only)
-- INSERT INTO public.article_likes (article_id, user_id)
-- VALUES ('article-id', 'user-id');

-- Unlike an article
-- DELETE FROM public.article_likes
-- WHERE article_id = 'article-id' AND user_id = 'user-id';

-- Get article with stats
-- SELECT 
--     la.*,
--     la.view_count,
--     la.like_count
-- FROM public.learning_articles la
-- WHERE la.id = 'article-id';

-- =====================================================
