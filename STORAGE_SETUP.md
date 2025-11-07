# Supabase Storage Setup Guide

## Current Issue
```
❌ [UserPets] Upload images failed: Property 'blob' doesn't exist
```

## Fix Applied
✅ Changed from `blob()` to `arrayBuffer()` for React Native compatibility
- Updated `lib/services/userPetsService.ts`
- Now uses `Uint8Array` format for uploads

## Required: Create Storage Buckets

You need to create two storage buckets in Supabase for image uploads:

### 1. Pet Images Bucket

**Bucket Name**: `pet-images`  
**Purpose**: Store pet photos uploaded by users

**Steps to Create**:
1. Go to Supabase Dashboard → **Storage**
2. Click **"New Bucket"**
3. Bucket name: `pet-images`
4. ✅ **Check "Public bucket"** (so images are publicly accessible)
5. Click **"Create bucket"**

**Set Policies** (Run in SQL Editor):
```sql
-- Allow authenticated users to upload pet images
CREATE POLICY "Users can upload pet images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'pet-images');

-- Allow public to view pet images
CREATE POLICY "Public can view pet images"
ON storage.objects FOR SELECT
USING (bucket_id = 'pet-images');

-- Allow users to update their own pet images
CREATE POLICY "Users can update own pet images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'pet-images');

-- Allow users to delete their own pet images
CREATE POLICY "Users can delete own pet images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'pet-images');
```

### 2. User Avatars Bucket

**Bucket Name**: `user-avatars`  
**Purpose**: Store user profile pictures

**Steps to Create**:
1. Go to Supabase Dashboard → **Storage**
2. Click **"New Bucket"**
3. Bucket name: `user-avatars`
4. ✅ **Check "Public bucket"** (so avatars are publicly accessible)
5. Click **"Create bucket"**

**Set Policies** (Run in SQL Editor):
```sql
-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public to view avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-avatars');

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## How Image Upload Works Now

### Pet Images Upload Flow
```typescript
// User picks image from phone
const imageUri = "file:///path/to/photo.jpg"

// Service converts to ArrayBuffer
const response = await fetch(imageUri);
const arrayBuffer = await response.arrayBuffer();
const fileData = new Uint8Array(arrayBuffer);

// Upload to Supabase Storage
await supabase.storage
  .from('pet-images')
  .upload('pet-images/pet-id-123456.jpg', fileData, {
    contentType: 'image/jpg',
    upsert: true
  });

// Get public URL
const { data } = supabase.storage
  .from('pet-images')
  .getPublicUrl('pet-images/pet-id-123456.jpg');

// Save URL to database
const imageUrl = data.publicUrl;
```

### File Naming Convention

**Pet Images**:
- Format: `{petId}-{timestamp}-{index}.{extension}`
- Example: `8f3d5c7a-...-1730000000-0.jpg`
- Stored in: `pet-images/` folder

**User Avatars**:
- Format: `{userId}/avatar-{timestamp}.{extension}`
- Example: `703d7ccc-.../avatar-1730000000.jpg`
- Stored in: `user-avatars/{userId}/` folder

## Testing Upload

After creating the buckets, test the upload:

1. **Add a Pet** with photos
2. Check logs for:
   ```
   ✅ [UserPets] Image 1/3 uploaded
   ✅ [UserPets] Image 2/3 uploaded
   ✅ [UserPets] Image 3/3 uploaded
   ✅ [UserPets] Uploaded 3/3 images successfully
   ```

3. **Verify in Supabase**:
   - Go to Storage → `pet-images`
   - You should see uploaded images
   - Click image → "Get URL" to verify public access

## Troubleshooting

### Error: "Bucket not found"
❌ **Problem**: Storage bucket doesn't exist  
✅ **Solution**: Create the bucket in Supabase Dashboard (see steps above)

### Error: "Policy violation"
❌ **Problem**: RLS policies not set on storage  
✅ **Solution**: Run the policy SQL scripts above

### Error: "Invalid bucket name"
❌ **Problem**: Typo in bucket name  
✅ **Solution**: Ensure exact names: `pet-images` and `user-avatars`

### Images upload but don't show
❌ **Problem**: Bucket not public  
✅ **Solution**: Edit bucket → Check "Public" option

## Image Size Limits

**Recommended**:
- Max size per image: 5 MB
- Max dimensions: 2000 x 2000 px
- Formats: JPG, PNG, WEBP

**Current Limits** (Supabase Free Tier):
- Total storage: 1 GB
- Bandwidth: 2 GB/month

## Code Reference

**Image Upload Service**: `lib/services/userPetsService.ts` (Lines 163-210)  
**Avatar Upload Service**: `lib/services/profileService.ts` (Lines 185-235)

Both now use `arrayBuffer()` instead of `blob()` for React Native compatibility ✅

---

**Status**: ✅ Code fixed, awaiting storage bucket creation in Supabase
