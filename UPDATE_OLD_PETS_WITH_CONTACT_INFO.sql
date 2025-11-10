-- Migration: Update Old Pets with Contact Information
-- This script adds default WhatsApp contact info to existing pets that don't have it
-- Run this in Supabase SQL Editor

-- Check how many pets are missing contact_info
SELECT 
    COUNT(*) as total_pets_without_contact,
    COUNT(DISTINCT owner_id) as affected_users
FROM pets 
WHERE contact_info IS NULL OR contact_info = '{}' OR contact_info::text = 'null';

-- Update pets with user's phone number from their profile
-- This will use the user's phone as the default WhatsApp number
UPDATE pets p
SET 
    contact_info = jsonb_build_object(
        'phone', COALESCE(up.phone, '01700000000'),
        'whatsapp', COALESCE(up.phone, '01700000000')
    ),
    updated_at = NOW()
FROM user_profiles up
WHERE p.owner_id = up.id
AND (p.contact_info IS NULL OR p.contact_info = '{}' OR p.contact_info::text = 'null');

-- If some pets don't have owner_id (old data), set a default contact
-- You should replace '01700000000' with your actual test phone number
UPDATE pets
SET 
    contact_info = jsonb_build_object(
        'phone', '01700000000',
        'whatsapp', '01700000000'
    ),
    updated_at = NOW()
WHERE (contact_info IS NULL OR contact_info = '{}' OR contact_info::text = 'null')
AND owner_id IS NOT NULL;

-- Verify the update
SELECT 
    id,
    name,
    owner_id,
    contact_info,
    adoption_status
FROM pets
ORDER BY created_at DESC
LIMIT 10;

-- Count pets with contact info now
SELECT 
    COUNT(*) as pets_with_contact_info
FROM pets 
WHERE contact_info IS NOT NULL 
AND contact_info != '{}' 
AND contact_info::text != 'null';
