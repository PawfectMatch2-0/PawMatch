-- Notification Enhancements
-- Adds welcome notifications and pet like notifications
-- Run this after 04_extended_schema.sql

-- 1. Update notifications table to support new types and liker information
ALTER TABLE notifications 
  DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE notifications
  ADD CONSTRAINT notifications_type_check 
  CHECK (type IN (
    'adoption_approved', 
    'adoption_rejected', 
    'adoption_pending', 
    'message', 
    'system',
    'welcome',
    'pet_liked'
  ));

-- Add columns for liker information (for pet_liked notifications)
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS liker_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS liker_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS liker_avatar TEXT;

-- 2. Function to create welcome notification for new users
CREATE OR REPLACE FUNCTION create_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Create welcome notification when a new user profile is created
  INSERT INTO notifications (user_id, type, title, message, read)
  VALUES (
    NEW.id,
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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create welcome notification when user profile is created
DROP TRIGGER IF EXISTS welcome_notification_trigger ON user_profiles;
CREATE TRIGGER welcome_notification_trigger
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_welcome_notification();

-- 3. Function to create notification when someone likes a pet
CREATE OR REPLACE FUNCTION create_pet_like_notification()
RETURNS TRIGGER AS $$
DECLARE
  pet_owner_id UUID;
  pet_name_val VARCHAR(100);
  pet_image_val TEXT;
  liker_name_val VARCHAR(100);
  liker_avatar_val TEXT;
BEGIN
  -- Get pet owner and pet information
  SELECT p.owner_id, p.name, p.images[1]
  INTO pet_owner_id, pet_name_val, pet_image_val
  FROM pets p
  WHERE p.id = NEW.pet_id;
  
  -- Only create notification if pet has an owner and owner is not the liker
  IF pet_owner_id IS NOT NULL AND pet_owner_id != NEW.user_id THEN
    -- Get liker's profile information
    SELECT up.full_name, up.avatar_url
    INTO liker_name_val, liker_avatar_val
    FROM user_profiles up
    WHERE up.id = NEW.user_id;
    
    -- Create notification for pet owner
    INSERT INTO notifications (
      user_id, 
      type, 
      title, 
      message, 
      pet_id, 
      pet_name, 
      pet_image,
      liker_id,
      liker_name,
      liker_avatar,
      read
    )
    VALUES (
      pet_owner_id,
      'pet_liked',
      'Someone Liked Your Pet! ❤️',
      COALESCE(liker_name_val, 'Someone') || ' liked your pet ' || pet_name_val || '!',
      NEW.pet_id,
      pet_name_val,
      pet_image_val,
      NEW.user_id,
      liker_name_val,
      liker_avatar_val,
      false
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification when pet is favorited
DROP TRIGGER IF EXISTS pet_like_notification_trigger ON pet_favorites;
CREATE TRIGGER pet_like_notification_trigger
  AFTER INSERT ON pet_favorites
  FOR EACH ROW
  EXECUTE FUNCTION create_pet_like_notification();

-- 4. Add index for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_liker_id ON notifications(liker_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_welcome_notification() TO authenticated;
GRANT EXECUTE ON FUNCTION create_pet_like_notification() TO authenticated;

