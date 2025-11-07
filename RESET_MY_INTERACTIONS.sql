-- =====================================================
-- RESET YOUR PET INTERACTIONS
-- =====================================================
-- This clears your swipe history so you can see all pets again
-- Run this in Supabase SQL Editor when testing
-- =====================================================

-- Delete all your pet interactions (swipes)
DELETE FROM public.pet_interactions 
WHERE user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56';

-- Delete all your pet favorites (likes)
DELETE FROM public.pet_favorites 
WHERE user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56';

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check interaction count (should be 0)
SELECT COUNT(*) as interaction_count 
FROM public.pet_interactions 
WHERE user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56';

-- Check favorites count (should be 0)
SELECT COUNT(*) as favorites_count 
FROM public.pet_favorites 
WHERE user_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56';

-- Check total available pets
SELECT COUNT(*) as total_available_pets 
FROM public.pets 
WHERE adoption_status = 'available';

-- =====================================================
-- Expected Results After Reset:
-- - 0 interactions
-- - 0 favorites
-- - All pets available to swipe again!
-- =====================================================
