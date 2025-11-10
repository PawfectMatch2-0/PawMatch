# Old Pets Contact Information Migration Guide

## Problem
Old pets in the database don't have `contact_info` populated, so they:
- Don't show WhatsApp buttons
- Don't display Contact Information section
- Appear incomplete compared to newly added pets

## Solution Overview
We've implemented a **3-tier fallback system**:

### Fallback Priority:
1. **Pet's contact_info** (from add pet form)
2. **Owner's phone from user_profiles** (automatic fallback)
3. **"Not Available" message** (graceful degradation)

---

## What's Already Fixed in Code ✅

### 1. Pet Detail Page (`app/pet/[id].tsx`)

#### Owner Profile Loading:
```typescript
// Now fetches phone number from user_profiles
const { data: profileData, error: profileError } = await supabase
  .from('user_profiles')
  .select('full_name, email, phone')  // ✅ Added 'phone'
  .eq('id', data.user_id)
  .single();
```

#### WhatsApp Contact Handler:
```typescript
const handleWhatsAppContact = () => {
  // 3-tier fallback: pet contact → owner phone → null
  const phoneNumber = pet?.contact_info?.phone || 
                     pet?.contact_info?.whatsapp || 
                     ownerProfile?.phone;  // ✅ Fallback to owner's phone
  
  if (!phoneNumber) {
    Alert.alert('No Contact', 'WhatsApp contact information is not available.');
    return;
  }
  // ... opens WhatsApp
};
```

#### Contact Information Display:
```typescript
{/* Always shows owner info */}
<View style={styles.contactItem}>
  <User size={20} color={COLORS.secondary} />
  <Text>{ownerProfile.full_name}</Text>
  <Text>{ownerProfile.email}</Text>
  {ownerProfile.phone && (
    <Text>📱 {ownerProfile.phone}</Text>  // ✅ Shows owner phone
  )}
</View>

{/* WhatsApp with fallback or "Not Available" */}
{(pet.contact_info?.phone || pet.contact_info?.whatsapp || ownerProfile?.phone) ? (
  <View style={styles.contactItem}>
    <MessageCircle size={20} color="#25D366" />
    <Text>WhatsApp Number</Text>
    <Text>{pet.contact_info?.phone || ownerProfile?.phone}</Text>
    <Text>Tap button below to chat</Text>
  </View>
) : (
  <View style={styles.contactItem}>
    <MessageCircle size={20} color="#999" />
    <Text>Contact info not available</Text>
    <Text>Owner hasn't added contact details yet</Text>
  </View>
)}
```

#### WhatsApp Button:
```typescript
{/* Shows button if ANY contact exists, otherwise shows disabled state */}
{(pet.contact_info?.phone || pet.contact_info?.whatsapp || ownerProfile?.phone) ? (
  <TouchableOpacity onPress={handleWhatsAppContact}>
    <LinearGradient colors={['#25D366', '#20BA5A']}>
      <Text>Contact on WhatsApp</Text>
    </LinearGradient>
  </TouchableOpacity>
) : (
  <View style={styles.whatsappButtonDisabled}>
    <MessageCircle size={22} color="#999" />
    <Text>Contact Info Not Available</Text>
  </View>
)}
```

---

## Database Migration (REQUIRED) 🔴

### Step 1: Run the Migration SQL

Open **Supabase SQL Editor** and run:

```sql
-- File: UPDATE_OLD_PETS_WITH_CONTACT_INFO.sql

-- Check current status
SELECT 
    COUNT(*) as pets_without_contact,
    COUNT(DISTINCT user_id) as affected_users
FROM pets 
WHERE contact_info IS NULL OR contact_info = '{}';

-- Update pets with owner's phone from user_profiles
UPDATE pets p
SET 
    contact_info = jsonb_build_object(
        'phone', COALESCE(up.phone, '01700000000'),
        'whatsapp', COALESCE(up.phone, '01700000000')
    ),
    updated_at = NOW()
FROM user_profiles up
WHERE p.user_id = up.id
AND (p.contact_info IS NULL OR p.contact_info = '{}');

-- Verify results
SELECT 
    id,
    name,
    user_id,
    contact_info,
    adoption_status
FROM pets
ORDER BY created_at DESC
LIMIT 10;
```

### Step 2: Update User Profiles (If Needed)

If users don't have phone numbers in `user_profiles`:

