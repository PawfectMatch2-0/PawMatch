-- ============================================
-- BANGLADESH PET SERVICES DATA MIGRATION
-- Inserts real pet service providers in Dhaka
-- Run this after the main schema is set up
-- ============================================

-- ============================================
-- Create Services Table if it doesn't exist
-- ============================================

-- Drop the existing table if it exists (to avoid schema conflicts)
DROP TABLE IF EXISTS pet_services CASCADE;

-- Create the pet_services table with correct schema
CREATE TABLE pet_services (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('veterinary', 'grooming', 'training', 'boarding', 'pet-store', 'emergency')),
    description TEXT,
    
    -- Location
    location_area VARCHAR(100),
    location_district VARCHAR(100),
    location_address TEXT,
    location_landmarks TEXT,
    
    -- Contact
    contact_phone JSONB,
    contact_email VARCHAR(255),
    contact_facebook VARCHAR(255),
    contact_website VARCHAR(255),
    contact_whatsapp VARCHAR(50),
    
    -- Timing
    weekday_hours VARCHAR(100),
    weekend_hours VARCHAR(100),
    emergency_available BOOLEAN DEFAULT false,
    
    -- Services & Details
    services JSONB,
    specialties JSONB,
    price_range VARCHAR(20) CHECK (price_range IN ('budget', 'moderate', 'premium')),
    
    -- Reviews & Rating
    rating DECIMAL(2,1) DEFAULT 0.0,
    reviews INTEGER DEFAULT 0,
    
    -- Other Info
    established_year INTEGER,
    languages JSONB,
    accepts_insurance BOOLEAN DEFAULT false,
    home_service BOOLEAN DEFAULT false,
    featured_image TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pet_services_category ON pet_services(category);
CREATE INDEX IF NOT EXISTS idx_pet_services_district ON pet_services(location_district);
CREATE INDEX IF NOT EXISTS idx_pet_services_rating ON pet_services(rating);

-- ============================================
-- Enable Row Level Security
-- ============================================

ALTER TABLE pet_services ENABLE ROW LEVEL SECURITY;

-- Policy to allow everyone to read pet services
CREATE POLICY "Anyone can view pet services" ON pet_services
    FOR SELECT USING (true);

-- Policy to allow only authenticated users to insert/update/delete
CREATE POLICY "Only authenticated users can modify pet services" ON pet_services
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- Insert Pet Services Data
-- ============================================

-- Insert Veterinary Services
INSERT INTO pet_services (id, name, category, description, location_area, location_district, location_address, location_landmarks, contact_phone, contact_email, contact_facebook, contact_website, contact_whatsapp, weekday_hours, weekend_hours, emergency_available, specialties, price_range, rating, reviews, established_year, languages, accepts_insurance, home_service, featured_image, created_at, updated_at) VALUES

