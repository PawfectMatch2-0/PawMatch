# Notification Setup Guide

This guide explains how to set up the new welcome and pet like notifications.

## 📋 New Notification Types

### 1. Welcome Notification (`welcome`)
- **When:** Automatically created when a new user profile is created
- **Purpose:** Welcome new users and introduce app features
- **Content:** Warm welcome message with app feature overview

### 2. Pet Liked Notification (`pet_liked`)
- **When:** Automatically created when someone likes a pet
- **Purpose:** Notify pet owners when their pet is liked
- **Content:** Shows liker's name, avatar, and pet information

---

## 🗄️ Database Setup

### Step 1: Run the SQL Migration

Run the SQL script in your Supabase SQL Editor:

```bash
database/25_notification_enhancements.sql
```

This script will:
1. ✅ Add new notification types (`welcome`, `pet_liked`) to the database constraint
2. ✅ Add columns for liker information (`liker_id`, `liker_name`, `liker_avatar`)
3. ✅ Create trigger for welcome notifications (when user profile is created)
4. ✅ Create trigger for pet like notifications (when pet is favorited)
5. ✅ Add indexes for better performance

### Step 2: Verify Database Changes

After running the SQL, verify:

```sql
-- Check notification types constraint
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'notifications_type_check';

-- Check new columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notifications' 
AND column_name IN ('liker_id', 'liker_name', 'liker_avatar');

-- Check triggers exist
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name IN ('welcome_notification_trigger', 'pet_like_notification_trigger');
```

---

## 🔔 How It Works

### Welcome Notifications

**Trigger:** `welcome_notification_trigger`
- Fires: `AFTER INSERT` on `user_profiles` table
- Function: `create_welcome_notification()`

**What happens:**
1. User signs up and confirms email
2. User profile is created in `user_profiles` table
3. Trigger automatically creates welcome notification
4. User sees notification in their notifications screen

**Notification Content:**
```
Title: "Welcome to PawfectMatch! 🎉"
Message: "Welcome to PawfectMatch! We're thrilled to have you join our community of pet lovers. Here's what you can do:

🐾 Discover Pets - Swipe through adorable pets looking for homes
❤️ Save Favorites - Like pets you're interested in
📝 Apply for Adoption - Submit applications for your favorite pets
💬 Chat with Mewi - Get pet care advice from our AI vet assistant
📚 Learn - Read articles about pet care and training
🛒 Shop - Find pet supplies and services near you

Start exploring and find your perfect furry friend!"
```

### Pet Liked Notifications

**Trigger:** `pet_like_notification_trigger`
- Fires: `AFTER INSERT` on `pet_favorites` table
- Function: `create_pet_like_notification()`

**What happens:**
1. User A likes User B's pet (swipes right/favorites)
2. Record is inserted into `pet_favorites` table
3. Trigger checks if pet has an owner and owner is not the liker
4. If conditions met, creates notification for pet owner
5. Notification includes liker's profile name and avatar

**Notification Content:**
```
Title: "Someone Liked Your Pet! ❤️"
Message: "[Liker Name] liked your pet [Pet Name]!"
Includes:
- Pet ID, name, and image
- Liker ID, name, and avatar
```

**Important:** Notification is only created if:
- Pet has an owner (`owner_id` is not null)
- Owner is not the same as the liker (prevents self-notifications)

---

## 🎨 UI Updates

The notification screen has been updated to:

1. **Display liker information** for `pet_liked` notifications:
   - Shows liker's avatar (circular image with border)
   - Shows liker's name prominently
   - Uses heart icon (pink)

2. **Display welcome notifications**:
   - Shows longer message (5 lines instead of 2)
   - Uses heart icon (pink)
   - Navigates to main tabs when tapped

3. **Navigation**:
   - `pet_liked` → Navigates to pet detail page
   - `welcome` → Navigates to main tabs (discover)

---

## 🧪 Testing

### Test Welcome Notification

1. Create a new user account
2. Confirm email
3. Check notifications screen
4. Should see welcome notification with app features

### Test Pet Liked Notification

1. User A: Upload a pet
2. User B: Like User A's pet (swipe right or favorite)
3. User A: Check notifications
4. Should see notification: "[User B] liked your pet [Pet Name]"
5. Should see User B's avatar and name

### Test Edge Cases

1. **Self-like:** User likes their own pet → No notification (correct behavior)
2. **Pet without owner:** Like a pet with no owner_id → No notification (correct behavior)
3. **Multiple likes:** Multiple users like same pet → Multiple notifications (one per like)

---

## 📱 Push Notifications (Optional)

To also send push notifications when these are created, you can:

1. **Listen for new notifications in database:**
```typescript
supabase
  .channel('notifications')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'notifications' },
    async (payload) => {
      const notification = payload.new;
      if (notification.type === 'welcome' || notification.type === 'pet_liked') {
        await sendNotification(
          notification.title,
          notification.message,
          {
            type: notification.type,
            petId: notification.pet_id,
            likerId: notification.liker_id,
          }
        );
      }
    }
  )
  .subscribe();
```

2. **Or use the notification service:**
```typescript
import { notificationService } from '@/lib/services/notificationService';

// When welcome notification is created, also send push
await notificationService.sendLocalNotification(
  'Welcome to PawfectMatch! 🎉',
  'Start exploring and find your perfect furry friend!',
  { type: 'welcome' }
);
```

---

## 🔧 Troubleshooting

### Welcome notifications not appearing

1. Check if trigger exists:
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'welcome_notification_trigger';
```

2. Check if function exists:
```sql
SELECT * FROM pg_proc WHERE proname = 'create_welcome_notification';
```

3. Manually test trigger:
```sql
-- Create a test profile
INSERT INTO user_profiles (id, email, full_name)
VALUES (gen_random_uuid(), 'test@example.com', 'Test User');

-- Check if notification was created
SELECT * FROM notifications WHERE type = 'welcome' ORDER BY created_at DESC LIMIT 1;
```

### Pet liked notifications not appearing

1. Check if trigger exists:
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'pet_like_notification_trigger';
```

2. Verify pet has owner:
```sql
SELECT id, name, owner_id FROM pets WHERE id = 'your-pet-id';
```

3. Check if like was recorded:
```sql
SELECT * FROM pet_favorites WHERE pet_id = 'your-pet-id' ORDER BY created_at DESC;
```

4. Manually test:
```sql
-- Insert a favorite
INSERT INTO pet_favorites (user_id, pet_id)
VALUES ('liker-user-id', 'pet-with-owner-id');

-- Check notification
SELECT * FROM notifications WHERE type = 'pet_liked' ORDER BY created_at DESC LIMIT 1;
```

---

## 📝 Summary

✅ **Welcome notifications** - Automatically sent to new users
✅ **Pet liked notifications** - Automatically sent to pet owners when their pet is liked
✅ **Database triggers** - Handle automatic creation
✅ **UI updates** - Display liker info and welcome messages
✅ **Navigation** - Proper routing for new notification types

All notifications are stored in the database and can trigger push notifications if configured.

