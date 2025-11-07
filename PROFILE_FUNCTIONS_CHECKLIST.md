# Profile Functions Checklist ✅

This document outlines all profile-related functions and how to test them.

## ✅ **COMPLETED SETUP**

### 1. **Authentication System**
- ✅ Sign In: Uses `useAuth()` hook from `@/hooks/useAuth`
- ✅ Sign Out: Calls `signOut()` with confirmation dialog
- ✅ Auto-redirect: If not signed in, redirects to `/auth`
- ✅ Session persistence: JWT tokens managed by Supabase

### 2. **Profile Management**
- ✅ Load Profile: Fetches user data from `user_profiles` table
- ✅ Edit Profile: Toggle edit mode with Edit button
- ✅ Save Changes: Updates name, phone, location
- ✅ Avatar Display: Shows user icon placeholder
- ✅ Email Display: Read-only, shows authenticated email

### 3. **My Pets Section**
- ✅ Load User Pets: Fetches pets where `owner_id` = user.id
- ✅ Add Pet Button: Navigates to `/pet/add`
- ✅ Pet List Display: Shows all user's uploaded pets
- ✅ Delete Pet: Delete with confirmation dialog
- ✅ Auto-refresh: Reloads pets when screen comes into focus

### 4. **Add Pet Functionality**
- ✅ Photo Upload: Up to 5 images via `expo-image-picker`
- ✅ Form Validation: Name, breed, age, at least 1 image required
- ✅ Pet Details: Gender, size, personality traits, description
- ✅ Contact Info: Location and phone number
- ✅ Image Upload: Uploads to Supabase Storage `pet-images` bucket
- ✅ Success Message: Shows confirmation and redirects back
- ✅ Database Insert: Creates pet with `owner_id` linking to user

---

## 🧪 **TESTING STEPS**

### **Test 1: Sign In & Profile Load**
1. Open app
2. Sign in with credentials
3. Tap profile button (upper right corner of Discover screen)
4. **Expected**: Profile screen loads with user's email, name, phone, location

### **Test 2: Edit Profile**
1. From profile screen, tap Edit button (pencil icon)
2. Change Full Name to "Test User Updated"
3. Change Phone to "123-456-7890"
4. Change Location to "Dhaka, Bangladesh"
5. Tap Save button (disk icon)
6. **Expected**: Success alert, fields updated, edit mode exits

### **Test 3: Add Pet**
1. From profile screen, tap "Add Pet for Adoption" button
2. Tap "Pick Image" - select 2-3 photos
3. Fill in:
   - Name: "Buddy"
   - Breed: "Golden Retriever"
   - Age: "2"
   - Color: "Golden"
   - Gender: Male
   - Size: Medium
   - Personality: Friendly, Playful, Loyal
   - Description: "A sweet and friendly dog"
   - Location: "Dhaka"
   - Phone: "123-456-7890"
4. Tap "Add Pet for Adoption" button at bottom
5. **Expected**: Loading indicator, success alert "Buddy has been added successfully...", redirect to profile

### **Test 4: View My Pets**
1. Return to profile screen
2. Scroll to "My Pets" section
3. **Expected**: See "1 pet listed", Buddy's card with photo, name, breed, age, and "Available" badge

### **Test 5: Delete Pet**
1. From "My Pets" section, tap Trash icon on Buddy's card
2. **Expected**: Confirmation dialog "Are you sure you want to delete Buddy?"
3. Tap "Delete"
4. **Expected**: Success alert, Buddy removed from list, count updated

### **Test 6: Pet Appears in Discover Feed**
1. Add a new pet (follow Test 3)
2. Navigate to Discover tab (bottom nav)
3. Swipe through cards
4. **Expected**: Your uploaded pet appears in the swipeable card stack with other pets

### **Test 7: Sign Out**
1. From profile screen, scroll to bottom
2. Tap "Sign Out" button (red button with logout icon)
3. **Expected**: Confirmation dialog "Are you sure you want to sign out?"
4. Tap "Sign Out"
5. **Expected**: Redirects to `/auth` screen, user logged out

---

## 🔧 **KEY FILES & FUNCTIONS**

### **Profile Screen** (`app/(tabs)/profile.tsx`)
```typescript
- loadProfile(): Fetches user profile from database
- loadUserPets(): Fetches user's pets (refreshes on focus)
- handleSave(): Updates profile information
- handleDeletePet(): Deletes pet with confirmation
- handleSignOut(): Signs out with confirmation, redirects to auth
```

