-- =====================================================
-- CHECK YOUR UPLOADED PETS IN DATABASE
-- =====================================================
-- This verifies your uploaded pets exist and have correct owner_id
-- =====================================================

-- 1. Check all pets you own (with your owner_id)
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
WHERE owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
ORDER BY created_at DESC;

-- 2. Check total count of your pets
SELECT COUNT(*) as my_pets_count
FROM public.pets
WHERE owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56';

-- 3. Check all available pets (what appears in discover feed)
SELECT 
    id,
    name,
    breed,
    adoption_status,
    owner_id,
    created_at
FROM public.pets
WHERE adoption_status = 'available'
ORDER BY created_at DESC;

-- 4. Check if your uploaded pets have correct adoption_status
SELECT 
    id,
    name,
    adoption_status,
    CASE 
        WHEN adoption_status = 'available' THEN '✅ Will appear in discover'
        ELSE '❌ Will NOT appear in discover'
    END as discover_visibility
FROM public.pets
WHERE owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56';

-- =====================================================
-- EXPECTED BEHAVIOR:
-- - Your uploaded pets SHOULD have adoption_status = 'available'
-- - They SHOULD appear in the discover feed for OTHER users
-- - They will NOT appear in YOUR discover feed if you already swiped on them
-- - Other users CAN see and swipe on your uploaded pets
-- =====================================================
