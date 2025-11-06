/**
 * Shop Service - Handles all pet services/shops data operations with Supabase
 */

import { supabase } from '../supabase';

export interface PetShop {
  id: string;
  name: string;
  type: 'shelter' | 'veterinary' | 'grooming' | 'training' | 'pet_store' | 'daycare';
  description: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  location: any; // GeoJSON or location object
  images: string[];
  services: string[];
  opening_hours?: any;
  rating?: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export const shopService = {
  /**
   * Get all pet services/shops
   */
  async getAllShops(limit = 50, offset = 0): Promise<PetShop[]> {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, returning empty array');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('pet_services')
        .select('*')
        .order('verified', { ascending: false })
        .order('rating', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('❌ Error fetching shops:', error);
        return [];
      }

      console.log(`✅ Fetched ${data?.length || 0} shops from database`);
      return (data as PetShop[]) || [];
    } catch (error) {
      console.error('💥 Exception fetching shops:', error);
      return [];
    }
  },

  /**
   * Get shops by type
   */
  async getShopsByType(
    type: 'shelter' | 'veterinary' | 'grooming' | 'training' | 'pet_store' | 'daycare'
  ): Promise<PetShop[]> {
    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('pet_services')
        .select('*')
        .eq('type', type)
        .order('verified', { ascending: false })
        .order('rating', { ascending: false });

      if (error) {
        console.error('❌ Error fetching shops by type:', error);
        return [];
      }

      console.log(`✅ Fetched ${data?.length || 0} ${type} shops`);
      return (data as PetShop[]) || [];
    } catch (error) {
      console.error('💥 Exception fetching shops by type:', error);
      return [];
    }
  },

  /**
   * Get a single shop by ID
   */
  async getShopById(id: string): Promise<PetShop | null> {
    if (!supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('pet_services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error fetching shop:', error);
        return null;
      }

      return data as PetShop;
    } catch (error) {
      console.error('💥 Exception fetching shop:', error);
      return null;
    }
  },

  /**
   * Get verified shops only
   */
  async getVerifiedShops(): Promise<PetShop[]> {
    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('pet_services')
        .select('*')
        .eq('verified', true)
        .order('rating', { ascending: false });

      if (error) {
        console.error('❌ Error fetching verified shops:', error);
        return [];
      }

      console.log(`✅ Fetched ${data?.length || 0} verified shops`);
      return (data as PetShop[]) || [];
    } catch (error) {
      console.error('💥 Exception fetching verified shops:', error);
      return [];
    }
  },

  /**
   * Search shops by name or location
   */
  async searchShops(searchTerm: string): Promise<PetShop[]> {
    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('pet_services')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
        .order('verified', { ascending: false })
        .order('rating', { ascending: false });

      if (error) {
        console.error('❌ Error searching shops:', error);
        return [];
      }

      console.log(`✅ Found ${data?.length || 0} shops matching "${searchTerm}"`);
      return (data as PetShop[]) || [];
    } catch (error) {
      console.error('💥 Exception searching shops:', error);
      return [];
    }
  },

  /**
   * Get shops by location (nearby)
   * Note: This is a simple implementation. For production, you'd want to use PostGIS
   */
  async getShopsByLocation(location: string): Promise<PetShop[]> {
    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('pet_services')
        .select('*')
        .ilike('address', `%${location}%`)
        .order('verified', { ascending: false })
        .order('rating', { ascending: false });

      if (error) {
        console.error('❌ Error fetching shops by location:', error);
        return [];
      }

      console.log(`✅ Found ${data?.length || 0} shops in ${location}`);
      return (data as PetShop[]) || [];
    } catch (error) {
      console.error('💥 Exception fetching shops by location:', error);
      return [];
    }
  },

  /**
   * Get shops that offer specific services
   */
  async getShopsByService(service: string): Promise<PetShop[]> {
    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('pet_services')
        .select('*')
        .contains('services', [service])
        .order('verified', { ascending: false })
        .order('rating', { ascending: false });

      if (error) {
        console.error('❌ Error fetching shops by service:', error);
        return [];
      }

      console.log(`✅ Found ${data?.length || 0} shops offering ${service}`);
      return (data as PetShop[]) || [];
    } catch (error) {
      console.error('💥 Exception fetching shops by service:', error);
      return [];
    }
  }
};
