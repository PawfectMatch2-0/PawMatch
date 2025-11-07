-- =====================================================
-- ADD MORE PETS TO DATABASE
-- =====================================================
-- Run this in Supabase SQL Editor to add 30 more adoptable pets
-- These will give you fresh pets to swipe on!
-- =====================================================

-- Add 30 diverse pets with realistic data
INSERT INTO public.pets (name, breed, age, gender, size, color, personality, description, images, location, adoption_status) VALUES

-- Dogs
('Luna', 'Golden Retriever', 3, 'female', 'large', 'Golden', ARRAY['Friendly', 'Energetic', 'Loyal'], 'Luna is a sweet and gentle golden retriever who loves playing fetch and swimming. She''s great with kids and other pets!', ARRAY['https://images.unsplash.com/photo-1633722715463-d30f4f325e24'], 'Dhaka, Bangladesh', 'available'),

('Max', 'German Shepherd', 2, 'male', 'large', 'Black and Tan', ARRAY['Protective', 'Intelligent', 'Loyal'], 'Max is a well-trained German Shepherd perfect for families or as a guard dog. Very obedient and loving.', ARRAY['https://images.unsplash.com/photo-1568572933382-74d440642117'], 'Chittagong, Bangladesh', 'available'),

('Bella', 'Labrador', 4, 'female', 'large', 'Chocolate Brown', ARRAY['Gentle', 'Playful', 'Smart'], 'Bella is a calm and loving lab who enjoys long walks and cuddling. Great family companion!', ARRAY['https://images.unsplash.com/photo-1558788353-f76d92427f16'], 'Sylhet, Bangladesh', 'available'),

('Rocky', 'Husky', 1, 'male', 'large', 'Gray and White', ARRAY['Energetic', 'Vocal', 'Independent'], 'Rocky is a beautiful husky puppy full of energy. Needs an active family who loves outdoor activities.', ARRAY['https://images.unsplash.com/photo-1605568427561-40dd23c2acea'], 'Dhaka, Bangladesh', 'available'),

('Daisy', 'Beagle', 3, 'female', 'medium', 'Tricolor', ARRAY['Curious', 'Friendly', 'Gentle'], 'Daisy is an adorable beagle with a great nose! She loves exploring and is wonderful with children.', ARRAY['https://images.unsplash.com/photo-1505628346881-b72b27e84530'], 'Rajshahi, Bangladesh', 'available'),

('Charlie', 'Poodle', 2, 'male', 'small', 'White', ARRAY['Intelligent', 'Elegant', 'Hypoallergenic'], 'Charlie is a smart and playful poodle. Perfect for apartments and people with allergies!', ARRAY['https://images.unsplash.com/photo-1537151608828-ea2b11777ee8'], 'Dhaka, Bangladesh', 'available'),

('Molly', 'Cocker Spaniel', 5, 'female', 'medium', 'Golden', ARRAY['Affectionate', 'Calm', 'Loyal'], 'Molly is a sweet senior lady who loves gentle walks and lots of cuddles. Perfect for quiet homes.', ARRAY['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e'], 'Khulna, Bangladesh', 'available'),

('Buddy', 'Border Collie', 2, 'male', 'medium', 'Black and White', ARRAY['Intelligent', 'Active', 'Obedient'], 'Buddy is extremely smart and loves learning tricks. Needs mental stimulation and exercise.', ARRAY['https://images.unsplash.com/photo-1587300003388-59208cc962cb'], 'Chittagong, Bangladesh', 'available'),

('Coco', 'Shih Tzu', 3, 'female', 'small', 'Brown and White', ARRAY['Friendly', 'Affectionate', 'Playful'], 'Coco is a tiny bundle of joy! She loves being carried around and sitting on laps.', ARRAY['https://images.unsplash.com/photo-1548199973-03cce0bbc87b'], 'Dhaka, Bangladesh', 'available'),

