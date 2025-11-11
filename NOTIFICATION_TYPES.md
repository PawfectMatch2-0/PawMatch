# Notification Types in PawfectMatch

This document describes all the types of notifications users will receive in the PawfectMatch app.

## 📋 Overview

The app sends notifications to keep users informed about:
- **Adoption Application Status** - Updates on their pet adoption requests
- **Messages** - New messages from admins or other users
- **System Updates** - Important app-wide announcements

---

## 🔔 Notification Types

### 1. **Adoption Application Notifications**

#### 📋 `adoption_pending`
**When:** User submits an adoption application

**Title:** "Application Submitted Successfully! 📋"

**Message:** 
> "Your adoption application for [Pet Name] has been submitted and is under review. We will contact you within 2-3 business days."

**Icon:** ⏰ Clock icon (orange)

**Action:** User can view the pet profile or check application status

**Trigger:** Automatically created when a new adoption application is inserted into the database

---

#### ✅ `adoption_approved`
**When:** Admin approves a user's adoption application

**Title:** "Adoption Request Approved! 🎉"

**Message:**
> "Congratulations! Your adoption application for [Pet Name] has been approved! Please contact us to arrange pickup."

**Icon:** ❤️ Heart icon (green, filled)

**Action:** 
- Tap to view pet details
- Navigate to adoption tracker
- Contact admin to arrange pickup

**Trigger:** Automatically created when adoption application status changes from `pending` to `approved`

---

#### ❌ `adoption_rejected`
**When:** Admin rejects a user's adoption application

**Title:** "Application Update 📝"

**Message:**
> "Unfortunately, your application for [Pet Name] was not selected this time. Please consider applying for other pets."

**Icon:** ❌ X icon (red)

**Action:**
- Tap to view pet details
- Browse other available pets
- Apply for a different pet

**Trigger:** Automatically created when adoption application status changes from `pending` to `rejected`

---

### 2. **Message Notifications**

#### 💬 `message`
**When:** User receives a new message from:
- Admin regarding their adoption application
- Another user (if messaging feature is enabled)
- System announcements

**Title:** "💬 Message from [Sender Name]"

**Message:**
> "[Message preview - first 50 characters]..."

**Icon:** 💬 Message circle icon

**Action:**
- Tap to open chat/messages screen
- View full conversation
- Reply to message

**Trigger:** Created when a new message is inserted into `user_messages` table

**Example Scenarios:**
- Admin asks for additional information about adoption
- Admin provides pickup instructions
- Admin sends welcome message after approval
- System sends important updates

---

### 3. **System Notifications**

#### 🔔 `system`
**When:** Important app-wide announcements or updates

**Title:** Varies based on announcement type

**Message:** System-wide information

**Icon:** 🔔 Bell icon

**Action:** Tap to view full announcement or relevant screen

**Examples:**
- App maintenance notifications
- New features announcements
- Policy updates
- Important reminders
- Pet care tips
- Seasonal pet care reminders

---

## 📱 Notification Display

### Visual Indicators

Each notification type has a unique icon and color:

