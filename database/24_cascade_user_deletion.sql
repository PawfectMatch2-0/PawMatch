-- ============================================
-- CASCADE USER DELETION FUNCTION
-- ============================================
-- This function automatically deletes all user-related data
-- when a user is deleted from auth.users (via Supabase Dashboard)
-- 
-- Run this in Supabase SQL Editor
-- ============================================

-- Function to handle cascade deletion of all user data
CREATE OR REPLACE FUNCTION public.handle_user_deletion()
RETURNS TRIGGER AS $$
DECLARE
  deleted_user_id UUID;
BEGIN
  -- Get the deleted user's ID
  deleted_user_id := OLD.id;
  
  -- Log the deletion (optional, for debugging)
  RAISE NOTICE 'Deleting all data for user: %', deleted_user_id;
  
  -- Delete user-related data from all tables
  -- Note: Tables with ON DELETE CASCADE will auto-delete, but we'll be explicit
  
  -- 1. Delete pet favorites
  DELETE FROM public.pet_favorites WHERE user_id = deleted_user_id;
  
  -- 2. Delete pet interactions (likes, passes, super_likes)
  DELETE FROM public.pet_interactions WHERE user_id = deleted_user_id;
  
  -- 3. Delete adoption applications (both as applicant and reviewer)
  DELETE FROM public.adoption_applications WHERE user_id = deleted_user_id;
  DELETE FROM public.adoption_applications WHERE processed_by = deleted_user_id;
  
  -- 4. Delete user messages
  DELETE FROM public.user_messages WHERE sender_id = deleted_user_id;
  DELETE FROM public.user_messages WHERE receiver_id = deleted_user_id;
  
  -- 5. Delete notifications
  DELETE FROM public.notifications WHERE user_id = deleted_user_id;
  
  -- 6. Delete AI chat sessions (if table exists)
  DELETE FROM public.ai_chat_sessions WHERE user_id = deleted_user_id;
  
  -- 7. Delete learning progress (if table exists)
  DELETE FROM public.learning_progress WHERE user_id = deleted_user_id;
  
  -- 8. Delete article likes (if table exists)
  DELETE FROM public.article_likes WHERE user_id = deleted_user_id;
  
  -- 9. Delete article views (if table exists)
  DELETE FROM public.article_views WHERE user_id = deleted_user_id;
  
  -- 10. Handle pets owned by user
  -- Option A: Delete all pets owned by user (recommended for complete cleanup)
  DELETE FROM public.pets WHERE owner_id = deleted_user_id;
  
  -- Option B: If you want to keep pets but remove ownership (uncomment if preferred):
  -- UPDATE public.pets SET owner_id = NULL WHERE owner_id = deleted_user_id;
  
  -- 11. Delete user profile (this should cascade automatically, but being explicit)
  DELETE FROM public.user_profiles WHERE id = deleted_user_id;
  
  -- 12. Clean up any orphaned records (safety check)
  -- Delete article views where user_id is set to NULL (from ON DELETE SET NULL)
  -- This is optional since views with NULL user_id are for guest users
  -- DELETE FROM public.article_views WHERE user_id IS NULL AND session_id IS NULL;
  
  -- 12. Delete any other user-related data
  -- Add more DELETE statements here for any other tables that reference user_id
  
  RAISE NOTICE 'Successfully deleted all data for user: %', deleted_user_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires BEFORE user deletion from auth.users
-- This ensures we clean up data before the user is actually deleted
CREATE OR REPLACE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_deletion();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the trigger is set up correctly:

-- Check if trigger exists:
-- SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_deleted';

-- Check if function exists:
-- SELECT * FROM pg_proc WHERE proname = 'handle_user_deletion';

-- ============================================
-- TESTING (DO NOT RUN IN PRODUCTION)
-- ============================================
-- To test, create a test user, then delete them from Supabase Dashboard
-- All related data should be automatically deleted

-- ============================================
-- IMPORTANT NOTES
-- ============================================
-- 1. This trigger runs BEFORE deletion, so it has access to OLD.id
-- 2. The function uses SECURITY DEFINER to ensure it has proper permissions
-- 3. All deletions are logged with RAISE NOTICE (visible in Supabase logs)
-- 4. If you want to keep pets but remove ownership, uncomment Option B above
-- 5. Make sure all foreign keys have proper ON DELETE CASCADE or handle manually
-- 6. This works when admin deletes user from Supabase Dashboard → Authentication → Users

