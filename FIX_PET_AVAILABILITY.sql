-- =====================================================
-- CHECK CURRENT PETS IN DATABASE
-- =====================================================
-- This shows exactly what pets you have and why you're only seeing a few
-- =====================================================

-- Count all pets by status
SELECT 
    adoption_status,
    COUNT(*) as count
FROM public.pets
GROUP BY adoption_status;

-- Show all pets
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
ORDER BY created_at DESC;

-- Check if pets have the correct adoption_status
SELECT 
    COUNT(*) as total_pets,
    COUNT(*) FILTER (WHERE adoption_status = 'available') as available_pets,
    COUNT(*) FILTER (WHERE adoption_status IS NULL) as null_status,
    COUNT(*) FILTER (WHERE adoption_status != 'available') as unavailable_pets
FROM public.pets;

-- =====================================================
-- SOLUTION: Update all pets to 'available' status
-- =====================================================

-- Set all pets to 'available' so they show up in the app
UPDATE public.pets
SET adoption_status = 'available'
WHERE adoption_status IS NULL OR adoption_status != 'available';

-- Verify the update
SELECT 
    adoption_status,
    COUNT(*) as count
FROM public.pets
GROUP BY adoption_status;

-- Show total available pets
SELECT COUNT(*) as total_available_pets 
FROM public.pets 
WHERE adoption_status = 'available';

-- =====================================================
-- Expected Results:
-- All pets should now have adoption_status = 'available'
-- Total count should match what you expected (32 pets)
-- =====================================================
