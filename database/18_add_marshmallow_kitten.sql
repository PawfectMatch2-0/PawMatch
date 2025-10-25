-- Add Marshmallow (Munchkin kitten) to the pets database
-- This script adds the new pet to both the pets table and creates sample images

-- Insert Marshmallow into pets table
INSERT INTO pets (
  id,
  name,
  breed,
  age_months,
  gender,
  size,
  location,
  description,
  personality_traits,
  adoption_status,
  shelter_id,
  created_at,
  updated_at,
  health_status,
  vaccination_status,
  spayed_neutered,
  good_with_kids,
  good_with_pets,
  energy_level,
  grooming_needs
) VALUES (
  gen_random_uuid(),
  'Marshmallow',
  'Munchkin',
  4,
  'female',
  'small',
  'Dhaka, Bangladesh',
  '🤍 Marshmallow is an absolutely adorable Munchkin kitten with stunning black and white markings! With her short legs and big personality, she loves to explore and play. This little sweetie has the most beautiful green eyes and would make the perfect companion for someone looking for a cuddly, loving kitten. She''s litter trained and loves to be held!',
  ARRAY['Playful', 'Curious', 'Sweet', 'Adorable'],
  'available',
  (SELECT id FROM shelters LIMIT 1), -- Use first available shelter
  NOW(),
  NOW(),
  'healthy',
  'up_to_date',
  false, -- Too young to be spayed
  true,
  true,
  'medium',
  'medium'
);

-- Get the pet ID for image insertion
DO $$
DECLARE
    pet_id UUID;
BEGIN
    SELECT id INTO pet_id FROM pets WHERE name = 'Marshmallow' AND breed = 'Munchkin' ORDER BY created_at DESC LIMIT 1;
    
    -- Insert images for Marshmallow
    INSERT INTO pet_images (
      id,
      pet_id,
      image_url,
      is_primary,
      caption,
      created_at
    ) VALUES 
    (
      gen_random_uuid(),
      pet_id,
      'https://i.imgur.com/VdckEAH.jpg',
      true,
      'Marshmallow - adorable Munchkin kitten with beautiful features',
      NOW()
    ),
    (
      gen_random_uuid(),
      pet_id,
      'https://i.imgur.com/bWUizup.jpg',
      false,
      'Marshmallow showing her sweet personality',
      NOW()
    ),
    (
      gen_random_uuid(),
      pet_id,
      'https://i.imgur.com/pJrCpP1.jpg',
      false,
      'Marshmallow being adorable and playful',
      NOW()
    );
    
    -- Insert some characteristics specific to Munchkin breed
    INSERT INTO pet_characteristics (
      id,
      pet_id,
      characteristic_type,
      characteristic_value,
      created_at
    ) VALUES 
    (
      gen_random_uuid(),
      pet_id,
      'special_needs',
      'None - healthy Munchkin kitten',
      NOW()
    ),
    (
      gen_random_uuid(),
      pet_id,
      'training_level',
      'Litter trained, learning basic commands',
      NOW()
    ),
    (
      gen_random_uuid(),
      pet_id,
      'activity_preference',
      'Indoor play, climbing, exploring',
      NOW()
    );
END $$;

-- Update pet statistics
UPDATE app_statistics 
SET total_pets = total_pets + 1,
    available_pets = available_pets + 1,
    cats = cats + 1
WHERE id = 1;

COMMIT;