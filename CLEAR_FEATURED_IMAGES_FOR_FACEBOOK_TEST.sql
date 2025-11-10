-- Clear featured images for services that have Facebook URLs
-- This will allow testing the Facebook profile picture feature

UPDATE pet_services
SET featured_image = NULL
WHERE contact_facebook IS NOT NULL
  AND contact_facebook != ''
  AND name IN (
    'Pet Heaven Veterinary Clinic',
    'MR Veterinary Clinic',
    'Head to Tail',
    'Pet Grooming BD',
    'Surokkha Vet Clinic',
    'Paw Stay Boarding'
  );

-- Verify the changes
SELECT 
  name,
  category,
  featured_image,
  contact_facebook
FROM pet_services
WHERE contact_facebook IS NOT NULL
ORDER BY category, name;
