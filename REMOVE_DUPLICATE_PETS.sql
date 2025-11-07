-- =====================================================
-- FIND AND REMOVE DUPLICATE PETS
-- =====================================================
-- This script identifies and removes duplicate pet entries
-- Keeps the oldest entry of each duplicate
-- =====================================================

-- Step 1: Find duplicate pets (same name and breed)
SELECT 
    name,
    breed,
    COUNT(*) as duplicate_count,
    array_agg(id) as pet_ids,
    array_agg(created_at ORDER BY created_at) as created_dates
FROM public.pets
GROUP BY name, breed
HAVING COUNT(*) > 1
ORDER BY name;

-- =====================================================
-- Step 2: Remove duplicates (keeps the OLDEST entry)
-- =====================================================

-- Delete newer duplicates, keep the oldest one for each name+breed combination
DELETE FROM public.pets
WHERE id IN (
    SELECT id
    FROM (
        SELECT 
            id,
            ROW_NUMBER() OVER (PARTITION BY name, breed ORDER BY created_at ASC) as rn
        FROM public.pets
    ) t
    WHERE rn > 1  -- Keep first (oldest) entry, delete the rest
);

-- =====================================================
-- Step 3: Verification - Check for remaining duplicates
-- =====================================================

-- Should return no rows if all duplicates removed
SELECT 
    name,
    breed,
    COUNT(*) as count
FROM public.pets
GROUP BY name, breed
HAVING COUNT(*) > 1;

-- Show all pets after cleanup
SELECT 
    id,
    name,
    breed,
    age,
    gender,
    location,
    adoption_status,
    created_at
FROM public.pets
ORDER BY name, breed;

-- Count total pets remaining
SELECT 
    COUNT(*) as total_pets,
    COUNT(DISTINCT name) as unique_names
FROM public.pets;

-- =====================================================
-- Expected Results:
-- - Duplicate check returns empty (no duplicates)
-- - All pets listed with unique name+breed combinations
-- =====================================================
