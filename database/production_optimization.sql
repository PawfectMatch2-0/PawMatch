-- Production Database Optimization Script
-- Run this after deploying to production for optimal performance

-- Enable Row Level Security on all tables (should already be enabled)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_services ENABLE ROW LEVEL SECURITY;

-- Create performance indexes for common queries
CREATE INDEX IF NOT EXISTS idx_pets_adoption_status ON pets(adoption_status);
CREATE INDEX IF NOT EXISTS idx_pets_location ON pets(location);
CREATE INDEX IF NOT EXISTS idx_pets_breed ON pets(breed);
CREATE INDEX IF NOT EXISTS idx_pets_age ON pets(age);
CREATE INDEX IF NOT EXISTS idx_pets_created_at ON pets(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_adoption_applications_user_id ON adoption_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_pet_id ON adoption_applications(pet_id);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_status ON adoption_applications(status);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_created_at ON adoption_applications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pet_services_service_type ON pet_services(service_type);
CREATE INDEX IF NOT EXISTS idx_pet_services_location ON pet_services(location);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_pets_status_location ON pets(adoption_status, location);
CREATE INDEX IF NOT EXISTS idx_pets_breed_age ON pets(breed, age);

-- Full-text search indexes (for future search functionality)
CREATE INDEX IF NOT EXISTS idx_pets_search ON pets USING gin(to_tsvector('english', name || ' ' || breed || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_pet_services_search ON pet_services USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Update table statistics for query planner
ANALYZE user_profiles;
ANALYZE pets;
ANALYZE adoption_applications;
ANALYZE pet_services;

-- Set up connection pooling parameters (adjust based on usage)
-- These would be set at the database level in Supabase dashboard
-- max_connections = 200
-- shared_buffers = 256MB
-- effective_cache_size = 1GB
-- work_mem = 4MB
-- maintenance_work_mem = 64MB

-- Enable query logging for monitoring (production monitoring)
-- log_statement = 'mod'
-- log_duration = on
-- log_min_duration_statement = 1000

-- Backup and monitoring setup
-- Set up automated backups in Supabase dashboard
-- Enable real-time monitoring and alerts
-- Configure log retention policies

SELECT 'Production database optimization complete!' as status;