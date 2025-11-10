# Article Views Fix - Step by Step

## IMMEDIATE FIX (Run these one by one in Supabase SQL Editor)

### Step 1: Drop the broken constraint
```sql
ALTER TABLE public.article_views DROP CONSTRAINT unique_user_article_view;
```

### Step 2: Drop any existing indexes
```sql
DROP INDEX IF EXISTS idx_unique_authenticated_article_view;
DROP INDEX IF EXISTS idx_unique_guest_article_view;
```

### Step 3: Create correct indexes
```sql
CREATE UNIQUE INDEX idx_article_views_user 
ON public.article_views(article_id, user_id) 
WHERE user_id IS NOT NULL;
```

```sql
CREATE UNIQUE INDEX idx_article_views_session 
ON public.article_views(article_id, session_id) 
WHERE session_id IS NOT NULL;
```

### Step 4: Verify
```sql
SELECT indexname FROM pg_indexes WHERE tablename = 'article_views';
```

You should see:
- `idx_article_views_user`
- `idx_article_views_session`
- Plus the existing indexes

## After Fix
1. Reload your mobile app
2. Open an article → View count will now track properly
3. Like/unlike will work
4. No more errors!

## If Still Getting Errors
Try the comprehensive fix script: `database/22_comprehensive_article_views_fix.sql`
