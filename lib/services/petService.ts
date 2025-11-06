/**
 * Pet Service - Handles all pet-related data operations with Supabase
 */

import { supabase } from '../supabase';

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  color: string;
  personality: string[];
  description: string;
  images: string[];
  location: string;
  contact_info: any;
  adoption_status: 'available' | 'pending' | 'adopted';
  owner_id?: string;
  shelter_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PetWithDetails extends Pet {
  owner?: {
    id: string;
    email: string;
    full_name?: string;
  };
  shelter?: {
    id: string;
    name: string;
    location: string;
  };
}

export const petService = {
  /**
   * Get all available pets for adoption
   */
  async getAvailablePets(limit = 50, offset = 0): Promise<Pet[]> {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, returning empty array');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('adoption_status', 'available')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('❌ Error fetching available pets:', error);
        return [];
      }

      console.log(`✅ Fetched ${data?.length || 0} available pets from database`);
      return (data as Pet[]) || [];
    } catch (error) {
      console.error('💥 Exception fetching pets:', error);
      return [];
    }
  },

  /**
   * Get pets excluding already interacted ones (for swipe cards)
   */
  async getPetsForSwipe(userId: string, limit = 20): Promise<Pet[]> {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured');
      return [];
    }

    try {
      // First get the IDs of pets the user has already interacted with
      const { data: interactions, error: interactionsError } = await supabase
        .from('pet_interactions')
        .select('pet_id')
        .eq('user_id', userId);

      if (interactionsError) {
        console.error('❌ Error fetching interactions:', interactionsError);
      }

      const interactedPetIds = interactions?.map((i: any) => i.pet_id) || [];

      // Get available pets excluding the interacted ones
      let query = supabase
        .from('pets')
        .select('*')
        .eq('adoption_status', 'available')
        .order('created_at', { ascending: false })
        .limit(limit);

      // If there are interacted pets, exclude them
      if (interactedPetIds.length > 0) {
        query = query.not('id', 'in', `(${interactedPetIds.join(',')})`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching pets for swipe:', error);
        return [];
      }

      console.log(`✅ Fetched ${data?.length || 0} pets for swipe`);
      return (data as Pet[]) || [];
    } catch (error) {
      console.error('💥 Exception fetching pets for swipe:', error);
      return [];
    }
  },

  /**
   * Get a single pet by ID with full details
   */
  async getPetById(id: string): Promise<PetWithDetails | null> {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('pets')
        .select(`
          *,
          owner:owner_id (id, email, full_name),
          shelter:shelter_id (id, name, location)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error fetching pet:', error);
        return null;
      }

      return data as PetWithDetails;
    } catch (error) {
      console.error('💥 Exception fetching pet:', error);
      return null;
    }
  },

  /**
   * Record pet interaction (swipe left/right/super like)
   */
  async recordInteraction(
    userId: string,
    petId: string,
    interactionType: 'like' | 'pass' | 'super_like'
  ): Promise<boolean> {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured');
      return false;
    }

    try {
      const { error } = await supabase
        .from('pet_interactions')
        .upsert({
          user_id: userId,
          pet_id: petId,
          interaction_type: interactionType,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,pet_id'
        });

      if (error) {
        console.error('❌ Error recording interaction:', error);
        return false;
      }

      console.log(`✅ Recorded ${interactionType} for pet ${petId}`);
      return true;
    } catch (error) {
      console.error('💥 Exception recording interaction:', error);
      return false;
    }
  },

  /**
   * Add pet to favorites
   */
  async addToFavorites(userId: string, petId: string): Promise<boolean> {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured');
      return false;
    }

    try {
      const { error } = await supabase
        .from('pet_favorites')
        .insert({
          user_id: userId,
          pet_id: petId,
          created_at: new Date().toISOString()
        });

      if (error) {
        // Check if it's a duplicate
        if (error.code === '23505') {
          console.log('ℹ️ Pet already in favorites');
          return true;
        }
        console.error('❌ Error adding to favorites:', error);
        return false;
      }

      console.log(`✅ Added pet ${petId} to favorites`);
      return true;
    } catch (error) {
      console.error('💥 Exception adding to favorites:', error);
      return false;
    }
  },

  /**
   * Remove pet from favorites
   */
  async removeFromFavorites(userId: string, petId: string): Promise<boolean> {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured');
      return false;
    }

    try {
      const { error } = await supabase
        .from('pet_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('pet_id', petId);

      if (error) {
        console.error('❌ Error removing from favorites:', error);
        return false;
      }

      console.log(`✅ Removed pet ${petId} from favorites`);
      return true;
    } catch (error) {
      console.error('💥 Exception removing from favorites:', error);
      return false;
    }
  },

  /**
   * Get user's favorite pets
   */
  async getUserFavorites(userId: string): Promise<Pet[]> {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('pet_favorites')
        .select(`
          created_at,
          pets (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching favorites:', error);
        return [];
      }

      // Extract pets from the joined data
      const pets = data?.map((fav: any) => fav.pets).filter(Boolean) || [];
      console.log(`✅ Fetched ${pets.length} favorite pets`);
      return pets as Pet[];
    } catch (error) {
      console.error('💥 Exception fetching favorites:', error);
      return [];
    }
  },

  /**
   * Check if pet is favorited by user
   */
  async isPetFavorited(userId: string, petId: string): Promise<boolean> {
    if (!supabase) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('pet_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('pet_id', petId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error checking favorite status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('💥 Exception checking favorite:', error);
      return false;
    }
  },

  /**
   * Search pets by criteria
   */
  async searchPets(filters: {
    breed?: string;
    size?: 'small' | 'medium' | 'large';
    gender?: 'male' | 'female';
    location?: string;
    maxAge?: number;
  }): Promise<Pet[]> {
    if (!supabase) {
      return [];
    }

    try {
      let query = supabase
        .from('pets')
        .select('*')
        .eq('adoption_status', 'available');

      if (filters.breed) {
        query = query.ilike('breed', `%${filters.breed}%`);
      }
      if (filters.size) {
        query = query.eq('size', filters.size);
      }
      if (filters.gender) {
        query = query.eq('gender', filters.gender);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.maxAge) {
        query = query.lte('age', filters.maxAge);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error searching pets:', error);
        return [];
      }

      console.log(`✅ Found ${data?.length || 0} pets matching filters`);
      return (data as Pet[]) || [];
    } catch (error) {
      console.error('💥 Exception searching pets:', error);
      return [];
    }
  }
};
