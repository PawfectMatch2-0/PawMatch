# 🗑️ Complete User Deletion System

## Overview
When an admin deletes a user from Supabase Dashboard → Authentication → Users, **ALL** user-related data is automatically deleted from the entire database. The user must create a new account to use the app again.

---

## ✅ What Gets Deleted

When a user is deleted from `auth.users`, the following data is **automatically deleted**:

### 1. **User Profile**
- `user_profiles` table entry
- All profile information (name, phone, location, preferences)

### 2. **Pet Data**
- All pets owned by the user (`pets` table where `owner_id = user_id`)
- **Note:** If you want to keep pets but remove ownership, see configuration below

### 3. **Favorites & Interactions**
- All saved/favorited pets (`pet_favorites`)
- All swipe interactions (`pet_interactions` - likes, passes, super_likes)

### 4. **Adoption Data**
- All adoption applications submitted by user (`adoption_applications`)
- All applications reviewed by user (as `processed_by`)

### 5. **Messages**
- All messages sent by user (`user_messages` as `sender_id`)
- All messages received by user (`user_messages` as `receiver_id`)

### 6. **Notifications**
- All notifications for the user (`notifications`)

### 7. **AI Chat**
- All AI chat sessions (`ai_chat_sessions`)
- All chat messages (cascade from sessions)

### 8. **Learning/Articles**
- All article likes (`article_likes`)
- All article views (`article_views` - user-specific views)
- All learning progress (`learning_progress` if exists)

---

## 🚀 Setup Instructions

### Step 1: Run the SQL Script

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open the file: `database/24_cascade_user_deletion.sql`
3. Copy and paste the entire SQL script
4. Click **Run** ✅

### Step 2: Verify Setup

Run these queries to verify the trigger is active:

```sql
-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_deleted';

-- Check if function exists
SELECT * FROM pg_proc WHERE proname = 'handle_user_deletion';
```

You should see the trigger and function listed.

---

## 🧪 Testing

### Test the Deletion System:

1. **Create a test user:**
   - Sign up in your app with a test email
   - Add some data (favorite pets, submit applications, etc.)

2. **Delete the user:**
   - Go to Supabase Dashboard → **Authentication** → **Users**
   - Find the test user
   - Click **Delete** (or three dots → Delete)

3. **Verify deletion:**
   ```sql
   -- Check user profile is deleted
   SELECT * FROM public.user_profiles WHERE email = 'test@example.com';
   -- Should return 0 rows
   
   -- Check pets are deleted
   SELECT * FROM public.pets WHERE owner_id = 'deleted-user-id';
   -- Should return 0 rows
   
   -- Check favorites are deleted
   SELECT * FROM public.pet_favorites WHERE user_id = 'deleted-user-id';
   -- Should return 0 rows
   ```

4. **Try to sign in:**
   - User should NOT be able to sign in
   - User must create a new account

---

## ⚙️ Configuration Options

### Option A: Delete All User Pets (Default)
```sql
-- In the function, this line deletes all pets:
DELETE FROM public.pets WHERE owner_id = deleted_user_id;
```

### Option B: Keep Pets, Remove Ownership
If you want to keep pets but just remove the ownership link:

1. Edit `database/24_cascade_user_deletion.sql`
2. Comment out the DELETE line:
   ```sql
   -- DELETE FROM public.pets WHERE owner_id = deleted_user_id;
   ```
3. Uncomment the UPDATE line:
   ```sql
   UPDATE public.pets SET owner_id = NULL WHERE owner_id = deleted_user_id;
   ```
4. Re-run the script

---

## 📋 What Happens When Admin Deletes User

### Flow:
1. Admin deletes user from Supabase Dashboard
2. **Trigger fires** (`on_auth_user_deleted`)
3. **Function executes** (`handle_user_deletion`)
4. **All user data deleted** from all tables
5. **User removed** from `auth.users`
6. User **cannot sign in** anymore
7. User **must create new account** to use app

### Logs:
The function logs all deletions. Check Supabase logs to see:
```
NOTICE: Deleting all data for user: <user-id>
NOTICE: Successfully deleted all data for user: <user-id>
```

---

## 🔒 Security Notes

1. **SECURITY DEFINER**: Function runs with elevated privileges to ensure it can delete from all tables
2. **BEFORE DELETE**: Trigger runs BEFORE deletion so it has access to `OLD.id`
3. **Cascade Protection**: Even if foreign keys have `ON DELETE CASCADE`, we're explicit about deletions
4. **Complete Cleanup**: No orphaned data left behind

---

## 🚨 Important Warnings

### ⚠️ **IRREVERSIBLE ACTION**
- Once a user is deleted, **ALL their data is permanently removed**
- This **cannot be undone**
- User must create a completely new account

### ⚠️ **Pets Deletion**
- By default, **all pets owned by the user are deleted**
- If you want to keep pets, use Option B above

### ⚠️ **Testing**
- Always test with a test account first
- Never delete production users without backup

---

## 📊 Tables Affected

| Table | Action | Notes |
|-------|--------|-------|
| `user_profiles` | DELETE | User profile data |
| `pets` | DELETE | All owned pets (or set owner_id = NULL) |
| `pet_favorites` | DELETE | Saved pets |
| `pet_interactions` | DELETE | Swipe history |
| `adoption_applications` | DELETE | As applicant and reviewer |
| `user_messages` | DELETE | As sender and receiver |
| `notifications` | DELETE | All user notifications |
| `ai_chat_sessions` | DELETE | AI chat history |
| `ai_chat_messages` | DELETE | Cascade from sessions |
| `article_likes` | DELETE | Article likes |
| `article_views` | DELETE | User-specific views |
| `learning_progress` | DELETE | Learning progress |

---

## ✅ Verification Checklist

After setup, verify:

- [ ] SQL script executed successfully
- [ ] Trigger `on_auth_user_deleted` exists
- [ ] Function `handle_user_deletion` exists
- [ ] Test deletion with a test user
- [ ] All user data deleted correctly
- [ ] User cannot sign in after deletion
- [ ] User must create new account

---

## 🆘 Troubleshooting

### Trigger Not Firing?
- Check if trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_deleted';`
- Re-run the SQL script

### Data Not Deleting?
- Check Supabase logs for error messages
- Verify foreign key constraints allow deletion
- Check RLS policies don't block deletion

### User Can Still Sign In?
- User might have been recreated
- Check `auth.users` table
- Verify deletion actually happened

---

## 📝 Notes

- This system works **automatically** - no code changes needed
- Works when admin deletes from **Supabase Dashboard**
- Also works if user is deleted via **Supabase API**
- User must **create completely new account** after deletion
- All data is **permanently removed** (no recovery)

---

## 🎯 Summary

✅ **Complete cascade deletion** of all user data  
✅ **Automatic** - no manual cleanup needed  
✅ **Secure** - uses database triggers  
✅ **Comprehensive** - covers all tables  
✅ **Irreversible** - user must create new account  

**The user is completely removed from the system and must start fresh!**

