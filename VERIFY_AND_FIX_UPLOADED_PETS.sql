-- =====================================================
-- VERIFY AND FIX USER UPLOADED PETS SYSTEM
-- =====================================================
-- This script checks and fixes common issues with uploaded pets
-- =====================================================

-- STEP 1: Check your current pets
-- =====================================================
SELECT 
    '📋 YOUR UPLOADED PETS' as section,
    COUNT(*) as total_count
FROM public.pets
WHERE owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56';

SELECT 
    id,
    name,
    breed,
    adoption_status,
    created_at,
    CASE 
        WHEN adoption_status = 'available' THEN '✅ Visible in Discover'
        ELSE '❌ Hidden from Discover'
    END as visibility_status
FROM public.pets
WHERE owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
ORDER BY created_at DESC;

-- STEP 2: Check all available pets (what appears in discover)
-- =====================================================
SELECT 
    '📱 PETS IN DISCOVER FEED' as section,
    COUNT(*) as total_available_pets
FROM public.pets
WHERE adoption_status = 'available';

SELECT 
    name,
    breed,
    owner_id,
    CASE 
        WHEN owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56' THEN '🙋 YOUR PET'
        WHEN owner_id IS NULL THEN '🤖 DEMO PET (no owner)'
        ELSE '👤 OTHER USER PET'
    END as pet_owner_type
FROM public.pets
WHERE adoption_status = 'available'
ORDER BY created_at DESC
LIMIT 20;

-- STEP 3: Check your swipe history
-- =====================================================
SELECT 
    '👆 YOUR SWIPE HISTORY' as section,
    COUNT(*) as total_interactions
FROM public.pet_interactions
WHERE user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56';

SELECT 
    pi.interaction_type,
    p.name as pet_name,
    p.breed,
    pi.created_at,
    CASE 
        WHEN p.owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56' THEN '⚠️ YOU SWIPED YOUR OWN PET'
        ELSE '✅ Normal interaction'
    END as note
FROM public.pet_interactions pi
LEFT JOIN public.pets p ON pi.pet_id = p.id
WHERE pi.user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
ORDER BY pi.created_at DESC
LIMIT 10;

-- STEP 4: FIX - Ensure all your pets are available in discover
-- =====================================================
-- Uncomment the line below to make all YOUR pets visible in discover
-- UPDATE public.pets 
-- SET adoption_status = 'available'
-- WHERE owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56';

-- STEP 5: FIX - Clear your interactions with your own pets (so you can see them)
-- =====================================================
-- Uncomment the lines below to remove interactions with your own pets
-- DELETE FROM public.pet_interactions
-- WHERE user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
--   AND pet_id IN (
--     SELECT id FROM public.pets 
--     WHERE owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
--   );

-- STEP 6: Verify the fix worked
-- =====================================================
-- After running fixes, check what you'll see in discover:
SELECT 
    '🔍 PETS YOU WILL SEE IN DISCOVER' as section,
    COUNT(*) as visible_pets_count
FROM public.pets p
WHERE p.adoption_status = 'available'
  AND p.id NOT IN (
    SELECT pet_id 
    FROM public.pet_interactions 
    WHERE user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
  );

-- List of pets you'll see:
SELECT 
    p.name,
    p.breed,
    CASE 
        WHEN p.owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56' THEN '🙋 YOUR PET'
        WHEN p.owner_id IS NULL THEN '🤖 DEMO PET'
        ELSE '👤 OTHER USER PET'
    END as owner_type,
    p.created_at
FROM public.pets p
WHERE p.adoption_status = 'available'
  AND p.id NOT IN (
    SELECT pet_id 
    FROM public.pet_interactions 
    WHERE user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
  )
ORDER BY p.created_at DESC
LIMIT 20;

-- =====================================================
-- INTERPRETATION GUIDE:
-- =====================================================
-- 
-- ✅ SYSTEM IS WORKING IF:
-- - Your uploaded pets show in "📱 PETS IN DISCOVER FEED"
-- - They have adoption_status = 'available'
-- - Other users can see them (they query all available pets)
--
-- ⚠️ YOU WON'T SEE YOUR PETS IF:
-- - You already swiped on them (check "👆 YOUR SWIPE HISTORY")
-- - Solution: Run STEP 5 fix to clear those interactions
--
-- ❌ PETS NOT IN DATABASE:
-- - If "📋 YOUR UPLOADED PETS" shows 0 count
-- - They were deleted by KEEP_ONLY_MY_PETS.sql
-- - Solution: Re-upload through the app
--
-- 🎯 FOR OTHER USERS:
-- - They see ALL pets where adoption_status = 'available'
-- - Includes YOUR uploaded pets
-- - Excludes only pets THEY already swiped on
-- - They DON'T see owner_id, so all pets look the same
--
-- =====================================================
