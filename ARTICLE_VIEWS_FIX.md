# 🔧 Article Views Constraint Fix

## Problem
When recording article views, PostgreSQL was throwing an error:
```
ERROR: there is no unique or exclusion constraint matching the ON CONFLICT specification
Code: 42P10
```

## Root Cause
The original constraint was:
```sql
CONSTRAINT unique_user_article_view UNIQUE (article_id, user_id, session_id)
```

This doesn't work properly with NULL values because:
- For authenticated users: `user_id` has a value, but `session_id` is NULL
- For guest users: `session_id` has a value, but `user_id` is NULL
- In SQL, `NULL` ≠ `NULL`, so the UNIQUE constraint treats them as different rows

## Solution
Replace with two separate constraints using partial indexes:

```sql
-- For authenticated users (user_id NOT NULL, session_id IS NULL)
UNIQUE (article_id, user_id) WHERE user_id IS NOT NULL;

-- For guest users (user_id IS NULL, session_id NOT NULL)
UNIQUE (article_id, session_id) WHERE session_id IS NOT NULL;
```

## How to Fix

### Step 1: Run the fix SQL script in Supabase
```
Go to Supabase → SQL Editor
Copy and paste: database/21_fix_article_views_constraint.sql
Click "Run"
```

### Step 2: Restart the Expo app
The app will now properly track article views without errors.

## What Happens After Fix
✅ Article views are tracked one per user per article  
✅ Guest users tracked by session ID  
✅ Authenticated users tracked by user ID  
✅ No duplicate views in database  
✅ View counts increment correctly  

## Testing
1. Open an article → View count should increase from 0 to 1
2. Open the same article again → View count stays at 1 (not 2)
3. Like/unlike the article → Like count changes

## Files Modified
- `database/21_fix_article_views_constraint.sql` - SQL fix script
- `lib/services/learningService.ts` - Added helpful tip to error message
