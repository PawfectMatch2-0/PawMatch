-- =====================================================
-- QUICK FIX: SEE YOUR OWN UPLOADED PETS IN DISCOVER
-- =====================================================
-- Problem: You swiped on your own 2 uploaded pets
-- Solution: Clear those interactions so they appear again
-- =====================================================

-- STEP 1: Check what pets you interacted with
-- =====================================================
SELECT 
    '👆 YOUR CURRENT INTERACTIONS' as info,
    COUNT(*) as total_interactions
FROM public.pet_interactions
WHERE user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56';

SELECT 
    pi.pet_id,
    p.name as pet_name,
    p.breed,
    pi.interaction_type,
    CASE 
        WHEN p.owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56' THEN '🙋 YOUR PET (will be deleted)'
        ELSE '👤 OTHER PET (will keep)'
    END as note
FROM public.pet_interactions pi
LEFT JOIN public.pets p ON pi.pet_id = p.id
WHERE pi.user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56';

-- STEP 2: DELETE interactions with YOUR OWN pets
-- =====================================================
-- This removes your swipes on your own uploaded pets
-- So they will appear in your discover feed again

DELETE FROM public.pet_interactions
WHERE user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
  AND pet_id IN (
    SELECT id FROM public.pets 
    WHERE owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
  );

-- STEP 3: Verify the fix
-- =====================================================
SELECT 
    '✅ AFTER FIX' as info,
    COUNT(*) as remaining_interactions
FROM public.pet_interactions
WHERE user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56';

-- Check what you'll see in discover now:
SELECT 
    '🔍 PETS IN YOUR DISCOVER FEED' as info,
    COUNT(*) as visible_pets
FROM public.pets p
WHERE p.adoption_status = 'available'
  AND p.id NOT IN (
    SELECT pet_id 
    FROM public.pet_interactions 
    WHERE user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
  );

-- List the pets:
SELECT 
    p.name,
    p.breed,
    CASE 
        WHEN p.owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56' THEN '🙋 YOUR PET'
        ELSE '👤 OTHER USER PET'
    END as owner_type
FROM public.pets p
WHERE p.adoption_status = 'available'
  AND p.id NOT IN (
    SELECT pet_id 
    FROM public.pet_interactions 
    WHERE user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
  )
ORDER BY p.created_at DESC;

-- =====================================================
-- RESULT:
-- After running this script:
-- - Your 2 uploaded pets will appear in YOUR discover feed
-- - You can swipe on them again if needed
-- - Other users are not affected (they still see your pets)
-- =====================================================
