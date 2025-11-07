/**
 * Services Index - Central export for all backend services
 */

export { petService } from './petService';
export type { Pet, PetWithDetails } from './petService';

export { shopService } from './shopService';
export type { PetShop } from './shopService';

export { authService } from './authService';
export type { SignUpData, SignInData } from './authService';

export * from './profileService';
export * from './userPetsService';

// Re-export from supabase for convenience
export { supabase, databaseService } from '../supabase';
export type { UserProfile, LearningArticle } from '../supabase';