### **Add Pet Screen** (`app/pet/add.tsx`)
```typescript
- pickImage(): Opens image picker
- validateForm(): Checks required fields
- handleSubmit(): 
  1. Creates pet record with owner_id
  2. Uploads images to Supabase Storage
  3. Updates pet record with image URLs
  4. Shows success message
  5. Redirects back to profile
```

### **User Pets Service** (`lib/services/userPetsService.ts`)
```typescript
- getUserPets(userId): Returns pets where owner_id = userId
- createUserPet(userId, petData): Inserts pet with owner_id
- deleteUserPet(petId): Removes pet from database
- uploadPetImages(petId, imageUris[]): Uploads to pet-images bucket
```

### **Profile Service** (`lib/services/profileService.ts`)
```typescript
- getUserProfile(userId): Fetches from user_profiles table
- updateUserProfile(userId, updates): Updates name, phone, location
```

### **Auth Hook** (`hooks/useAuth.tsx`)
```typescript
- useAuth(): Returns { user, signIn, signOut, signUp, loading }
- user: Current authenticated user object
- signOut(): Clears session, removes JWT tokens
```

---

## 🔐 **DATABASE STRUCTURE**

### **user_profiles Table**
```sql
- id: uuid (references auth.users)
- email: text
- full_name: text
- phone: text
- location: text
- avatar_url: text
- preferences: jsonb
- created_at: timestamp
```

### **pets Table**
```sql
- id: uuid (primary key)
- name: text
- breed: text
- age: integer
- gender: text
- size: text
- color: text
- personality: text[]
- description: text
- images: text[] (array of Supabase Storage URLs)
- location: text
- contact_info: jsonb { phone, email }
- adoption_status: text (available, pending, adopted)
- owner_id: uuid (references user_profiles.id) ⭐
- created_at: timestamp
- updated_at: timestamp
```

### **Row Level Security (RLS)**
```sql
-- Users can view all pets
SELECT: authenticated users can see all pets

-- Users can only insert their own pets
INSERT: owner_id = auth.uid()

-- Users can only update their own pets
UPDATE: owner_id = auth.uid()

-- Users can only delete their own pets
DELETE: owner_id = auth.uid()
```

---

## 🐛 **COMMON ISSUES & FIXES**

### **Issue 1: Profile not loading**
- **Cause**: User not authenticated or profile not created
- **Fix**: Ensure user signs up properly (profile auto-created in `lib/enhanced-auth.ts`)

### **Issue 2: Images not uploading**
- **Cause**: Supabase Storage bucket doesn't exist
- **Fix**: 
  1. Go to Supabase Dashboard → Storage
  2. Create bucket named `pet-images`
  3. Set policies: Public read, authenticated write

### **Issue 3: Pets not appearing in My Pets**
- **Cause**: RLS policies blocking query
- **Fix**: Check Supabase Dashboard → SQL Editor → Run:
  ```sql
  SELECT * FROM pets WHERE owner_id = 'YOUR_USER_ID';
  ```

### **Issue 4: Can't delete other users' pets**
- **Expected behavior**: RLS prevents users from deleting pets they don't own

### **Issue 5: Sign out not working**
- **Cause**: Supabase connection issue
- **Fix**: Check `.env` file has correct `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## ✨ **SUCCESS CRITERIA**

All profile functions are working if:
- ✅ User can sign in and profile loads
- ✅ User can edit and save profile changes
- ✅ User can add pets with photos
- ✅ User can see their pets in "My Pets"
- ✅ User can delete their own pets
- ✅ Uploaded pets appear in Discover feed for all users
- ✅ User can sign out successfully

---

## 📝 **ENVIRONMENT SETUP**

Ensure `.env` file has:
```env
EXPO_PUBLIC_SUPABASE_URL=https://afxkliyukojjymvfwiyp.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_ADMIN_EMAIL=pawfect.mew@gmail.com
EXPO_PUBLIC_DEBUG_AUTH=true
APP_ENV=development
```

**Restart Expo after `.env` changes!**

```bash
npx expo start --clear
```

---

## 🎯 **READY TO TEST!**

All functionality is implemented and ready. Follow the testing steps above to verify everything works correctly! 🐾
