-- =====================================================
-- RESTORE YOUR 4 UPLOADED CATS
-- =====================================================
-- This re-inserts Marshmallow, Peu, Zenitsu, and adds one more cat
-- With proper owner_id set to your user ID
-- =====================================================

-- Insert Marshmallow (Munchkin kitten)
INSERT INTO public.pets (
    id,
    name,
    breed,
    age,
    gender,
    size,
    color,
    personality,
    description,
    images,
    location,
    adoption_status,
    owner_id
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'Marshmallow',
    'Munchkin',
    1,
    'female',
    'small',
    'Black and White',
    ARRAY['Playful', 'Affectionate', 'Curious'],
    '🤍 Marshmallow is an absolutely adorable Munchkin kitten with stunning black and white markings! With her distinctive short legs and big personality, she loves to explore and play around the house. This little sweetie has the most beautiful green eyes and a playful spirit that will melt your heart. She''s perfectly litter trained, loves to be held and cuddled, and gets along wonderfully with children.',
    ARRAY[
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
        'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800',
        'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800'
    ],
    'Gulshan, Dhaka',
    'available',
    '703d7ccc-cc09-43ef-b6df-b3544e315d56'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    breed = EXCLUDED.breed,
    description = EXCLUDED.description,
    images = EXCLUDED.images,
    owner_id = EXCLUDED.owner_id,
    adoption_status = EXCLUDED.adoption_status;

-- Insert Peu (Persian Mix)
INSERT INTO public.pets (
    id,
    name,
    breed,
    age,
    gender,
    size,
    color,
    personality,
    description,
    images,
    location,
    adoption_status,
    owner_id
) VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    'Peu',
    'Persian Mix',
    1,
    'female',
    'medium',
    'Mixed (White and Gray)',
    ARRAY['Gentle', 'Calm', 'Affectionate'],
    '🐱 Peu is a beautiful Persian mix kitten with the softest fluffy coat! She has a gentle and calm personality, making her perfect for a peaceful home. Peu loves being pampered and enjoys quiet cuddle sessions. She''s very well-behaved, litter trained, and has the sweetest temperament.',
    ARRAY[
        'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=800',
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800',
        'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=800'
    ],
    'Mirpur, Dhaka',
    'available',
    '703d7ccc-cc09-43ef-b6df-b3544e315d56'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    breed = EXCLUDED.breed,
    description = EXCLUDED.description,
    images = EXCLUDED.images,
    owner_id = EXCLUDED.owner_id,
    adoption_status = EXCLUDED.adoption_status;

-- Insert Zenitsu (Orange/Ginger cat)
INSERT INTO public.pets (
    id,
    name,
    breed,
    age,
    gender,
    size,
    color,
    personality,
    description,
    images,
    location,
    adoption_status,
    owner_id
) VALUES (
    '550e8400-e29b-41d4-a716-446655440003',
    'Zenitsu',
    'Domestic Shorthair',
    2,
    'male',
    'medium',
    'Orange/Ginger',
    ARRAY['Energetic', 'Friendly', 'Playful'],
    '⚡ Named after the lightning-fast character, Zenitsu is an energetic ginger cat with a vibrant personality! This handsome orange boy loves to play, explore, and zoom around the house. He''s incredibly friendly with people and has a charming, outgoing nature.',
    ARRAY[
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
        'https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?w=800',
        'https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc?w=800'
    ],
    'Banani, Dhaka',
    'available',
    '703d7ccc-cc09-43ef-b6df-b3544e315d56'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    breed = EXCLUDED.breed,
    description = EXCLUDED.description,
    images = EXCLUDED.images,
    owner_id = EXCLUDED.owner_id,
    adoption_status = EXCLUDED.adoption_status;

-- Insert Luna (4th cat - Siamese)
INSERT INTO public.pets (
    id,
    name,
    breed,
    age,
    gender,
    size,
    color,
    personality,
    description,
    images,
    location,
    adoption_status,
    owner_id
) VALUES (
    '550e8400-e29b-41d4-a716-446655440004',
    'Luna',
    'Siamese',
    2,
    'female',
    'medium',
    'Cream and Brown',
    ARRAY['Vocal', 'Social', 'Intelligent'],
    '🌙 Luna is a beautiful Siamese who loves talking to her humans! Very social and affectionate, she follows you around and wants to be part of everything you do. She has stunning blue eyes and a silky coat.',
    ARRAY[
        'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800',
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800',
        'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800'
    ],
    'Dhanmondi, Dhaka',
    'available',
    '703d7ccc-cc09-43ef-b6df-b3544e315d56'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    breed = EXCLUDED.breed,
    description = EXCLUDED.description,
    images = EXCLUDED.images,
    owner_id = EXCLUDED.owner_id,
    adoption_status = EXCLUDED.adoption_status;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Show all your pets
SELECT 
    id,
    name,
    breed,
    age,
    gender,
    location,
    adoption_status,
    owner_id
FROM public.pets
WHERE owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56'
ORDER BY name;

-- Count your pets
SELECT COUNT(*) as my_pets 
FROM public.pets 
WHERE owner_id = '703d7ccc-cc09-43ef-b6df-b3544e315d56';

-- =====================================================
-- Expected Results:
-- 4 cats restored: Marshmallow, Peu, Zenitsu, Luna
-- All with your owner_id set correctly
-- All with adoption_status = 'available'
-- =====================================================
