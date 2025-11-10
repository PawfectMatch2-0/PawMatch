# 🔧 Fix: Article Detail Like Count Shows 10 Instead of 1

## Problem
Article detail page showed "10 likes" even though you only liked once.

## Solution Applied

### Code Fix ✅ (Already Done)
Updated `app/learn/article/[id].tsx`:
- Added `likeCount` state to track real-time like count
- Like button now increments/decrements `likeCount` immediately
- Display shows actual `likeCount` instead of stale database value
- Like count updates instantly when you like/unlike

### Database Fix (Still Needed)
The database still has `like_count = 10` for some articles. Run this SQL in Supabase:

**Step 1: Reset all like counts to 0**
```sql
UPDATE public.learning_articles SET like_count = 0;
```

**Step 2: Recalculate from actual article_likes table**
```sql
UPDATE public.learning_articles la
SET like_count = (
    SELECT COUNT(*) FROM public.article_likes 
    WHERE article_id = la.id
);
```

**Step 3: Verify the fix**
```sql
SELECT title, like_count FROM public.learning_articles ORDER BY like_count DESC LIMIT 5;
```

Or run complete script: `database/23_fix_like_counts.sql`

## After Fix
1. Run SQL queries in Supabase
2. Reload mobile app
3. Article detail will show correct like counts (0 or 1)
4. Like button works in real-time immediately

## How It Works Now
- **User likes article** → `likeCount` state updates immediately to 1
- **User unlike article** → `likeCount` state updates immediately to 0
- **Page reload** → Fetches fresh data from database
- **No more stale data** - UI updates are instant!
