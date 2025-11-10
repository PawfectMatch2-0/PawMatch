# 🔧 Fix Like Count & View Count Display Issues

## Issues Found
1. ❌ Like count showing "10" instead of "1"
2. ❌ View count showing "00" instead of "0"

## Root Cause
- Like count in database is incorrect (shows 10 instead of 1)
- View count formatting was showing "00" due to old format

## Fixes Applied

### Code Fix (Already Done ✅)
Updated `lib/services/learningService.ts`:
- ✅ Improved `formatCount()` function to handle nulls properly
- ✅ Now shows "1" instead of "1.0" for numbers under 1000
- ✅ Now shows "0" instead of "00" for zero values

### Database Fix (You Need to Run)

**Step 1: Reset like counts**
```sql
UPDATE public.learning_articles
SET like_count = 0;
```

**Step 2: Recalculate from actual likes**
```sql
UPDATE public.learning_articles la
SET like_count = (
    SELECT COUNT(*) FROM public.article_likes 
    WHERE article_id = la.id
);
```

**Step 3: Verify**
```sql
SELECT title, like_count FROM public.learning_articles LIMIT 5;
```

Or run the complete script: `database/23_fix_like_counts.sql`

## After Fix
1. Run the SQL queries in Supabase
2. Reload your mobile app
3. Like counts will show correctly (1 if you liked once, 0 if not liked)
4. View counts will show properly (0, 1, 2, etc.)

## Testing
- Open article → Like it → Reload → Should show "1 likes"
- Unlike it → Reload → Should show "0 likes"
- View counts will display correctly
