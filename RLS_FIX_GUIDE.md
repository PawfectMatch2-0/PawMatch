# 🚨 Fix RLS Errors - Quick Guide

## Current Error
```
ERROR ❌ [Discover] Error recording like: 
{"code": "42501", "message": "new row violates row-level security policy for table \"pet_interactions\""}
```

## Solution: Run SQL Script in Supabase

### Option 1: Complete Fix (RECOMMENDED) ⚡

**Run this ONE script to fix everything:**

1. Open `FIX_ALL_RLS_POLICIES.sql` in VS Code
2. Copy the entire file (Ctrl+A, Ctrl+C)
3. Go to Supabase Dashboard → SQL Editor
4. Paste and click **Run**
5. You should see 12 policies created (5 + 4 + 3)

This fixes:
- ✅ Profile creation
- ✅ Pet interactions (likes/dislikes)
- ✅ Pet favorites (saved pets)

### Option 2: Individual Fixes

If you want to run them separately:

1. **`FIX_PET_INTERACTIONS_RLS.sql`** - Fixes the current error (liking pets)
2. **`FIX_PET_FAVORITES_RLS.sql`** - Enables saving favorites
3. **`FIX_RLS_PERMISSIVE.sql`** - Fixes profile creation (already done)

### After Running the Script:

1. **Reload your app** (press 'r' in Expo terminal)
2. **Try liking a pet** in the Discover tab
3. **Should see:**
   ```
   ✅ [Discover] Successfully recorded interaction!
   ✅ [Discover] Successfully added to favorites!
   ```

### Why This Happens:

Supabase uses Row-Level Security (RLS) to control database access. Without policies, authenticated users can't insert/update data even though they're logged in. The policies say:

> "Authenticated users can INSERT rows IF the `user_id` column matches their `auth.uid()`"

This ensures users can only manage their own data - perfect security! 🔒

### Quick Test:

After running the script, swipe right on a pet. You should see these logs:
- ✅ `[Discover] User liked pet: [name]`
- ✅ `[Discover] Recording interaction for user: [your-id]`
- ✅ `[Discover] Successfully recorded interaction!`
- ✅ `[Discover] Successfully added to favorites!`

No more RLS errors! 🎉

---

**Need help?** Check the verification queries at the bottom of each SQL script to confirm policies are created correctly.
