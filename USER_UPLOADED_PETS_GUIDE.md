# User Uploaded Pets - Complete Guide

## 📋 How It Works

### ✅ Current System Behavior (Already Working!)

When ANY user uploads a pet through the "Add Pet for Adoption" feature:

1. **Pet is stored in database** with:
   - `owner_id` = User's ID (who uploaded it)
   - `adoption_status` = 'available' (automatically set)
   - All pet details (name, breed, age, images, description, etc.)

2. **Pet appears in Discover feed for ALL users** (including other users):
   - Query: `SELECT * FROM pets WHERE adoption_status = 'available'`
   - Does NOT exclude based on `owner_id`
   - Only excludes pets the current user already swiped on

3. **Pet owner can manage their pet**:
   - View in Profile → My Pets section
   - Edit details
   - Delete listing
   - Change adoption status (available/pending/adopted)

## 🎯 User Upload Flow

### When User Uploads a Pet:

```typescript
// File: lib/services/userPetsService.ts
export async function createUserPet(userId, petData) {
  return await supabase
    .from('pets')
    .insert([{
      ...petData,
      owner_id: userId,              // ✅ Links pet to user
      adoption_status: 'available',  // ✅ Makes it appear in discover
    }])
}
```

### When Other Users Browse Discover:

```typescript
// File: lib/supabase.ts - getPetsExcludingInteracted()
let query = supabase
  .from('pets')
  .select('*')
  .eq('adoption_status', 'available')  // ✅ Includes ALL available pets
  .not('id', 'in', alreadySwipedPetIds) // ❌ Only excludes already swiped
```

**Result:** Your uploaded pet appears for other users! ✅

## 🔍 Why You Might Not See Your Own Uploaded Pets

There are 3 possible reasons:

### 1. **You Already Swiped on Them**
- If you swiped on your own pet, it's hidden from your discover feed
- **Solution:** Run `RESET_MY_INTERACTIONS.sql` to clear your swipe history

### 2. **Pets Were Deleted**
- The `KEEP_ONLY_MY_PETS.sql` script accidentally deleted your pets
- **Reason:** Your pets didn't have `owner_id` set when they were uploaded
- **Solution:** Re-upload your pets through the app OR run restoration script

### 3. **Adoption Status Changed**
- If `adoption_status` is 'pending' or 'adopted', pet won't show in discover
- **Solution:** Run `FIX_PET_AVAILABILITY.sql` to set all to 'available'

## 🛠️ Verification Steps

### Step 1: Check Your Uploaded Pets Exist
Run `CHECK_MY_UPLOADED_PETS.sql` in Supabase SQL Editor

Expected result:
```sql
-- Should show your pets with:
- owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
- adoption_status = 'available'
- discover_visibility = '✅ Will appear in discover'
```

### Step 2: Check Pet Interactions
```sql
SELECT COUNT(*) as interactions_count
FROM pet_interactions
WHERE user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56';
```

If this shows interactions with your own pets, run `RESET_MY_INTERACTIONS.sql`

### Step 3: Verify Discover Feed Query
```sql
-- This is what the app runs to get pets for you:
SELECT * FROM pets
WHERE adoption_status = 'available'
  AND id NOT IN (
    SELECT pet_id FROM pet_interactions 
    WHERE user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
  )
ORDER BY created_at DESC;
```

## 📱 How Other Users See Your Pets

### Example Scenario:

**You (User A)** upload a cat named "Marshmallow":
- `owner_id` = Your ID
- `adoption_status` = 'available'
- Stored in database ✅

**Other User (User B)** opens Discover:
1. App queries: `SELECT * FROM pets WHERE adoption_status = 'available'`
2. Includes your "Marshmallow" ✅
3. User B sees your cat in their swipe feed
4. User B can like/pass on your cat
5. If User B likes it, they can contact you (via contact_info)

## 🔄 Re-uploading Your Pets

If your pets were deleted, you have 2 options:

### Option 1: Upload Through App (RECOMMENDED)
1. Open Pawfect Match app
2. Go to Profile tab
3. Tap "Add Pet for Adoption" button
4. Fill in pet details with original information:
   - Name (e.g., "Marshmallow", "Peu", "Zenitsu")
   - Breed
   - Age
   - Gender
   - Size
   - Photos (upload from your phone)
   - Description
   - Location
   - Contact info
5. Submit - pet automatically saved with correct `owner_id`

### Option 2: SQL Insert Script
If you have the original data, run:

```sql
INSERT INTO pets (
  id, name, breed, age, gender, size, color, 
  personality, description, images, location, 
  contact_info, adoption_status, owner_id, created_at
) VALUES (
  gen_random_uuid(),
  'Marshmallow',
  'Munchkin',
  2,
  'female',
  'small',
  'White with gray patches',
  ARRAY['Playful', 'Affectionate', 'Curious'],
  'Your original description...',
  ARRAY['your-image-url-1.jpg', 'your-image-url-2.jpg'],
  'Dhaka, Bangladesh',
  '{"phone": "your-phone", "email": "your-email"}',
  'available',
  '703d7ccc-cc09-43ef-b6df-b3544e315d56',
  NOW()
);
```

## ✅ Best Practices

### For Pet Owners:
1. **Always set adoption_status = 'available'** when you want the pet in discover
2. **Change to 'pending'** when someone is interested
3. **Change to 'adopted'** when pet finds a home
4. **Provide accurate contact_info** so interested users can reach you
5. **Use high-quality images** (3-5 photos recommended)

### For Database Management:
1. **Never run deletion scripts without verifying owner_id**
2. **Always check adoption_status before wondering why pets don't appear**
3. **Use UPSERT instead of INSERT** to avoid duplicate key errors
4. **Set owner_id when creating pets** to track ownership

## 🎉 Summary

**Your uploaded pets system is ALREADY working correctly!**

The code is set up to:
- ✅ Store user-uploaded pets in database with owner_id
- ✅ Show them in discover feed for ALL users
- ✅ Allow other users to like/pass on your pets
- ✅ Let pet owners manage their own pets in Profile

If you don't see your pets:
1. Check if they exist in database (`CHECK_MY_UPLOADED_PETS.sql`)
2. Check if you already swiped on them (`pet_interactions` table)
3. Re-upload through the app if they were deleted

**No code changes needed - the system works as designed!** 🚀
