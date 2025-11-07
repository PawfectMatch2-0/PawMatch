/**
 * User Statistics Service
 * Handles fetching user-related statistics (liked pets, my pets, nearby pets, etc.)
 */

import { supabase } from '../supabase';

export interface UserStats {
  likedPetsCount: number;
  myPetsCount: number;
  nearbyPetsCount: number;
}

/**
 * Get user statistics for profile display
 */
export async function getUserStats(userId: string): Promise<{ data: UserStats | null; error: any }> {
  try {
    if (!supabase) {
      console.warn('⚠️ [Stats] Supabase not configured');
      return { data: { likedPetsCount: 0, myPetsCount: 0, nearbyPetsCount: 0 }, error: null };
    }

    // Get liked/favorited pets count
    const { count: likedCount, error: likedError } = await supabase
      .from('pet_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (likedError) {
      console.error('❌ [Stats] Error fetching liked pets count:', likedError);
    }

    // Get user's own pets count
    const { count: myPetsCount, error: myPetsError } = await supabase
      .from('pets')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', userId);

    if (myPetsError) {
      console.error('❌ [Stats] Error fetching my pets count:', myPetsError);
    }

    // Get nearby pets count (all available pets for now - can be enhanced with geolocation)
    const { count: nearbyCount, error: nearbyError } = await supabase
      .from('pets')
      .select('*', { count: 'exact', head: true })
      .eq('adoption_status', 'available')
      .neq('owner_id', userId); // Exclude user's own pets

    if (nearbyError) {
      console.error('❌ [Stats] Error fetching nearby pets count:', nearbyError);
    }

    const stats: UserStats = {
      likedPetsCount: likedCount || 0,
      myPetsCount: myPetsCount || 0,
      nearbyPetsCount: nearbyCount || 0,
    };

    console.log('✅ [Stats] User stats loaded:', stats);
    return { data: stats, error: null };
  } catch (error) {
    console.error('❌ [Stats] Failed to fetch user stats:', error);
    return { data: null, error };
  }
}

/**
 * Get count of user's favorited pets
 */
export async function getLikedPetsCount(userId: string): Promise<number> {
  try {
    if (!supabase) return 0;

    const { count, error } = await supabase
      .from('pet_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('❌ [Stats] Error fetching liked count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('❌ [Stats] Failed to get liked count:', error);
    return 0;
  }
}

/**
 * Get count of user's own pets
 */
export async function getMyPetsCount(userId: string): Promise<number> {
  try {
    if (!supabase) return 0;

    const { count, error } = await supabase
      .from('pets')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', userId);

    if (error) {
      console.error('❌ [Stats] Error fetching my pets count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('❌ [Stats] Failed to get my pets count:', error);
    return 0;
  }
}

/**
 * Get count of nearby available pets
 */
export async function getNearbyPetsCount(userId: string): Promise<number> {
  try {
    if (!supabase) return 0;

    const { count, error } = await supabase
      .from('pets')
      .select('*', { count: 'exact', head: true })
      .eq('adoption_status', 'available')
      .neq('owner_id', userId);

    if (error) {
      console.error('❌ [Stats] Error fetching nearby count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('❌ [Stats] Failed to get nearby count:', error);
    return 0;
  }
}
