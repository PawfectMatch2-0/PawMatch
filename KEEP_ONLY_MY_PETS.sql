-- =====================================================
-- KEEP ONLY YOUR UPLOADED PETS
-- =====================================================
-- This removes all pets EXCEPT the ones you uploaded
-- Keeps only pets owned by you (user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56')
-- =====================================================

-- Step 1: Show which pets will be kept (YOUR pets only)
SELECT 
    id,
    name,
    breed,
    owner_id,
    created_at
FROM public.pets
WHERE owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
ORDER BY name;

-- Step 2: Show which pets will be DELETED (not yours)
SELECT 
    id,
    name,
    breed,
    owner_id,
    created_at
FROM public.pets
WHERE owner_id IS NULL OR owner_id != '703d7ccc-cc09-43ef-b6df-b3544e315d56'
ORDER BY name;

-- =====================================================
-- DELETE ALL PETS EXCEPT YOURS
-- =====================================================

-- Delete all pets that are NOT owned by you
DELETE FROM public.pets
WHERE owner_id IS NULL OR owner_id != '703d7ccc-cc09-43ef-b6df-b3544e315d56';

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Show remaining pets (should only be yours)
SELECT 
    id,
    name,
    breed,
    age,
    gender,
    adoption_status,
    owner_id,
    created_at
FROM public.pets
ORDER BY name;

-- Count total pets
SELECT 
    COUNT(*) as total_pets,
    COUNT(*) FILTER (WHERE owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56') as my_pets
FROM public.pets;

-- =====================================================
-- Expected Results:
-- Only YOUR uploaded pets remain (Marshmallow, Peu, Zenitsu, etc.)
-- All other pets deleted
-- =====================================================
