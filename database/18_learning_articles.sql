-- Drop existing learning_articles table if it exists (to avoid schema conflicts)
DROP TABLE IF EXISTS public.learning_articles CASCADE;

-- Create learning_articles table
CREATE TABLE public.learning_articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    read_time TEXT NOT NULL,
    author TEXT DEFAULT 'PawfectMatch Team',
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on category for faster queries
CREATE INDEX IF NOT EXISTS idx_learning_articles_category ON public.learning_articles(category);
CREATE INDEX IF NOT EXISTS idx_learning_articles_featured ON public.learning_articles(is_featured);

-- Enable Row Level Security
ALTER TABLE public.learning_articles ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to learning articles"
ON public.learning_articles
FOR SELECT
TO public
USING (true);

-- Create policy for authenticated users to insert/update
CREATE POLICY "Allow authenticated users to insert learning articles"
ON public.learning_articles
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update learning articles"
ON public.learning_articles
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Add comments
COMMENT ON TABLE public.learning_articles IS 'Stores educational articles about pet care, training, health, etc.';
COMMENT ON COLUMN public.learning_articles.category IS 'Article category: care, training, health, nutrition, etc.';
COMMENT ON COLUMN public.learning_articles.is_featured IS 'Whether this article is featured on the main learning page';
