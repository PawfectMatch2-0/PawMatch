# Notifications Guide for PawfectMatch

This guide explains how to use push notifications and local notifications in the PawfectMatch app.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Basic Usage](#basic-usage)
4. [Common Use Cases](#common-use-cases)
5. [Advanced Features](#advanced-features)
6. [Troubleshooting](#troubleshooting)

---

## Overview

The app uses **Expo Notifications** (`expo-notifications`) to handle:
- ✅ **Push Notifications** - Remote notifications sent from your server
- ✅ **Local Notifications** - Notifications triggered by the app itself
- ✅ **Notification Permissions** - Automatic permission requests
- ✅ **Badge Counts** - Unread notification badges
- ✅ **Notification Taps** - Handle when users tap notifications

---

## Setup

### 1. Configuration

The notification service is already configured in:
- ✅ `app.config.js` - Expo plugin configuration
- ✅ `lib/services/notificationService.ts` - Core service
- ✅ `hooks/useNotifications.ts` - React hook

### 2. Initialize Notifications

Notifications are automatically initialized when a user signs in. The service:
- Requests notification permissions
- Registers for push notifications
- Saves the push token to the user's profile

**No manual setup required!** The service initializes automatically in the app.

---

## Basic Usage

### Using the Hook

```typescript
import { useNotifications } from '@/hooks/useNotifications';

function MyComponent() {
  const {
    isEnabled,           // Whether notifications are enabled
    isInitialized,      // Whether service is ready
    sendNotification,   // Send immediate notification
    scheduleNotification, // Schedule for later
    cancelNotification, // Cancel a scheduled notification
    setBadgeCount,      // Set app badge count
  } = useNotifications();

  // Send a notification
  const handleNotify = async () => {
    if (isEnabled) {
      await sendNotification(
        'New Pet Available!',
        'Check out this adorable cat looking for a home',
        {
          type: 'new_pet',
          petId: '123',
        }
      );
    }
  };

  return (
    <Button onPress={handleNotify} title="Send Notification" />
  );
}
```

### Direct Service Usage

```typescript
import { notificationService } from '@/lib/services/notificationService';

// Initialize (usually done automatically)
await notificationService.initialize(userId);

// Send immediate notification
await notificationService.sendLocalNotification(
  'Adoption Approved!',
  'Your application for Fluffy has been approved.',
  {
    type: 'adoption_approved',
    petId: '123',
  }
);

// Schedule notification for 1 hour from now
await notificationService.scheduleNotification(
  'Reminder',
  'Don\'t forget to check your adoption status!',
  3600, // seconds
  { type: 'reminder' }
);
```

---

## Common Use Cases

### 1. Adoption Application Status

**When:** User's adoption application is approved/rejected

```typescript
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';

function AdoptionStatusHandler() {
  const { sendNotification } = useNotifications();
  const { user } = useAuth();

  const notifyAdoptionApproved = async (petName: string, petId: string) => {
    await sendNotification(
      '🎉 Adoption Approved!',
      `Congratulations! Your application for ${petName} has been approved.`,
      {
        type: 'adoption_approved',
        petId: petId,
        petName: petName,
      }
    );
  };

  const notifyAdoptionRejected = async (petName: string) => {
    await sendNotification(
      'Application Update',
      `Your application for ${petName} was not approved at this time.`,
      {
        type: 'adoption_rejected',
        petName: petName,
      }
    );
  };

  return { notifyAdoptionApproved, notifyAdoptionRejected };
}
```

### 2. New Pet Available

**When:** A new pet matching user's preferences is added

```typescript
const notifyNewPet = async (pet: Pet) => {
  await sendNotification(
    '🐾 New Pet Available!',
    `${pet.name} is looking for a loving home. Check them out!`,
    {
      type: 'new_pet',
      petId: pet.id,
      petName: pet.name,
      petImage: pet.images?.[0],
    }
  );
};
```

### 3. New Message

**When:** User receives a message from another user or admin

```typescript
const notifyNewMessage = async (senderName: string, message: string) => {
  await sendNotification(
    `💬 Message from ${senderName}`,
    message.substring(0, 50) + (message.length > 50 ? '...' : ''),
    {
      type: 'message',
      senderName: senderName,
    }
  );
};
```

### 4. Reminder Notifications

**When:** Remind users to check their applications or favorite pets

```typescript
const { scheduleNotification } = useNotifications();

// Remind user to check application status in 3 days
await scheduleNotification(
  'Application Status Check',
  'It\'s been 3 days since you applied. Check your application status!',
  3 * 24 * 3600, // 3 days in seconds
  { type: 'reminder' }
);
```

### 5. Pet Care Reminders

**When:** Scheduled reminders for pet care (if user has adopted pets)

```typescript
// Remind user to feed their pet every day at 8 AM
const scheduleDailyReminder = async () => {
  const now = new Date();
  const reminderTime = new Date();
  reminderTime.setHours(8, 0, 0, 0);
  
  if (reminderTime < now) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  await scheduleNotification(
    '🐾 Time to Feed Your Pet!',
    'Don\'t forget to feed your furry friend.',
    reminderTime,
    { type: 'pet_care', action: 'feed' }
  );
};
```

---

## Advanced Features

### 1. Handling Notification Taps

When a user taps a notification, you can navigate to a specific screen:

```typescript
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

function NotificationHandler() {
  const router = useRouter();

  useEffect(() => {
    // Listen for notification taps
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        
        // Navigate based on notification type
        if (data.type === 'adoption_approved' && data.petId) {
          router.push(`/pet/${data.petId}`);
        } else if (data.type === 'message') {
          router.push('/chat');
        } else if (data.type === 'new_pet' && data.petId) {
          router.push(`/pet/${data.petId}`);
        }
      }
    );

    return () => subscription.remove();
  }, [router]);
}
```

### 2. Badge Count Management

Update the app badge to show unread notifications:

```typescript
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect } from 'react';

function BadgeManager() {
  const { setBadgeCount } = useNotifications();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch unread notifications from database
    const fetchUnreadCount = async () => {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
      await setBadgeCount(count);
    };

    fetchUnreadCount();
  }, []);

  return null; // This is a background component
}
```

### 3. Push Notifications from Server

To send push notifications from your backend:

1. **Get the user's push token:**
```typescript
const pushToken = await notificationService.getPushToken();
// Save this token to your database
```

2. **Send from your server using Expo Push API:**
```javascript
// Example: Node.js server
const { Expo } = require('expo-server-sdk');

const expo = new Expo();
const messages = [{
  to: pushToken,
  sound: 'default',
  title: 'New Pet Available!',
  body: 'Check out this adorable cat!',
  data: { petId: '123' },
}];

const chunks = expo.chunkPushNotifications(messages);
for (const chunk of chunks) {
  await expo.sendPushNotificationsAsync(chunk);
}
```

### 4. Notification Categories (iOS)

For iOS, you can define notification categories with actions:

```typescript
import * as Notifications from 'expo-notifications';

await Notifications.setNotificationCategoryAsync('ADOPTION', [
  {
    identifier: 'VIEW_PET',
    buttonTitle: 'View Pet',
    options: { opensAppToForeground: true },
  },
  {
    identifier: 'DISMISS',
    buttonTitle: 'Dismiss',
    options: { isDestructive: true },
  },
]);
```

---

## Integration Examples

### Example 1: Adoption Application Submission

```typescript
// In app/adoption/apply.tsx or similar
import { useNotifications } from '@/hooks/useNotifications';

const submitApplication = async () => {
  // ... submit application logic ...
  
  // Send confirmation notification
  await sendNotification(
    'Application Submitted!',
    `Your application for ${petName} has been received. We'll review it soon!`,
    {
      type: 'adoption_pending',
      petId: petId,
      petName: petName,
    }
  );
};
```

### Example 2: Database Trigger Integration

When a notification is created in the database, trigger a push notification:

```sql
-- Example: Supabase Database Function
CREATE OR REPLACE FUNCTION notify_user_on_adoption_status()
RETURNS TRIGGER AS $$
BEGIN
  -- When adoption status changes, create notification
  IF NEW.status != OLD.status THEN
    INSERT INTO notifications (user_id, type, title, message, pet_id)
    VALUES (
      NEW.user_id,
      'adoption_' || NEW.status,
      'Adoption ' || NEW.status,
      'Your application status has been updated.',
      NEW.pet_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Then in your app, listen for new notifications and send push notifications:

```typescript
// Listen for new notifications in database
supabase
  .channel('notifications')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'notifications' },
    async (payload) => {
      const notification = payload.new;
      await sendNotification(
        notification.title,
        notification.message,
        {
          type: notification.type,
          petId: notification.pet_id,
        }
      );
    }
  )
  .subscribe();
```

---

## Troubleshooting

### Notifications Not Showing

1. **Check Permissions:**
```typescript
const { status } = await Notifications.getPermissionsAsync();
console.log('Permission status:', status);
```

2. **Check Initialization:**
```typescript
const isInitialized = await notificationService.initialize(userId);
console.log('Service initialized:', isInitialized);
```

3. **Check Platform:**
   - Push notifications require a physical device (not simulator)
   - Local notifications work on simulator

### Push Token Not Received

- Ensure `expo-notifications` plugin is configured in `app.config.js`
- Check that `Constants.expoConfig?.extra?.eas?.projectId` is set
- Rebuild the app after adding the plugin

### Notifications Not Tappable

- Ensure notification data includes navigation info (e.g., `petId`)
- Set up notification tap handler in your root component

---

## Best Practices

1. **Request Permissions Early**: Initialize notifications when user signs in
2. **Provide Context**: Always include relevant data in notification payload
3. **Don't Spam**: Limit notification frequency
4. **Handle Errors**: Always wrap notification calls in try-catch
5. **Test Thoroughly**: Test on both iOS and Android devices

---

## API Reference

### `notificationService`

- `initialize(userId?: string)`: Initialize service and request permissions
- `sendLocalNotification(title, body, data?, sound?)`: Send immediate notification
- `scheduleNotification(title, body, trigger, data?)`: Schedule for later
- `cancelNotification(notificationId)`: Cancel a scheduled notification
- `cancelAllNotifications()`: Cancel all scheduled notifications
- `getBadgeCount()`: Get current badge count
- `setBadgeCount(count)`: Set badge count
- `getPushToken()`: Get Expo push token
- `areNotificationsEnabled()`: Check if permissions granted

### `useNotifications()` Hook

Returns:
- `isEnabled`: Boolean - Are notifications enabled?
- `isInitialized`: Boolean - Is service ready?
- `sendNotification(...)`: Function - Send notification
- `scheduleNotification(...)`: Function - Schedule notification
- `cancelNotification(...)`: Function - Cancel notification
- `cancelAllNotifications()`: Function - Cancel all
- `getBadgeCount()`: Function - Get badge count
- `setBadgeCount(...)`: Function - Set badge count
- `getPushToken()`: Function - Get push token

---

## Need Help?

- Check Expo Notifications docs: https://docs.expo.dev/versions/latest/sdk/notifications/
- Review the service code: `lib/services/notificationService.ts`
- Check example implementations in the codebase

