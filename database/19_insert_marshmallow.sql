-- Insert Marshmallow pet into database
INSERT INTO public.pets (
    id, name, breed, age, gender, size, color, location, description,
    personality, images, adoption_status,
    owner_id, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001'::UUID,
    'Marshmallow',
    'Munchkin',
    1,
    'female',
    'small',
    'black and white',
    'Dhaka, Bangladesh',
    '🤍 Marshmallow is an absolutely adorable Munchkin kitten with stunning black and white markings! With her distinctive short legs and big personality, she loves to explore and play around the house. This little sweetie has the most beautiful green eyes and a playful spirit that will melt your heart. She''s perfectly litter trained, loves to be held and cuddled, and gets along wonderfully with children. Marshmallow enjoys playing with feather toys and has a curious nature that makes every day an adventure!',
    ARRAY['Playful', 'Curious', 'Sweet', 'Adorable'],
    ARRAY['https://i.imgur.com/VdckEAH.jpg', 'https://i.imgur.com/bWUizup.jpg', 'https://i.imgur.com/pJrCpP1.jpg'],
    'available',
    NULL,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    images = EXCLUDED.images,
    updated_at = NOW();