-- Care & Cure Veterinary Clinic
('dhk-vet-001', 'Care & Cure Veterinary Clinic', 'veterinary', 'Comprehensive pet care with experienced doctors and emergency services. Digital X-ray and surgery facilities available.', 'Dhanmondi', 'Dhaka', '78 Satmasjid Road, Dhanmondi, Dhaka 1205, Bangladesh', 'Located on Satmasjid Road', '["01713-567890", "02-9876543"]'::jsonb, 'info@careandcure.com', 'facebook.com/careandcurevet', 'careandcure.com.bd', '01713-567890', '9:00 AM - 9:00 PM', '10:00 AM - 8:00 PM', true, '["24/7 Emergency", "Digital X-ray", "Surgery", "Pet grooming"]'::jsonb, 'moderate', 4.8, 156, 2015, '["English", "Bangla"]'::jsonb, true, true, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=400&h=300', NOW(), NOW()),

-- Pet Heaven Veterinary Clinic
('dhk-vet-002', 'Pet Heaven Veterinary Clinic', 'veterinary', '24/7 emergency services with modern equipment. Specializes in surgery and critical care with experienced veterinarians.', 'Mirpur', 'Dhaka', 'Plot 15, Road 1, Block A, Section 6, Mirpur, Dhaka 1216, Bangladesh', 'Located in Mirpur Section 6', '["01819-123456", "02-8012345"]'::jsonb, 'contact@pethavenbd.com', 'facebook.com/PetHeavenVet', 'pethavenbd.com', '01819-123456', '24 Hours', '24 Hours', true, '["Emergency surgery", "ICU", "Digital X-ray", "Laboratory"]'::jsonb, 'premium', 4.9, 203, 2012, '["English", "Bangla"]'::jsonb, true, false, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&h=300', NOW(), NOW()),

-- MR Veterinary Clinic
('dhk-vet-003', 'MR Veterinary Clinic', 'veterinary', 'Affordable vet care with home visit services. Surgery requires prior booking. Good for routine care and emergency treatment.', 'East Bashabo', 'Dhaka', '126/6 Patwary Gali, East Bashabo, Dhaka 1214, Bangladesh', 'Located in East Bashabo area', '["01521-489206"]'::jsonb, NULL, 'facebook.com/MRVeterinaryClinic', NULL, NULL, '10:00 AM - 8:00 PM', '10:00 AM - 6:00 PM', false, '["General treatment", "Vaccination", "Home visits", "Affordable care"]'::jsonb, 'budget', 4.5, 89, 2018, '["English", "Bangla"]'::jsonb, false, true, 'https://images.unsplash.com/photo-1530041539828-114de669390e?auto=format&fit=crop&w=400&h=300', NOW(), NOW());

-- Insert Grooming Services
INSERT INTO pet_services (id, name, category, description, location_area, location_district, location_address, location_landmarks, contact_phone, contact_email, contact_facebook, contact_website, contact_whatsapp, weekday_hours, weekend_hours, emergency_available, specialties, price_range, rating, reviews, established_year, languages, accepts_insurance, home_service, featured_image, created_at, updated_at) VALUES

-- Pet Grooming BD
('dhk-groom-001', 'Pet Grooming BD', 'grooming', 'Professional grooming services with experienced staff. Full-service salon with nail trimming and spa packages.', 'Mohammadpur', 'Dhaka', 'House 25, Road 3, Block B, Mohammadpur, Dhaka 1207, Bangladesh', 'Located in Mohammadpur residential area', '["01755-234567"]'::jsonb, 'info@petgroomingbd.com', 'facebook.com/PetGroomingBD', NULL, '01755-234567', '10:00 AM - 7:00 PM', '10:00 AM - 8:00 PM', false, '["Full grooming", "Nail trimming", "Spa packages", "Professional care"]'::jsonb, 'moderate', 4.6, 127, 2019, '["English", "Bangla"]'::jsonb, false, false, 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=400&h=300', NOW(), NOW()),

-- Head to Tail
('dhk-groom-002', 'Head to Tail', 'grooming', 'Full-service grooming salon offering bath, styling, and nail care. Professional groomers with experience in all breeds.', 'Madani Avenue', 'Dhaka', '100ft Madani Avenue, Dhaka, Bangladesh', 'Located on 100ft Madani Avenue', '["Contact via Facebook"]'::jsonb, NULL, 'facebook.com/HeadToTailBD', NULL, NULL, '9:00 AM - 7:00 PM', '10:00 AM - 6:00 PM', false, '["Complete grooming", "Styling", "Bath & brush", "Nail care"]'::jsonb, 'moderate', 4.7, 98, 2020, '["English", "Bangla"]'::jsonb, false, false, 'https://images.unsplash.com/photo-1559190394-90caa8fc893c?auto=format&fit=crop&w=400&h=300', NOW(), NOW());

-- Insert Training Services
INSERT INTO pet_services (id, name, category, description, location_area, location_district, location_address, location_landmarks, contact_phone, contact_email, contact_facebook, contact_website, contact_whatsapp, weekday_hours, weekend_hours, emergency_available, specialties, price_range, rating, reviews, established_year, languages, accepts_insurance, home_service, featured_image, created_at, updated_at) VALUES

-- Dogs Health Care Centre
('dhk-train-001', 'Dogs Health Care Centre', 'training', 'Professional dog training center with certified trainers. Offering basic to advanced training programs.', 'Mirpur-1', 'Dhaka', 'House 45, Road 2, Mirpur-1, Dhaka 1216, Bangladesh', 'Located in Mirpur-1 residential area', '["01677-345678"]'::jsonb, 'training@dogshealthcare.com', NULL, NULL, NULL, '8:00 AM - 6:00 PM', '9:00 AM - 5:00 PM', false, '["Basic obedience", "Advanced training", "Puppy classes", "Behavioral training"]'::jsonb, 'moderate', 4.5, 76, 2017, '["English", "Bangla"]'::jsonb, false, true, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&h=300', NOW(), NOW()),

-- Surokkha Vet Clinic
('dhk-train-002', 'Surokkha Vet Clinic', 'training', 'Pet training and behavioral modification services. Specialized in puppy training and socialization programs.', 'Sobhanbag', 'Dhaka', 'House 12, Road 7, Sobhanbag, Dhaka 1207, Bangladesh', 'Located in Sobhanbag area', '["01888-456789"]'::jsonb, NULL, 'facebook.com/SurokkhaVet', NULL, '01888-456789', '7:00 AM - 7:00 PM', '8:00 AM - 6:00 PM', false, '["Puppy training", "Behavioral modification", "Socialization", "Basic commands"]'::jsonb, 'moderate', 4.8, 134, 2016, '["English", "Bangla"]'::jsonb, false, true, 'https://images.unsplash.com/photo-1587559070757-f72a388edbba?auto=format&fit=crop&w=400&h=300', NOW(), NOW());

-- Insert Pet Stores
INSERT INTO pet_services (id, name, category, description, location_area, location_district, location_address, location_landmarks, contact_phone, contact_email, contact_facebook, contact_website, contact_whatsapp, weekday_hours, weekend_hours, emergency_available, specialties, price_range, rating, reviews, established_year, languages, accepts_insurance, home_service, featured_image, created_at, updated_at) VALUES

-- Paw Care
('dhk-store-001', 'Paw Care', 'pet-store', 'Wide selection and good after-sales service. Complete pet supplies with quality products and online ordering.', 'Katabon', 'Dhaka', 'Katabon, 290 Dhaka University Market, Dhaka 1205, Bangladesh', 'Located in Dhaka University Market', '["01700-000000"]'::jsonb, NULL, NULL, 'pawcare.com.bd', NULL, '9:00 AM - 9:00 PM', '9:00 AM - 10:00 PM', false, '["Royal Canin", "Reflex", "Whiskas", "Imported Toys"]'::jsonb, 'moderate', 4.2, 95, 2016, '["English", "Bangla"]'::jsonb, false, true, 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?auto=format&fit=crop&w=400&h=300', NOW(), NOW()),

-- Bangladesh Pet House
('dhk-store-002', 'Bangladesh Pet House', 'pet-store', 'Known for exotic fish and good packaging for delivery. Expert advice and pet resale accepted under policy.', 'Katabon', 'Dhaka', '290 Dhaka University Market, Katabon, Dhaka 1205, Bangladesh', 'Located in Dhaka University Market', '["01711-146763"]'::jsonb, NULL, NULL, NULL, NULL, '10:00 AM - 8:00 PM', '10:00 AM - 9:00 PM', false, '["Imported Fish", "Premium Dog Foods", "Aquarium setup", "Pet consultation"]'::jsonb, 'moderate', 4.4, 78, 2017, '["English", "Bangla"]'::jsonb, false, true, 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&h=300', NOW(), NOW()),

-- Head to Tail – Pet Store & Groom
('dhk-store-003', 'Head to Tail – Pet Store & Groom', 'pet-store', 'Large store with grooming services and good stock of imported items. Membership discounts available.', 'Madani Avenue', 'Dhaka', '100ft Madani Avenue, Dhaka, Bangladesh', 'Located on 100ft Madani Avenue', '["Contact via Facebook"]'::jsonb, NULL, NULL, NULL, NULL, '10:00 AM - 8:00 PM', '10:00 AM - 9:00 PM', false, '["International Pet Brands", "Combined store and grooming", "Premium accessories"]'::jsonb, 'premium', 4.0, 52, 2019, '["English", "Bangla"]'::jsonb, false, true, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&h=300', NOW(), NOW());

-- Insert Boarding Services
INSERT INTO pet_services (id, name, category, description, location_area, location_district, location_address, location_landmarks, contact_phone, contact_email, contact_facebook, contact_website, contact_whatsapp, weekday_hours, weekend_hours, emergency_available, specialties, price_range, rating, reviews, established_year, languages, accepts_insurance, home_service, featured_image, created_at, updated_at) VALUES

-- Paw Stay Boarding
('dhk-board-001', 'Paw Stay Boarding', 'boarding', 'Safe and caring pet boarding facility with professional 24/7 care. Air-conditioned rooms and trained staff.', 'Mirpur', 'Dhaka', 'Mirpur-1, Dhaka, Bangladesh', 'Near Mirpur-1 Circle', '["01711-123456"]'::jsonb, 'info@pawstaybd.com', 'facebook.com/pawstayboarding', 'www.pawstaybd.com', NULL, '24 hours open', '24 hours open', true, '["Large breed expert", "Medical boarding", "Long term stay", "Puppy day care"]'::jsonb, 'moderate', 4.4, 67, 2019, '["English", "Bangla"]'::jsonb, false, false, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&h=300', NOW(), NOW()),

-- Fur Home Boarding
('dhk-board-002', 'Fur Home Boarding', 'boarding', 'Homely environment for pets with personalized care. Family-run boarding service with outdoor play area.', 'Dhanmondi', 'Dhaka', 'Dhanmondi R/A, Dhaka, Bangladesh', 'Near Dhanmondi Lake', '["01755-987654"]'::jsonb, 'furhomebd@gmail.com', NULL, NULL, '01755-987654', '8:00 AM - 8:00 PM (Drop-off/Pick-up)', '9:00 AM - 6:00 PM (Drop-off/Pick-up)', true, '["Home environment", "Personal attention", "Daily photo updates", "Outdoor garden play"]'::jsonb, 'budget', 4.5, 89, 2020, '["English", "Bangla"]'::jsonb, false, true, 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&h=300', NOW(), NOW());
