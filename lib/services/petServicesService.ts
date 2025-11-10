/**
 * Pet Services Service
 * Handles loading and managing pet services from Supabase database
 */

import { supabase } from '../supabase';

export interface PetService {
  id: string;
  name: string;
  category: 'veterinary' | 'grooming' | 'training' | 'boarding' | 'pet-store' | 'emergency';
  description: string;
  location_area: string;
  location_district: string;
  location_address: string;
  location_landmarks: string;
  contact_phone: string[];
  contact_email: string;
  contact_facebook: string;
  contact_website: string;
  contact_whatsapp: string;
  weekday_hours: string;
  weekend_hours: string;
  emergency_available: boolean;
  services: string[];
  specialties: string[];
  price_range: 'budget' | 'moderate' | 'premium';
  rating: number;
  reviews: number;
  established_year: number;
  languages: string[];
  accepts_insurance: boolean;
  home_service: boolean;
  featured_image: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get all pet services
 */
export async function getAllPetServices(category?: string) {
  try {
    console.log('🏪 [PetServices] Fetching all pet services...', category ? `Category: ${category}` : '');
    
    if (!supabase) {
      return { data: [], error: new Error('Supabase not initialized') };
    }

    let query = supabase
      .from('pet_services')
      .select('*')
      .order('rating', { ascending: false });
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ [PetServices] Error fetching services:', error);
      return { data: [], error };
    }
    
    console.log(`✅ [PetServices] Fetched ${data?.length || 0} services`);
    return { data: data || [], error: null };
  } catch (err) {
    console.error('💥 [PetServices] Unexpected error:', err);
    return { data: [], error: err };
  }
}

/**
 * Get pet services by district
 */
export async function getPetServicesByDistrict(district: string) {
  try {
    console.log(`🏪 [PetServices] Fetching services for district: ${district}`);
    
    if (!supabase) {
      return { data: [], error: new Error('Supabase not initialized') };
    }

    const { data, error } = await supabase
      .from('pet_services')
      .select('*')
      .eq('location_district', district)
      .order('rating', { ascending: false });
    
    if (error) {
      console.error('❌ [PetServices] Error fetching services:', error);
      return { data: [], error };
    }
    
    console.log(`✅ [PetServices] Fetched ${data?.length || 0} services for ${district}`);
    return { data: data || [], error: null };
  } catch (err) {
    console.error('💥 [PetServices] Unexpected error:', err);
    return { data: [], error: err };
  }
}

/**
 * Get pet service by ID
 */
export async function getPetServiceById(id: string) {
  try {
    console.log(`🏪 [PetServices] Fetching service: ${id}`);
    
    if (!supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }

    const { data, error } = await supabase
      .from('pet_services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('❌ [PetServices] Error fetching service:', error);
      return { data: null, error };
    }
    
    console.log(`✅ [PetServices] Fetched: ${data?.name}`);
    return { data, error: null };
  } catch (err) {
    console.error('💥 [PetServices] Unexpected error:', err);
    return { data: null, error: err };
  }
}

/**
 * Get services by category with filtering
 */
export async function getPetServicesByCategory(category: string, district?: string) {
  try {
    console.log(`🏪 [PetServices] Fetching ${category} services`, district ? `in ${district}` : '');
    
    if (!supabase) {
      return { data: [], error: new Error('Supabase not initialized') };
    }

    let query = supabase
      .from('pet_services')
      .select('*')
      .eq('category', category)
      .order('rating', { ascending: false });
    
    if (district) {
      query = query.eq('location_district', district);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ [PetServices] Error fetching services:', error);
      return { data: [], error };
    }
    
    console.log(`✅ [PetServices] Fetched ${data?.length || 0} ${category} services`);
    return { data: data || [], error: null };
  } catch (err) {
    console.error('💥 [PetServices] Unexpected error:', err);
    return { data: [], error: err };
  }
}

/**
 * Get services with high ratings
 */
export async function getTopRatedPetServices(limit: number = 10) {
  try {
    console.log(`🏪 [PetServices] Fetching top ${limit} rated services`);
    
    if (!supabase) {
      return { data: [], error: new Error('Supabase not initialized') };
    }

    const { data, error } = await supabase
      .from('pet_services')
      .select('*')
      .gte('rating', 4.0)
      .order('rating', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('❌ [PetServices] Error fetching services:', error);
      return { data: [], error };
    }
    
    console.log(`✅ [PetServices] Fetched ${data?.length || 0} top-rated services`);
    return { data: data || [], error: null };
  } catch (err) {
    console.error('💥 [PetServices] Unexpected error:', err);
    return { data: [], error: err };
  }
}

/**
 * Search pet services
 */
export async function searchPetServices(query: string) {
  try {
    console.log(`🏪 [PetServices] Searching for: ${query}`);
    
    if (!supabase) {
      return { data: [], error: new Error('Supabase not initialized') };
    }

    const { data, error } = await supabase
      .from('pet_services')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,location_area.ilike.%${query}%`)
      .order('rating', { ascending: false });
    
    if (error) {
      console.error('❌ [PetServices] Error searching services:', error);
      return { data: [], error };
    }
    
    console.log(`✅ [PetServices] Found ${data?.length || 0} services matching: ${query}`);
    return { data: data || [], error: null };
  } catch (err) {
    console.error('💥 [PetServices] Unexpected error:', err);
    return { data: [], error: err };
  }
}