('Zeus', 'Rottweiler', 4, 'male', 'large', 'Black and Brown', ARRAY['Protective', 'Confident', 'Loyal'], 'Zeus is a gentle giant despite his imposing appearance. Very loyal and protective of family.', ARRAY['https://images.unsplash.com/photo-1567752881298-894bb81f9379'], 'Sylhet, Bangladesh', 'available'),

-- Cats
('Whiskers', 'Persian Cat', 2, 'male', 'medium', 'White', ARRAY['Calm', 'Affectionate', 'Quiet'], 'Whiskers is a fluffy Persian who loves lounging and gentle petting. Perfect lap cat!', ARRAY['https://images.unsplash.com/photo-1595433707802-6b2626ef1c91'], 'Dhaka, Bangladesh', 'available'),

('Mittens', 'Tabby Cat', 1, 'female', 'small', 'Orange and White', ARRAY['Playful', 'Curious', 'Energetic'], 'Mittens is a playful kitten who loves chasing toys and climbing cat trees.', ARRAY['https://images.unsplash.com/photo-1574158622682-e40e69881006'], 'Chittagong, Bangladesh', 'available'),

('Shadow', 'Black Cat', 3, 'male', 'medium', 'Black', ARRAY['Independent', 'Mysterious', 'Loyal'], 'Shadow is a sleek black cat with golden eyes. He''s independent but very loving with his family.', ARRAY['https://images.unsplash.com/photo-1529778873920-4da4926a72c2'], 'Dhaka, Bangladesh', 'available'),

('Luna', 'Siamese Cat', 2, 'female', 'medium', 'Cream and Brown', ARRAY['Vocal', 'Social', 'Intelligent'], 'Luna is a beautiful Siamese who loves talking to her humans. Very social and affectionate!', ARRAY['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8'], 'Rajshahi, Bangladesh', 'available'),

('Simba', 'Maine Coon', 4, 'male', 'large', 'Orange Tabby', ARRAY['Gentle', 'Playful', 'Sociable'], 'Simba is a majestic Maine Coon with a dog-like personality. Very friendly with everyone!', ARRAY['https://images.unsplash.com/photo-1574158622682-e40e69881006'], 'Sylhet, Bangladesh', 'available'),

('Bella', 'Ragdoll', 3, 'female', 'medium', 'Blue Point', ARRAY['Docile', 'Affectionate', 'Calm'], 'Bella goes limp when picked up, true to her breed! She''s incredibly gentle and loving.', ARRAY['https://images.unsplash.com/photo-1543852786-1cf6624b9987'], 'Dhaka, Bangladesh', 'available'),

('Oliver', 'British Shorthair', 2, 'male', 'medium', 'Gray', ARRAY['Calm', 'Independent', 'Friendly'], 'Oliver is a chunky British Shorthair with the sweetest round face. Very easygoing!', ARRAY['https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e'], 'Khulna, Bangladesh', 'available'),

('Cleo', 'Bengal Cat', 1, 'female', 'medium', 'Spotted Brown', ARRAY['Active', 'Playful', 'Intelligent'], 'Cleo is a stunning Bengal with leopard-like spots. She''s very active and loves interactive play!', ARRAY['https://images.unsplash.com/photo-1569591159212-b02ea8a9f239'], 'Chittagong, Bangladesh', 'available'),

-- More Dogs
('Tucker', 'Pug', 3, 'male', 'small', 'Fawn', ARRAY['Charming', 'Sociable', 'Loving'], 'Tucker is a charming little pug with a big personality. He loves snuggling and making people smile!', ARRAY['https://images.unsplash.com/photo-1517849845537-4d257902454a'], 'Dhaka, Bangladesh', 'available'),

('Rosie', 'Dachshund', 2, 'female', 'small', 'Red', ARRAY['Playful', 'Brave', 'Loyal'], 'Rosie is a feisty little wiener dog who thinks she''s much bigger than she is. Very brave and loyal!', ARRAY['https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc'], 'Sylhet, Bangladesh', 'available'),

('Duke', 'Boxer', 3, 'male', 'large', 'Brindle', ARRAY['Energetic', 'Playful', 'Protective'], 'Duke is a muscular boxer with endless energy. He loves playing and protecting his family.', ARRAY['https://images.unsplash.com/photo-1587859281139-8c6e8a8e0c0b'], 'Chittagong, Bangladesh', 'available'),

