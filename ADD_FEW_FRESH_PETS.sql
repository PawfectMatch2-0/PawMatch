-- =====================================================
-- ADD A FEW FRESH PETS (Keep existing user-uploaded pets)
-- =====================================================
-- This adds only 10 new pets so you have fresh content to swipe
-- Your uploaded pets (Marshmallow, Peu, Zenitsu) will remain in database
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add 10 diverse, fresh pets with realistic Bangladesh data
INSERT INTO public.pets (name, breed, age, gender, size, color, personality, description, images, location, adoption_status) VALUES

-- Fresh Dogs (5)
('Bruno', 'German Shepherd', 2, 'male', 'large', 'Black and Tan', ARRAY['Protective', 'Intelligent', 'Loyal'], 'Bruno is a well-trained German Shepherd perfect for families. Very obedient and loving with a protective nature.', ARRAY['https://images.unsplash.com/photo-1568572933382-74d440642117'], 'Dhaka, Bangladesh', 'available'),

('Lily', 'Golden Retriever', 3, 'female', 'large', 'Golden', ARRAY['Friendly', 'Gentle', 'Playful'], 'Lily is a sweet golden retriever who loves children and other pets. She enjoys playing fetch and going for walks!', ARRAY['https://images.unsplash.com/photo-1633722715463-d30f4f325e24'], 'Gulshan, Dhaka', 'available'),

('Rocky', 'Husky', 1, 'male', 'large', 'Gray and White', ARRAY['Energetic', 'Vocal', 'Independent'], 'Rocky is a beautiful husky puppy full of energy. Perfect for active families who love outdoor activities.', ARRAY['https://images.unsplash.com/photo-1605568427561-40dd23c2acea'], 'Chittagong, Bangladesh', 'available'),

('Bella', 'Labrador', 4, 'female', 'large', 'Chocolate Brown', ARRAY['Gentle', 'Smart', 'Loyal'], 'Bella is a calm and loving lab who makes an excellent family companion. She''s great with kids!', ARRAY['https://images.unsplash.com/photo-1558788353-f76d92427f16'], 'Banani, Dhaka', 'available'),

('Charlie', 'Beagle', 2, 'male', 'medium', 'Tricolor', ARRAY['Curious', 'Friendly', 'Playful'], 'Charlie is an adorable beagle who loves exploring. He has a great temperament and is wonderful with children.', ARRAY['https://images.unsplash.com/photo-1505628346881-b72b27e84530'], 'Dhanmondi, Dhaka', 'available'),

-- Fresh Cats (5)
('Luna', 'Persian Cat', 2, 'female', 'medium', 'White', ARRAY['Calm', 'Affectionate', 'Quiet'], 'Luna is a fluffy Persian beauty who loves lounging and gentle petting. She''s the perfect lap cat!', ARRAY['https://images.unsplash.com/photo-1595433707802-6b2626ef1c91'], 'Uttara, Dhaka', 'available'),

('Simba', 'Maine Coon', 3, 'male', 'large', 'Orange Tabby', ARRAY['Gentle', 'Playful', 'Sociable'], 'Simba is a majestic Maine Coon with a dog-like personality. He''s very friendly and loves everyone!', ARRAY['https://images.unsplash.com/photo-1574158622682-e40e69881006'], 'Mirpur, Dhaka', 'available'),

('Shadow', 'Black Cat', 2, 'male', 'medium', 'Black', ARRAY['Independent', 'Mysterious', 'Loyal'], 'Shadow is a sleek black cat with stunning golden eyes. Independent but very loving with his family.', ARRAY['https://images.unsplash.com/photo-1529778873920-4da4926a72c2'], 'Mohammadpur, Dhaka', 'available'),

('Mimi', 'Siamese', 1, 'female', 'small', 'Cream and Brown', ARRAY['Vocal', 'Social', 'Affectionate'], 'Mimi is a beautiful Siamese kitten who loves talking to her humans. Very social and playful!', ARRAY['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8'], 'Sylhet, Bangladesh', 'available'),

('Oliver', 'British Shorthair', 2, 'male', 'medium', 'Gray', ARRAY['Calm', 'Independent', 'Friendly'], 'Oliver is a chunky British Shorthair with the sweetest round face. Very easygoing and perfect for apartments!', ARRAY['https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e'], 'Bashundhara, Dhaka', 'available');

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check total pet count
SELECT COUNT(*) as total_pets FROM public.pets;

-- Show new pets added
SELECT name, breed, location FROM public.pets 
ORDER BY created_at DESC 
LIMIT 10;

-- =====================================================
-- Expected Results:
-- - 10 new pets added
-- - Your uploaded pets (Marshmallow, Peu, Zenitsu) still there
-- - Total should be previous count + 10
-- =====================================================