| Type | Icon | Color | Meaning |
|------|------|-------|---------|
| `adoption_approved` | ❤️ Heart (filled) | Green (#10B981) | Success/Approval |
| `adoption_pending` | ⏰ Clock | Orange (#F59E0B) | Waiting/In Progress |
| `adoption_rejected` | ❌ X | Red (#EF4444) | Rejection/Declined |
| `message` | 💬 Message | Primary color | New message |
| `system` | 🔔 Bell | Primary color | System update |

### Read/Unread Status

- **Unread:** Bold text, colored icon, appears at top of list
- **Read:** Grayed out text, muted icon, appears below unread

### Timestamp Format

- **< 1 hour:** "X minutes ago"
- **< 24 hours:** "X hours ago"
- **< 7 days:** "X days ago"
- **> 7 days:** Full date (e.g., "Jan 15, 2024")

---

## 🔄 Automatic Notification Creation

The app uses **database triggers** to automatically create notifications:

### 1. Application Submission Trigger
```sql
-- Automatically creates 'adoption_pending' notification
-- When: New adoption application is inserted
```

### 2. Status Change Trigger
```sql
-- Automatically creates 'adoption_approved' or 'adoption_rejected' notification
-- When: Adoption application status is updated
```

### 3. Manual Creation
```typescript
// Can be created manually via API
await databaseService.createNotification({
  user_id: userId,
  type: 'message',
  title: 'New Message',
  message: 'You have a new message!',
  pet_id: 'optional-pet-id',
  pet_name: 'Optional Pet Name',
  pet_image: 'optional-image-url'
});
```

---

## 📲 Push Notification Integration

When notifications are created in the database, you can also send push notifications:

```typescript
import { useNotifications } from '@/hooks/useNotifications';

// Send push notification when adoption is approved
const { sendNotification } = useNotifications();

await sendNotification(
  'Adoption Request Approved! 🎉',
  'Congratulations! Your application for Fluffy has been approved!',
  {
    type: 'adoption_approved',
    petId: pet.id,
    petName: pet.name,
  }
);
```

---

## 🎯 User Actions on Notifications

### Tapping a Notification

When a user taps a notification, the app navigates to:

1. **Adoption Notifications** (`adoption_approved`, `adoption_pending`, `adoption_rejected`)
   - Navigates to: `/pet/[petId]` - Pet detail page
   - Shows pet information and adoption status

2. **Message Notifications** (`message`)
   - Navigates to: `/chat` or messages screen
   - Opens conversation thread

3. **System Notifications** (`system`)
   - Navigates to: Relevant screen based on notification data
   - Or shows full announcement modal

### Marking as Read

- **Single notification:** Tap to automatically mark as read
- **All notifications:** "Mark all as read" button in notifications screen
- **Badge count:** App badge updates to show unread count

---

## 🔮 Future Notification Types (Potential)

These could be added in future updates:

### Pet-Related
- `new_pet_match` - New pet matches user's preferences
- `pet_favorite_available` - A favorited pet becomes available
- `pet_update` - Updates about a pet user is interested in

### Adoption Process
- `meeting_scheduled` - Adoption meeting scheduled
- `pickup_reminder` - Reminder about upcoming pickup
- `adoption_completed` - Adoption process completed

### Engagement
- `weekly_digest` - Weekly summary of new pets
- `care_tip` - Pet care tips and reminders
- `community_update` - Community news and updates

### Learning
- `new_article` - New learning article published
- `article_recommendation` - Recommended article based on interests

---

## 📊 Notification Statistics

Users can see:
- Total notifications count
- Unread notifications count
- Notification history
- Filter by type (if implemented)

Admins can see:
- Total notifications sent
- Unread notifications across all users
- Notification engagement rates

---

## ⚙️ Notification Settings (Future)

Users may be able to customize:
- Which notification types to receive
- Push notification preferences
- Email notification preferences
- Quiet hours
- Notification sound preferences

---

## 🔧 Technical Details

### Database Schema
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type VARCHAR(50) CHECK (type IN (
    'adoption_approved',
    'adoption_rejected', 
    'adoption_pending',
    'message',
    'system'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  pet_id UUID REFERENCES pets(id),
  pet_name VARCHAR(100),
  pet_image TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### API Functions
- `getUserNotifications(userId)` - Get all notifications for user
- `markNotificationAsRead(notificationId)` - Mark as read
- `createNotification(notification)` - Create new notification

---

## 📝 Summary

**Current Notification Types:**
1. ✅ `adoption_approved` - Adoption application approved
2. ❌ `adoption_rejected` - Adoption application rejected
3. ⏰ `adoption_pending` - Application submitted, under review
4. 💬 `message` - New message received
5. 🔔 `system` - System announcements

**All notifications:**
- Are stored in the database
- Can trigger push notifications
- Have unique icons and colors
- Support navigation to relevant screens
- Can be marked as read/unread
- Show timestamps
- Include pet information when relevant

---

For implementation details, see `NOTIFICATIONS_GUIDE.md`.

