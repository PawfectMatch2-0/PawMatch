-- Send Welcome Notification to All Existing Users
-- This script ensures all existing users get a welcome notification
-- Run this AFTER running 25_notification_enhancements.sql

-- Function to send welcome notification to all users who don't have one
CREATE OR REPLACE FUNCTION send_welcome_to_all_users()
RETURNS TABLE(users_notified INTEGER, errors INTEGER) AS $$
DECLARE
  user_record RECORD;
  notification_count INTEGER := 0;
  error_count INTEGER := 0;
BEGIN
  -- Loop through all user profiles
  FOR user_record IN 
    SELECT id, email, full_name 
    FROM user_profiles
    WHERE id NOT IN (
      -- Exclude users who already have a welcome notification
      SELECT DISTINCT user_id 
      FROM notifications 
      WHERE type = 'welcome'
    )
  LOOP
    BEGIN
      -- Create welcome notification for this user
      INSERT INTO notifications (user_id, type, title, message, read)
      VALUES (
        user_record.id,
        'welcome',
        'Welcome to PawfectMatch! 🎉',
        'Welcome to PawfectMatch! We''re thrilled to have you join our community of pet lovers. Here''s what you can do:

🐾 Discover Pets - Swipe through adorable pets looking for homes
❤️ Save Favorites - Like pets you''re interested in
📝 Apply for Adoption - Submit applications for your favorite pets
💬 Chat with Mewi - Get pet care advice from our AI vet assistant
📚 Learn - Read articles about pet care and training
🛒 Shop - Find pet supplies and services near you

Start exploring and find your perfect furry friend!',
        false
      );
      
      notification_count := notification_count + 1;
      RAISE NOTICE '✅ Created welcome notification for user: % (%)', user_record.email, user_record.id;
      
    EXCEPTION WHEN OTHERS THEN
      error_count := error_count + 1;
      RAISE WARNING '❌ Error creating welcome notification for user % (%): %', 
        user_record.email, user_record.id, SQLERRM;
    END;
  END LOOP;
  
  RETURN QUERY SELECT notification_count, error_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to send welcome notifications to all existing users
DO $$
DECLARE
  result RECORD;
BEGIN
  SELECT * INTO result FROM send_welcome_to_all_users();
  RAISE NOTICE '📬 Welcome notifications sent: % users notified, % errors', 
    result.users_notified, result.errors;
END $$;

-- Optional: Check how many users got welcome notifications
-- SELECT 
--   COUNT(DISTINCT user_id) as users_with_welcome,
--   COUNT(*) as total_welcome_notifications
-- FROM notifications 
-- WHERE type = 'welcome';

