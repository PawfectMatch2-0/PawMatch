-- =====================================================
-- SEARCH FOR YOUR ORIGINAL PET DATA
-- =====================================================
-- This searches for any trace of your original pets
-- =====================================================

-- Check ALL pets in database (any that might remain)
SELECT 
    id,
    name,
    breed,
    age,
    description,
    images,
    owner_id,
    adoption_status,
    created_at
FROM public.pets
ORDER BY created_at DESC;

-- Check if any pets with your specific names exist
SELECT 
    id,
    name,
    breed,
    description,
    images,
    created_at
FROM public.pets
WHERE LOWER(name) IN ('marshmallow', 'peu', 'zenitsu')
ORDER BY created_at DESC;

-- Check pet_favorites (might have your pet IDs stored)
SELECT 
    pf.id,
    pf.pet_id,
    pf.created_at
FROM public.pet_favorites pf
WHERE pf.user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
ORDER BY created_at DESC;

-- Check pet_interactions (shows which pets you interacted with)
SELECT 
    pi.id,
    pi.pet_id,
    pi.interaction_type,
    pi.created_at
FROM public.pet_interactions pi
WHERE pi.user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- If any data found above, we can try to restore it!
-- Otherwise, you'll need to re-upload through the app
-- =====================================================