```sql
-- Check which users need phone numbers
SELECT 
    up.id,
    up.email,
    up.full_name,
    up.phone,
    COUNT(p.id) as pet_count
FROM user_profiles up
LEFT JOIN pets p ON p.user_id = up.id
WHERE up.phone IS NULL
GROUP BY up.id, up.email, up.full_name, up.phone;

-- Update a specific user's phone
UPDATE user_profiles
SET phone = '01712345678'
WHERE email = 'user@example.com';
```

---

## User Experience Before vs After

### BEFORE (Old Pets):
```
Pet Detail Page:
├── Photos
├── Name, Breed, Age
├── Personality Tags
├── Description
└── ❌ No Contact Information
└── ❌ No WhatsApp Button
└── ❌ No Owner Details
```

### AFTER (With Migration):
```
Pet Detail Page:
├── Photos
├── Name, Breed, Age (with WhatsApp icon badge)
├── Adoption Status Badge
├── Owner Name Badge
├── Personality Tags
├── Description
├── ✅ Contact Information Section
│   ├── Pet Owner (name, email, phone)
│   ├── WhatsApp Number (from pet or owner)
│   └── Location
└── ✅ WhatsApp Button (green, prominent)
```

### GRACEFUL DEGRADATION (No Contact Info):
```
Contact Information Section:
├── ✅ Pet Owner (always shows)
├── ⚠️ WhatsApp Number: "Contact info not available"
│   └── Helper: "Owner hasn't added contact details yet"
└── ✅ Location (if available)

Action Buttons:
└── 🔒 Disabled Button: "Contact Info Not Available"
    (gray background, non-clickable)
```

---

## Testing Checklist

### Test Case 1: Old Pet with No Contact Info (Before Migration)
- [ ] View old pet details
- [ ] See "Contact info not available" message
- [ ] See owner's email
- [ ] See disabled WhatsApp button

### Test Case 2: Old Pet After Migration (Owner Has Phone)
- [ ] Run migration SQL
- [ ] View same pet
- [ ] See owner's phone in contact section
- [ ] See green WhatsApp button
- [ ] Click WhatsApp → Opens chat with owner's number

### Test Case 3: Newly Added Pet
- [ ] Add new pet with WhatsApp number
- [ ] View pet details
- [ ] See pet's WhatsApp number in contact section
- [ ] Click WhatsApp → Opens chat with pet's number

### Test Case 4: Pet Card in Discovery Feed
- [ ] See WhatsApp badge on cards with contact info
- [ ] See status badges (Available/Pending/Adopted)
- [ ] Tap card → Goes to detail page

---

## Files Modified

### 1. `app/pet/[id].tsx` (Pet Detail Page)
- ✅ Added `phone` to owner profile query
- ✅ Updated `handleWhatsAppContact` with 3-tier fallback
- ✅ Added owner phone display
- ✅ Added "Not Available" state for contact section
- ✅ Added disabled WhatsApp button state
- ✅ Added new styles: `contactPhone`, `contactValueUnavailable`, `contactSubtitleGray`, `whatsappButtonDisabled`, `whatsappButtonTextDisabled`

### 2. `UPDATE_OLD_PETS_WITH_CONTACT_INFO.sql` (New File)
- ✅ Migration script to populate old pets' contact_info
- ✅ Uses owner's phone as WhatsApp number
- ✅ Includes verification queries

---

## Quick Commands

### Check Database Status:
```sql
-- Count pets without contact info
SELECT COUNT(*) FROM pets WHERE contact_info IS NULL;

-- Count pets with contact info
SELECT COUNT(*) FROM pets WHERE contact_info IS NOT NULL;

-- Show specific pet's contact info
SELECT name, contact_info, user_id FROM pets WHERE id = 'your-pet-id';
```

### Update Single Pet:
```sql
UPDATE pets
SET contact_info = jsonb_build_object(
    'phone', '01712345678',
    'whatsapp', '01712345678'
)
WHERE id = 'pet-id-here';
```

---

## Summary

**The app now works for both old and new pets!**

✅ **New pets**: Use contact info from add pet form  
✅ **Old pets**: Use owner's phone as fallback  
✅ **No contact**: Show graceful "not available" message  
✅ **Always visible**: Owner name, email, location  
✅ **Smart button**: Enabled only when contact exists  

**Next Step**: Run the migration SQL in Supabase to update all existing pets! 🚀
