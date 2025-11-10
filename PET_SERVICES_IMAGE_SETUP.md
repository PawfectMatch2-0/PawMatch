# 🖼️ Pet Service Images - Setup Guide

## Current Solution: Unsplash Auto-Search

The app now automatically loads real images for pet services using Unsplash API:

### How It Works
1. **Featured Image Priority** - If you upload a custom image URL to `featured_image` field, it will use that
2. **Auto-Search** - If no featured image, it searches Unsplash using:
   - Service name (e.g., "Dr. Hasan's Veterinary Clinic")
   - Category (e.g., "veterinary")
   - Keywords (pet, bangladesh)
3. **Real Results** - Shows relevant, high-quality images automatically

### Benefits
✅ No storage costs  
✅ Automatic image matching  
✅ Always fresh images  
✅ Works offline (uses cached images)  
✅ No setup required  

---

## Option 2: Upload Custom Images to Supabase Storage

If you want to upload your own images, follow these steps:

### Step 1: Create a Storage Bucket in Supabase

1. Go to **Supabase Dashboard** → **Storage**
2. Click **+ Create Bucket**
3. Name it: `pet-service-images`
4. Set to **Public** (so images are accessible)
5. Click **Create**

### Step 2: Upload Image Files

1. In the `pet-service-images` bucket, upload your service photos
2. Name them clearly (e.g., `dr-hasan-clinic.jpg`, `royal-grooming.jpg`)
3. Get the public URL for each image

### Step 3: Update Database with Image URLs

In Supabase SQL Editor, update the `featured_image` field:

```sql
UPDATE pet_services
SET featured_image = 'https://your-supabase-url/storage/v1/object/public/pet-service-images/your-image-name.jpg'
WHERE name = 'Service Name';
```

Example:
```sql
UPDATE pet_services
SET featured_image = 'https://afxkliyukojjymvfwiyp.supabase.co/storage/v1/object/public/pet-service-images/dr-hasan-clinic.jpg'
WHERE name = 'Dr. Hasan''s Veterinary Clinic';
```

### Step 4: Reload App

Reload the app - your custom images will now display!

---

## Option 3: Update Database with Custom Image URLs

If images are hosted on your own server or CDN:

```sql
UPDATE pet_services
SET featured_image = 'https://your-domain.com/images/service-name.jpg'
WHERE id = 'service-id';
```

---

## Complete Image Setup Workflow

### For Each Service:

1. **Prepare Image**
   - Format: JPG, PNG (recommended: 400x300px)
   - Size: Keep under 500KB
   - Quality: High-resolution, clear photo

2. **Upload to Supabase**
   - Go to Storage → pet-service-images bucket
   - Click Upload
   - Select your image
   - Copy public URL

3. **Update Database**
   - Run SQL: `UPDATE pet_services SET featured_image = '...' WHERE name = '...'`
   - Or use Supabase UI to edit the row directly

4. **Test**
   - Reload app
   - Check if image appears

---

## Auto-Image Feature Details

**Image Sources:**
- Unsplash free library
- High-quality pet/veterinary/grooming photos
- Automatically selected by category

**Search Strategy:**
```
Veterinary: "veterinary clinic pet doctor medical"
Grooming: "pet grooming salon dog cat bath"
Training: "pet training dog obedience trainer"
Pet Store: "pet store animal shop supplies"
Boarding: "pet boarding hotel care facility"
Emergency: "emergency veterinary clinic hospital"
```

**Fallback Behavior:**
- If Unsplash is down → Uses category default image
- If service name is unclear → Uses category image
- If featured_image is set → Always uses that first

---

## Database Schema

The `pet_services` table has a `featured_image` field:
- Type: `TEXT`
- Current: Usually NULL (uses auto-search)
- Can be: Any valid image URL

---

## Recommended: Use Both

1. **Keep auto-search enabled** (free, no setup)
2. **Upload best images** for top-rated services
3. **Mix and match** as you prefer

This way, all services have images, but your top services can have custom branded photos!

---

## Testing

After updating images:

1. Go to Shops tab
2. Pull down to refresh
3. Check if images load
4. Try different categories
5. Verify all services have images

---

## Need Help?

- **Image not loading?** Check the URL is accessible (paste in browser)
- **URL too long?** Shorten it using a URL shortener
- **Wrong image?** Check the featured_image field value
- **Want different search terms?** Edit the search query in `lib/utils/petServiceImages.ts`

---

## Files Updated

- `lib/utils/petServiceImages.ts` - New image utility
- `app/(tabs)/shops.tsx` - Uses new image logic

Both work together to ensure every service has a relevant image!
