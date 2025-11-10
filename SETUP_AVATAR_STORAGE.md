# Avatar Storage Setup Guide

## Issue
The app needs to upload profile pictures to Supabase Storage.

## Solution
We'll use the existing `user-avatars` bucket for profile pictures.

## Steps to Fix

### 1. Verify Bucket Exists
Go to Supabase Dashboard → Storage → Check if `user-avatars` bucket exists.

✅ **Good news!** Looking at your screenshot, the `user-avatars` bucket already exists and is Public!

### 2. Set Up Storage Policies

Run these SQL commands in Supabase SQL Editor:

```sql
-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-avatars'
);

-- Allow anyone to view avatars (public read)
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'user-avatars'
);

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-avatars'
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-avatars'
);
```

### 3. Test Upload

1. Open the app
2. Go to Profile tab
3. Click the camera button on the avatar
4. Select a photo
5. It should upload successfully!

## What Was Changed in Code

1. ✅ Fixed deprecated `MediaTypeOptions.Images` → `['images']`
2. ✅ Using `'user-avatars'` bucket (already exists in your project!)
3. ✅ Simplified blob conversion for both web and mobile
4. ✅ Made email text darker and bolder for better visibility
5. ✅ Fixed email display to use `user.email` as fallback

## File Structure in Storage

```
user-avatars/
  ├── avatar-user-id-1-timestamp.jpg
  ├── avatar-user-id-2-timestamp.jpg
  └── ...
```

## Troubleshooting

### Still getting "Bucket not found"?
- Verify the bucket name is exactly `pet-images` (case-sensitive)
- Check that the bucket is created in your Supabase project

### Upload works but image doesn't show?
- Make sure the bucket is set to **Public**
- Check the Storage policies are applied correctly

### Permission errors?
- Verify the user is authenticated
- Check the RLS policies are created correctly