('Ruby', 'Chihuahua', 2, 'female', 'small', 'Tan', ARRAY['Feisty', 'Loyal', 'Alert'], 'Ruby may be tiny but she has a huge personality! Very devoted to her favorite person.', ARRAY['https://images.unsplash.com/photo-1541599468348-e96984315921'], 'Dhaka, Bangladesh', 'available'),

('Bear', 'Bernese Mountain Dog', 4, 'male', 'large', 'Tricolor', ARRAY['Gentle', 'Calm', 'Friendly'], 'Bear is a gentle giant who loves everyone. Perfect family dog with a calm temperament.', ARRAY['https://images.unsplash.com/photo-1576201836106-db1758fd1c97'], 'Rajshahi, Bangladesh', 'available'),

('Penny', 'Cavalier King Charles', 2, 'female', 'small', 'Blenheim', ARRAY['Gentle', 'Affectionate', 'Adaptable'], 'Penny is the sweetest little companion dog. She adapts well to any living situation!', ARRAY['https://images.unsplash.com/photo-1587300003388-59208cc962cb'], 'Dhaka, Bangladesh', 'available'),

('Ace', 'Australian Shepherd', 1, 'male', 'medium', 'Blue Merle', ARRAY['Intelligent', 'Energetic', 'Loyal'], 'Ace is a stunning blue merle Aussie. He''s very smart and needs an active family!', ARRAY['https://images.unsplash.com/photo-1568393691622-c7ba131d63b4'], 'Chittagong, Bangladesh', 'available'),

-- More Cats
('Jasper', 'Scottish Fold', 3, 'male', 'medium', 'Gray', ARRAY['Sweet', 'Calm', 'Playful'], 'Jasper has the cutest folded ears! He''s very sweet-natured and loves gentle play.', ARRAY['https://images.unsplash.com/photo-1615789591457-74a63395c990'], 'Dhaka, Bangladesh', 'available'),

('Nala', 'Calico Cat', 2, 'female', 'small', 'Calico', ARRAY['Independent', 'Affectionate', 'Playful'], 'Nala is a beautiful calico with a tortoiseshell pattern. She''s sassy but very loving!', ARRAY['https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc'], 'Sylhet, Bangladesh', 'available'),

('Leo', 'Sphynx Cat', 1, 'male', 'medium', 'Hairless', ARRAY['Energetic', 'Friendly', 'Warm'], 'Leo is a unique hairless cat who feels like warm suede. He loves snuggling for warmth!', ARRAY['https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a'], 'Dhaka, Bangladesh', 'available'),

('Princess', 'Russian Blue', 3, 'female', 'medium', 'Blue-Gray', ARRAY['Quiet', 'Gentle', 'Loyal'], 'Princess is an elegant Russian Blue with stunning green eyes. Very loyal to her family!', ARRAY['https://images.unsplash.com/photo-1574144611937-0df059b5ef3e'], 'Khulna, Bangladesh', 'available'),

('Milo', 'Norwegian Forest Cat', 4, 'male', 'large', 'Brown Tabby', ARRAY['Independent', 'Playful', 'Friendly'], 'Milo is a fluffy Norwegian Forest Cat built for cold weather. Very friendly and playful!', ARRAY['https://images.unsplash.com/photo-1569591159212-b02ea8a9f239'], 'Chittagong, Bangladesh', 'available');

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Check how many pets are now in the database
SELECT 
  COUNT(*) as total_pets,
  COUNT(CASE WHEN adoption_status = 'available' THEN 1 END) as available_pets
FROM public.pets;

-- Show the newly added pets
SELECT id, name, breed, gender, size, location, adoption_status
FROM public.pets
ORDER BY created_at DESC
LIMIT 30;

-- =====================================================
-- SUCCESS! You should now have 30 new pets to swipe on
-- Restart your app and they should appear in Discover!
-- =====================================================
